import express from 'express';
import bcrypt from 'bcrypt';
import { requireAccessToken } from '../middlwarmies/require-access-token.middleware.js';
import { prisma } from '../utils/prisma.utils.js';
import { authConstant } from '../constants/auth.constant.js';
import { HTTP_STATUS } from '../constants/http-status.constant.js';
import { MESSAGES } from '../constants/message.constant.js';


const profileRouter = express.Router();

profileRouter.patch('/user', requireAccessToken, async (req, res, next) => {
    try {
        const { userId } = req.user;
        const { nickname, oneLiner } = req.body;

        if (!nickname && !oneLiner) {
            return res.status(HTTP_STATUS.UNAUTHORIZED).json({ error: '수정할 정보를 입력해 주세요.' });
        }

        const existedNickname = await prisma.user.findUnique({
            where: { nickname },
        });
        if (existedNickname) {
            return res.status(HTTP_STATUS.CONFLICT).json({
                status: HTTP_STATUS.CONFLICT,
                message: MESSAGES.AUTH.COMMON.NICKNAME.TOO,
            });
        }

        const updateData = {};
        if (nickname) updateData.nickname = nickname;
        if (oneLiner) updateData.oneLiner = oneLiner;

        const updateProfile = await prisma.user.update({
            where: { id: userId },
            data: updateData,
        });

        const profileDetail = {
            userId: updateProfile.id,
            nickname: updateProfile.nickname,
            oneLiner: updateProfile.oneLiner,
            createdAt: updateProfile.createdAt,
            updatedAt: updateProfile.updatedAt,
        };

        return res.status(HTTP_STATUS.OK).json({ status: HTTP_STATUS.OK, message: '수정이 완료 되었습니다.', profileDetail });

    } catch (err) {
        next(err);
    }
});

profileRouter.patch('/password', requireAccessToken, async (req, res, next) => {
    try {
        const { userId } = req.user;
        const { password, newPassword } = req.body;

        if (!password || !newPassword) {
            return res.status(HTTP_STATUS.UNAUTHORIZED).json({ error: "기존 비밀번호와 새 비밀번호를 모두 입력해주세요." });
        }

        if (newPassword.length < 6) {
            return res.status(HTTP_STATUS.UNAUTHORIZED).json({
                status: HTTP_STATUS.UNAUTHORIZED,
                message: MESSAGES.AUTH.COMMON.PASSWORD.MIN_LENGTH,
            });
        }

        const user = await prisma.user.findUnique({
            where: { userId },
            select: { password: true, nickname: true, createdAt: true, updatedAt: true }
        });

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(HTTP_STATUS.UNAUTHORIZED).json({ status: HTTP_STATUS.UNAUTHORIZED, error: "기존 비밀번호가 일치하지 않습니다." });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, authConstant.HASH_SALT_ROUNDS);

        const updatedUser = await prisma.user.update({
            where: { userId },
            data: { password: hashedNewPassword },
        });

        return res.status(HTTP_STATUS.OK).json({
            message: "새 비밀번호 설정이 완료되었습니다.",
            userDetails: {
                userId: updatedUser.id,
                nickname: updatedUser.nickname,
                createdAt: updatedUser.createdAt,
                updatedAt: updatedUser.updatedAt,
            }
        });

    } catch (err) {
        next(err);
    }
});

export { profileRouter };
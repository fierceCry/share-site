import express from 'express';
import bcrypt from 'bcrypt';
import { prisma } from '../utils/prisma.utils.js';
import { HASH_SALT_ROUNDS } from '../constants/auth.constant.js';
import { signupValidator } from '../middlwarmies/sign-up-valildator.middleware.js';
import { HTTP_STATUS } from '../constants/http-status.constant.js';
import { MESSAGES } from '../constants/message.constant.js';
const authRouter = express.Router();

authRouter.post('/sign-up', signupValidator, async (req, res, next) => {
    try {
        const { email, password, nickname, one_liner, imageUrl, emailVerified } = req.body;
        //중복되는 이메일이 있다면 회원가입 실패
        const existedUser = await prisma.user.findUnique({ where: { email } });
        if (existedUser) return res.status(HTTP_STATUS.CONFLICT).json({
            status: HTTP_STATUS.CONFLICT,
            message: MESSAGES.AUTH.COMMON.EMAIL.TOO
        });
        //중복되는 닉네임이 있다면 회원가입 실패
        const existedNickname = await prisma.user.findUnique({ where: { nickname } });
        if (existedNickname) return res.status(HTTP_STATUS.CONFLICT).json({
            status: HTTP_STATUS.CONFLICT,
            message: MESSAGES.AUTH.COMMON.NICKNAME.TOO
        });
        // 데이터 생성
        const hashedPassword = bcrypt.hashSync(password, HASH_SALT_ROUNDS);
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                nickname,
                one_liner,
                imageUrl,
                emailVerified
            }
        })
        user.password = undefined;

        return res.status(HTTP_STATUS.CREATED).json({
            status: HTTP_STATUS.CREATED,
            message: MESSAGES.AUTH.SIGN_UP.SUCCEED,
            data: user
        })
    } catch (err) {
        next(err)
    }



});
export { authRouter };




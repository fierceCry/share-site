import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../utils/prisma.utils.js';
import { authConstant } from '../constants/auth.constant.js';
import { signupValidator } from '../middlwarmies/sign-up-validator.middleware.js';
import { signinValidator } from '../middlwarmies/sign-in-validator.middleware.js';
import { HTTP_STATUS } from '../constants/http-status.constant.js';
import { MESSAGES } from '../constants/message.constant.js';
import { ENV_KEY } from '../constants/env.constant.js'
const authRouter = express.Router();

authRouter.post('/sign-up', signupValidator, async (req, res, next) => {
    try {
        const { email, password, nickname, oneLiner, imageUrl, emailVerified } = req.body;
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
        const hashedPassword = bcrypt.hashSync(password, authConstant.HASH_SALT_ROUNDS);
        const { password: _, ...result } = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                nickname,
                oneLiner,
                imageUrl,
                emailVerified
            }
        })
        // user.password = undefined;

        return res.status(HTTP_STATUS.CREATED).json({
            status: HTTP_STATUS.CREATED,
            message: MESSAGES.AUTH.SIGN_UP.SUCCEED,
            data: result
        })
    } catch (err) {
        next(err)
    }
});

authRouter.post('/sign-in', signinValidator, async (req, res, next) => {
    try {
        const { email, password } = req.body;
        // 해당 사용자가 없을 시
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return res.status(HTTP_STATUS.UNAUTHORIZED).message(MESSAGES.AUTH.COMMON.EMAIL.NOTFOUND);
        // 비밀번호 확인
        const userPassword = bcrypt.compareSync(password, user.password);
        if (!userPassword) return res.status(HTTP_STATUS.UNAUTHORIZED).message(MESSAGES.AUTH.COMMON.PASSWORD.NOTMATCHED);
        // jwt 생성
        const payload = { id: user.userId };
        const accessToken = await generateAuthTokens(payload);

        return res.status(HTTP_STATUS.OK).json({
            status: HTTP_STATUS.OK,
            message: MESSAGES.AUTH.SIGN_IN.SUCCEED,
            data: { accessToken }
        });
        next();
    } catch (err) {
        next(err);
    }

});


//토큰 생성
const generateAuthTokens = async (payload) => {
    const userId = payload.id;

    const accessToken = jwt.sign(payload, ENV_KEY.ACCESS_TOKEN_SECRET, {
        expiresIn: '12h',
    });

    const refreshToken = jwt.sign(payload, ENV_KEY.REFRESH_TOKEN_SECRET, {
        expiresIn: '7d',
    });

    const hashedRefreshToken = bcrypt.hashSync(refreshToken, authConstant.HASH_SALT_ROUNDS);

    // RefreshToken을 갱신 ( 없을경우 생성 )
    await prisma.refreshToken.upsert({
        where: {
            userId,
        },
        update: {
            refreshToken: hashedRefreshToken,
        },
        create: {
            userId,
            refreshToken: hashedRefreshToken,
        },
    });

    return { accessToken, refreshToken };
};

export { authRouter };
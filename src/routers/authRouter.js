import express from 'express';
import prisma from '@prisma/client';
import jwt from jsonwebtoken;
import bcrypt from bcrypt;
import { HASH_SALT_ROUNDS } from '../constants/auth.constant.js';
const authRouter = express.Router();

authRouter.post('/sign-up', async (req, res, next) => {
    const { email, password, nickname, one_liner, imageUrl } = req.body;
    //유효성검사는 미들웨어를 통해 joi로 해결함
    //이상이 없을시에 User라는  테이블에 생성하기로 함

    //이미 중복되는 이메일이있다면 회원가입 실패
    const existedUser = await prisma.User.findFirst({ where: { email } });
    if (!existedUser) return res.status(409).json("오류");
    // 데이터 생성
    const hashedPassword = bcrypt.hashSync(password, HASH_SALT_ROUNDS);
    const user = await prisma.User.create({
        data: {
            email,
            password: hashedPassword,
            nickname,
            one_liner,
            imageUrl
        }
    })


});
export { authRouter };

const app = express();


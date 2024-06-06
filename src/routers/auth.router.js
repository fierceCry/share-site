import express from 'express';
import bcrypt from 'bcrypt';
import nodeMailer from 'nodemailer';
import { passport } from '../passport.Strategy/naver.Strategy.js';
import jwt from 'jsonwebtoken';
import { ENV_KEY } from '../constants/env.constant.js';
import { prisma } from '../utils/prisma.utils.js';
import { emalilCodeSchema } from '../middlwarmies/validation/emai.code.validation.middleware.js';
import { authConstant } from '../constants/auth.constant.js';
import { HTTP_STATUS } from '../constants/http-status.constant.js';
import { MESSAGES } from '../constants/message.constant.js';
import { signupValidator } from '../middlwarmies/validation/sign-up-validator.middleware.js';
import { signinValidator } from '../middlwarmies/validation/sign-in-validator.middleware.js';
import { requireRefreshToken } from '../middlwarmies/require-refresh-token.middleware.js';
import kakaoStrategy from '../passport.Strategy/kakao.Strategy.js';
const authRouter = express();

/** 네이버 로그인 뱃지 **/ 
authRouter.get(
  '/naver',
  passport.authenticate('naver', { session: false, authType: 'reprompt' })
);

/** 네이버 로그인 리다이렉트 **/
authRouter.get(
  '/naver/callback',
  passport.authenticate('naver', { session: false, failureRedirect: '/main' }),
  (req, res) => {
    const accessToken = req.user.data.token.accessToken;
    const refreshToken = req.user.data.token.refreshToken;
    res.redirect(
      `http://127.0.0.1:3000/callback?accessToken=${accessToken}&refreshToken=${refreshToken}`
    );
  }
);

/** 카카오 로그인 뱃지 **/ 
authRouter.get(
  '/kakao',
  kakaoStrategy.authenticate('kakao', { session: false, authType: 'reprompt' })
);

/** 카카오 로그인 리다이렉트 **/
authRouter.get(
  '/kakao/callback',
  kakaoStrategy.authenticate('kakao', {
    session: false,
    failureRedirect: '/main',
  }),
  (req, res) => {
    const accessToken = req.user.data.token.accessToken;
    const refreshToken = req.user.data.token.refreshToken;
    res.redirect(
      `http://127.0.0.1:3000/callback?accessToken=${accessToken}&refreshToken=${refreshToken}`
    );
  }
);

/** 일반 회원가입 **/
authRouter.post('/sign-up', signupValidator, async (req, res, next) => {
  try {
    const {
      email,
      password,
      nickname,
      oneLiner,
      imageUrl,
      emailVerified,
      provider,
    } = req.body;
    const existedUser = await prisma.user.findUnique({ where: { email } });
    if (existedUser)
      return res.status(HTTP_STATUS.CONFLICT).json({
        status: HTTP_STATUS.CONFLICT,
        message: MESSAGES.AUTH.COMMON.EMAIL.TOO,
      });
    const existedNickname = await prisma.user.findUnique({
      where: { nickname },
    });
    if (existedNickname)
      return res.status(HTTP_STATUS.CONFLICT).json({
        status: HTTP_STATUS.CONFLICT,
        message: MESSAGES.AUTH.COMMON.NICKNAME.TOO,
      });
    const hashedPassword = bcrypt.hashSync(
      password,
      authConstant.HASH_SALT_ROUNDS
    );
    const { password: _, ...result } = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        nickname,
        oneLiner,
        imageUrl,
        emailVerified,
        provider,
      },
    });
    return res.status(HTTP_STATUS.CREATED).json({
      status: HTTP_STATUS.CREATED,
      message: MESSAGES.AUTH.SIGN_UP.SUCCEED,
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

/** 일반 로그인 **/
authRouter.post('/sign-in', signinValidator, async (req, res, next) => {
  try {
    const { email, password, provider } = req.body;
    const user = await prisma.user.findUnique({ where: { email, provider} });
    if (!user)
      return res
        .status(HTTP_STATUS.UNAUTHORIZED)
        .json({ message: MESSAGES.AUTH.COMMON.EMAIL.NOTFOUND });
    const userPassword = bcrypt.compareSync(password, user.password);
    if (!userPassword)
      return res
        .status(HTTP_STATUS.UNAUTHORIZED)
        .json({ message: MESSAGES.AUTH.COMMON.PASSWORD.NOTMATCHED });
    const accessToken = await generateAuthTokens({ id: user.userId });
    return res.status(HTTP_STATUS.OK).json({
      status: HTTP_STATUS.OK,
      message: MESSAGES.AUTH.SIGN_IN.SUCCEED,
      data: { accessToken },
    });
  } catch (error) {
    next(error);
  }
});

/** 토큰 재발급 **/
authRouter.post('/token', requireRefreshToken, async (req, res, next) => {
  try {
    const user = req.user;
    const payload = { id: user.id };
    const data = await generateAuthTokens(payload);
    return res.status(HTTP_STATUS.OK).json({
      status: HTTP_STATUS.OK,
      message: MESSAGES.AUTH.TOKEN.SUCCEED,
      data: data,
    });
  } catch (error) {
    next(error);
  }
});

/** 로그아웃 **/
authRouter.delete('/sign-out', requireRefreshToken, async (req, res, next) => {
  const user = req.user;
  await prisma.refreshToken.update({
    where: { userId: user.userId },
    data: {
      refreshToken: null,
    },
  });
  return res.status(HTTP_STATUS.OK).json({
    status: HTTP_STATUS.OK,
    message: MESSAGES.AUTH.SIGN_OUT.SUCCEED,
    data: { id: user.userId },
  });
});

/** 이메일 인증 가입 메일 전송 기능 **/
authRouter.post('/email', emalilCodeSchema, async (req, res, next) => {
  try {
    const { email } = req.body;
    const userData = await prisma.emailAuthCode.findFirst({
      where: { email: email },
    });
    const result = await prisma.user.findFirst({
      where: {
        email: email
      }
    })
    if(result){
      return res.status(400).json({ message: MESSAGES.AUTH.COMMON.EMAIL.TOO});
    }
    const emailCode = generateRandomCode();
    const expirationAt = new Date();
    expirationAt.setMinutes(expirationAt.getMinutes() + 5);
    if (userData) {
      await prisma.emailAuthCode.update({
        where: {
          emailCodeId: userData.emailCodeId,
          email: userData.email,
        },
        data: {
          emailCode: emailCode,
          expirationAt: expirationAt,
        },
      });
    } else {
      await prisma.emailAuthCode.create({
        data: {
          email: email,
          emailCode: emailCode,
          expirationAt: expirationAt,
        },
      });
    }
    const transporter = nodeMailer.createTransport({
      service: ENV_KEY.EMAIL_SERVICE,
      auth: { user: ENV_KEY.EMAIL_ADDRESS, pass: ENV_KEY.EMAIL_PASSWORD },
    });
    const mailOptions = {
      to: email,
      subject: '맛집 추천 이메일 인증번호 발송',
      html: `
      <table cellpadding="0" cellspacing="0" style="border-collapse: collapse; border: none; width: 100%; max-width: 600px; margin: 0 auto;">
      <tr>
        <td style="padding: 20px; text-align: center;">
          <h2 style="color: #333; font-size: 24px; margin: 0;">가입확인 인증번호 발송</h2>
        </td>
      </tr>
      <tr>
        <td style="padding: 10px; text-align: center;">
          <p style="color: #666; font-size: 16px; margin: 0;">
            안녕하세요, 맛집 추천 서비스 가입을 위한 인증번호가 발송되었습니다.
          </p>
        </td>
      </tr>
      <tr>
        <td style="padding: 20px; text-align: center;">
          <div style="background-color: #007BFF; color: #FFF; font-size: 18px; padding: 10px 20px; text-align: center; border-radius: 5px;">
            인증번호: <strong>${emailCode}</strong>
          </div>
        </td>
      </tr>
    </table>
      `,
    };
    await transporter.sendMail(mailOptions);
    return res
      .status(200)
      .json({ message:MESSAGES.AUTH.COMMON.EMAILVERIFIED.SEND});
  } catch (error) {
    next(error);
  }
});

/** 이메일 가입 인증 확인 기능 **/
authRouter.get('/verify-email/:email/:emailCode', async (req, res, next) => {
  try {
    const { email, emailCode } = req.params;
    const data = await prisma.emailAuthCode.findFirst({
      where: { email },
    });
    if (!data || data.emailCode !== emailCode) {
      return res
        .status(400)
        .json({ message:MESSAGES.AUTH.COMMON.EMAILVERIFIED.FAILED });
    }
    if (data.expirationAt < new Date()) {
      return res.status(400).json({ message:MESSAGES.AUTH.COMMON.EMAILVERIFIED.TIMEOVER });
    }
    return res.status(200).json({ message:MESSAGES.AUTH.COMMON.EMAILVERIFIED.SUCCESS });
  } catch (error) {
    next(error);
  }
});

/** 토큰 생성 함수 **/
const generateAuthTokens = async (payload) => {
  const userId = payload.id;
  const accessToken = jwt.sign(payload, ENV_KEY.ACCESS_TOKEN_SECRET, {
    expiresIn: '12h',
  });
  const refreshToken = jwt.sign(payload, ENV_KEY.REFRESH_TOKEN_SECRET, {
    expiresIn: '7d',
  });
  const hashedRefreshToken = bcrypt.hashSync(
    refreshToken,
    authConstant.HASH_SALT_ROUNDS
  );

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

/** 인증코드 랜덤 발급 **/
const generateRandomCode = () => {
  let code = '';
  for (let i = 0; i < 8; i++) {
    let randomAscii = Math.floor(Math.random() * (122 - 48 + 1)) + 48;
    while (
      (randomAscii >= 60 && randomAscii <= 64) ||
      (randomAscii >= 91 && randomAscii <= 96)
    ) {
      randomAscii = Math.floor(Math.random() * (122 - 48 + 1)) + 48;
    }
    code += String.fromCharCode(randomAscii);
  }
  return code;
};

export { authRouter, generateAuthTokens };

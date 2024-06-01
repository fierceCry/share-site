import express from 'express';
import { ENV_KEY } from '../constants/env.constant.js';
import { prisma } from '../utils/prisma.utils.js';
import nodeMailer from 'nodemailer';
import { emalilCodeSchema } from '../middlwarmies/validation/emailCode.validation.middleware.js';

const authRouter = express();

/** 이메일 인증 가입 메일 전송 기능 **/
authRouter.post('/email', emalilCodeSchema, async(req, res, next) => {
  try {
    const { email } = req.body;

    const userData = await prisma.emailAuthCode.findFirst({
      where: { email: email }
    });
 
    const emailCode = generateRandomCode();
    const expirationAt = new Date()
    expirationAt.setMinutes(expirationAt.getMinutes()+ 5);
    if (userData) {
      await prisma.emailAuthCode.update({
        where: { 
          emailCodeId: userData.emailCodeId,
          email: userData.email 
        },
        data: {
          emailCode: emailCode,
          expirationAt: expirationAt
        }
      });
    } else {
      await prisma.emailAuthCode.create({
        data: {
          email: email,
          emailCode: emailCode,
          expirationAt: expirationAt
        }
      });
    }

    const transporter = nodeMailer.createTransport({
      service: ENV_KEY.EMAIL_SERVICE,
      auth: { user: ENV_KEY.EMAIL_ADDRESS, pass: ENV_KEY.EMAIL_PASSWORD },
    });

    const mailOptions = {
      to: email,
      subject: '맛집 추천 이메일 인증번호 발송',
      html: 
      `
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
      `
    };
    await transporter.sendMail(mailOptions);
    return res
      .status(200)
      .json({ message: '이메일 인증번호를 이메일로 전송했습니다.' });
  } catch (error) {
    next(error);
  }
});

/** 이메일 가입 인증 확인 기능 **/
authRouter.get('/verify-email/:email/:emailCode', async(req, res, next) => {
  try {
    const { email, emailCode } = req.params;

    const data = await prisma.emailAuthCode.findFirst({
      where: { email }
    });

    if (!data || data.emailCode !== emailCode) {
      return res.status(400).json({ message: '잘못된 이메일 또는 인증번호입니다.' });
    }

    if (data.expirationAt < new Date()) {
      return res.status(400).json({ message: '인증번호가 만료되었습니다.' });
    }

    return res.status(200).json({ message: '인증이 성공되었습니다.' });
  } catch (error) {
    next(error)
  }
})

/** 인증코드 랜덤 발급 **/
const generateRandomCode = () =>{
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
}

export { authRouter };
import 'dotenv/config'

export const ENV_KEY = {
  PORT : process.env.PORT,
  EMAIL_SERVICE: process.env.EMAIL_SERVICE,
  EMAIL_ADDRESS: process.env.EMAIL_ADDRESS,
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
  NAVER_CLIENT_ID: process.env.NAVER_CLIENT_ID,
  NAVER_SECRET: process.env.NAVER_SECRET,
  NAVER_CALLBACK: process.env.NAVER_CALLBACK
}
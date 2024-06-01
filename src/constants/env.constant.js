import dotenv from 'dotenv';

dotenv.config()

export const ENV_KEY = {
  PORT : process.env.PORT,
  EMAIL_SERVICE: process.env.EMAIL_SERVICE,
  EMAIL_ADDRESS: process.env.EMAIL_ADDRESS,
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET
}
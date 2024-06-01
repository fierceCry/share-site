import dotenv from 'dotenv';

dotenv.config()

export const ENV_KEY = {
  PORT : process.env.PORT,
  EMAIL: process.env.EMAIL,
  EMAIL_ADDRESS: process.env.EMAIL_ADDRESS,
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD
}
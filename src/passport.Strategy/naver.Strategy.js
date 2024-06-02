import passport from 'passport';
import { Strategy as NaverStrategy } from 'passport-naver-v2';
import { ENV_KEY } from '../constants/env.constant.js';
import { prisma } from '../utils/prisma.utils.js';
import jwt from 'jsonwebtoken';

passport.use(
  new NaverStrategy(
    {
      clientID: ENV_KEY.NAVER_CLIENT_ID,
      clientSecret: ENV_KEY.NAVER_SECRET,
      callbackURL: ENV_KEY.NAVER_CALLBACK,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await prisma.user.findFirst({
          where: { email: profile.email },
        });

        if (!user) {
          user = await prisma.user.create({
            data: {
              email: profile.email,
              nickname: profile.nickname,
              imageUrl: profile.profileImage,
              provider: profile.provider,
              emailVerified: true,
            },
          });
        }
        console.log(user)
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
          expiresIn: '12h',
        });

        const data = {
          userId: user.userId,
          email:  user.email,
          nickname: user.nickname,
          imageUrl: user.imageUrl,
          token: token,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }

        done(null, { user, data });
      } catch (error) {
        done(error);
      }
    }
  )
);

export default passport;
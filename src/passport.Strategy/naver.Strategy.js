import passport from 'passport';
import { Strategy as NaverStrategy } from 'passport-naver-v2';
import { ENV_KEY } from '../constants/env.constant.js';
import { prisma } from '../utils/prisma.utils.js';
import { generateAuthTokens } from '../routers/auth.router.js';

passport.use(
  new NaverStrategy(
    {
      clientID: ENV_KEY.NAVER_CLIENT_ID,
      clientSecret: ENV_KEY.NAVER_SECRET,
      callbackURL: ENV_KEY.NAVER_CALLBACK,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const user = await prisma.user.findFirst({
          where: { email: profile.email },
        });
        if (!user) {
          const newUser = await prisma.user.create({
            data: {
              email: profile.email,
              nickname: profile.nickname,
              imageUrl: profile.profileImage,
              provider: profile.provider,
              emailVerified: true,
            },
          });
        }
        console.log(user);
        const token = jwt.sign(
          { userId: user.id },
          ENV_KEY.ACCESS_TOKEN_SECRET,
          {
            expiresIn: ENV_KEY.ACCESS_TOKEN_EXPIRES_IN,
          }
        );

        const data = {
          userId: newUser.userId,
          email: newUser.email,
          nickname: newUser.nickname,
          imageUrl: newUser.imageUrl,
          token: token,
          createdAt: newUser.createdAt,
          updatedAt: newUser.updatedAt,
        };

        done(null, { user, data });
      } catch (error) {
        done(error);
      }
    }
  )
);

export { passport };

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
        console.log('Received profile:', profile);

        const user = await prisma.user.findFirst({
          where: { email: profile.email },
        });

        if (!user) {
          console.log('Creating new user with email:', profile.email);
          const newUser = await prisma.user.create({
            data: {
              email: profile.email,
              nickname: profile.nickname,
              imageUrl: profile.profileImage,
              provider: profile.provider,
              emailVerified: true,
            },
          });

          console.log('New user created:', newUser);
          const token = await generateAuthTokens({ id: newUser.userId });
          console.log('Generated token for new user:', token);

          const data = {
            userId: newUser.userId,
            email: newUser.email,
            nickname: newUser.nickname,
            imageUrl: newUser.imageUrl,
            token: token,
            createdAt: newUser.createdAt,
            updatedAt: newUser.updatedAt,
          };

          return done(null, { user: newUser, data });
        }

        console.log('Existing user found:', user);
        const token = await generateAuthTokens({ id: user.userId });
        console.log('Generated token for existing user:', token);

        const data = {
          userId: user.userId,
          email: user.email,
          nickname: user.nickname,
          imageUrl: user.imageUrl,
          token: token,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        };

        return done(null, { user, data });
      } catch (error) {
        console.error('Error in NaverStrategy:', error);
        return done(error);
      }
    }
  )
);

export { passport };

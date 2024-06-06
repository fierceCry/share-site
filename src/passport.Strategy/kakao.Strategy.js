import kakaoStrategy from 'passport';
import { ENV_KEY } from '../constants/env.constant.js';
import { prisma } from '../utils/prisma.utils.js';
import { Strategy as KakaoStrategy } from 'passport-kakao';
import { generateAuthTokens } from '../routers/auth.router.js';

kakaoStrategy.use(new KakaoStrategy(
    {
        clientID: ENV_KEY.KAKAO_CLIENT_ID, 
        clientSecret: ENV_KEY.KAKAO_SECRET,
        callbackURL: ENV_KEY.KAKAO_CALLBACK, 
    },
    async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await prisma.user.findFirst({
                where: { email: profile._json.kakao_account.email},
            });
            if (!user) {
                user = await prisma.user.create({
                    data: {
                        email: profile._json.kakao_account.email,
                        nickname: profile._json.properties.nickname,
                        imageUrl: profile._json.properties.profile_image,
                        provider: profile.provider,
                        oneLiner: null,
                        emailVerified: profile._json.kakao_account.is_email_verified
                    },
                });
            }
            const token = await generateAuthTokens({ id: user.userId });
            const data = {
                userId: user.userId,
                email: user.email,
                nickname: user.nickname,
                imageUrl: user.imageUrl,
                token: token,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }
            done(null, { user, data });
        } catch (err) {
            return done(err);
        }
    }
));

export default kakaoStrategy
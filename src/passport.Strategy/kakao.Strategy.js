import kakaoStrategy from 'passport';
import { ENV_KEY } from '../constants/env.constant.js';
import { prisma } from '../utils/prisma.utils.js';
import { Strategy as KakaoStrategy } from 'passport-kakao';
import { generateAuthTokens } from '../routers/auth.router.js';

kakaoStrategy.use(new KakaoStrategy(
    {
        clientID: ENV_KEY.KAKAO_CLIENT_ID, // 카카오 로그인에서 발급받은 REST API 키
        clientSecret: ENV_KEY.KAKAO_SECRET,
        callbackURL: ENV_KEY.KAKAO_CALLBACK, // 카카오 로그인 Redirect URI 경로 , 카카오 디벨로퍼에 적어놓은 redirect uri와 같아야 한다
    },
    async (accessToken, refreshToken, profile, done) => {
        try {
            // 사용자의 정보는 profile에 들어있다.
            console.log(profile.provider)
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
            console.log(data);
            done(null, { user, data });
        } catch (err) {
            return done(err);
        }
    }
));

export default kakaoStrategy
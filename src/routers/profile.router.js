import express from 'express';
import { requireAccessToken } from '../middlwarmies/require-access-token.middleware.js';
import { prisma } from '../utils/prisma.utils.js';

const profileRouter = express();




profileRouter.patch('/user', requireAccessToken, async( req, res, next ) => {
 try {
    const { userId } = req.user;
    const { nickname, oneLiner } = req.body;

   if(!nickname && !oneLiner ) {
    return res.status(400).json({ error: '수정할 정보를 입력해 주세요.'})
   }

   const updateData = {};
   if (nickname) updateData.nickname = nickname;
   if (oneLiner) updateData.oneLiner = oneLiner;

    const updateProfile = await prisma.user.update({
        where: { userId },
        data: updateData,
    });

    const profileDetail = {
        userId: updateProfile.userId,
        nickname: updateProfile.nickname,
        one_liner: updateProfile.oneLiner,
        createdAt: updateProfile.createdAt,
        updatedAt: updateProfile.updatedAt,
    };
    
    return res.status(200).json({message:' 수정이 완료 되었습니다.', profileDetail});

 }catch(err){
    next(err);
 }
})

// profileRouter.patch('/password',requireAccessToken, async( req, res, next ) => {
//     const {};
// })





export { profileRouter };
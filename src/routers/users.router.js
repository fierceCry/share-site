import express from 'express';
import bcrypt from 'bcrypt';
import { requireAccessToken } from '../middlwarmies/require-access-token.middleware.js';
import { prisma } from '../utils/prisma.utils.js';
import { MESSAGES } from '../constants/message.constant.js';
import { HTTP_STATUS } from '../constants/http-status.constant.js';
import { authConstant } from '../constants/auth.constant.js';

const userRouter = express.Router();

userRouter.get('/my', requireAccessToken, async (req, res, next) => {
  try {
    const { userId } = req.user;
    const userProfile = await prisma.user.findUnique({
      where: { userId: +userId },
      select: {
        userId: true,
        email: true,
        nickname: true,
        oneLiner: true,
        imageUrl: true,
        createdAt: true,
        updatedAt: true,
        posts: {
          select: {
            postId: true,
            title: true,
            content: true,
            imageUrl: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    if (!userProfile) {
      return res
        .status(HTTP_STATUS.NOT_FOUND)
        .json({ error: '사용자의 프로필을 찾을 수 없습니다.' });
    }

    // 팔로우 수와 팔로워 수를 카운트
    const followerCount = await prisma.follows.count({
      where: { followedId: +userId },
    });

    const followingCount = await prisma.follows.count({
      where: { followerId: +userId },
    });

    const formattedPosts = userProfile.posts.map((post) => ({
      postId: post.postId,
      title: post.title,
      content: post.content,
      imageUrl: post.imageUrl,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    }));

    return res.status(HTTP_STATUS.OK).json({
      status: HTTP_STATUS.OK,
      userProfile: {
        ...userProfile,
        posts: formattedPosts,
        followerCount,
        followingCount,
      },
    });
  } catch (err) {
    next(err);
  }
});

userRouter.patch('/user', requireAccessToken, async (req, res, next) => {
    try {
        const { userId } = req.user;
        const { nickname, oneLiner } = req.body;

        if (!nickname && !oneLiner) {
            return res.status(HTTP_STATUS.UNAUTHORIZED).json({ error: '수정할 정보를 입력해 주세요.' });
        }

        const existedNickname = await prisma.user.findUnique({
            where: { nickname },
        });
        if (existedNickname) {
            return res.status(HTTP_STATUS.CONFLICT).json({
                status: HTTP_STATUS.CONFLICT,
                message: MESSAGES.AUTH.COMMON.NICKNAME.TOO,
            });
        }

        const updateData = {};
        if (nickname) updateData.nickname = nickname;
        if (oneLiner) updateData.oneLiner = oneLiner;

        const updateProfile = await prisma.user.update({
            where: { userId },
            data: updateData,
        });

        const profileDetail = {
            userId: updateProfile.id,
            nickname: updateProfile.nickname,
            oneLiner: updateProfile.oneLiner,
            createdAt: updateProfile.createdAt,
            updatedAt: updateProfile.updatedAt,
        };

        return res.status(HTTP_STATUS.OK).json({ status: HTTP_STATUS.OK, message: '수정이 완료 되었습니다.', profileDetail });

    } catch (err) {
        next(err);
    }
});

userRouter.patch('/password', requireAccessToken, async (req, res, next) => {
    try {
        const { userId } = req.user;
        const { password, newPassword } = req.body;

        if (!password || !newPassword) {
            return res.status(HTTP_STATUS.UNAUTHORIZED).json({ error: "기존 비밀번호와 새 비밀번호를 모두 입력해주세요." });
        }

        if (newPassword.length < 6) {
            return res.status(HTTP_STATUS.UNAUTHORIZED).json({
                status: HTTP_STATUS.UNAUTHORIZED,
                message: MESSAGES.AUTH.COMMON.PASSWORD.MIN_LENGTH,
            });
        }

        const user = await prisma.user.findUnique({
            where: { userId },
            select: { password: true, nickname: true, createdAt: true, updatedAt: true }
        });

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(HTTP_STATUS.UNAUTHORIZED).json({ status: HTTP_STATUS.UNAUTHORIZED, error: "기존 비밀번호가 일치하지 않습니다." });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, authConstant.HASH_SALT_ROUNDS);

        const updatedUser = await prisma.user.update({
            where: { userId },
            data: { password: hashedNewPassword },
        });

        return res.status(HTTP_STATUS.OK).json({
            message: "새 비밀번호 설정이 완료되었습니다.",
            userDetails: {
                userId: updatedUser.id,
                nickname: updatedUser.nickname,
                createdAt: updatedUser.createdAt,
                updatedAt: updatedUser.updatedAt,
            }
        });

    } catch (err) {
        next(err);
    }
});

userRouter.post(
  '/profileupload',
  requireAccessToken,
  profileUpload.single('imageUrl'),
  async (req, res) => {
    console.log(req)
    if (!req.file) {
      return res
        .status(400)
        .json({ message: '이미지를 업로드하지 않았습니다.' });
    }
    const userId = req.user.userId;
    const fileUrl = req.file.location;
    console.log(userId)
    console.log(fileUrl)
    const updatedUser = await prisma.user.update({
      where: { userId },
      data: { imageUrl: fileUrl },
    });
    console.log(updatedUser)
    res.status(200).json({ message: '프로필이 업로드 되었습니다.', data: updatedUser.imageUrl });
  }
);

//팔로우
userRouter.post('/follows/:userId', requireAccessToken, async(req, res, next)=>{
    console.log(requireAccessToken)
    try {
        const {userId} = req.params
        const currentUserId = req.user.userId
        const user = await prisma.user.findUnique({
        where:{
            userId: Number(userId)
        }
    });
        if(user){
            await prisma.follows.create({
                data:{
                    followerId: currentUserId,
                    followedId: Number(userId)
                }
            })
            //await user.addFollowing(parseInt(req.params.userId, 10))
        return res.status(HTTP_STATUS.CREATED).json({status:HTTP_STATUS.CREATED,message:'팔로우 성공했습니다.'})
    } else {
        res.status(HTTP_STATUS.NOT_FOUND).json({status:HTTP_STATUS.NOT_FOUND})
    }
} catch(err) {
    next(err)
}
})
//언팔로우
userRouter.patch('/follows/:userId', requireAccessToken, async(req, res, next)=>{
    try{
        const {userId} = req.params
        const currentUserId =req.user.userId
        const user = await prisma.user.findUnique({
            where : { userId: Number(userId)}
        })
        if(user){
            await prisma.follows.deleteMany({
                where:{
                    followerId: currentUserId,
                    followedId: Number(userId)
                }
            })
            //await user.removeFollower(parseInt(req.params.userId))
            return res.status(HTTP_STATUS.OK).json({status:HTTP_STATUS.CREATED,message:'팔로우 취소했습니다.'})
        } else {
            res.status(HTTP_STATUS.NOT_FOUND).json({status:HTTP_STATUS.NOT_FOUND})}
    } catch(err) {
        next(err)
    }
})
//팔로우한 사람 게시글 조회
userRouter.get('/follows/:id',requireAccessToken, async(req, res, next)=>{
    try{
        const {id: userId} = req.params
        
        if(!userId){
            return res.status(HTTP_STATUS.NOT_FOUND).json({status:HTTP_STATUS.NOT_FOUND,message:'사용자를 찾을 수 없습니다'})
        }
        
       // const {id: followerId} = req.params;
        const following = await prisma.follows.findMany({
            where:{ followerId: +userId },
            select:{ followedId: true}
        });
        const followedIds = following.map(data => data.followedId)

        const posts = await prisma.post.findMany({
            where:{
                userId:{
                    in: followedIds
                }
            },
            orderBy:{
                createdAt: 'desc'
            },
            include:{
                user: true
            }
        })
        res.json(posts)
        }

     catch(err) {
        next()
    }
})

export { userRouter };

import express from 'express';
import bcrypt from 'bcrypt';
import { requireAccessToken } from '../middlwarmies/require-access-token.middleware.js';
import { prisma } from '../utils/prisma.utils.js';
import { MESSAGES } from '../constants/message.constant.js';
import { HTTP_STATUS } from '../constants/http-status.constant.js';
import { authConstant } from '../constants/auth.constant.js';
import { profileUpload } from '../middlwarmies/S3.middleware.js';

const userRouter = express.Router();

/** 본인 프로필 조회 **/
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
        .json({ message :MESSAGES.PROFILE.INFORMATION.NOTFOUND});
    }
    const followerCount = await prisma.follows.count({
      where: { followedId: +userId },
    })
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
      userProfile: {
        ...userProfile,
        posts: formattedPosts,
        followerCount,
        followingCount,
      },
    });
  } catch (error){
    next(error);
  }
});

/** 마이페이지 프로필 수정 **/
userRouter.patch('/user', requireAccessToken,async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { nickname, oneLiner } = req.body;
    if (!nickname && !oneLiner) {
      return res
        .status(HTTP_STATUS.UNAUTHORIZED)
        .json({ message: MESSAGES.PROFILE.INFORMATION.CHANGE });
    }
    const user = await prisma.user.findUnique({
      where: { userId: userId },
    });
    if (nickname !== user.nickname) {
      const existedNickname = await prisma.user.findUnique({
        where: { nickname },
      });
      if (existedNickname) {
        return res.status(HTTP_STATUS.CONFLICT).json({
          message: MESSAGES.AUTH.COMMON.NICKNAME.TOO,
        });
      }
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
    return res
      .status(HTTP_STATUS.OK)
      .json({
        message: MESSAGES.PROFILE.INFORMATION.CHNAGE_SUCCESS,
        profileDetail,
      });
  } catch (err) {
    next(err);
  }
});

/** 다른 유저 프로필 조회 **/
userRouter.get('/:userId', requireAccessToken, async (req, res, next) => {
  try {
    const { userId } = req.params;
    const userProfile = req.user.id;

    const user = await prisma.user.findUnique({
      where: { userId: parseInt(userId) },
      select: {
        userId: true,
        nickname: true,
        oneLiner: true,
        imageUrl: true,
        posts: {
          select: {
            postId: true,
            content: true,
            title: true,
            imageUrl: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ message: MESSAGES.PROFILE.INFORMATION.NO_USER });
    }
    const isFollowing = await prisma.follows.findFirst({
      where: {
        followerId: userProfile,
        followedId: +userId,
      },
    });
    const followersCount = await prisma.follows.count({
      where: { followedId: +userId },
    });
    const followingCount = await prisma.follows.count({
      where: { followerId: +userId },
    });

    const responseData = {
      ...user,
      followers: followersCount,
      following: followingCount,
      isFollowing: !!isFollowing,
    };

    return res.status(HTTP_STATUS.OK).json({ data: responseData });
  } catch (error) {
    next(error);
  }
});

/** 유저 패스워드 변경 **/
userRouter.patch('/password', requireAccessToken, async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { password, newPassword } = req.body;
    if (!password || !newPassword) {
      return res
        .status(HTTP_STATUS.UNAUTHORIZED)
        .json({ error: MESSAGES.PROFILE.PASSWORD.INPUT_ERROR });
    }

    if (newPassword.length < 6) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        status: HTTP_STATUS.UNAUTHORIZED,
        message: MESSAGES.AUTH.COMMON.PASSWORD.MIN_LENGTH,
      });
    }

    const user = await prisma.user.findUnique({
      where: { userId },
      select: {
        password: true,
        nickname: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(HTTP_STATUS.UNAUTHORIZED)
        .json({
          error: MESSAGES.PROFILE.PASSWORD.NOT_MATCHED,
        });
    }

    const hashedNewPassword = await bcrypt.hash(
      newPassword,
      authConstant.HASH_SALT_ROUNDS
    );

    const updatedUser = await prisma.user.update({
      where: { userId },
      data: { password: hashedNewPassword },
    });
    return res.status(HTTP_STATUS.OK).json({
      message: MESSAGES.PROFILE.PASSWORD.NEW_PASSWORD_CHANGE_SUCCESS ,
      userDetails: {
        userId: updatedUser.id,
        nickname: updatedUser.nickname,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt,
      },
    });
  } catch (error) {
    next(error);
  }
});

userRouter.post(
  '/profileupload',
  requireAccessToken,
  profileUpload.single('imageUrl'),
  async (req, res) => {
    if (!req.file) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ message: MESSAGES.PROFILE.IMAGE.NOT_UPLOAD });
    }
    const userId = req.user.userId;
    const fileUrl = req.file.location;
    const updatedUser = await prisma.user.update({
      where: { userId },
      data: { imageUrl: fileUrl },
    });
    res
      .status(HTTP_STATUS.OK)
      .json({
        message: MESSAGES.PROFILE.INFORMATION.UPLOAD_SUCCESS,
        data: updatedUser.imageUrl,
      });
  }
);

/** 팔로우 생성 기능 **/
userRouter.post(
  '/follows/:userId',
  requireAccessToken,
  async (req, res, next) => {
    try {
      console.log(req.user)
      const { userId } = req.params;
      const currentUserId = req.user.userId;
      const user = await prisma.user.findUnique({
        where: {
          userId: Number(userId),
        },
      });
      if (user) {
        await prisma.follows.create({
          data: {
            followerId: currentUserId,
            followedId: Number(userId),
          },
        });
        return res
          .status(HTTP_STATUS.CREATED)
          .json({
            status: HTTP_STATUS.CREATED,
            message: MESSAGES.PROFILE.FOLLOW.SUCCESS,
          });
      } else {
        res
          .status(HTTP_STATUS.NOT_FOUND)
          .json({ status: HTTP_STATUS.NOT_FOUND });
      }
    } catch (err) {
      next(err);
    }
  }
);
/** 팔로우 취소 기능 **/
userRouter.patch(
  '/follows/:userId',
  requireAccessToken,
  async (req, res, next) => {
    try {
      const { userId } = req.params;
      const currentUserId = req.user.userId;
      const user = await prisma.user.findUnique({
        where: { userId: Number(userId) },
      });
      if (user) {
        await prisma.follows.deleteMany({
          where: {
            followerId: currentUserId,
            followedId: Number(userId),
          },
        });

        return res
          .status(HTTP_STATUS.OK)
          .json({
            status: HTTP_STATUS.CREATED,
            message: MESSAGES.PROFILE.FOLLOW.CANCEL,
          });
      } else {
        res
          .status(HTTP_STATUS.NOT_FOUND)
          .json({ status: HTTP_STATUS.NOT_FOUND });
      }
    } catch (err) {
      next(err);
    }
  }
);

/** 팔로우 목록 조회 **/
userRouter.get('/follows/:id', requireAccessToken, async (req, res, next) => {
  try {
    const { id: userId } = req.params;
    if (!userId) {
      return res
        .status(HTTP_STATUS.NOT_FOUND)
        .json({
          status: HTTP_STATUS.NOT_FOUND,
          message:MESSAGES.PROFILE.FOLLOW.NOT_FOUND_USER,
        });
    }

    const following = await prisma.follows.findMany({
      where: { followerId: +userId },
      select: { followedId: true },
    });
    const followedIds = following.map((data) => data.followedId);

    const posts = await prisma.post.findMany({
      where: {
        userId: {
          in: followedIds,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: true,
      },
    });
    res.status(HTTP_STATUS.OK).json({ data: posts});
  } catch (err) {
    next();
  }
});

export { userRouter };

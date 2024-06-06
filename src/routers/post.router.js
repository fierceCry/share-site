import express from 'express';
import { prisma } from '../utils/prisma.utils.js';
import { commentSchema } from '../middlwarmies/validation/comment.validation.middleware.js';
import { HTTP_STATUS } from '../constants/http-status.constant.js';
import { postCreateValidator } from '../middlwarmies/validation/create-post-validator.middleware.js';
import { postUpload } from '../middlwarmies/S3.middleware.js';
import { upload } from '../middlwarmies/multer.middleware.js';
import { MESSAGES } from '../constants/message.constant.js';
import { requireAccessToken } from '../middlwarmies/require-access-token.middleware.js'
const postsRouter = express();

postsRouter.post(
  '/upload',
  requireAccessToken,
  upload.array('images', 5),
  (req, res, next) => {
    try {
      if (!req.files) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          status: HTTP_STATUS.BAD_REQUEST,
          message: MESSAGES.POST_MESSAGES.POST_IMAGE_FAIL,
        });
      }
      const imageUrl = `/uploads/${req.file.filename}`;
      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES.POST_MESSAGES.POST_IMAGE_CREATE,
        imageUrl,
      });
    } catch (error) {
      next(error);
    }
  }
);

postsRouter.post(
  '/posts',
  requireAccessToken,
  postCreateValidator,
  async (req, res, next) => {
    try {
      const { userId } = req.user;
      const { title, content, regionId, imageUrl } = req.body;
      const data = await prisma.post.create({
        data: {
          userId: userId,
          title,
          content,
          regionId,
          imageUrl,
        },
      });
      return res.status(HTTP_STATUS.CREATED).json({
        status: HTTP_STATUS.CREATED,
        message: MESSAGES.POST_MESSAGES.POST_CREATE,
        data: data,
      });
    } catch (error) {
      next(error);
    }
  }
);

/** 게시글 목록 조회 **/
postsRouter.get('/posts', requireAccessToken, async (req, res, next) => {
  try {
    console.log(res.user)
    let { sort, page = 1, limit = 12 } = req.query;
    sort = sort?.toLowerCase();

    if (sort !== 'desc' && sort !== 'asc') {
      sort = 'desc';
    }
    const skip = (page - 1) * limit;
    const [data, totalCount] = await Promise.all([
      prisma.post.findMany({
        orderBy: {
          createdAt: sort,
        },
        include: {
          user: true,
        },
        skip,
        take: +limit,
      }),
      prisma.post.count(),
    ]);
    const totalPages = Math.ceil(totalCount / limit);
    const formattedData = data.map((post) => {
      return {
        postId: post.postId,
        title: post.title,
        content: post.content,
        regionId: post.regionId,
        imageUrl: post.imageUrl,
        nickname: post.user.nickname,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
      };
    });
    return res.status(HTTP_STATUS.OK).json({
      status: HTTP_STATUS.OK,
      message: MESSAGES.POST_MESSAGES.POST_LIST,
      data: formattedData,
      currentPage: page,
      totalPages,
    });
  } catch (error) {
    next(error);
  }
});

/** 게시글 상세 조회 **/
postsRouter.get('/:id', requireAccessToken, async (req, res, next) => {
  try {
    const { id: postId } = req.params;
    const userId = req.user.userId;
    const likeCount = await prisma.like.count({
      where: {
        postId: +postId,
      },
    });
    const userLike = await prisma.like.findFirst({
      where: {
        postId: +postId,
        userId: +userId,
      },
    });
    const isLikedByUser = Boolean(userLike);
    let data = await prisma.post.findUnique({
      where: { postId: +postId },
      include: {
        user: {
          select: {
            nickname: true,
          },
        },
        Comment: {
          take: 3,
          include: {
            user: {
              select: {
                nickname: true,
              },
            },
          },
        },
      },
    });
    if (!data) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        status: HTTP_STATUS.NOT_FOUND,
        message: MESSAGES.POST_MESSAGES.POST_NOT_FOUND,
        data: data,
      });
    }
    let comments = await Promise.all(
      data.Comment.map(async (comment) => {
        const commentLikeCount = await prisma.commentLike.count({
          where: {
            commentId: comment.commentId,
          },
        });
        return {
          commentId: comment.commentId,
          userId: comment.userId,
          postId: comment.postId,
          comment: comment.comment,
          createdAt: comment.createdAt,
          updatedAt: comment.updatedAt,
          nickname: comment.user.nickname, 
          likes: commentLikeCount, 
        };
      })
    );
    // 최종 응답 데이터를 구성합니다.
    data = {
      postId: data.postId,
      title: data.title,
      userId: data.userId,
      content: data.content,
      nickname: data.user.nickname,
      regionId: data.regionId,
      imageUrl: data.imageUrl,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      comments: comments, 
      likes: likeCount, 
      isLikedByUser,
    };
    return res.status(HTTP_STATUS.OK).json({
      status: HTTP_STATUS.OK,
      message: MESSAGES.POST_MESSAGES.POST_DETAIL,
      data,
    });
  } catch (error) {
    next(error);
  }
});

/** 게시글 수정 **/
postsRouter.patch('/:postId', requireAccessToken, upload.single('image'), async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { postId } = req.params;
    const { title, content, regionId, imageUrl } = req.body;
    const idcheck = await prisma.post.findUnique({
      where: {
        postId: +postId,
      },
    });
    if (!idcheck) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        status: HTTP_STATUS.NOT_FOUND,
        message: MESSAGES.POST_MESSAGES.POST_NOT_FOUND,
      });
    }
    if (!title && !content && !imageUrl && !regionId) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        status: HTTP_STATUS.BAD_REQUEST,
        message: MESSAGES.POST_MESSAGES.POST_NOT_UPDATE,
      });
    }
    if (idcheck.userId !== userId) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ message: MESSAGES.POST_MESSAGES.POST_NOT_AUTH});
    }
    const updatedPost = await prisma.post.update({
      where: { postId: +postId },
      data: {
        title,
        content,
        imageUrl,
        regionId,
        updatedAt: new Date(),
      },
      include: {
        user: {
          select: {
            email: true,
            nickname: true,
          },
        },
      },
    });
    return res.status(HTTP_STATUS.OK).json({
      status: HTTP_STATUS.OK,
      message: MESSAGES.POST_MESSAGES.POST_UPDATE,
      data: {
        postId: updatedPost.postId,
        email: updatedPost.user.email,
        nickname: updatedPost.user.nickname,
        title: updatedPost.title,
        content: updatedPost.content,
        imageUrl: updatedPost.imageUrl,
        region: updatedPost.regionId,
        createdAt: updatedPost.createdAt,
        updatedAt: updatedPost.updatedAt,
      },
    });
  } catch (error) {
    next(error);
  }
});

/** 게시글 삭제 **/
postsRouter.delete('/:postId',requireAccessToken, async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { postId } = req.params;
    const idcheck = await prisma.post.findUnique({
      where: {
        postId: +postId,
      },
    });
    if (!idcheck) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        status: HTTP_STATUS.NOT_FOUND,
        message: MESSAGES.POST_MESSAGES.POST_NOT_FOUND,
      });
    }
    if (idcheck.userId !== userId) {
      return res
        .status(HTTP_STATUS.NOT_FOUND)
        .json({ message: MESSAGES.POST_MESSAGES.POST_NOT_AUTH});
    }
    await prisma.comment.deleteMany({
      where: {
        postId: +postId,
      },
    });
    await prisma.like.deleteMany({
      where: {
        postId: +postId,
      },
    });
    await prisma.post.delete({
      where: { postId: +postId, userId: userId },
    });
    return res.status(HTTP_STATUS.OK).json({
      status: HTTP_STATUS.OK,
      message: MESSAGES.POST_MESSAGES.POST_DELETE,
    });
  } catch (error) {
    next(error);
  }
});

/** 게시글 좋아요 기능 **/
postsRouter.patch(
  '/likes/:postId',
  requireAccessToken,
  async (req, res, next) => {
    try {
      const { postId } = req.params;
      const { userId } = req.user;
      const result = await prisma.post.findUnique({
        where: { postId: +postId },
      });
      if (!result) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: MESSAGES.POST_MESSAGES.POST_NOT_FOUND});
      }
      // 좋아요 존재 여부 확인
      const postsData = await prisma.like.findFirst({
        where: {
          postId: +postId,
          userId,
        },
      });
      if (postsData) {
        await prisma.like.delete({
          where: {
            likeId: postsData.likeId,
          },
        });
        return res
          .status(HTTP_STATUS.OK)
          .json({ message: MESSAGES.POST_MESSAGES.POST_LIKE_DELETE});
      } else {
        await prisma.like.create({
          data: {
            postId: +postId,
            userId,
          },
        });
        return res
          .status(HTTP_STATUS.OK)
          .json({ message: MESSAGES.POST_MESSAGES.POST_LIKE_CREATE});
      }
    } catch (error) {
      next(error);
    }
  }
);

/** 댓글 좋아요 기능 **/
postsRouter.patch(
  '/likes/:postId/:commentId',
  requireAccessToken,
  async (req, res, next) => {
    try {
      const { postId, commentId } = req.params;
      const { userId } = req.user;
      const postResult = await prisma.post.findUnique({
        where: { postId: +postId },
      });
      if (!postResult) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: MESSAGES.POST_MESSAGES.POST_NOT_FOUND});
      }
      const commentResult = await prisma.comment.findUnique({
        where: { commentId: +commentId },
      });
      if (!commentResult) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: MESSAGES.POST_MESSAGES.COMMENT_NOT_FOUND});
      }
      const likeData = await prisma.commentLike.findFirst({
        where: {
          commentId: +commentId,
          postId: +postId,
          userId,
        },
      });
      if (likeData) {
        await prisma.commentLike.delete({
          where: {
            commentlikeId: likeData.commentlikeId,
          },
        });
        return res
          .status(HTTP_STATUS.OK)
          .json({ message: MESSAGES.POST_MESSAGES.COMMENT_LIKE_DELETE});
      } else {
        await prisma.commentLike.create({
          data: {
            commentId: +commentId,
            postId: +postId,
            userId,
          },
        });
        return res
          .status(HTTP_STATUS.OK)
          .json({ message: MESSAGES.POST_MESSAGES.COMMENT_LIKE_CREATE});
      }
    } catch (error) {
      next(error);
    }
  }
);

/**  게시글에 댓글 생성 **/
postsRouter.post(
  '/comment/:postId',
  requireAccessToken,
  commentSchema,
  async (req, res, next) => {
    try {
      const { postId } = req.params;
      const { userId } = req.user;
      const { comment } = req.body;
      const postData = await prisma.post.findFirst({
        where: {
          postId: +postId,
        },
      });
      if (!postData) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: MESSAGES.POST_MESSAGES.POST_NOT_FOUND});
      }
      const commentData = await prisma.comment.create({
        data: {
          postId: +postId,
          userId: userId,
          comment: comment,
        },
      });
      const data = await prisma.user.findUnique({
        where: { userId: userId },
      });
      const result = {
        comment: commentData.comment,
        commentId: commentData.commentId,
        createdAt: commentData.createdAt,
        updatedAt: commentData.updatedAt,
        postId: commentData.postId,
        userId: commentData.userId,
        nickname: data.nickname,
      };
      return res
        .status(HTTP_STATUS.OK)
        .json({ message: MESSAGES.POST_MESSAGES.POST_COMMENT_CREATE, data: result });
    } catch (error) {
      next(error);
    }
  }
);

/** 게시글에 댓글 조회 **/
postsRouter.get(
  '/comments/:postId',
  requireAccessToken,
  async (req, res, next) => {
    try {
      const { postId } = req.params;
      const { userId } = req.user;
      const postData = await prisma.post.findFirst({
        where: { postId: +postId },
      });
      if (!postData) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: MESSAGES.POST_MESSAGES.POST_NOT_FOUND});
      }
      const commentsWithLikes = await prisma.comment.findMany({
        where: {
          postId: +postId,
        },
        include: {
          user: {
            select: {
              nickname: true,
            },
          },
          commentLike: true,
        },
      });
      const data = commentsWithLikes.map((comment) => {
        const likeCount = comment.commentLike.length;
        const isLikedByUser = comment.commentLike.some(
          (like) => like.userId === +userId
        ); 

        return {
          commentId: comment.commentId,
          userId: comment.userId,
          postId: comment.postId,
          nickname: comment.user.nickname,
          comment: comment.comment,
          createdAt: comment.createdAt,
          updatedAt: comment.updatedAt,
          likeCount, 
          isLikedByUser, 
        };
      });

      return res.status(HTTP_STATUS.OK).json({ data : data });
    } catch (error) {
      next(error);
    }
  }
);

/** 게시글에 댓글 수정 **/
postsRouter.patch(
  '/comments/:postId/:commentId',
  requireAccessToken,
  commentSchema,
  async (req, res, next) => {
    try {
      const { postId, commentId } = req.params;
      const { userId } = req.user;
      const { comment } = req.body;
      const existingComment = await prisma.comment.findFirst({
        where: {
          postId: +postId,
          commentId: +commentId,
        },
      });
      if (!existingComment) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({ message: MESSAGES.POST_MESSAGES.COMMENT_NOT_FOUND});
      }
      if (existingComment.userId !== userId) {
        return res
          .status(HTTP_STATUS.FORBIDDEN)
          .json({ message: MESSAGES.POST_MESSAGES.COMMENT_NOT_UPDATE});
      }
      const updatedComment = await prisma.comment.update({
        where: {
          commentId: +commentId,
          postId: +postId,
          userId: +userId,
        },
        data: {
          comment: comment,
        },
      });
      return res.status(HTTP_STATUS.OK).json({
        message: MESSAGES.POST_MESSAGES.COMMENT_UPDATE,
        data: updatedComment,
      });
    } catch (error) {
      next(error);
    }
  }
);

/** 게시글에 댓글 삭제 **/
postsRouter.delete(
  '/comments/:postId/:commentId',
  requireAccessToken,
  async (req, res, next) => {
    try {
      const { postId, commentId } = req.params;
      const { userId } = req.user;
      const data = await prisma.comment.findFirst({
        where: {
          commentId: +commentId,
          postId: +postId,
        },
      });
      if (!data) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: MESSAGES.POST_MESSAGES.COMMENT_NOT_FOUND});
      }
      if (data.userId !== userId) {
        return res
          .status(HTTP_STATUS.FORBIDDEN)
          .json({ message: MESSAGES.POST_MESSAGES.COMMENT_NOT_DELETE});
      }
      await prisma.commentLike.deleteMany({
        where: {
          commentId: +commentId
        }
      });
      const deleteComment = await prisma.comment.delete({
        where: {
          commentId: +commentId,
          userId: userId,
        },
      });
      return res.status(HTTP_STATUS.OK).json({
        message: MESSAGES.POST_MESSAGES.COMMENT_DELETE,
        data: deleteComment,
      });
    } catch (error) {
      next(error);
    }
  }
);

//게시글 이미지 업로드
postsRouter.post(
  '/uploadtest',
  requireAccessToken,
  postUpload.array('image', 10), 
  async (req, res) => {
    const fileUrls = req.files.map((file) => file.location);
    const fileUrlsJson = {
      imageUrl: JSON.stringify(fileUrls), 
    };
    res.status(HTTP_STATUS.OK).json({
      message: MESSAGES.POST_MESSAGES.POST_FILE_UPLOAD,
      data: fileUrlsJson,
    });
  }
);

/** 카테고리 별 목록조회 **/
postsRouter.get(
  '/category/:categoryId',
  requireAccessToken,
  async (req, res, next) => {
    try {
      const { categoryId } = req.params;
      console.log(req)
      const limit = parseInt(req.query.limit) || 12;  
      const offset = parseInt(req.query.offset) || 0;
      const data = await prisma.post.findMany({
        where: {
          regionId: +categoryId,
        },
        select: {
          postId: true,
          userId: true,
          title: true,
          content: true,
          regionId: true,
          imageUrl: true,
          createdAt: true,
          updatedAt: true,
          user: {
            select: {
              nickname: true,
            },
          },
        },
        skip: offset,
        take: limit,
      });
      const result = data.map((post) => ({
        postId: post.postId,
        userId: post.userId,
        title: post.title,
        content: post.content,
        regionId: post.regionId,
        imageUrl: post.imageUrl,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        nickname: post.user.nickname,
      }));
      const totalPosts = await prisma.post.count({
        where: {
          regionId: +categoryId,
        },
      });
      return res.status(HTTP_STATUS.OK).json({
        message: MESSAGES.POST_MESSAGES.POST_SUCCESS_CHECK,
        data: result,
        pagination: {
          total: totalPosts,
          limit: limit,
          offset: offset,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

export { postsRouter };

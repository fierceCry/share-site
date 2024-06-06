import express from 'express';
import { prisma } from '../utils/prisma.utils.js';
import { commentSchema } from '../middlwarmies/validation/comment.validation.middleware.js';
import { requireAccessToken } from '../middlwarmies/require-access-token.middleware.js';
import { HTTP_STATUS } from '../constants/http-status.constant.js';
import { POST_MESSAGES } from '../constants/post.constant.js';
import { postCreateValidator } from '../middlwarmies/validators/src/middlewares/validators/create-post-validator.middleware.js';
import { postUpload } from '../middlwarmies/S3.middleware.js';
import { upload } from '../middlwarmies/multer.middleware.js';

const postsRouter = express();

postsRouter.post(
  '/upload',
  requireAccessToken,
  upload.array('images', 5),
  (req, res, next) => {
    try {
      console.log(req);
      if (!req.files) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          status: HTTP_STATUS.BAD_REQUEST,
          message: '이미지가 업로드 되지 않았습니다.',
        });
      }
      const imageUrl = `/uploads/${req.file.filename}`;
      console.log(imageUrl);
      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: '이미지 업로드가 완료 되었습니다.',
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
        message: POST_MESSAGES.POST_CREATE,
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
      message: POST_MESSAGES.POST_LIST,
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
    const userId = req.user.userId; // 인증된 사용자의 ID를 가져옵니다. (예: JWT 토큰에서 추출된 userId)
    
    // 게시글의 좋아요 수를 가져옵니다.
    const likeCount = await prisma.like.count({
      where: {
        postId: +postId,
      },
    });

    // 사용자가 게시글에 좋아요를 눌렀는지 여부를 확인합니다.
    const userLike = await prisma.like.findFirst({
      where: {
        postId: +postId,
        userId: +userId,
      },
    });
    const isLikedByUser = Boolean(userLike);

    // 게시글의 데이터를 가져옵니다.
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
        message: POST_MESSAGES.POST_NOT_FOUND,
        data: data,
      });
    }

    // 댓글의 좋아요 수를 계산하여 댓글 정보에 추가합니다.
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
          nickname: comment.user.nickname, // 댓글 작성자의 닉네임을 새로운 필드로 추가합니다.
          likes: commentLikeCount, // 댓글 좋아요 수
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
      comments: comments, // 'comments'로 키 이름 수정
      likes: likeCount, // 게시글 좋아요 수 추가
      isLikedByUser, // 사용자가 좋아요를 눌렀는지 여부 추가
    };
    console.log(data)
    return res.status(HTTP_STATUS.OK).json({
      status: HTTP_STATUS.OK,
      message: POST_MESSAGES.POST_DETAIL,
      data,
    });
  } catch (error) {
    next(error);
  }
});


/** 게시글 수정 **/
postsRouter.patch('/:postId', requireAccessToken, async (req, res, next) => {
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
      return res.status(404).json({
        status: HTTP_STATUS.NOT_FOUND,
        message: '게시물이 존재하지 않습니다.',
      });
    }

    if (!title && !content && !imageUrl && !regionId) {
      return res.status(400).json({
        status: HTTP_STATUS.BAD_REQUEST,
        message: '수정된 내용이 없습니다.',
      });
    }
    if (idcheck.userId !== userId) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ message: '접근 권한이 없습니다.' });
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

    return res.status(200).json({
      status: HTTP_STATUS.OK,
      message: '수정 완료되었습니다.',
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
postsRouter.delete('/:postId', requireAccessToken, async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { postId } = req.params;

    const idcheck = await prisma.post.findUnique({
      where: {
        postId: +postId,
      },
    });

    if (!idcheck) {
      return res.status(404).json({
        status: HTTP_STATUS.NOT_FOUND,
        message: '게시물이 존재하지 않습니다.',
      });
    }
    if (idcheck.userId !== userId) {
      return res
        .status(HTTP_STATUS.NOT_FOUND)
        .json({ message: '접근 권한이 없습니다.' });
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

    return res.status(200).json({
      status: HTTP_STATUS.OK,
      message: '게시글 삭제가 완료되었습니다.',
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
        return res.status(400).json({ message: '게시글이 존재하지 않습니다.' });
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
          .status(200)
          .json({ message: '게시글 좋아요가 삭제되었습니다.' });
      } else {
        await prisma.like.create({
          data: {
            postId: +postId,
            userId,
          },
        });
        return res
          .status(200)
          .json({ message: '게시글 좋아요가 생성되었습니다.' });
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
        return res.status(400).json({ message: '게시글이 존재하지 않습니다.' });
      }

      const commentResult = await prisma.comment.findUnique({
        where: { commentId: +commentId },
      });
      if (!commentResult) {
        return res.status(400).json({ message: '댓글이 존재하지 않습니다.' });
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
          .status(200)
          .json({ message: '댓글 좋아요가 삭제되었습니다.' });
      } else {
        await prisma.commentLike.create({
          data: {
            commentId: +commentId,
            postId: +postId,
            userId,
          },
        });
        return res
          .status(200)
          .json({ message: '댓글 좋아요가 생성되었습니다.' });
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
        return res.status(400).json({ message: '게시글을 찾을 수 없습니다.' });
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
        .status(200)
        .json({ message: '댓글 생성이 완료했습니다.', data: result });
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
        return res.status(400).json({ message: '게시글을 찾을 수 없습니다.' });
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
          commentLike: true, // 모든 좋아요를 포함
        },
      });

      const data = commentsWithLikes.map((comment) => {
        const likeCount = comment.commentLike.length; // 좋아요 개수 계산
        const isLikedByUser = comment.commentLike.some(
          (like) => like.userId === +userId
        ); // 사용자가 좋아요를 눌렀는지 확인

        return {
          commentId: comment.commentId,
          userId: comment.userId,
          postId: comment.postId,
          nickname: comment.user.nickname,
          comment: comment.comment,
          createdAt: comment.createdAt,
          updatedAt: comment.updatedAt,
          likeCount, // 좋아요 개수 추가
          isLikedByUser, // 사용자가 좋아요를 눌렀는지 여부 추가
        };
      });

      return res.status(200).json({ data : data });
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
        return res.status(404).json({ message: '댓글을 찾을 수 없습니다.' });
      }
      if (existingComment.userId !== userId) {
        return res
          .status(403)
          .json({ message: '댓글을 수정할 수 있는 권한이 없습니다.' });
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
      return res.status(200).json({
        message: '댓글이 성공적으로 수정되었습니다.',
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
        return res.status(400).json({ message: '댓글이 없습니다.' });
      }

      if (data.userId !== userId) {
        return res
          .status(403)
          .json({ message: '댓글을 삭제할 수 있는 권한이 없습니다.' });
      }

      const deleteComment = await prisma.comment.delete({
        where: {
          commentId: +commentId,
          userId: userId,
        },
      });
      return res.status(200).json({
        message: '댓글이 성공적으로 삭제되었습니다.',
        data: deleteComment,
      });
    } catch (error) {
      next(error);
    }
  }
);

// //게시글 이미지 업로드
postsRouter.post(
  '/uploadtest',
  requireAccessToken,
  // postCreateValidator,
  postUpload.array('image', 10), // 여러 파일 업로드 가능
  async (req, res) => {
    const fileUrls = req.files.map((file) => file.location); // 업로드된 파일의 URL 가져오기
    const fileUrlsJson = {
      imageUrl: JSON.stringify(fileUrls), // URL을 JSON 형식으로 변환하여 저장 / 해당 변수를 imagUrl 칸에 넣기.
    };

    res.status(200).json({
      message: '파일이 업로드 되었습니다.',
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
      const limit = parseInt(req.query.limit) || 12;  // 기본값 10
      const offset = parseInt(req.query.offset) || 0; // 기본값 0

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

      return res.status(200).json({
        message: '조회에 성공 했습니다.',
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

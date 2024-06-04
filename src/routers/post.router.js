import express from 'express';
import { prisma } from '../utils/prisma.utils.js';
import { commentSchema } from '../middlwarmies/validation/comment.validation.middleware.js';
import { requireAccessToken } from '../middlwarmies/require-access-token.middleware.js';
import { HTTP_STATUS } from '../constants/http-status.constant.js';
import { POST_MESSAGES } from '../constants/post.constant.js';
import { postCreateValidator } from '../middlwarmies/validators/src/middlewares/validators/create-post-validator.middleware.js';

const postsRouter = express();
//게시글 생성
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
        data,
      });
    } catch (error) {
      next(error);
    }
  }
);

//게시글 목록 조회
postsRouter.get('/posts', requireAccessToken, async (req, res, next) => {
  try {
    const { userId } = req.user;
    //const postId = userId;
    console.log(1)
    console.log(userId)
    //정렬
    let { sort } = req.query;

    sort = sort?.toLowerCase();

    if (sort !== 'desc' && sort !== 'asc') {
      sort = 'desc';
    }

    let data = await prisma.post.findMany({
      orderBy: {
        createdAt: sort,
      },
      include: {
        user: true,
      },
    });
    console.log(data)
    data = data.map((post) => {
      return {
        postId: post.postId,
        title: post.title,
        content: post.content,
        regionId: post.regionId,
        imageUrl: post.imageUrl,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
      };
    });
    return res
      .status(HTTP_STATUS.OK)
      .json({ status: HTTP_STATUS.OK, message: POST_MESSAGES.POST_LIST, data });
  } catch (error) {
    next(error);
  }
});
//게시글 상세 조회
postsRouter.get('/:id', async (req, res, next) => {
  try {
    //const {userId} = req.user;
    //const  userId = user.userId;

    const { id: postId } = req.params;
    console.log(postId)
    const likeCount = await prisma.like.count({
      where:{
        postId: Number(postId),
      }
    });
    let data = await prisma.post.findUnique({
      where: { postId: Number(postId) },
      include: {
        user: {
          select: {
            nickname: true
          }
        },
        Comment: {
          take: 3,
          include: {
            user: {
              select: {
                nickname: true
              }
            }
          }
        }
      }
    }); 

    if (!data) {
      return res
        .status(HTTP_STATUS.NOT_FOUND)
        .json({
          status: HTTP_STATUS.NOT_FOUND,
          message: POST_MESSAGES.POST_NOT_FOUND,
          data,
        });
    }
      // promise.all을 사용하여 모든 비동기작업이 완료될 때까지 기다렸다가 map메서드 실행
    let comments = await Promise.all(data.Comment.map(async (comment) =>{
      const {commentId} = req.params
      console.log({commentId})
      const commentLikeCount = await prisma.like.count({
        where: {
          commentId: commentId
        }
      })

      return {
        commentId: comment.commentId,
        userId: comment.userId,
        postId: comment.postId,
        comment: comment.comment,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt,
        nickname: comment.user.nickname, // 댓글 작성자의 닉네임을 새로운 필드로 추가합니다.
        likes: commentLikeCount //댓글 좋아요 수
      };
    }));

    data = {
      postId: data.postId,
      title: data.title,
      content: data.content,
      nickname: data.user.nickname,
      nickname: data.user.nickname,
      regionId: data.regionId,
      imageUrl: data.imageUrl,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      comment: comments,
      likes: likeCount,
      comment: comments
    };
    console.log(data)
    return res
      .status(HTTP_STATUS.OK)
      .json({
        status: HTTP_STATUS.OK,
        message: POST_MESSAGES.POST_DETAIL,
        data,
      });
  } catch (error) {
    next(error);
  }
});

// 게시글 수정
postsRouter.patch('/:postId', requireAccessToken, async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { postId } = req.params;
    const { title, content, regionId, imageUrl } = req.body;
    console.log(req.user)
    console.log(req.body)
    console.log(postId)
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
    if(idcheck.userId !== userId){
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ message : '접근 권한이 없습니다.'})
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

//게시글 삭제
// 게시글 삭제 할떄 좋아요 댓글 삭제하고 게시글 삭제
postsRouter.delete('/:postId', requireAccessToken, async (req, res, next) => {
  try {
    const { userId } = req.user
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
    if(idcheck.userId !== userId){
      return res.status(HTTP_STATUS.NOT_FOUND).json({ message : '접근 권한이 없습니다.'})
    }
    
    // 게시물에 관련된 댓글 삭제
    await prisma.comment.deleteMany({
      where: {
        postId: +postId
      }
    });

    // 게시물에 관련된 좋아요 삭제
    await prisma.like.deleteMany({
      where: {
        postId: +postId
      }
    });

    // 게시물 삭제
    await prisma.post.delete({
      where: { postId: +postId, userId: userId},
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
        // 좋아요 삭제
        await prisma.like.delete({
          where: {
            likeId: postsData.likeId,
          },
        });
        return res
          .status(200)
          .json({ message: '게시글 좋아요가 삭제되었습니다.' });
      } else {
        // 좋아요 생성
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

      // 게시글 존재 여부 확인
      const postResult = await prisma.post.findUnique({
        where: { postId: +postId },
      });
      if (!postResult) {
        return res.status(400).json({ message: '게시글이 존재하지 않습니다.' });
      }

      // 댓글 존재 여부 확인
      const commentResult = await prisma.comment.findUnique({
        where: { commentId: +commentId },
      });
      if (!commentResult) {
        return res.status(400).json({ message: '댓글이 존재하지 않습니다.' });
      }

      // 좋아요 존재 여부 확인
      const likeData = await prisma.commentLike.findFirst({
        where: {
          commentId: +commentId,
          postId :+postId,
          userId,
        },
      });

      if (likeData) {
        // 좋아요 삭제
        await prisma.commentLike.delete({
          where: {
            commentlikeId: likeData.commentlikeId,
          },
        });
        return res
          .status(200)
          .json({ message: '댓글 좋아요가 삭제되었습니다.' });
      } else {
        // 좋아요 생성
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

/**  댓글 생성 기능 **/
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
        where : {userId: userId}
      })
      const result = {
        comment: commentData.comment,
        commentId: commentData.commentId,
        createdAt: commentData.createdAt,
        updatedAt: commentData.updatedAt,
        postId: commentData.postId,
        userId: commentData.userId,
        nickname: data.nickname
      }
      console.log(result)
      return res
        .status(200)
        .json({ message: '댓글 생성이 완료했습니다.', data: result });
    } catch (error) {
      next(error);
    }
  }
);

/** 댓글 조회 기능 **/
postsRouter.get(
  '/comments/:postId',
  requireAccessToken,
  async (req, res, next) => {
    try {
      console.log(req.user)
      const { postId } = req.params;
      console.log(1)
      console.log(postId)
      const postData = await prisma.post.findFirst({
        where: { postId: +postId },
      });
      console.log(postData)
      if (!postData) {
        return res.status(400).json({ message: '게시글을 찾을 수 없습니다.' });
      }

      const commentData = await prisma.comment.findMany({
        where: {
          postId: +postId,
        },
        include: {
          user: {
            select: {
              nickname: true,
            },
          },
        },
      });
      const data = commentData.map((comment) => {
        return {
          commentId: comment.commentId,
          userId: comment.userId,
          postId: comment.postId,
          nickname: comment.user.nickname,
          comment: comment.comment,
          createdAt: comment.createdAt,
          updatedAt: comment.updatedAt,
        };
      });
      console.log(data)
      return res.status(200).json({ data: data });
    } catch (error) {
      next(error);
    }
  }
);

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
      return res
        .status(200)
        .json({
          message: '댓글이 성공적으로 수정되었습니다.',
          data: updatedComment,
        });
    } catch (error) {
      next(error);
    }
  }
);

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
          postId: +postId        
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
      return res
        .status(200)
        .json({
          message: '댓글이 성공적으로 삭제되었습니다.',
          data: deleteComment,
        });
    } catch (error) {
      next(error);
    }
  }
);
// 카테고리별 목록조회
postsRouter.get(
  '/category/:categoryId',
  requireAccessToken,
  async (req, res, next) => {
    try {
      const { categoryId } = req.params;
      console.log(categoryId);
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
            }
          }
        }
      });
      
      const result = data.map(post => ({
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

      return res
        .status(200)
        .json({ message: '조회에 성공 했습니다.', data: result });
    } catch (error) {
      next(error);
    }
  }
);


export { postsRouter };

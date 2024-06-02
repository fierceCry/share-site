import express from 'express';
import { prisma } from '../utils/prisma.utils.js';
import { commentSchema } from '../middlwarmies/validation/comment.validation.middleware.js';

const postsRouter = express();

/** 게시글 좋아요 기능 **/
postsRouter.patch(
  '/likes/:postId',
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
      const likeData = await prisma.like.findFirst({
        where: {
          commentId: +commentId,
          userId,
        },
      });

      if (likeData) {
        // 좋아요 삭제
        await prisma.like.delete({
          where: {
            likeId: likeData.likeId,
          },
        });
        return res
          .status(200)
          .json({ message: '댓글 좋아요가 삭제되었습니다.' });
      } else {
        // 좋아요 생성
        await prisma.like.create({
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
postsRouter.post('/comment/:postId', commentSchema, async(req, res, next)=>{
  try{
  const { postId } = req.params;
  const { userId } = req.user;
  const { comment } = req.body;

  const postData = await prisma.post.findFirst({
    where: {
      postId: +postId
    }
  })
  if(!postData){
    return res.status(400).json({ message : '게시글을 찾을 수 없습니다.'});
  }
  
  const commentData = await prisma.comment.create({
    data: {
      postId: +postId,
      userId: userId,
      comment: comment
    }
  })

  return res.status(200).json({ message : '댓글 생성이 완료했습니다.', data : commentData})
  }catch(error){
    next(error)
  }
})

 /** 댓글 조회 기능 **/
postsRouter.get('/comments/:postId', async (req, res, next) => {
  try {
    const { postId } = req.params;
    const postData = await prisma.post.findMany({
      where: { postId: +postId }
    });

    if (!postData) {
      return res.status(400).json({ message: '게시글을 찾을 수 없습니다.' });
    }

    const commentData = await prisma.comment.findMany({
      where: {
        postId: +postId,
      },include:{
        user:{
          select: {
            nickname: true
          }
        }
      }
    });

    const data = commentData.map(comment => {
      return {
        commentId: comment.contentId,
        userId: comment.userId,
        postId: comment.postId,
        nickname: comment.user.nickname,
        comment: comment.comment,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt
      };
    });

    return res.status(200).json({ data: data });
  } catch (error) {
    next(error);
  }
});

postsRouter.patch('/comments/:postId/:commentId', commentSchema, async(req, res, next)=>{
  try {
    const { postId, commentId } = req.params;
    const { userId } = req.user;
    const { comment } = req.body;

    const existingComment = await prisma.comment.findFirst({
      where: {
        postId: +postId,
        contentId: +commentId
      }
    });

    if (!existingComment) {
      return res.status(404).json({ message: '댓글을 찾을 수 없습니다.' });
    }

    if (existingComment.userId !== userId) {
      return res.status(403).json({ message: '댓글을 수정할 수 있는 권한이 없습니다.' });
    }

    const updatedComment = await prisma.comment.update({
      where: {
        contentId: +commentId,
        postId: +postId,
        userId: +userId
      },
      data: {
        comment: comment
      }
    });
    return res.status(200).json({ message: '댓글이 성공적으로 수정되었습니다.', data: updatedComment });
  } catch (error) {
    next(error);
  }
});

postsRouter.delete('/comments/:postId/:commentId', async(req, res, next)=>{
  try{
  const { postId, commentId } = req.params;
  const { userId } = req.user;

  const data = await prisma.comment.findFirst({
    where: {
      contentId: +commentId,
      postId: +postId,
      userId: userId
    }
  })

  if(!data){
    return res.status(400).json({message: '댓글이 없습니다.'});
  }

  const deleteComment = await prisma.comment.delete({
    where: {
      contentId: +commentId,
      userId: userId
    }
  })
  return res.status(200).json({ message: '댓글이 성공적으로 삭제되었습니다.', data: deleteComment});
  }catch(error){
    next(error)
  }
})

export { postsRouter };

import express from 'express';
import { prisma } from '../utils/prisma.utils.js';
// import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken';
//미들웨어 파일 필요

const router = express.Router();

// 게시글 수정
router.patch(
  '/posts/:id',
  /* 미들웨어,*/ async (req, res, next) => {
    const { userId } = req.user;
    const { id } = req.params;
    const { title, content, imageUrl, regionName } = req.body;

    const idcheck = await prisma.post.findFirst({
      where: { AND: [{ userId: +userId }, { postId: +id }] },
    });

    if (!idcheck) {
      return res.status(400).json({ message: '게시물이 존재하지 않습니다.' });
    }

    if (!title && !content && !imageUrl && !regionName) {
      return res.status(400).json({ message: '수정된 내용이 없습니다.' });
    }

    const updatedPost = await prisma.post.update({
      where: { postId: +id },
      data: {
        title,
        content,
        imageUrl,
        regionName,
        updatedAt: new Date(),
      },
      select: {
        postId: true,
        userId: true,
        title: true,
        content: true,
        imageUrl: true,
        regionName: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return res.status(200).json({
      status: 200,
      message: '수정완료 되었습니다.',
      data: updatedPost,
    });
  }
);

// 게시글 수정
router.patch('/posts/:postId', requireAccessToken, async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { postId } = req.params;
    const { title, content, regionId, imageUrl } = req.body;

    const idcheck = await prisma.Post.findUnique({
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

    const updatedPost = await prisma.Post.update({
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
router.delete('/posts/:postId', requireAccessToken, async (req, res, next) => {
  try {
    const { postId } = req.params;

    const idcheck = await prisma.Post.findUnique({
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

    await prisma.Post.delete({
      where: { postId: +postId },
    });

    return res.status(200).json({
      status: HTTP_STATUS.OK,
      message: '게시글 삭제가 완료되었습니다.',
    });
  } catch (error) {
    next(error);
  }
});

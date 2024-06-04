import express from 'express';
import { authRouter } from './auth.router.js';
import { postsRouter } from './post.router.js';
import { userRouter } from './users.router.js';

const apiRouter = express.Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/posts', postsRouter);
apiRouter.use('/profile', userRouter);

export { apiRouter };

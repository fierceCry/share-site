import express from 'express';
import { authRouter } from './auth.router.js';
import { postsRouter } from './post.router.js';

const apiRouter = express.Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/posts', postsRouter);
// apiRouter.use('/users', usersRouter);
// apiRouter.use('/posts', postsRouter);

export { apiRouter };

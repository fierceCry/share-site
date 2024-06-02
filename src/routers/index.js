import express from 'express';
import { postsRouter } from './posts.router.js';

const apiRouter = express.Router();

// apiRouter.use('/auth', authRouter);
// apiRouter.use('/users', usersRouter);
apiRouter.use('/posts', postsRouter);

export { apiRouter };

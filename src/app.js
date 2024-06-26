import express from 'express';
import logMiddleware from './middlwarmies/log.middleware.js';
import passport from 'passport';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import { apiRouter } from '../src/routers/index.js';
import { globalErrorHandler } from '../src/middlwarmies/error-handler.middleware.js';
import { ENV_KEY } from './constants/env.constant.js';

const app = express();
app.use(cors());

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use('/uploads', express.static(path.join(path.resolve(), 'src/uploads')));
app.use(passport.initialize());
app.use(logMiddleware)
app.use(express.json())
app.use(apiRouter)
app.use(globalErrorHandler);

app.get('/api', (req, res) => {
  return res.status(200).json({ message: '테스트 성공' });
});

app.listen(ENV_KEY.PORT, async () => {
  console.log(ENV_KEY.PORT, '포트로 서버가 열렸습니다.');
});

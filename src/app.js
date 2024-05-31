import express from 'express';
import { apiRouter } from '../src/routers/index.js';
import { globalErrorHandler } from '../src/middlwarmies/error-handler.middleware.js';
import { ENV_KEY } from './constants/env.constant.js';
<<<<<<< HEAD
=======
const app = express();
>>>>>>> 4616763e03f7c83c1c29b4bcbb4bc1c9b8c6d8e5

const app = express();

app.use(express.json());
app.use(apiRouter);
app.use(globalErrorHandler);

app.get('/api', (req, res) => {
  return res.status(200).json({ message: '테스트 성공' });
});

app.listen(ENV_KEY.PORT, async () => {
  console.log(ENV_KEY.PORT, '포트로 서버가 열렸습니다.');
});

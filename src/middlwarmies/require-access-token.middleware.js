import jwt from 'jsonwebtoken';
import { HTTP_STATUS } from '../constants/http-status.constant.js';
import { MESSAGES } from '../constants/message.constant.js';
import { ENV_KEY } from '../constants/env.constant.js';
import { prisma } from '../utils/prisma.utils.js';

/** JWT 인증 미들웨어 **/
export const requireAccessToken = async (req, res, next) => {
  try {
    const authorization = req.headers.authorization;
    if (!authorization) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        status: HTTP_STATUS.UNAUTHORIZED,
        message: MESSAGES.AUTH.COMMON.JWT.NO_TOKEN,
      });
    }
    const [type, accessToken] = authorization.split(' ');
    if (type !== 'Bearer') {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        status: HTTP_STATUS.UNAUTHORIZED,
        message: MESSAGES.AUTH.COMMON.JWT.NOT_SUPPORTED_TYPE,
      });
    }
    if (!accessToken) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        status: HTTP_STATUS.UNAUTHORIZED,
        message: MESSAGES.AUTH.COMMON.JWT.NO_TOKEN,
      });
    }
    let payload;
    try {
      payload = jwt.verify(accessToken, ENV_KEY.ACCESS_TOKEN_SECRET);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
          status: HTTP_STATUS.UNAUTHORIZED,
          message: MESSAGES.AUTH.COMMON.JWT.EXPIRED,
        });
      }
      else {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
          status: HTTP_STATUS.UNAUTHORIZED,
          message: MESSAGES.AUTH.COMMON.JWT.INVALID,
        });
      }
    }
    const { id } = payload;
    const user = await prisma.user.findUnique({
      where: { userId: id },
    });
    if (!user) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        status: HTTP_STATUS.UNAUTHORIZED,
        message: MESSAGES.AUTH.COMMON.JWT.NO_USER,
      });
    }
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

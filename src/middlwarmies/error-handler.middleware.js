import { MESSAGES } from '../constants/message.constant.js';
import { HTTP_STATUS } from '../constants/http-status.constant.js';

export const globalErrorHandler = (err, req, res, next) => {
  console.error(err.stack);
  if (err.name === MESSAGES.MIDDLWARMIES.VALIDATION.MESSAGE) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ messasge: err.message });
  }
  return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
    message: MESSAGES.MIDDLWARMIES.ERROR.MESSAGE,
  });
};

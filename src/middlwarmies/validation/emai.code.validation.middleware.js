import Joi from 'joi';

/** 이메일 가입 인증 기능 joi **/
export const emalilCodeSchema = async (req, res, next) => {
  try {
    const emailSchema = Joi.object({
      email: Joi.string().required().empty('').email().messages({
        'string.email': '이메일 형식이 올바르지 않습니다.',
        'any.required': '이메일을 입력해주세요.',
      })
    });
    await emailSchema.validateAsync(req.body);
    next();
  } catch (error) {
    next(error);
  }
};

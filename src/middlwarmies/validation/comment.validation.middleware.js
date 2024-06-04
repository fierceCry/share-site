import Joi from 'joi';

/** 댓글 기능 joi **/
const schema = Joi.object({
  comment: Joi.string().required().empty('').messages({
    'any.required': ':댓글 입력해주세요.',
  }),
  comment: Joi.string().required().empty('').messages({
    'any.required': ':댓글 입력해주세요.',
  }),
});

export const commentSchema = async (req, res, next) => {
  try {
    await schema.validateAsync(req.body);
    next();
  } catch (error) {
    next(error);
  }
};

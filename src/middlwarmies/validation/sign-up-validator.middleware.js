import Joi from 'joi';
import { MESSAGES } from '../../constants/message.constant.js';
import { authConstant } from '../../constants/auth.constant.js';
const schema = Joi.object({
  email: Joi.string().email().required().messages({
    'any.required': MESSAGES.AUTH.COMMON.EMAIL.REQUIRED,
    'string.email': MESSAGES.AUTH.COMMON.EMAIL.FORMAT,
  }),
  password: Joi.string()
    .required()
    .min(authConstant.MIN_PASSWORD_LENGTH)
    .messages({
      'any.required': MESSAGES.AUTH.COMMON.PASSWORD.REQUIRED,
      'string.min': MESSAGES.AUTH.COMMON.PASSWORD.MIN_LENGTH,
    }),
  passwordConfirm: Joi.string().required().valid(Joi.ref('password')).messages({
    'any.required': MESSAGES.AUTH.COMMON.PASSWORD_CONFIRM.REQUIRED,
    'any.only': MESSAGES.AUTH.COMMON.PASSWORD_CONFIRM.NOT_MATCHED_WITH_PASSWORD,
  }),
  nickname: Joi.string().required().messages({
    'any.required': MESSAGES.AUTH.COMMON.NICKNAME.REQUIRED,
  }),
  emailVerified: Joi.boolean().required().messages({
    'any.required': MESSAGES.AUTH.COMMON.EMAILVERIFIED.REQUIRED,
  }),
  oneLiner: Joi.string().required().messages({
    'any.required': MESSAGES.AUTH.COMMON.ONE_LINER.REQUIRED,
  }),
  provider: Joi.string().required().messages({
    'any.required': MESSAGES.AUTH.COMMON.PROVIDER.REQUIRED,
  }),
});

export const signupValidator = async (req, res, next) => {
  try {
    await schema.validateAsync(req.body);
    next();
  } catch (error) {
    next(error);
  }
};

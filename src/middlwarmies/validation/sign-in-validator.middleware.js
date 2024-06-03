// import Joi from 'joi';
import Joi from 'joi';
import { MESSAGES } from '../../constants/message.constant.js';
const schema = Joi.object({
    email: Joi.string().email().required().messages({
        'any.required': MESSAGES.AUTH.COMMON.EMAIL.REQUIRED,
        'string.email': MESSAGES.AUTH.COMMON.EMAIL.FORMAT
    }),
    password: Joi.string().required().messages({
        'any.required': MESSAGES.AUTH.COMMON.PASSWORD.REQUIRED
    }),

})

export const signinValidator = async (req, res, next) => {
    try {
        await schema.validateAsync(req.body);
        next();
    } catch (error) {
        next(error);
    }
}
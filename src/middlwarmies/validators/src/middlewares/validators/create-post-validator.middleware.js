import Joi from 'joi'

const schema = Joi.object({
    title: Joi.string().required().messages({'any.required':'제목을 입력해주세요',}),
    content: Joi.string().min(1).required().messages({'any.required':'내용을 입력해주세요'}),
    regionId: Joi.number().required().messages({'any.required':'지역을 입력해주세요'}),
    imageUrl: Joi.string().required().messages({'any.required':'이미지를 넣어주세요'}),
});

export const postCreateValidator = async (req, res, next) => {
    try{
        await schema.validateAsync(req.body)
        next();
    }catch(error) {
        next(error);
    }
};
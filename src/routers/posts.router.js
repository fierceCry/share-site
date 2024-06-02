import express from 'express'
import {HTTP_STATUS} from '../constants/http-status.contant.js'
import {POST_MESSAGES} from '../constants/post.constant.js'
//import {postCreateValidator} from '../middlwarmies/validators/' //파일이 안뜬거 확인하기
import { prisma } from '../utils/prisma.utils.js'
import { postCreateValidator } from '../middlwarmies/validators/src/middlewares/validators/create-post-validator.middleware.js'
const postsRouter =express.Router()
//게시글 생성
postsRouter.post('/posts',postCreateValidator ,async(req, res, next) => {
        console.log(req.body)
    try{
        const {userId} = req.user;
        const {title, content, regionId, imageUrl} = req.body;
        
        

        const data = await prisma.post.create({ 
            data: {               
                userId: userId,
                title,
                content,
                regionId,
                imageUrl
            }
        })


        return res.status(HTTP_STATUS.CREATED).json({status:HTTP_STATUS.CREATED, message: POST_MESSAGES.POST_CREATE,data});
    } catch (error) {
        next(error);
    }
})

//게시글 목록 조회
postsRouter.get('/', async(req, res, next) => {
    try{
        const {userId} = req.user;
        const postId = userId;
        
        //정렬
        let { sort } = req.query;

        sort = sort?.toLowerCase();

        if (sort)
        

        return res.status(HTTP_STATUS.CREATED).json({status:HTTP_STATUS.CREATED, message:POST_MESSAGES.POST_LIST,data});
    } catch (error) {
        next(error);
    }
})
//게시글 상세 조회
postsRouter.get('/:id', async(req, res, next) => {
    try{
        const data = null;
        

        return res.status(HTTP_STATUS.CREATED).json({status:HTTP_STATUS.CREATED, message:POST_MESSAGES.POST_DETAIL,data});
    } catch (error) {
        next(error);
    }
})

export {postsRouter};
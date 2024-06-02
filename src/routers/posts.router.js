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
postsRouter.get('/posts', async(req, res, next) => {
    try{
        const {userId} = req.user;
        //const postId = userId;
        //정렬
        let { sort } = req.query;

        sort = sort?.toLowerCase();

        if (sort !== 'desc' && sort !== 'asc'){
            sort = 'desc';
        }

        let data = await prisma.post.findMany({
            where: { userId },
            orderBy: {
                createdAt: sort,
            },
            include: {
                user: true,
            }
        })

        data = data.map((post)=>{
            return{
                postId: post.postId,
                title: post.title,
                content: post.content,
                regionId: post.regionId,
                imageUrl: post.imageUrl,
                createdAt: post.createdAt,
                updatedAt: post.updatedAt,
            }
        })

        return res.status(HTTP_STATUS.OK).json({status:HTTP_STATUS.OK, message:POST_MESSAGES.POST_LIST,data});
    } catch (error) {
        next(error);
    }
})
//게시글 상세 조회
postsRouter.get('/:id', async(req, res, next) => {
    try{
        const user = req.user;
        const  userId = user.userId;

        const {postId} = req. params
        
        let data = await prisma.post.findUnique({
            where: { postId },
            include: { user: true},
            })
        
        if (!data) {
            return res.status(HTTP_STATUS.CREATED)
            .json({status:HTTP_STATUS.NOT_FOUND, message:POST_MESSAGES.POST_NOT_FOUND,data});
        }
        
        data= {
            postId: post.postId,
            title: post.title,
            content: post.content,
            regionId: post.regionId,
            imageUrl: post.imageUrl,
            createdAt: post.createdAt,
            updatedAt: post.updatedAt,
        }
        return res.status(HTTP_STATUS.CREATED)
        .json({status:HTTP_STATUS.CREATED, message:POST_MESSAGES.POST_DETAIL,data});
    } catch (error) {
        next(error);
    }
})

export {postsRouter};
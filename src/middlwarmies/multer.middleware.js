import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';


const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
    cb(null, path.join(_dirname, "..", 'uploads')); // 절대경로 설정
    },
    // filename: (req, file, cb) => {
    //     cb(null, `${Date.now()}-${file.originalname}`); // 파일명 설정
    // },
});

const fileFilter = (req, file, cb) => {
    if(file.mimetype.startsWith('image/')){
        cb(null, true);
    }else{
        cb(new Error('이미지 파일만 업로드 가능합니다.'), false);
    }
};


export const upload = multer({
    storage,
    fileFilter,
    limits: {fileSize: 1024* 1024* 5}, // 5MB 파일 크기 제한
});
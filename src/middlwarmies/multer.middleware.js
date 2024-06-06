import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { MESSAGES } from '../constants/message.constant.js';
const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
    cb(null, path.join(_dirname, "..", 'uploads'));
    },
});

const fileFilter = (req, file, cb) => {
    if(file.mimetype.startsWith('image/')){
        cb(null, true);
    }else{
        cb(new Error(MESSAGES.MUITER.ERROR.MESSAGE), false);
    }
};

export const upload = multer({
    storage,
    fileFilter,
    limits: {fileSize: 1024* 1024* 5}, // 5MB 파일 크기 제한
});
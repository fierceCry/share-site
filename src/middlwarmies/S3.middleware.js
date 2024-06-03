import dotenv from 'dotenv';
dotenv.config();

import multer from 'multer';
import multerS3 from 'multer-s3';
import AWS from 'aws-sdk';
import path from 'path';

const s3 = new AWS.S3({
  region: process.env.AWS_S3_REGION,
  accessKeyId: process.env.AWS_S3_ACCESS_KEY,
  secretAccessKey: process.env.AWS_S3_SECRET_KEY,
});

// 프로필 S3
const frofileUpload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_S3_BUCKET,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file, callback) => {
      const ext = path.extname(file.originalname);
      const fileName = `${Date.now().toString()}${ext}`;
      callback(null, `share-site2-frofile/${fileName}`);
    },
    acl: 'public-read',
  }),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

// 게시물 S3
const postUpload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_S3_BUCKET,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file, callback) => {
      const ext = path.extname(file.originalname);
      const fileName = `${Date.now().toString()}${ext}`;
      callback(null, `share-site2-posts/${fileName}`);
    },
    acl: 'public-read',
  }),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

export { frofileUpload, postUpload };

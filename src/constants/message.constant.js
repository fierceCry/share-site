import { authConstant } from './auth.constant.js';

export const MESSAGES = {
  AUTH: {
    COMMON: {
      EMAIL: {
        REQUIRED: '이메일을 입력해주세요',
        FORMAT: '이메일 형식이 올바르지 않습니다.',
        TOO: '이미 가입된 사용자입니다.',
        NOTFOUND: '조회되지 않는 이메일입니다.',
      },
      PASSWORD: {
        REQUIRED: '비밀번호를 입력해주세요',
        MIN_LENGTH: `비밀번호는 ${authConstant.MIN_PASSWORD_LENGTH}자리 이상이어야 합니다.`,
        NOTMATCHED: '일치하지 않는 비밀번호입니다.',
      },
      PASSWORD_CONFIRM: {
        REQUIRED: '비밀번호 확인을 입력해주세요',
        NOT_MATCHED_WITH_PASSWORD: '입력한 두 비밀번호가 일치하지 않습니다.',
      },
      NICKNAME: {
        REQUIRED: '이름을 입력해주세요',
        TOO: '이미 존재하는 닉네임입니다.',
      },
      EMAILVERIFIED: {
        REQUIRED: '이메일 인증을 확인해주세요',
        SEND : '이메일 인증번호를 이메일로 전송했습니다.',
        FAILED : '잘못된 이메일 또는 인증번호 입니다.',
        TIMEOVER : '인증번호가 만료되었습니다.',
        SUCCESS : '인증이 성공되었습니다.',
      },
      ONE_LINER: {
        REQUIRED: '한줄 소개 입력해주세요',
      },
      PROVIDER: {
        REQUIRED: '일반, 네이버, 카카오',
      },
      JWT: {
        NO_TOKEN: '인증정보가 없습니다',
        NOT_SUPPORTED_TYPE: '지원하지 않는 인증방식 입니다.',
        EXPIRED: '인증 정보가 만료되었습니다.',
        NO_USER: '인증 정보와 일치하는 사용자가 없습니다.',
        INVALID: '인증 정보가 유효하지 않습니다.',
        DISCARDED_TOKEN: '폐기 된 인증 정보입니다.',
      },
    },
    SIGN_UP: {
      SUCCEED: '회원가입에 성공했습니다',
    },
    SIGN_IN: {
      SUCCEED: '로그인에 성공했습니다.',
    },
    SIGN_OUT: {
      SUCCEED: '로그아웃에 성공했습니다.',
    },
  },
  MUITER:{
    ERROR:{
      MESSAGE: '이미지 파일만 업로드 가능합니다.'
    }
  },
  MIDDLWARMIES:{
    ERROR: {
      MESSAGE : '예상치 못한 에러가 발생했습니다. 관리자에게 문의해 주세요.'
    },
    VALIDATION:{
      MESSAGE: 'ValidationError'
    }
  },
  PROFILE:{
    INFORMATION:{
      NOTFOUND: '사용자의 프로필을 찾을 수 없습니다.',
      CHANGE : '수정할 정보를 입력해 주세요.',
      CHNAGE_SUCCESS : '수정이 완료 되었습니다.',
      NO_USER : '사용자가 없습니다.',
      UPLOAD_SUCCESS:'프로필이 업로드 되었습니다.'
    },
    PASSWORD:{
      INPUT_ERROR:'기존 비밀번호와 새 비밀번호를 모두 입력해주세요.',
      NOT_MATCHED:'기존 비밀번호가 일치하지 않습니다.',
      NEW_PASSWORD_CHANGE_SUCCESS:'새 비밀번호 설정이 완료되었습니다.',
    },
    IMAGE:{
      NOT_UPLOAD:'이미지를 업로드하지 않았습니다.',

    },
    FOLLOW:{
      SUCCESS:'팔로우 성공했습니다.',
      CANCEL: '팔로우 취소했습니다.',
      NOT_FOUND_USER: '사용자를 찾을 수 없습니다',
      
    }
  },
  POST_MESSAGES : {
    POST_CREATE: '게시글 생성에 성공하였습니다.',
    POST_LIST: '게시글 목록에 성공하였습니다.',
    POST_DETAIL: '게시글 상세 조회에 성공하였습니다.',
    POST_NOT_FOUND: '게시글이 존재하지 않습니다.',
    POST_IMAGE_CREATE: '이미지 업로드가 완료 되었습니다.',
    POST_IMAGE_FAIL: '이미지가 업로드 되지 않았습니다.',
    POST_NOT_UPDATE: '수정된 내용이 없습니다.',
    POST_UPDATE: '수정 완료되었습니다.',
    POST_NOT_AUTH: '접근 권한이 없습니다.',
    POST_DELETE: '게시글 삭제가 완료되었습니다',
    POST_LIKE_DELETE: '게시글 좋아요가 삭제되었습니다.',
    POST_LIKE_CREATE: '게시글 좋아요가 생성되었습니다.',
    COMMENT_NOT_FOUND: '댓글이 존재하지 않습니다.',
    COMMENT_LIKE_DELETE: '댓글 좋아요가 삭제되었습니다.',
    COMMENT_LIKE_CREATE: '댓글 좋아요가 생성되었습니다.',
    POST_COMMENT_CREATE: '댓글 생성이 완료했습니다.',
    COMMENT_NOT_UPDATE: '댓글을 수정할 수 있는 권한이 없습니다.',
    COMMENT_UPDATE: '댓글이 성공적으로 수정되었습니다.',
    COMMENT_NOT_DELETE: '댓글을 삭제할 수 있는 권한이 없습니다.',
    COMMENT_DELETE: '댓글이 성공적으로 삭제되었습니다.',
    POST_FILE_UPLOAD: '파일이 업로드 되었습니다.',
    POST_SUCCESS_CHECK: '조회에 성공 했습니다.',
  }
};

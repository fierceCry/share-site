import { authConstant } from './auth.constant.js'

export const MESSAGES = {
    AUTH: {
        COMMON: {
            EMAIL: {
                REQUIRED: "이메일을 입력해주세요",
                FORMAT: "이메일 형식이 올바르지 않습니다.",
                TOO: "이미 가입된 사용자입니다.",
                NOTFOUND: "조회되지 않는 이메일입니다."
            },
            PASSWORD: {
                REQUIRED: "비밀번호를 입력해주세요",
                MIN_LENGTH: `비밀번호는 ${authConstant.MIN_PASSWORD_LENGTH}자리 이상이어야 합니다.`,
                NOTMATCHED: "일치하지 않는 비밀번호입니다."
            },
            PASSWORD_CONFIRM: {
                REQUIRED: "비밀번호 확인을 입력해주세요",
                NOT_MATCHED_WITH_PASSWORD: "입력한 두 비밀번호가 일치하지 않습니다."
            },
            NICKNAME: {
                REQUIRED: "이름을 입력해주세요",
                TOO: "이미 존재하는 닉네임입니다.",
            },
            EMAILVERIFIED: {
                REQUIRED: "이메일 인증을 확인해주세요",
            },
            JWT: {
                NO_TOKEN: "인증정보가 없습니다",
                NOT_SUPPORTED_TYPE: "지원하지 않는 인증방식 입니다.",
                EXPIRED: '인증 정보가 만료되었습니다.',
                NO_USER: '인증 정보와 일치하는 사용자가 없습니다.',
                INVALID: '인증 정보가 유효하지 않습니다.',
                DISCARDED_TOKEN: '폐기 된 인증 정보입니다.',
            }


        },
        SIGN_UP: {
            SUCCEED: "회원가입에 성공했습니다"
        },
        SIGN_IN: {
            SUCCEED: "회원가입에 성공했습니다"
        }

    }
}
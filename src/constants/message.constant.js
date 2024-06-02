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
            ONE_LINER:{
                REQUIRED: "한줄 소개 입력해주세요",
            },
            PROVIDER:{
                REQUIRED: "일반, 네이버, 카카오"
            }


        },
        SIGN_UP: {
            SUCCEED: "회원가입에 성공했습니다"
        }

    }
}
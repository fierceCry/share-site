# 프로젝트 설명
"맛집 공유 서비스"는 사용자들이 전국의 숨겨진 맛집을 발견하고, 자신의 경험을 공유할 수 있는 플랫폼입니다. 이 서비스를 통해 사용자들은 맛집에 대한 리뷰를 작성하고, 다른 사용자의 리뷰를 읽으며 새로운 맛집을 발견할 수 있습니다. 우리의 목표는 사용자들이 쉽고 빠르게 정보를 공유하며 더 풍부한 식문화를 경험할 수 있게 하는 것입니다.

# 팀 소개
> 팀명: 만규와 아이들 
> 
> 인원: 팀장 김만규, 팀원 이길현, 박서진, 이민준, 이성운

### 역할 분담
* 리더 : 김만규
  * 이메일 가입 및 인증 기능
  * 게시글 좋아요 기능
  * 댓글 좋아요 기능
  * 댓글 CRUD
  * 네이버 로그인
  * 프론트 전체적 작업
* 팀원 : 이길현
  * 게시글 생성, 조회 기능
  * 게시글 상세 조회 기능
  * 팔로우, 팔로워 기능
  * 프론트 메인페이지 모달창 CSS 작업
* 팀원 : 박서진
  * 프로필 관리 기능
  * 게시글 멀티미디어 기능
  * 프론트 게시글 상세페이지 CSS 작업
* 팀원 : 이민준
  * 게시글 수정, 삭제 기능
  * 이미지 업로드(AWS S3) 기능
  * 프론트 마이페이지 CSS 작업
* 팀원 : 이성운
  * 회원가입, 로그인, 로그아웃
  * 카카오 로그인
  * 프론트 로그인, 회원가입, 메인페이지 CSS 작업

## 🔧기술 스택

### BACKEND
![Node.js](https://img.shields.io/badge/node.js-339933?style=for-the-badge&logo=Node.js&logoColor=white) ![JavaScript](https://img.shields.io/badge/javascript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black) ![MySQL](https://img.shields.io/badge/mysql-4479A1?style=for-the-badge&logo=mysql&logoColor=white) ![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=prisma&logoColor=white)

### CO-OP TOOLS
![Slack](https://img.shields.io/badge/Slack-4A154B?style=for-the-badge&logo=Slack&logoColor=white) ![Notion](https://img.shields.io/badge/Notion-000000?style=for-the-badge&logo=Notion&logoColor=white) ![Miro](https://img.shields.io/badge/Miro-FFD700?style=for-the-badge&logo=miro&logoColor=black) ![GitHub](https://img.shields.io/badge/github-181717?style=for-the-badge&logo=github&logoColor=white) ![Git](https://img.shields.io/badge/git-F05032?style=for-the-badge&logo=git&logoColor=white) ![DrawSQL](https://img.shields.io/badge/DrawSQL-007ACC?style=for-the-badge&logo=drawsql&logoColor=white)

## 프로젝트 설치 및 실행 방법

1. 저장소를 클론합니다:
    ```bash
    git clone https://github.com/fierceCry/share-site.git
    ```

2. 프로젝트 디렉토리로 이동합니다:
    ```bash
    cd share-site
    ```

3. 필요한 패키지를 설치합니다:
    ```bash
    yarn install
    ```

4. 환경 변수를 설정합니다. `.env` 파일을 생성하고 다음과 같은 설정을 추가합니다:
    ```
    PORT=3000
    DATABASE_URL="mysql://<username>:<password>@localhost:3306/myDatabase"
    ```

5. prisma Database 생성
    ```bash
    npx prisma db push
    ```
6. 임시 데이터를 생성합니다.
    ```bash
    yarn seed
    ```

7. 애플리케이션을 실행합니다:

    ```bash
    yarn start (배포용)
    ```

    ```bash
    yarn dev (개발용)
    ```

## API 명세서
[![Notion 로고](https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Notion-logo.svg/24px-Notion-logo.svg.png) 노션 바로가기](https://www.notion.so/teamsparta/ver-2024-e712a885d2624b388327f80a12051923?pvs=4)

## ERD
[<img src="https://tenereteam.s3.us-west-1.amazonaws.com/draw-sql.webp?v=1708250048" alt="DrawSQL 로고" width="24"> DrawSQL 바로가기](https://drawsql.app/teams/kimmangyu/diagrams/-2)

## 프론트 프로젝트 링크
[<img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" alt="DrawSQL 로고" width="24"> 프론트 github 바로가기](https://github.com/fierceCry/share-site-FrontEnd.git)
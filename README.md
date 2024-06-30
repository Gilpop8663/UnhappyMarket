# UnhappyMarket

## 프로젝트 개요

**UnhappyMarket**에 오신 것을 환영합니다. 이곳은 당신의 슬픔과 불행이 거래되는 독특한 플랫폼입니다. 기쁨을 나누는 것이 흔한 세상에서, UnhappyMarket은 사용자가 자신의 불행을 공유하고 타인의 불행을 구매할 수 있도록 합니다. 당신의 짐을 덜고 싶거나, 공유된 경험을 통해 다른 사람들과 연결되고 싶다면, UnhappyMarket은 인생의 고난을 다루는 새로운 방법을 제공합니다.

## 주요 기능

- **불행 공유**: 자신의 불행을 게시하고 커뮤니티와 공유할 수 있습니다.
- **불행 구매**: 다양한 불행 목록을 탐색하고, 마음에 드는 불행을 구매할 수 있습니다.
- **커뮤니티 지원**: 당신의 고통을 이해하는 사람들과 소통하고 지원을 받을 수 있습니다.
- **익명 게시**: 신원을 밝히지 않고 가장 깊은 걱정거리를 공유할 수 있습니다.

## 설치 방법

1. 레포지토리를 클론합니다 (백엔드)

```bash
git clone https://github.com/yourusername/UnhappyMarket_BE.git
```

1. 레포지토리를 클론합니다 (프론트엔드)

```bash
git clone https://github.com/yourusername/UnhappyMarket_FE.git
```

2. 프로젝트 디렉토리로 이동합니다

```
cd UnhappyMarket
```

3. 필요한 종속성을 설치합니다

```
npm install
```

## PostgreSQL 설정

1. PostgreSQL을 설치합니다. (PostgreSQL 설치 방법은 운영체제에 따라 다를 수 있습니다. PostgreSQL 공식 사이트를 참조하세요.)

2. PostgreSQL 서버를 시작합니다. (EX:pgAdmin4)
3. 데이터베이스를 생성합니다

```bash
createdb unhappymarket
```

4. .env.dev 파일을 설정하여 데이터베이스 연결 정보를 입력합니다

```env
DB_WINDOW_HOST="아이피 주소"
DB_HOST="아이피 주소"
DB_PORT="5432"
DB_USERNAME="postgres"
DB_DATABASE_NAME="commentube"
DB_PASSWORD="asdf1234"
JWT_SECRET_KEY="6A@>S=X-va=IUWe2nh4Svp~>ip5[rg"
```

## 사용 방법

1. 애플리케이션을 시작합니다

2. 브라우저를 열고 http://localhost/5173 에 접속하여 UnhappyMarket을 탐색하세요.

## 기여 방법

기여를 환영합니다! 다음 단계를 따라주세요:

1. 레포지토리를 포크합니다.
2. 새로운 브랜치를 생성합니다

```bash
git checkout -b feature-name
```

3. 변경 사항을 커밋합니다

```bash
git commit -m "Add new feature"
```

4. 브랜치에 푸시합니다

```bash
git push origin feature-name
```

5. 풀 리퀘스트를 엽니다.

## 라이선스

이 프로젝트는 MIT 라이선스에 따라 라이선스가 부여됩니다. 자세한 내용은 LICENSE 파일을 참조하세요.

```bash
이 Markdown 파일을 사용하여 UnhappyMarket의 한글 설명을 포함한 프로젝트 정보를 제공할 수 있습니다. 추가적으로 도움이 필요하거나 질문이 있으면 언제든지 말씀해 주세요!
```

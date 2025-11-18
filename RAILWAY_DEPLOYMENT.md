# Railway 배포 가이드

## 🚂 Railway로 백엔드 API 배포하기

Railway를 사용하면 MongoDB Atlas와 연결된 백엔드 API를 무료로 배포할 수 있습니다.
GitHub Pages(프론트엔드)에서 Railway API(백엔드)를 호출하여 안전하게 데이터를 관리합니다.

## 📋 배포 단계

### 1단계: Railway 계정 생성

1. https://railway.app 접속
2. **"Start a New Project"** 또는 **"Login with GitHub"** 클릭
3. GitHub 계정으로 로그인

### 2단계: 프로젝트 생성 및 GitHub 연결

1. Railway 대시보드에서 **"New Project"** 클릭
2. **"Deploy from GitHub repo"** 선택
3. `ksnu-portfolio` 저장소 선택
4. 저장소 접근 권한 허용

### 3단계: 환경 변수 설정

Railway 프로젝트 대시보드에서:

1. 배포된 서비스 클릭
2. **"Variables"** 탭 선택
3. 다음 환경 변수 추가:

```env
# MongoDB Atlas 연결 정보
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
DB_NAME=portfolio

# Node.js 환경
NODE_ENV=production
API_PORT=3000

# CORS 설정 (GitHub Pages URL)
CORS_ORIGIN=https://kgyujin.github.io

# 보안 (선택사항)
JWT_SECRET=your-secret-key-change-this
```

**중요**: `MONGODB_URI`는 MongoDB Atlas의 연결 문자열을 사용하세요.

### 4단계: 배포 설정 확인

1. **"Settings"** 탭에서:
   - **Root Directory**: 비워둠 (또는 `/`)
   - **Start Command**: `cd backend && npm start`
   - **Build Command**: `cd backend && npm ci`

2. **"Deploy"** 버튼 클릭하여 수동 배포 시작

### 5단계: Railway URL 확인 및 복사

1. 배포 완료 후 **"Settings"** 탭으로 이동
2. **"Domains"** 섹션에서 생성된 URL 확인
   - 예: `https://your-app-name.up.railway.app`
3. 이 URL을 복사

### 6단계: config.js에 Railway URL 설정

로컬에서 `public/js/config.js` 파일을 수정:

```javascript
production: {
  baseURL: 'https://your-app-name.up.railway.app/api',  // 복사한 Railway URL + /api
  enabled: true,
  useDataAPI: false
}
```

### 7단계: 변경사항 커밋 및 푸시

```bash
git add public/js/config.js
git commit -m "Railway API URL 설정"
git push origin main
```

GitHub Actions가 자동으로 GitHub Pages에 배포합니다.

## ✅ 배포 확인

### 1. Railway API 테스트

```bash
# Health Check
curl https://your-app-name.up.railway.app/health

# 댓글 조회
curl https://your-app-name.up.railway.app/api/comments
```

### 2. GitHub Pages에서 확인

1. https://kgyujin.github.io/ksnu-portfolio/ 접속
2. 댓글 섹션 확인
3. 로컬과 동일한 데이터가 표시되는지 확인

### 3. 댓글 작성 테스트

배포된 사이트에서 댓글 작성 → MongoDB Atlas에 저장됨 → Railway API를 통해 조회

## 🔧 트러블슈팅

### CORS 에러 발생 시

Railway의 환경 변수에서 `CORS_ORIGIN` 확인:

```env
CORS_ORIGIN=https://kgyujin.github.io
```

### 배포 실패 시

Railway 로그 확인:
1. 서비스 클릭 → **"Deployments"** 탭
2. 최신 배포 클릭 → **"View Logs"**
3. 에러 메시지 확인

### MongoDB 연결 실패 시

1. MongoDB Atlas에서 **Network Access** 확인
2. **"Allow access from anywhere"** (0.0.0.0/0) 추가
3. 연결 문자열이 정확한지 확인

## 💰 비용

Railway 무료 플랜:
- ✅ **$5 크레딧/월** (약 500시간 실행 시간)
- ✅ 1GB 메모리
- ✅ 1GB 디스크
- ✅ 자동 HTTPS
- ✅ 무제한 배포

일반적인 포트폴리오 사이트는 무료 플랜으로 충분합니다.

## 🔒 보안

Railway의 장점:
- ✅ 환경 변수가 GitHub에 노출되지 않음
- ✅ MongoDB URI가 안전하게 저장됨
- ✅ HTTPS 자동 적용
- ✅ Railway 대시보드에서만 환경 변수 확인 가능

## 📊 모니터링

Railway 대시보드에서:
- CPU/메모리 사용량 확인
- 로그 실시간 모니터링
- 배포 히스토리 확인
- 크레딧 사용량 확인

## 🔄 자동 배포

GitHub 저장소의 `main` 브랜치에 푸시하면:
1. Railway가 자동으로 백엔드 재배포
2. GitHub Actions가 프론트엔드 재배포

완전 자동화된 CI/CD 파이프라인! 🎉

---

**다음 단계**: Railway에서 프로젝트를 생성하고 위 단계를 따라 배포하세요.

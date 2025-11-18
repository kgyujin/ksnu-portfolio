# 🚀 Portfolio 프로젝트 - 환경변수 가이드

## 📋 목차
1. [로컬 개발 환경 설정](#로컬-개발-환경-설정)
2. [환경변수 설명](#환경변수-설명)
3. [GitHub Pages 배포](#github-pages-배포)
4. [보안 주의사항](#보안-주의사항)

---

## 🛠 로컬 개발 환경 설정

### 1. 환경변수 파일 생성

```bash
# .env.example을 복사하여 .env 파일 생성
cp .env.example .env
```

### 2. MongoDB Atlas 연결 정보 입력

`.env` 파일을 열고 MongoDB Atlas 연결 문자열을 입력하세요:

```env
MONGODB_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/?appName=your_app
DB_NAME=portfolio
```

### 3. Docker 실행

```bash
# 컨테이너 빌드 및 실행
docker compose up -d --build

# 로그 확인
docker logs portfolio-api

# 정상 연결 확인 (아래 메시지가 출력되어야 함)
# ✅ MongoDB connected successfully
# 📦 Database: portfolio
```

### 4. 브라우저에서 확인

```
http://localhost:8080
```

---

## 📝 환경변수 설명

### MongoDB 설정
| 변수명 | 설명 | 예시 |
|--------|------|------|
| `MONGODB_URI` | MongoDB Atlas 연결 문자열 | `mongodb+srv://user:pass@cluster.mongodb.net/` |
| `DB_NAME` | 데이터베이스 이름 | `portfolio` |

### 서버 설정
| 변수명 | 설명 | 기본값 |
|--------|------|--------|
| `NODE_ENV` | 실행 환경 | `development` |
| `API_PORT` | API 서버 포트 | `3000` |
| `WEB_PORT` | 웹 서버 포트 | `8080` |
| `CORS_ORIGIN` | CORS 허용 도메인 | `http://localhost:8080` |

---

## 🌐 GitHub Pages 배포

### 자동 배포 프로세스

GitHub Pages는 **정적 파일만 호스팅**하므로:

1. **프론트엔드**: GitHub Pages에서 자동 호스팅됨
2. **백엔드 API**: 별도 배포 필요 (Railway/Render 추천)
3. **데이터베이스**: MongoDB Atlas (이미 클라우드에 있음)

### 현재 동작 방식

```javascript
// public/js/config.js에서 자동 환경 감지
get isProduction() {
  return window.location.hostname !== 'localhost' && 
         window.location.hostname !== '127.0.0.1';
}
```

- **로컬** (`localhost`): MongoDB Atlas 사용 ✅
- **GitHub Pages** (`kgyujin.github.io`): 정적 데이터 사용 (API 미사용)

### GitHub Pages에서 실시간 댓글 사용하려면

백엔드를 **Railway** 또는 **Render**에 배포:

1. Railway/Render에 Docker 배포
2. 배포된 API URL을 `config.js`에 추가:
```javascript
production: {
  baseURL: 'https://your-api.railway.app/api',
  enabled: true
}
```

---

## 🔒 보안 주의사항

### ⚠️ Git에 커밋하지 말아야 할 파일

```bash
.env                    # ❌ MongoDB 연결 정보 포함
backend/.env            # ❌ 백엔드 환경변수
docker-compose.override.yml  # ❌ 로컬 설정
```

### ✅ Git에 커밋해도 되는 파일

```bash
.env.example            # ✅ 템플릿 (실제 값 없음)
backend/.env.example    # ✅ 템플릿
docker-compose.yml      # ✅ 환경변수 참조만 포함
```

### 🔐 환경변수 관리 체크리스트

- [x] `.gitignore`에 `.env` 포함됨
- [x] `.env.example`에는 실제 비밀번호 없음
- [x] `docker-compose.yml`은 환경변수만 참조
- [x] MongoDB Atlas IP 화이트리스트 설정
- [x] MongoDB 사용자 권한 최소화

---

## 🧪 테스트

### API 연결 테스트

```bash
# Health Check
curl http://localhost:3000/health

# 댓글 작성 테스트
curl -X POST http://localhost:3000/api/comments \
  -H "Content-Type: application/json" \
  -d '{"name":"테스트","password":"test1234","message":"테스트 댓글"}'

# 댓글 조회 테스트
curl http://localhost:3000/api/comments
```

### 예상 결과

```json
// Health Check
{"status":"OK","timestamp":"2025-11-18T05:19:45.989Z"}

// 댓글 작성
{"success":true,"id":"691c01f1c766dcefde228933","message":"댓글이 작성되었습니다."}

// 댓글 조회
[{"id":"691c01f1c766dcefde228933","name":"테스트","message":"테스트 댓글","created_at":"2025-11-18T05:19:45.989Z"}]
```

---

## 🐛 문제 해결

### MongoDB 연결 실패

```bash
❌ MongoDB connection failed: MONGODB_URI is not defined
```

**해결방법:**
1. `.env` 파일이 존재하는지 확인
2. `MONGODB_URI` 값이 올바른지 확인
3. MongoDB Atlas IP 화이트리스트에 `0.0.0.0/0` 추가됐는지 확인

### 한글이 깨져 보이는 경우

MongoDB는 기본적으로 UTF-8을 지원하므로 문제없습니다.
브라우저 인코딩이 UTF-8인지 확인하세요.

---

## 📞 도움말

문제가 발생하면:
1. `docker logs portfolio-api` 로그 확인
2. `.env` 파일 값 재확인
3. MongoDB Atlas 연결 테스트
4. Docker 컨테이너 재시작: `docker compose restart`

---

**마지막 업데이트:** 2025-11-18

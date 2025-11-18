# 🚀 프로젝트 퀵 스타트 가이드 (모듈화 버전)

## 빠른 실행 방법

### 1단계: 저장소 클론 및 환경 설정

```bash
# 저장소 클론
git clone https://github.com/kgyujin/ksnu-portfolio.git
cd ksnu-portfolio

# 환경 변수 파일 생성
cp .env.example .env

# 필요시 .env 파일 수정
nano .env
```

### 2단계: Docker로 실행

```bash
# Docker Compose로 모든 서비스 시작
docker compose up -d

# 서비스 로그 확인
docker compose logs -f
```

### 3단계: 서비스 확인

- **웹 포트폴리오**: http://localhost:8080
- **백엔드 API**: http://localhost:3000
- **API Health Check**: http://localhost:3000/health
- **MySQL 데이터베이스**: localhost:3306

### 4단계: 서비스 중지

```bash
# 서비스 중지
docker compose down

# 데이터까지 삭제하려면
docker compose down -v
```

## 📂 프로젝트 구조

### 백엔드 API (backend/)
- `backend/src/server.js` - Express 서버
- `backend/src/config/database.js` - MySQL 연결
- `backend/src/routes/` - API 라우트
  - `projects.js` - 프로젝트 API
  - `guestbook.js` - 방명록 API
  - `skills.js` - 스킬 API
  - `stats.js` - 통계 API
- `backend/Dockerfile` - API 서버 이미지
- `backend/package.json` - 백엔드 의존성

### 프론트엔드 (public/)
- `public/js/` - 모듈화된 JavaScript
  - `main.js` - 메인 진입점
  - `api.js` - API 클라이언트
  - `animation.js` - 애니메이션
  - `projects.js` - 프로젝트 UI
  - `skills.js` - 스킬 UI
  - `ui.js` - UI 유틸리티
  - `typing.js` - 타이핑 효과
- `public/index.html` - 메인 HTML
- `public/styles.css` - 스타일시트
- `public/img/` - 이미지 리소스

### Docker & 설정
- `docker-compose.yml` - 3-tier 오케스트레이션 (Web + API + DB)
- `Dockerfile` - Nginx 웹 서버 이미지
- `nginx.conf` - Nginx 설정 + API 프록시
- `.dockerignore` - 빌드 제외 파일

### 환경 & 문서
- `.env` - 환경 변수 (gitignore)
- `.env.example` - 환경 변수 예제
- `init.sql` - MySQL 초기화
- `README_MODULAR.md` - 모듈화된 프로젝트 문서

## 🔍 주요 기능

### 아키텍처
- ✅ **3-Tier 구조**: Nginx + Node.js API + MySQL
- ✅ **모듈화된 코드**: ES6 모듈 시스템
- ✅ **RESTful API**: Express 기반 백엔드
- ✅ **환경 변수 관리**: .env 파일

### 백엔드 API
- ✅ `/api/projects` - 프로젝트 관리
- ✅ `/api/guestbook` - 방명록 관리
- ✅ `/api/skills` - 스킬 관리
- ✅ `/api/stats` - 통계 및 방문자 추적
- ✅ Rate Limiting (15분당 100 요청)
- ✅ CORS, Helmet 보안
- ✅ 입력 검증 (Joi)

### 프론트엔드
- ✅ ES6 모듈화 JavaScript
- ✅ Fetch API 기반 통신
- ✅ GSAP 애니메이션
- ✅ 반응형 디자인
- ✅ 커스텀 커서 효과

### 데이터베이스
- ✅ MySQL 8.0
- ✅ 4개 테이블 (Projects, Guestbook, Skills, Stats)
- ✅ 샘플 데이터 자동 삽입
- ✅ Docker Volume 영속성

## 🛠️ 개발 명령어

### Docker Compose
```bash
# 서비스 시작 (백그라운드)
docker compose up -d

# 로그 실시간 확인
docker compose logs -f

# 웹 서비스만 재시작
docker compose restart web

# 서비스 상태 확인
docker compose ps

# 서비스 중지
docker compose down
```

### Docker
```bash
# 이미지 빌드
docker build -t portfolio-web:latest .

# 컨테이너 실행
docker run -d -p 8080:80 portfolio-web:latest

# 실행 중인 컨테이너 확인
docker ps

# 로그 확인
docker logs portfolio-web
```

## 📊 시스템 구성

```
사용자 브라우저 (http://localhost:8080)
         ↓
    Nginx 웹 서버 (Docker)
         ↓
  MySQL 데이터베이스 (Docker)
         ↓
   영속적 데이터 저장 (Volume)
```

## 🔐 기본 접속 정보

### MySQL 데이터베이스
```yaml
Host: localhost
Port: 3306
Database: portfolio_db
User: portfolio_user
Password: portfolio_pass
Root Password: rootpassword
```

> ⚠️ **보안 경고**: 프로덕션 환경에서는 반드시 비밀번호를 변경하세요!

## 🐛 문제 해결

### 포트가 이미 사용 중인 경우

```bash
# macOS/Linux
lsof -i :8080
lsof -i :3306

# 포트 변경: docker-compose.yml 수정
```

### Docker 캐시 문제

```bash
# 캐시 없이 재빌드
docker compose build --no-cache
docker compose up -d
```

### 데이터베이스 초기화

```bash
# 볼륨까지 삭제하고 재시작
docker compose down -v
docker compose up -d
```

## 📚 더 자세한 정보

전체 문서는 `README.md` 파일을 참조하세요:
- 시스템 아키텍처 다이어그램 (Mermaid)
- ERD 다이어그램
- CI/CD 파이프라인 상세 설명
- 프로덕션 배포 가이드

## ✅ 체크리스트

프로젝트 구성 완료 여부를 확인하세요:

- [x] Docker 및 Docker Compose 설치됨
- [x] 저장소 클론 완료
- [x] `docker compose up -d` 실행 완료
- [x] http://localhost:8080 접속 확인
- [x] MySQL 컨테이너 정상 작동 확인
- [ ] (선택) GitHub Actions CI/CD 설정 확인
- [ ] (선택) 프로덕션 배포 설정

## 🎯 다음 단계

1. **로컬 개발**: `public/` 폴더의 파일들을 수정하고 재빌드
2. **데이터 추가**: MySQL에 접속하여 데이터 추가/수정
3. **배포 준비**: README.md의 "프로덕션 배포 체크리스트" 확인
4. **GitHub 푸시**: 코드를 푸시하면 자동으로 CI/CD 실행

---

**Made with ❤️ by Kim Gyujin**

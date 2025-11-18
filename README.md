# 🎨 KSNU Portfolio - 웹 포트폴리오 프로젝트

![Portfolio Banner](https://img.shields.io/badge/Portfolio-Web%20Application-yellow)
![Docker](https://img.shields.io/badge/Docker-Supported-blue)
![CI/CD](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-green)
![MongoDB](https://img.shields.io/badge/Database-MongoDB%20Atlas-green)

군산대학교 소프트웨어학부 김규진의 웹 포트폴리오 사이트입니다. Docker를 활용한 컨테이너화 및 GitHub Actions를 통한 CI/CD 파이프라인, MongoDB Atlas 클라우드 데이터베이스가 구축되어 있습니다.

> ⚠️ **보안 주의**: 이 프로젝트는 MongoDB Atlas를 사용하며, 데이터베이스 연결 정보는 환경변수로 관리됩니다. 자세한 내용은 [SECURITY.md](SECURITY.md)를 참조하세요.

## 📋 목차

- [프로젝트 소개](#-프로젝트-소개)
- [시스템 아키텍처](#-시스템-아키텍처)
- [기술 스택](#-기술-스택)
- [프로젝트 구조](#-프로젝트-구조)
- [설치 및 실행](#-설치-및-실행)
- [Docker 사용법](#-docker-사용법)
- [CI/CD 파이프라인](#-cicd-파이프라인)
- [데이터베이스 스키마](#-데이터베이스-스키마)
- [환경 변수 설정](#-환경-변수-설정)
- [라이선스](#-라이선스)

## 🎯 프로젝트 소개

이 프로젝트는 개인 포트폴리오 웹사이트로, 다음과 같은 기능을 제공합니다:

- 📱 **반응형 웹 디자인**: 모바일, 태블릿, 데스크톱 모두 지원
- 🎨 **인터랙티브 UI**: GSAP 애니메이션을 활용한 동적인 사용자 경험
- 📊 **프로젝트 갤러리**: 주요 프로젝트 소개 및 상세 정보 제공
- 💼 **기술 스택 시각화**: 보유한 기술들을 아이콘으로 표시
- 📝 **방명록 기능**: 방문자의 메시지를 데이터베이스에 저장
- 📈 **조회수 추적**: 프로젝트별 조회수 관리

## 🏗️ 시스템 아키텍처

```mermaid
graph TB
    subgraph "사용자"
        A[웹 브라우저]
    end
    
    subgraph "GitHub"
        B[GitHub Repository]
        C[GitHub Actions<br/>CI/CD Pipeline]
        D[GitHub Container Registry<br/>GHCR]
    end
    
    subgraph "Docker Environment"
        E[Nginx Web Server<br/>포트: 8080]
        F[MySQL 8.0 Database<br/>포트: 3306]
        G[Docker Network<br/>portfolio-network]
        H[Docker Volume<br/>mysql-data]
    end
    
    A -->|HTTP 요청| E
    E -->|정적 파일 제공| A
    E -->|데이터 조회/저장| F
    F -->|데이터 영속성| H
    E -.->|네트워크| G
    F -.->|네트워크| G
    
    B -->|Push/PR| C
    C -->|빌드 & 테스트| C
    C -->|Docker 이미지 푸시| D
    D -.->|이미지 풀| E
    
    style A fill:#e1f5ff
    style E fill:#ffe1e1
    style F fill:#fff4e1
    style C fill:#e1ffe1
    style D fill:#f0e1ff
```

### 아키텍처 설명

1. **사용자 계층**: 웹 브라우저를 통해 포트폴리오에 접근
2. **웹 서버 계층**: Nginx가 정적 파일을 서빙하고 요청을 처리
3. **데이터베이스 계층**: MySQL이 동적 데이터(프로젝트, 방명록 등)를 관리
4. **CI/CD 계층**: GitHub Actions가 자동으로 빌드, 테스트, 배포 수행
5. **컨테이너 계층**: Docker가 모든 서비스를 격리된 환경에서 실행

## 🛠️ 기술 스택

### Frontend
- **HTML5**: 시맨틱 마크업
- **CSS3**: 반응형 디자인, 애니메이션
- **JavaScript (ES6+)**: DOM 조작, 이벤트 처리
- **jQuery**: DOM 조작 라이브러리
- **GSAP**: 고급 애니메이션 라이브러리

### Backend & Infrastructure
- **Node.js 18**: 백엔드 API 서버
- **Express**: REST API 프레임워크
- **Mongoose**: MongoDB ODM
- **MongoDB Atlas**: 클라우드 NoSQL 데이터베이스 (512MB 무료)
- **Nginx**: 웹 서버 (Alpine Linux 기반)
- **Docker**: 컨테이너화 플랫폼
- **Docker Compose**: 멀티 컨테이너 오케스트레이션

### Security
- **SHA-256**: 비밀번호 해싱
- **XSS Prevention**: HTML 엔티티 인코딩
- **MongoDB Injection Prevention**: Mongoose 스키마 검증
- **Environment Variables**: 민감한 정보 보호

### DevOps
- **GitHub Actions**: CI/CD 파이프라인
- **GitHub Pages**: 정적 사이트 호스팅
- **GitHub Container Registry (GHCR)**: Docker 이미지 저장소

## 📁 프로젝트 구조

```
ksnu-portfolio/
├── .github/
│   └── workflows/
│       ├── deploy-gh-pages.yml  # GitHub Pages 배포 워크플로우
│       └── ci-cd.yml           # Docker CI/CD (로컬 개발용)
│
├── public/                     # GitHub Pages에 배포되는 정적 파일
│   ├── index.html             # 메인 HTML
│   ├── styles.css             # 스타일시트
│   ├── scripts.js             # 레거시 스크립트
│   ├── js/                    # 모듈화된 JavaScript
│   │   ├── main.js           # 메인 앱
│   │   ├── api.js            # API 클라이언트 (fallback 포함)
│   │   ├── config.js         # 환경 설정
│   │   ├── projects.js       # 프로젝트 관리
│   │   ├── animation.js      # 애니메이션
│   │   ├── typing.js         # 타이핑 효과
│   │   └── ...
│   └── img/                  # 이미지 리소스
│       ├── projects/         # 프로젝트 이미지
│       ├── skills/           # 스킬 아이콘
│       └── ...
│
├── backend/                   # 로컬 개발용 백엔드 (배포 안 됨)
│   ├── src/
│   │   ├── server.js
│   │   ├── routes/
│   │   └── config/
│   └── package.json
│
├── ref/                       # 참조 파일 (원본)
│   ├── index.html
│   ├── style.css
│   ├── script.js
│   └── img/
│
├── Dockerfile                 # Nginx 웹 서버 (로컬 개발용)
├── docker-compose.yml         # Docker Compose 설정 (로컬 개발용)
├── nginx.conf                 # Nginx 서버 설정
├── init.sql                   # MySQL 초기화 스크립트
├── .dockerignore             # Docker 빌드 제외 파일
└── README.md                 # 프로젝트 문서 (현재 파일)
```

### 배포 vs 로컬 개발

| 항목 | GitHub Pages (프로덕션) | 로컬 개발 |
|------|------------------------|----------|
| 호스팅 | GitHub Pages | Docker Compose |
| 백엔드 | 없음 (정적 데이터) | Node.js + Express |
| 데이터베이스 | 없음 (정적 데이터) | MySQL 8.0 |
| 데이터 소스 | `api.js`의 `getFallbackData()` | API + MySQL |
| 배포 방식 | GitHub Actions 자동 배포 | 수동 실행 |

## 🚀 배포 방식

### 🌐 GitHub Pages (프로덕션)

이 프로젝트는 **GitHub Pages**를 사용하여 배포됩니다:
- ✅ **정적 사이트 호스팅**: 백엔드 없이 `public` 폴더만 배포
- ✅ **자동 배포**: `main` 브랜치에 푸시하면 자동으로 배포
- ✅ **무료 호스팅**: GitHub에서 제공하는 무료 호스팅 서비스
- 🔗 **배포 URL**: https://kgyujin.github.io/ksnu-portfolio/

### 💻 로컬 개발 환경

로컬에서는 **Docker Compose**를 사용하여 전체 스택을 실행할 수 있습니다:
- 백엔드 API (Node.js + Express) - 개발 중
- MySQL 데이터베이스
- Nginx 웹 서버

## 📦 GitHub Pages 배포 설정

### 1. Repository 설정
1. GitHub Repository → **Settings** → **Pages**
2. **Source**: `GitHub Actions` 선택
3. 저장 후 자동으로 배포 시작

### 2. 자동 배포
`main` 브랜치에 푸시하면 자동으로 배포됩니다:
```bash
git add .
git commit -m "Update portfolio"
git push origin main
```

### 3. 배포 확인
- GitHub Actions 탭에서 배포 진행 상황 확인
- 배포 완료 후 URL: `https://kgyujin.github.io/ksnu-portfolio/`

## 🚀 로컬 개발 환경 실행

### 사전 요구사항

- **Docker**: 20.10 이상
- **Docker Compose**: 2.0 이상
- **Git**: 버전 관리
- **MongoDB Atlas 계정**: 무료 512MB 클러스터

### 실행 방법

1. **저장소 클론**

```bash
git clone https://github.com/kgyujin/ksnu-portfolio.git
cd ksnu-portfolio
```

2. **환경변수 설정** 🔐

```bash
# .env.example을 복사하여 .env 생성
cp .env.example .env

# .env 파일 편집 (MongoDB Atlas 연결 문자열 입력)
nano .env
```

`.env` 파일 예시:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/
DB_NAME=portfolio
NODE_ENV=development
```

> ⚠️ **중요**: `.env` 파일은 Git에 커밋되지 않습니다. 자세한 내용은 [ENVIRONMENT_SETUP.md](ENVIRONMENT_SETUP.md)를 참조하세요.

3. **Docker Compose로 실행**

```bash
docker compose up -d --build
```

4. **MongoDB 연결 확인**

```bash
# API 로그 확인
docker logs portfolio-api

# 정상 연결 시 아래 메시지가 출력됨
# ✅ MongoDB connected successfully
# 📦 Database: portfolio
```

5. **웹 브라우저에서 확인**

```
http://localhost:8080
```

6. **서비스 중지**

```bash
docker compose down
```

## 🐳 Docker 사용법

### 개별 Docker 명령어

#### 1. 웹 서버 이미지 빌드

```bash
docker build -t portfolio-web:latest .
```

#### 2. 웹 서버 컨테이너 실행

```bash
docker run -d -p 8080:80 --name portfolio-web portfolio-web:latest
```

#### 3. MySQL 컨테이너 실행

```bash
docker run -d \
  --name portfolio-db \
  -e MYSQL_ROOT_PASSWORD=rootpassword \
  -e MYSQL_DATABASE=portfolio_db \
  -e MYSQL_USER=portfolio_user \
  -e MYSQL_PASSWORD=portfolio_pass \
  -p 3306:3306 \
  -v mysql-data:/var/lib/mysql \
  mysql:8.0
```

### Docker Compose 명령어

```bash
# 백그라운드에서 서비스 시작
docker compose up -d

# 로그 확인
docker compose logs -f

# 특정 서비스 로그만 확인
docker compose logs -f web
docker compose logs -f db

# 서비스 중지
docker compose stop

# 서비스 재시작
docker compose restart

# 서비스 중지 및 컨테이너 삭제
docker compose down

# 서비스 중지 및 볼륨까지 삭제
docker compose down -v

# 서비스 상태 확인
docker compose ps
```

## 🔄 CI/CD 파이프라인

GitHub Actions를 통해 자동화된 CI/CD 파이프라인이 구축되어 있습니다.

### 워크플로우 트리거

- `main` 브랜치에 **Push** 발생 시
- `main` 브랜치로의 **Pull Request** 생성 시
- `develop` 브랜치에 **Push** 발생 시

### CI 단계 (Continuous Integration)

1. **코드 체크아웃**: 최신 코드를 가져옴
2. **Docker 이미지 빌드**: Dockerfile을 기반으로 이미지 생성
3. **서비스 테스트**: Docker Compose로 전체 스택 실행
4. **헬스 체크**: 웹 서비스가 정상적으로 응답하는지 확인
5. **로그 수집**: 각 서비스의 로그를 기록

### CD 단계 (Continuous Deployment)

> **주의**: CD 단계는 `main` 브랜치에 머지될 때만 실행됩니다.

1. **GitHub Container Registry 로그인**
2. **Docker 이미지 태깅**: 버전 정보 추가
3. **이미지 푸시**: GHCR에 이미지 업로드
4. **배포 완료 알림**

### 이미지 태그 전략

- `latest`: 최신 메인 브랜치 이미지
- `main-<commit-sha>`: 특정 커밋의 이미지
- `<branch-name>`: 브랜치별 이미지

## 🗄️ 데이터베이스 스키마

### ERD (Entity Relationship Diagram)

```mermaid
erDiagram
    PROJECTS {
        int id PK
        varchar title
        varchar period
        text description
        text skills
        text role
        text review
        varchar image_url
        varchar project_url
        varchar github_url
        int view_count
        boolean is_featured
        timestamp created_at
        timestamp updated_at
    }
    
    GUESTBOOK {
        int id PK
        varchar name
        varchar email
        text message
        varchar password
        varchar ip_address
        boolean is_approved
        boolean is_deleted
        timestamp created_at
        timestamp updated_at
    }
    
    SKILLS {
        int id PK
        varchar name UK
        varchar category
        enum proficiency
        varchar icon_url
        int display_order
        timestamp created_at
        timestamp updated_at
    }
    
    VISITOR_STATS {
        int id PK
        date visit_date UK
        int visit_count
        int unique_visitors
        timestamp created_at
        timestamp updated_at
    }
```

### 주요 테이블 설명

#### 1. **projects** - 프로젝트 정보
- 프로젝트 제목, 기간, 설명, 사용 기술 등을 저장
- `view_count`: 조회수 추적
- `is_featured`: 추천 프로젝트 표시

#### 2. **guestbook** - 방명록
- 방문자의 이름, 이메일, 메시지 저장
- `is_approved`: 관리자 승인 여부
- `is_deleted`: 소프트 삭제 플래그

#### 3. **skills** - 보유 기술
- 기술 이름, 카테고리, 숙련도 저장
- `display_order`: 표시 순서 관리

#### 4. **visitor_stats** - 방문자 통계
- 일별 방문 횟수 및 순 방문자 수 추적

### 데이터베이스 접속 정보

```yaml
Host: localhost
Port: 3306
Database: portfolio_db
User: portfolio_user
Password: portfolio_pass
Root Password: rootpassword
```

> **보안 주의**: 프로덕션 환경에서는 반드시 강력한 비밀번호로 변경하세요.

## ⚙️ 환경 변수 설정

### Docker Compose 환경 변수

`docker-compose.yml` 파일에서 다음 환경 변수를 수정할 수 있습니다:

```yaml
services:
  db:
    environment:
      MYSQL_ROOT_PASSWORD: rootpassword      # MySQL root 비밀번호
      MYSQL_DATABASE: portfolio_db           # 데이터베이스 이름
      MYSQL_USER: portfolio_user             # 사용자 이름
      MYSQL_PASSWORD: portfolio_pass         # 사용자 비밀번호
```

### GitHub Actions Secrets

GitHub Container Registry에 푸시하려면 다음 secrets이 필요합니다 (자동 제공):

- `GITHUB_TOKEN`: GitHub에서 자동으로 제공

Docker Hub를 사용하려면 추가로 설정:

- `DOCKERHUB_USERNAME`: Docker Hub 사용자 이름
- `DOCKERHUB_TOKEN`: Docker Hub 액세스 토큰

## 🔧 개발 가이드

### 로컬 개발 환경

1. **파일 수정 후 재빌드**

```bash
docker compose down
docker compose build --no-cache
docker compose up -d
```

2. **Nginx 설정 변경 후**

```bash
docker compose restart web
```

3. **데이터베이스 스키마 변경 후**

```bash
docker compose down -v
docker compose up -d
```

### 프로덕션 배포 체크리스트

- [ ] 데이터베이스 비밀번호 변경
- [ ] Nginx 보안 헤더 확인
- [ ] HTTPS 인증서 설정 (Let's Encrypt 등)
- [ ] 환경별 설정 분리 (개발/스테이징/프로덕션)
- [ ] 백업 전략 수립
- [ ] 모니터링 도구 설정
- [ ] 로그 수집 및 분석 시스템 구축

## 📊 모니터링

### 컨테이너 리소스 사용량 확인

```bash
docker stats
```

### 특정 컨테이너 상세 정보

```bash
docker inspect portfolio-web
docker inspect portfolio-db
```

### 네트워크 확인

```bash
docker network ls
docker network inspect ksnu-portfolio_portfolio-network
```

## 🐛 트러블슈팅

### 1. 포트 충돌

```bash
# 이미 사용 중인 포트 확인 (macOS/Linux)
lsof -i :8080
lsof -i :3306

# 포트 변경은 docker-compose.yml에서 수정
ports:
  - "9090:80"  # 8080 대신 9090 사용
```

### 2. MySQL 연결 오류

```bash
# 데이터베이스 컨테이너 로그 확인
docker compose logs db

# MySQL 컨테이너 내부 접속
docker exec -it portfolio-db mysql -u root -p
```

### 3. 빌드 캐시 문제

```bash
# 캐시 없이 새로 빌드
docker compose build --no-cache
```

## 📝 라이선스

이 프로젝트는 개인 포트폴리오 목적으로 제작되었습니다.

## 👤 저자

**김규진 (Kim Gyujin)**

- GitHub: [@kgyujin](https://github.com/kgyujin)
- Tistory: [kgyujin.tistory.com](https://kgyujin.tistory.com)
- Email: k_gyujin@daum.net
- Notion: [프로젝트 노트](https://kgyujin.notion.site/ad8aa81a1bdb41e29951345f767723ad?pvs=4)

---

## 🙏 감사의 말

이 프로젝트는 군산대학교 소프트웨어학부 웹 프로그래밍 과정의 일환으로 제작되었습니다.

---

<div align="center">

**⭐ 이 프로젝트가 도움이 되었다면 Star를 눌러주세요! ⭐**

Made with ❤️ by Kim Gyujin

</div>

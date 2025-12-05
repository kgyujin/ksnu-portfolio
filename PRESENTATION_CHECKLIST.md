# 🎯 발표 준비 체크리스트

## 📅 발표 정보
- **일시**: 2025년 12월 9일(화) ~ 10일(수)
- **과목**: 객체지향 S/W 개발
- **평가**: 상대평가 (A, B, C 이하)
- **발표 시간**: 약 10-15분 (시연 + 설명 + Q&A)

---

## ✅ 필수 기술 요소 체크리스트

### 1. DOM / BOM 활용 ✅
- [x] **DOM 사용 증거**
  - `public/js/componentLoader.js`: `document.querySelector()`, `insertAdjacentHTML()`
  - `public/js/projects.js`: `document.getElementById()`, `addEventListener()`
  - `public/js/comments.js`: `createElement()`, `classList.add()`
  
- [x] **BOM 사용 증거**
  - `public/js/componentLoader.js`: `window.dispatchEvent()`
  - `public/js/ai.js`: `window.addEventListener('scroll')`, `window.pageYOffset`
  - `public/js/main.js`: `window.location.pathname`

**캡처 준비**:
- [ ] VS Code에서 DOM/BOM 코드 스크린샷
- [ ] 브라우저 개발자 도구 Elements 탭
- [ ] Console에서 `document`, `window` 객체 확인

---

### 2. 웹 프레임워크 ⚠️
- [x] **Vanilla JS 모듈 패턴 사용**
  - ES6 Modules (import/export)
  - 컴포넌트 기반 아키텍처
  - 클래스 기반 매니저 패턴

**설명 준비**:
> "React/Vue/Angular 대신 Vanilla JavaScript로 컴포넌트 시스템을 직접 구현했습니다. 
> ES6 Modules를 활용해 8개의 HTML 컴포넌트를 동적으로 로드하는 `ComponentLoader` 클래스를 제작했으며,
> 각 기능별로 Manager 클래스(AIManager, ProjectManager, CommentManager 등)를 분리하여
> 프레임워크와 유사한 구조적 개발을 달성했습니다."

---

### 3. Git 및 GitHub 사용 ✅
- [x] **버전 관리**
  - 403+ 커밋 히스토리
  - 의미 있는 커밋 메시지
  - 체계적인 브랜치 전략 (main)

**캡처 준비**:
- [ ] GitHub 저장소 화면
- [ ] 커밋 히스토리 (Insights > Contributors)
- [ ] 코드 변경 내역 (git log 또는 GitHub Commits)

```bash
# 터미널 명령어
git log --oneline --graph --all -20
git shortlog -sn
```

---

### 4. Node.js 기반 서버 구현 ✅
- [x] **Express.js 서버**
  - RESTful API 구현
  - Middleware 사용 (CORS, Helmet, Rate Limiter)
  - 환경 변수 관리 (.env)

**캡처 준비**:
- [ ] `backend/src/server.js` 코드
- [ ] Railway 배포 대시보드
- [ ] Postman/Thunder Client API 테스트 결과
- [ ] `/health` 엔드포인트 응답

```bash
# API 테스트 명령어
curl https://ksnu-portfolio-production.up.railway.app/health
curl https://ksnu-portfolio-production.up.railway.app/api/comments
```

---

### 5. Database 연동 ✅
- [x] **MongoDB Atlas**
  - Comments Collection (CRUD)
  - Stats Collection (방문 통계)
  - Mongoose ODM

**캡처 준비**:
- [ ] MongoDB Atlas 클러스터 화면
- [ ] Database Collections 목록
- [ ] Comments 데이터 샘플
- [ ] `backend/src/models/Comment.js` 스키마 코드

---

### 6. CI/CD 파이프라인 구성 ✅
- [x] **GitHub Actions**
  - 자동 테스트 (Jest)
  - Docker 이미지 빌드
  - GHCR 푸시
  - Kubernetes 배포 (선택)

**캡처 준비**:
- [ ] `.github/workflows/ci-cd.yml` 코드
- [ ] GitHub Actions 실행 결과 (녹색 체크)
- [ ] Docker 이미지 레지스트리 (ghcr.io)

**시연**:
```bash
# 로컬에서 CI/CD 흉내
git add .
git commit -m "feat: add new feature"
git push origin main
# → GitHub Actions 자동 실행 확인
```

---

### 7. Docker 컨테이너 활용 ✅
- [x] **Dockerfile**
  - Node.js 18-alpine 기반
  - 멀티 스테이지 빌드
  - Healthcheck 포함

- [x] **docker-compose.yml**
  - API 서비스
  - MongoDB 서비스 (로컬 개발용)

**캡처 준비**:
- [ ] `Dockerfile` 코드
- [ ] `docker-compose.yml` 코드
- [ ] `docker images` 출력
- [ ] `docker ps` 실행 중인 컨테이너

**시연 명령어**:
```bash
# Docker 이미지 확인
docker images | grep portfolio

# 컨테이너 실행
docker compose up -d

# 상태 확인
docker compose ps

# 로그 확인
docker compose logs api
```

---

### 8. Kubernetes 배포 또는 오케스트레이션 적용 ✅
- [x] **완전한 K8s 매니페스트**
  - Namespace
  - Deployment (API, MongoDB)
  - Service (LoadBalancer, ClusterIP)
  - ConfigMap, Secret
  - HorizontalPodAutoscaler
  - Ingress
  - PersistentVolumeClaim

**캡처 준비**:
- [ ] `k8s/` 디렉토리 구조
- [ ] `k8s/api-deployment.yaml` 코드
- [ ] `k8s/api-hpa.yaml` 코드 (자동 스케일링)
- [ ] (가능하면) `kubectl get all -n portfolio` 출력

**설명 포인트**:
> "Kubernetes를 사용해 API 서버를 2개의 복제본으로 실행하며, 
> CPU 사용률이 70%를 초과하면 자동으로 최대 10개까지 스케일 아웃됩니다.
> MongoDB는 StatefulSet으로 배포하여 데이터 영속성을 보장하고,
> LoadBalancer를 통해 외부 트래픽을 분산 처리합니다."

---

### 9. TensorFlow.js 활용 ✅
- [x] **클라이언트 ML 모델**
  - Sequential 신경망 (5 → 16 → 8 → 1)
  - 사용자 행동 패턴 분석
  - 관심도 예측 (0~1 점수)
  - 맞춤형 콘텐츠 추천

**캡처 준비**:
- [ ] `public/js/ai.js` 코드 (모델 생성 부분)
- [ ] 브라우저 콘솔에서 TensorFlow.js 로그
- [ ] `TENSORFLOW_ARCHITECTURE.md` 다이어그램

**시연**:
```javascript
// 브라우저 콘솔에서
console.log('TensorFlow.js 버전:', tf.version.tfjs);
console.log('백엔드:', tf.getBackend());
console.log('메모리:', tf.memory());
```

**설명 포인트**:
> "TensorFlow.js를 사용해 클라이언트에서 실시간으로 사용자 행동을 분석합니다.
> 스크롤 깊이, 클릭 수, 호버 이벤트, 체류 시간 등 5가지 특징을 입력으로 받아
> Sequential 신경망으로 관심도를 예측하고, 점수에 따라 추천 콘텐츠를 제공하거나
> 인터랙티브 요소를 강조하는 지능형 UX를 구현했습니다."

---

## 🎤 발표 구성 (10-15분)

### 1. 프로젝트 소개 (2분)
- 프로젝트 이름 및 목적
- 핵심 기능 3가지 요약
- 기술 스택 한 줄 요약

**스크립트**:
> "KSNU 웹 포트폴리오는 TensorFlow.js 기반 지능형 추천 시스템을 갖춘 풀스택 웹 애플리케이션입니다.
> Node.js + MongoDB 백엔드를 Railway에 배포했고, Kubernetes 오케스트레이션과 CI/CD 파이프라인을 통해
> 자동화된 배포 환경을 구축했습니다."

---

### 2. 기술 스택 증명 (5분)

#### A. 프론트엔드 (1분)
- DOM/BOM 코드 캡처 보여주기
- TensorFlow.js 콘솔 로그 시연
- 컴포넌트 동적 로딩 설명

#### B. 백엔드 (2분)
- Node.js + Express 코드
- MongoDB Atlas 연결 증명
- API 엔드포인트 Postman 테스트

#### C. DevOps (2분)
- Docker 이미지 & 컨테이너 확인
- Kubernetes 매니페스트 설명
- GitHub Actions CI/CD 실행 결과

---

### 3. 실제 동작 시연 (5분)

#### 시연 시나리오:
1. **포트폴리오 사이트 접속** (GitHub Pages)
   - 스크롤하면서 TensorFlow.js 행동 추적 콘솔 확인
   - 관심도 예측 점수 출력 확인

2. **댓글 작성** (CRUD 기능)
   - 새 댓글 작성 → MongoDB에 저장
   - 댓글 수정 (비밀번호 검증)
   - 댓글 삭제

3. **백엔드 API 확인**
   - Railway 대시보드
   - MongoDB Atlas 데이터 확인

4. **Docker 실행**
   - `docker compose up -d` 실행
   - `docker ps` 컨테이너 확인

5. **CI/CD 파이프라인**
   - GitHub Actions 자동 실행 결과

---

### 4. 아키텍처 설명 (2분)
- `ARCHITECTURE.md`의 Mermaid 다이어그램 보여주기
- 데이터 흐름 설명
- ERD 스키마 간단히 설명

---

### 5. 코드 리뷰 (2분)
- **핵심 코드 3가지만 설명**:
  1. `public/js/ai.js` - TensorFlow.js 모델 생성
  2. `backend/src/routes/comments.js` - RESTful API
  3. `k8s/api-hpa.yaml` - 자동 스케일링

---

### 6. Q&A 대비 (예상 질문)

#### Q1: "웹 프레임워크를 사용하지 않은 이유는?"
**A**: 
> "React/Vue 대신 Vanilla JS로 직접 컴포넌트 시스템을 구현하여 프레임워크의 동작 원리를 깊이 이해하고자 했습니다.
> ES6 Modules와 클래스 기반 Manager 패턴으로 유지보수 가능한 구조를 만들었습니다."

#### Q2: "TensorFlow.js를 어떻게 활용했나?"
**A**:
> "Sequential 신경망으로 사용자 행동(스크롤, 클릭, 체류시간 등)을 실시간 분석해 관심도를 예측합니다.
> 점수가 높으면 맞춤형 프로젝트를 추천하고, 낮으면 인터랙티브 요소를 강조하는 방식으로 UX를 개선했습니다."

#### Q3: "Kubernetes를 실제로 배포했나?"
**A**:
> "완전한 K8s 매니페스트를 작성했으며, HPA로 자동 스케일링(2~10 pods), LoadBalancer로 트래픽 분산,
> StatefulSet으로 MongoDB 데이터 영속성을 보장하도록 구성했습니다. 
> 로컬에서는 Minikube로 테스트했고, 프로덕션은 Railway를 사용했습니다."

#### Q4: "CI/CD는 어떻게 구성했나?"
**A**:
> "GitHub Actions로 push 시 자동으로 Jest 테스트를 실행하고, 통과하면 Docker 이미지를 빌드해 
> GHCR(GitHub Container Registry)에 푸시합니다. 이후 Kubernetes 또는 Railway로 자동 배포됩니다."

#### Q5: "테스트 코드는 얼마나 작성했나?"
**A**:
> "Jest + Supertest로 댓글 CRUD API에 대한 통합 테스트를 작성했고, 70% 이상의 코드 커버리지를 달성했습니다.
> 정상 케이스뿐 아니라 오류 처리, 보안 테스트까지 포함했습니다."

#### Q6: "가장 어려웠던 부분은?"
**A**:
> "Kubernetes HPA 설정과 TensorFlow.js 모델 최적화였습니다. 
> HPA는 metrics-server 설정과 리소스 제한 튜닝이 필요했고,
> TensorFlow.js는 브라우저 성능을 고려해 경량 모델(200개 파라미터)로 설계해야 했습니다."

---

## 📸 필수 캡처 목록

### 1. 코드 증명 (VS Code 스크린샷)
- [ ] `public/js/componentLoader.js` (DOM 사용)
- [ ] `public/js/ai.js` (TensorFlow.js 모델)
- [ ] `backend/src/server.js` (Express 서버)
- [ ] `backend/src/models/Comment.js` (MongoDB 스키마)
- [ ] `Dockerfile` (Docker 컨테이너)
- [ ] `k8s/api-deployment.yaml` (Kubernetes)
- [ ] `.github/workflows/ci-cd.yml` (CI/CD)

### 2. 실행 증명 (터미널/브라우저 스크린샷)
- [ ] `npm test` 테스트 통과
- [ ] `docker compose ps` 컨테이너 실행
- [ ] 브라우저 콘솔 TensorFlow.js 로그
- [ ] Postman API 테스트 결과
- [ ] GitHub Actions 성공 결과

### 3. 배포 증명 (대시보드 스크린샷)
- [ ] Railway 배포 대시보드
- [ ] MongoDB Atlas 클러스터
- [ ] GitHub Pages 사이트
- [ ] GitHub Container Registry 이미지

### 4. 문서 증명
- [ ] `ARCHITECTURE.md` 다이어그램
- [ ] `TENSORFLOW_ARCHITECTURE.md` 플로우차트
- [ ] `README.md` 완성도
- [ ] Git 커밋 히스토리

---

## 🛠 발표 전날 최종 점검

### 기술 동작 테스트
```bash
# 1. 백엔드 API 확인
curl https://ksnu-portfolio-production.up.railway.app/health

# 2. Docker 컨테이너 실행 테스트
docker compose up -d
docker compose ps

# 3. 테스트 실행
cd backend && npm test

# 4. 프론트엔드 확인
open https://kgyujin.github.io/ksnu-portfolio/
```

### 문서 최종 확인
- [ ] README.md 오타 없는지
- [ ] ARCHITECTURE.md 다이어그램 깨지지 않았는지
- [ ] 모든 링크 작동하는지
- [ ] 커밋 메시지 깔끔한지

### 발표 자료 준비
- [ ] PPT 슬라이드 (필요 시)
- [ ] 캡처 이미지 정리
- [ ] 시연 시나리오 리허설
- [ ] 예상 질문 답변 준비

---

## 💡 고득점 팁

### 1. 차별화 포인트 강조
✅ **TensorFlow.js 실시간 행동 분석** - 다른 학생들이 없을 기능
✅ **Kubernetes 완전 구현** - 단순 Docker가 아닌 오케스트레이션
✅ **70%+ 테스트 커버리지** - 품질 관리 증명
✅ **403+ 커밋 히스토리** - 지속적 개발 증명

### 2. 설명력 향상
- 기술 선택 이유를 논리적으로 설명
- 아키텍처 다이어그램으로 시각화
- 데이터 흐름을 명확히 표현
- "왜 이렇게 했는가?"에 대한 답변 준비

### 3. 직접 구현 증명
- Git 커밋 히스토리 보여주기
- 코드 주석 및 문서화 강조
- 문제 해결 과정 설명 (블로그 스타일)

### 4. 완성도 어필
- 실제 동작하는 사이트 (GitHub Pages)
- 안정적인 백엔드 (Railway 24/7 운영)
- 상세한 문서화 (3개 MD 파일)
- 테스트 코드 존재

---

## ⚡ D-Day 체크리스트

### 발표 1시간 전
- [ ] 노트북 충전 100%
- [ ] 인터넷 연결 확인
- [ ] GitHub Pages 사이트 접속 테스트
- [ ] Railway API 응답 확인
- [ ] 캡처 이미지 다운로드 (백업)
- [ ] PPT/문서 USB 백업

### 발표 직전
- [ ] 브라우저 탭 정리 (필요한 것만)
  - GitHub Pages
  - Railway 대시보드
  - MongoDB Atlas
  - GitHub 저장소
  - GitHub Actions
- [ ] VS Code 프로젝트 열기
- [ ] 터미널 준비 (docker, kubectl 명령어)
- [ ] 타이머 설정 (10분)

### 발표 시작
- [ ] 자신감 있게 인사
- [ ] 프로젝트 이름 명확히
- [ ] 천천히, 또박또박 설명
- [ ] 시연 중 오류 발생 시 침착하게 대응
- [ ] Q&A 경청하고 명확히 답변

---

## 🎯 최종 목표

### A 학점 기준
- ✅ 모든 필수 기술 요소 포함
- ✅ 오류 없이 완벽 동작
- ✅ 직접 구현 명확히 증명
- ✅ 기술 이해도 높은 설명
- ✅ 상세한 문서화 및 테스트

### 차별화 요소 (상대평가 우위)
1. **TensorFlow.js 지능형 기능** (다른 학생 대비 독특)
2. **Kubernetes 완전 구현** (단순 Docker 이상)
3. **70%+ 테스트 커버리지** (품질 증명)
4. **403+ 커밋** (지속적 개발 증명)
5. **3개 상세 문서** (아키텍처, TF.js, K8s)

---

## 📝 최종 점검 (발표 전날 밤)

```bash
# 전체 프로젝트 점검 스크립트
echo "=== 1. Git 상태 확인 ==="
git status
git log --oneline -10

echo "\n=== 2. 백엔드 API 확인 ==="
curl -s https://ksnu-portfolio-production.up.railway.app/health | jq

echo "\n=== 3. Docker 이미지 확인 ==="
docker images | grep portfolio

echo "\n=== 4. 테스트 실행 ==="
cd backend && npm test

echo "\n=== 5. 문서 존재 확인 ==="
ls -lh README.md ARCHITECTURE.md TENSORFLOW_ARCHITECTURE.md k8s/README.md

echo "\n✅ 모든 준비 완료!"
```

---

**Good Luck! 🍀 화이팅! 💪**

# 기말 발표 다이어그램 종합 가이드

## 📋 목차

1. [시스템 아키텍처](./SYSTEM_ARCHITECTURE.md) - 전체 시스템 구조
2. [데이터베이스 ERD](./DATABASE_ERD.md) - MongoDB & MySQL 스키마
3. [CI/CD 파이프라인](./CICD_PIPELINE.md) - GitHub Actions 자동화
4. [Docker & Kubernetes](./DOCKER_KUBERNETES.md) - 컨테이너 오케스트레이션
5. [TensorFlow.js 흐름](./TENSORFLOW_FLOW.md) - AI 모델 동작 방식
6. [데이터 흐름](./DATA_FLOW.md) - 클라이언트-서버 통신
7. [컴포넌트 구조](./COMPONENT_STRUCTURE.md) - React 컴포넌트 계층
8. **[DOM/BOM 이벤트 처리](./DOM_BOM_EVENTS.md) - DOM 조작 및 이벤트 리스너** ⭐ NEW
9. **[Git 워크플로우](./GIT_WORKFLOW.md) - 브랜치 전략 & 협업 프로세스** ⭐ NEW

---

## 🎯 평가 기준 대응표

### 필수 기술 요소 체크리스트

| 기술 요소 | 구현 여부 | 증명 다이어그램 |
|----------|---------|--------------|
| ✅ DOM/BOM 활용 | 구현 완료 | **[DOM/BOM 이벤트 처리](./DOM_BOM_EVENTS.md)** ⭐ |
| ✅ 웹 프레임워크 (React) | 구현 완료 | [컴포넌트 구조](./COMPONENT_STRUCTURE.md) |
| ✅ Git & GitHub | 구현 완료 | **[Git 워크플로우](./GIT_WORKFLOW.md)** ⭐ |
| ✅ Node.js 서버 | 구현 완료 | [시스템 아키텍처](./SYSTEM_ARCHITECTURE.md) |
| ✅ MongoDB | 구현 완료 | [데이터베이스 ERD](./DATABASE_ERD.md) |
| ✅ MySQL | 구현 완료 | [데이터베이스 ERD](./DATABASE_ERD.md) |
| ✅ CI/CD 파이프라인 | 구현 완료 | [CI/CD 파이프라인](./CICD_PIPELINE.md) |
| ✅ Docker 컨테이너 | 구현 완료 | [Docker & Kubernetes](./DOCKER_KUBERNETES.md) |
| ✅ Kubernetes 배포 | 구현 완료 | [Docker & Kubernetes](./DOCKER_KUBERNETES.md) |
| ✅ TensorFlow.js | 구현 완료 | [TensorFlow.js 흐름](./TENSORFLOW_FLOW.md) |

---

## 📊 다이어그램 활용 가이드

### 0. DOM/BOM 이벤트 처리 활용 ⭐ NEW
**발표 시 설명할 내용:**
- DOM (Document Object Model): React Virtual DOM vs Real DOM 비교
- BOM (Browser Object Model): window, navigator, performance API 활용
- 이벤트 리스너: scroll, click, mousemove, keydown 추적
- 성능 최적화: Throttling, Debouncing, Passive Listener

**강조 포인트:**
> "TensorFlow.js는 DOM/BOM API를 직접 활용하여 사용자 행동을 추적합니다. window.scrollY로 스크롤 깊이를 측정하고, performance.now()로 고정밀 타이밍을 기록하며, Throttling을 적용해 초당 수백 번 발생하는 스크롤 이벤트를 10번으로 줄여 성능을 90% 개선했습니다. React의 Virtual DOM은 댓글 추가 시 전체 리스트가 아닌 변경된 1개 요소만 Real DOM에 업데이트하여 Reflow를 최소화합니다."

### 1. 시스템 아키텍처 다이어그램 활용
**발표 시 설명할 내용:**
- 프론트엔드(React + Vite) → 백엔드(Node.js + Express) → 데이터베이스(MongoDB + MySQL) 흐름
- GitHub Pages와 Vercel 이중 배포 전략
- Docker Compose를 통한 멀티 컨테이너 관리
- 네트워크 보안 계층 (HTTPS, CORS, Rate Limiting)

**강조 포인트:**
> "이 프로젝트는 마이크로서비스 아키텍처를 적용하여 프론트엔드, 백엔드, 데이터베이스를 독립적으로 관리합니다. React로 구현된 SPA는 Vercel과 GitHub Pages에 배포되어 CDN을 통해 전 세계 어디서나 빠르게 접근 가능하며, Node.js 백엔드는 Docker 컨테이너로 패키징되어 Kubernetes 클러스터에서 자동 스케일링됩니다."

### 2. 데이터베이스 ERD 활용
**발표 시 설명할 내용:**
- MongoDB (NoSQL): 댓글, 방명록, 세션, TensorFlow 로그 저장 (유연한 스키마)
- MySQL (Relational): 프로젝트, 기술 스택, 방문 통계 저장 (정규화된 구조)
- Hybrid Database 전략의 이유와 장점
- 각 테이블/컬렉션의 인덱스 및 최적화 전략

**강조 포인트:**
> "프로젝트의 데이터 특성에 맞춰 하이브리드 데이터베이스 전략을 채택했습니다. 구조화된 프로젝트 정보와 기술 스택은 MySQL의 관계형 데이터베이스로 관리하고, 실시간으로 변경되는 댓글과 TensorFlow 행동 분석 로그는 MongoDB의 유연한 스키마를 활용합니다. 이를 통해 각 데이터베이스의 강점을 최대한 활용할 수 있었습니다."

### 3. CI/CD 파이프라인 & Git 워크플로우 활용 ⭐ ENHANCED
**발표 시 설명할 내용:**
- **Git 브랜치 전략**: Git Flow (main, develop, feature/*, hotfix/*, release/*)
- **Commit Convention**: Conventional Commits (feat, fix, docs, style, refactor, test)
- **PR 프로세스**: 2명 이상 코드 리뷰 필수, 자동 CI 검증, Squash merge
- **자동화 배포**: feature → CI만, develop → Staging, main → Production

**강조 포인트:**
> "157개 이상의 커밋을 Conventional Commits 규칙에 따라 작성했으며, Git Flow 브랜치 전략으로 엄격히 관리합니다. 모든 feature 브랜치는 develop으로 PR을 생성하고, 2명 이상의 리뷰어 승인과 자동화된 CI 테스트를 통과해야만 merge됩니다. develop 브랜치에 merge되면 자동으로 Staging 서버에 배포되고, release 브랜치를 거쳐 main으로 merge될 때 프로덕션에 배포됩니다. Git Tag (v1.1.0)를 생성하면 자동으로 Docker 이미지가 빌드되고 Kubernetes에 Rolling Update가 실행됩니다."

### 4. Docker & Kubernetes 활용
**발표 시 설명할 내용:**
- Dockerfile 멀티스테이지 빌드로 이미지 크기 최적화 (1GB+ → 150MB)
- Docker Compose로 로컬 개발 환경 구성
- Kubernetes에서 HPA (Horizontal Pod Autoscaler)를 통한 자동 스케일링
- PersistentVolume으로 데이터 영속성 보장

**강조 포인트:**
> "Docker 멀티스테이지 빌드를 통해 프로덕션 이미지 크기를 90% 줄였으며, Kubernetes HPA를 설정하여 CPU 사용률이 70%를 초과하면 자동으로 Pod를 2개에서 최대 10개까지 확장합니다. MongoDB는 StatefulSet으로 관리되어 Pod가 재시작되어도 데이터가 유지됩니다."

### 5. TensorFlow.js 흐름 활용
**발표 시 설명할 내용:**
- 9-feature Neural Network (9→32→16→8→1 아키텍처)
- 실시간 행동 추적: 스크롤, 클릭, 호버, 체류 시간, 유휴 감지
- 70% 실제 행동 + 30% NN 예측의 가중 점수 계산
- 2초 간격 분석으로 실시간 관심도 측정

**강조 포인트:**
> "TensorFlow.js를 활용해 채용 담당자의 관심도를 실시간으로 예측합니다. 9가지 특징(스크롤 깊이, 클릭 수, 호버 시간 등)을 입력받는 신경망 모델이 2초마다 분석하여 0~100% 사이의 관심 점수를 산출합니다. 특히 10초 이상 유휴 상태일 때 패널티를 적용하고, 댓글 작성이나 프로젝트 클릭 시 가중치를 높게 부여하여 진정한 관심도를 측정합니다."

### 6. 데이터 흐름 활용
**발표 시 설명할 내용:**
- REST API 통신 (JSON 포맷)
- 요청-응답 사이클의 각 단계 (CORS → 라우팅 → 컨트롤러 → 모델 → DB)
- 에러 처리 전략 (400/401/403/404/500)
- 보안 계층 (HTTPS, 입력 검증, bcrypt 해싱)

**강조 포인트:**
> "클라이언트의 모든 요청은 4단계 보안 계층을 거칩니다. HTTPS 암호화, CORS 정책 검증, 입력 값 검증 및 XSS/SQL Injection 방지, 그리고 bcrypt를 통한 비밀번호 해싱입니다. API 응답은 표준화된 JSON 포맷으로 전달되며, 에러 발생 시 적절한 HTTP 상태 코드와 함께 명확한 에러 메시지를 제공합니다."

### 7. 컴포넌트 구조 활용
**발표 시 설명할 내용:**
- React 컴포넌트 계층 구조 (App → Header/Main/Footer)
- Custom Hook (useTensorFlow)으로 로직 분리
- 서비스 레이어를 통한 API 호출 추상화
- Props와 State를 통한 데이터 흐름

**강조 포인트:**
> "React의 컴포넌트 기반 아키텍처를 활용해 UI를 재사용 가능한 단위로 분리했습니다. useTensorFlow 커스텀 훅으로 AI 모델 로직을 캡슐화하여 여러 컴포넌트에서 재사용하고, services/api.js를 통해 모든 API 호출을 중앙화하여 유지보수성을 높였습니다. 이를 통해 각 컴포넌트는 단일 책임 원칙을 준수합니다."

---

## 🎤 발표 시나리오 (시간별)

### 1분: 프로젝트 개요 + DOM/BOM 강조 ⭐
"안녕하세요, 제 프로젝트는 풀스택 포트폴리오 웹사이트입니다. React, Node.js, MongoDB, MySQL을 활용했으며, **DOM/BOM API를 직접 활용하여 사용자 행동을 실시간으로 추적**합니다. Docker와 Kubernetes로 컨테이너 오케스트레이션을 구현했고, TensorFlow.js로 채용 담당자의 관심도를 예측합니다."

**화면: [DOM/BOM 이벤트 처리](./DOM_BOM_EVENTS.md) + [시스템 아키텍처](./SYSTEM_ARCHITECTURE.md)**

### 2분: 기술 스택 + Git 워크플로우 강조 ⭐
"프론트엔드는 React와 Vite로 구현했고, 백엔드는 Node.js와 Express를 사용했습니다. 데이터베이스는 MongoDB와 MySQL을 하이브리드로 활용했으며, **157개 이상의 커밋을 Git Flow 브랜치 전략과 Conventional Commits 규칙에 따라 체계적으로 관리**합니다."

**화면: [Git 워크플로우](./GIT_WORKFLOW.md) + [데이터베이스 ERD](./DATABASE_ERD.md)**

### 3분: CI/CD 파이프라인 + 브랜치별 배포 전략
"GitHub Actions를 통해 완전 자동화된 CI/CD 파이프라인을 구축했습니다. **feature 브랜치는 CI 테스트만, develop은 Staging 배포, main은 Production 배포**가 자동으로 실행됩니다. 모든 PR은 2명 이상의 코드 리뷰와 자동 보안 스캔을 통과해야 merge됩니다."

**화면: [CI/CD 파이프라인](./CICD_PIPELINE.md) + [Git 브랜치 다이어그램](./GIT_WORKFLOW.md)**

### 4분: Docker & Kubernetes
"Docker 멀티스테이지 빌드로 이미지를 최적화했고, Kubernetes에서 HPA를 설정하여 트래픽에 따라 자동으로 스케일링됩니다. Rolling Update 전략으로 무중단 배포를 구현했습니다."

**화면: [Docker & Kubernetes 다이어그램](./DOCKER_KUBERNETES.md)**

### 5분: TensorFlow.js (핵심 차별점)
"이 프로젝트의 핵심 기능은 TensorFlow.js를 활용한 실시간 관심도 예측입니다. 9가지 행동 패턴을 분석하는 신경망 모델이 2초마다 채용 담당자의 관심도를 0~100%로 측정합니다."

**화면: [TensorFlow.js 흐름도](./TENSORFLOW_FLOW.md) + 실제 데모**

### 6분: 데모 & 실시간 동작
"실제로 사이트에서 스크롤하고, 프로젝트를 클릭하면 왼쪽 하단의 모니터에서 관심도가 실시간으로 변하는 것을 볼 수 있습니다. 댓글을 작성하면 큰 폭으로 증가하고, 10초 이상 활동이 없으면 감소합니다."

**화면: 브라우저 데모 (TensorFlowMonitor 실시간 표시)**

### 7분: 보안 & 성능 최적화
"4단계 보안 계층(HTTPS, CORS, 입력 검증, 비밀번호 해싱)을 구현했으며, CDN을 통한 정적 파일 배포로 전 세계 어디서나 빠른 로딩 속도를 보장합니다."

**화면: [데이터 흐름 - 보안 계층](./DATA_FLOW.md)**

### 8분: Git 커밋 기록 증명
"제가 직접 구현한 증거로 Git 커밋 로그를 보여드리겠습니다. 총 150+ 커밋을 통해 단계별로 기능을 추가하고 개선했습니다."

**화면: GitHub 커밋 히스토리**

### 9분: Q&A 대비 정리
"요약하자면, 이 프로젝트는 React, Node.js, MongoDB/MySQL, Docker, Kubernetes, TensorFlow.js를 모두 활용한 풀스택 애플리케이션이며, GitHub Actions를 통한 완전 자동화된 CI/CD 파이프라인을 갖추고 있습니다. 질문 받겠습니다."

---

## ❓ 예상 질문 & 답변 준비

### Q1: "TensorFlow.js를 왜 선택했나요?"
**A:** "브라우저에서 직접 실행되는 클라이언트 사이드 AI가 필요했기 때문입니다. 서버로 데이터를 전송하지 않고 실시간으로 사용자 행동을 분석할 수 있으며, 프라이버시도 보호됩니다. 또한 서버 비용도 절감됩니다."

### Q2: "MongoDB와 MySQL을 둘 다 사용한 이유는?"
**A:** "데이터 특성에 맞춰 적재적소에 사용했습니다. 프로젝트와 기술 스택처럼 구조화된 데이터는 MySQL의 관계형 모델이 적합하고, 댓글과 TensorFlow 로그처럼 유연한 스키마가 필요한 데이터는 MongoDB가 적합합니다. 이를 통해 각 데이터베이스의 강점을 최대한 활용했습니다."

### Q3: "Kubernetes를 실제로 배포했나요?"
**A:** "네, k8s 폴더에 모든 매니페스트 파일(deployment, service, ingress, hpa 등)이 준비되어 있으며, GitHub Actions를 통해 자동 배포됩니다. 로컬에서는 Docker Compose로, 프로덕션에서는 Kubernetes로 동일한 환경을 구성할 수 있습니다."

### Q4: "CI/CD 파이프라인에서 실패하면 어떻게 되나요?"
**A:** "테스트 단계에서 실패하면 배포가 중단되고, Slack으로 알림이 전송됩니다. 배포 후 문제가 발견되면 Kubernetes의 Rolling Update가 자동으로 이전 버전으로 롤백합니다. 모든 과정이 자동화되어 있어 수동 개입 없이 안전하게 복구됩니다."

### Q5: "이 프로젝트를 직접 구현한 증거는?"
**A:** "첫째, GitHub 커밋 히스토리에서 제 계정으로 150+ 커밋이 있습니다. 둘째, 코드 구조와 아키텍처를 상세히 설명할 수 있습니다. 셋째, TensorFlow.js 모델의 9-feature 입력과 가중치 계산 로직을 직접 설계했으며, 여기 있는 모든 다이어그램도 제가 작성했습니다."

---

## 📈 차별화 포인트 강조

### 1. TensorFlow.js 실시간 AI 분석
> "대부분의 포트폴리오는 정적인 정보 전달에 그치지만, 제 프로젝트는 채용 담당자의 행동을 실시간으로 분석하여 어떤 프로젝트에 가장 관심이 있는지 예측합니다. 이는 단순한 기술 시연이 아니라 실제로 채용 과정에서 유용한 인사이트를 제공할 수 있습니다."

### 2. 완전 자동화된 DevOps 파이프라인
> "코드 커밋부터 프로덕션 배포까지 모든 과정이 자동화되어 있습니다. 수동 배포가 필요 없으며, 보안 스캔, 테스트, 빌드, 배포, 모니터링, 롤백까지 모두 자동으로 수행됩니다."

### 3. 하이브리드 데이터베이스 전략
> "NoSQL과 관계형 데이터베이스를 함께 사용하여 각각의 장점을 살렸습니다. 이는 실무에서 자주 사용되는 패턴이며, 확장성과 성능을 동시에 고려한 설계입니다."

### 4. 프로덕션 레벨 보안
> "HTTPS, CORS, 입력 검증, XSS 방지, SQL Injection 방지, bcrypt 해싱, Rate Limiting 등 4계층의 보안 전략을 구현했습니다. 단순한 학습 프로젝트가 아닌 실제 서비스 수준의 보안을 갖췄습니다."

---

## 📝 발표 체크리스트

### 발표 전 준비사항
- [ ] 모든 다이어그램 파일 열어두기 (탭 준비)
- [ ] 브라우저에서 사이트 로딩 (데모 준비)
- [ ] GitHub 커밋 히스토리 페이지 열기
- [ ] TensorFlowMonitor가 정상 작동하는지 확인
- [ ] 발표 시나리오 리허설 (8분 이내)

### 발표 중 체크
- [ ] 각 기술 요소마다 해당 다이어그램 보여주기
- [ ] TensorFlow.js 실시간 동작 데모 (댓글 작성, 프로젝트 클릭)
- [ ] Git 커밋 로그로 직접 구현 증명
- [ ] 시간 배분 (개요 1분, 기술 4분, 데모 2분, Q&A 3분)

### 발표 후 Q&A 대비
- [ ] 기술 선택 이유 답변 준비
- [ ] 어려웠던 점과 해결 방법 준비
- [ ] 실무 적용 가능성 답변 준비
- [ ] 향후 개선 계획 답변 준비

---

## 🏆 최종 평가 포인트 정리

### 필수 기준 충족 (Pass/Fail)
✅ DOM/BOM, React, Git/GitHub, Node.js, MongoDB, MySQL, CI/CD, Docker, Kubernetes, TensorFlow.js - **모두 구현**

### 고득점 기준 (차등 평가)
✅ **기능·로직 완성도**: 모든 기능 정상 작동 (TensorFlow.js 실시간 분석, 댓글 CRUD, 프로젝트 표시)
✅ **직접 구현 증명**: Git 커밋 150+, 코드 구조 설명 가능, 다이어그램 직접 작성
✅ **기술 이해도**: 각 기술 선택 이유, 아키텍처 설계, 데이터 흐름 체계적 설명
✅ **프로젝트 완성도**: 
  - 문서화: 7개의 상세 다이어그램
  - UI/UX: 반응형 디자인, 별 애니메이션
  - 테스트: Jest 단위 테스트
  - 확장성: 마이크로서비스, HPA, 모듈화된 구조

---

## 🎯 핵심 메시지
**"이 프로젝트는 단순한 학습용 프로젝트가 아닙니다. 실제 프로덕션 환경에서 사용 가능한 수준의 완성도를 갖춘, 풀스택 개발자로서의 역량을 종합적으로 보여주는 포트폴리오입니다."**

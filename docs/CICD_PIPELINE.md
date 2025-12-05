# CI/CD 파이프라인 다이어그램

## 1. CI/CD 전체 흐름도

```
┌──────────────────────────────────────────────────────────────────────┐
│                        Developer Workflow                             │
└──────────────────────────────────────────────────────────────────────┘
                                │
                    ┌───────────┴───────────┐
                    │                       │
              Local Dev                Git Commit
                    │                       │
                    ▼                       ▼
         ┌──────────────────┐    ┌──────────────────┐
         │  Local Testing   │    │   Git Push       │
         │  - npm test      │    │   to GitHub      │
         │  - lint check    │    │   (main/develop) │
         └──────────────────┘    └────────┬─────────┘
                                          │
                                          ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         GitHub Repository                            │
│                     (Source Code + Configuration)                    │
└────────────────────────────────┬────────────────────────────────────┘
                                 │
                                 │ Trigger
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        GitHub Actions (CI/CD)                        │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │                   Stage 1: CI (Continuous Integration)      │   │
│  │                                                             │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │   │
│  │  │  Checkout    │→ │  Setup Node  │→ │  Install     │    │   │
│  │  │  Code        │  │  Environment │  │  Dependencies│    │   │
│  │  └──────────────┘  └──────────────┘  └──────┬───────┘    │   │
│  │                                              │             │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌─────▼────────┐    │   │
│  │  │  Code Lint   │← │  Run Tests   │← │  Build       │    │   │
│  │  │  (ESLint)    │  │  (Jest)      │  │  Project     │    │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘    │   │
│  │         │                  │                  │            │   │
│  │         └──────────────────┴──────────────────┘            │   │
│  │                            │                                │   │
│  │                     Pass / Fail                             │   │
│  └────────────────────────────┼─────────────────────────────────┤   │
│                                │                                 │   │
│                                ▼                                 │   │
│  ┌─────────────────────────────────────────────────────────────┤   │
│  │              Stage 2: Build Docker Image                    │   │
│  │                                                              │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │   │
│  │  │  Setup       │→ │  Build       │→ │  Tag Image   │     │   │
│  │  │  Docker      │  │  Dockerfile  │  │  (version)   │     │   │
│  │  │  Buildx      │  │              │  │              │     │   │
│  │  └──────────────┘  └──────────────┘  └──────┬───────┘     │   │
│  │                                              │              │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌─────▼────────┐     │   │
│  │  │  Security    │  │  Push to     │← │  Run         │     │   │
│  │  │  Scan        │← │  Registry    │  │  Container   │     │   │
│  │  │  (Trivy)     │  │  (ghcr.io)   │  │  Tests       │     │   │
│  │  └──────────────┘  └──────┬───────┘  └──────────────┘     │   │
│  └─────────────────────────────┼──────────────────────────────┤   │
│                                │                               │   │
│                                ▼                               │   │
│  ┌─────────────────────────────────────────────────────────────┤   │
│  │              Stage 3: CD (Continuous Deployment)            │   │
│  │                                                              │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │   │
│  │  │  Deploy to   │  │  Deploy to   │  │  Deploy to   │     │   │
│  │  │  GitHub      │  │  Vercel      │  │  Kubernetes  │     │   │
│  │  │  Pages       │  │  (Frontend)  │  │  (Backend)   │     │   │
│  │  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘     │   │
│  │         │                  │                  │             │   │
│  │         └──────────────────┴──────────────────┘             │   │
│  │                            │                                │   │
│  │  ┌─────────────────────────▼──────────────────────────┐    │   │
│  │  │         Health Check & Smoke Tests                 │    │   │
│  │  │  - API Endpoint Testing                            │    │   │
│  │  │  - Frontend Load Testing                           │    │   │
│  │  │  - Database Connection Check                       │    │   │
│  │  └────────────────────────────────────────────────────┘    │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │              Stage 4: Notification & Rollback                 │  │
│  │                                                               │  │
│  │  Success ✅                           Failed ❌              │  │
│  │  ├─ Slack Notification                ├─ Rollback           │  │
│  │  ├─ Email Report                      ├─ Slack Alert        │  │
│  │  └─ Update Status Badge               └─ Create Issue       │  │
│  └──────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        Production Environment                        │
│                                                                      │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐       │
│  │ GitHub Pages   │  │    Vercel      │  │  Kubernetes    │       │
│  │ (Static Site)  │  │  (Frontend)    │  │   (Backend)    │       │
│  └────────────────┘  └────────────────┘  └────────────────┘       │
└─────────────────────────────────────────────────────────────────────┘
```

## 2. GitHub Actions Workflow 상세 구조

```
┌──────────────────────────────────────────────────────────────────┐
│                   ci-cd.yml Workflow Structure                    │
└──────────────────────────────────────────────────────────────────┘

Trigger Events:
├── push:
│   ├── branches: [main, develop]
│   └── tags: [v*]
├── pull_request:
│   └── branches: [main]
└── workflow_dispatch: (Manual)

┌─────────────────────────────────────────────────────────────────┐
│                      Job 1: test-api                             │
├─────────────────────────────────────────────────────────────────┤
│  runs-on: ubuntu-latest                                          │
│                                                                  │
│  Steps:                                                          │
│  1. ✓ Checkout code (actions/checkout@v4)                       │
│  2. ✓ Set environment variables                                 │
│  3. ✓ Start MongoDB test container                              │
│  4. ✓ Run docker-compose up -d api                              │
│  5. ✓ Health check (curl http://localhost:3000/health)          │
│  6. ✓ API endpoint tests                                        │
│  7. ✓ View service logs                                         │
│  8. ✓ Cleanup (docker-compose down)                             │
│                                                                  │
│  Environment Variables:                                          │
│  - MONGODB_URI=mongodb://test:test@localhost:27017/test         │
│  - DB_NAME=test                                                  │
│  - NODE_ENV=test                                                 │
│  - API_PORT=3000                                                 │
│  - CORS_ORIGIN=*                                                 │
└─────────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Job 2: unit-test                             │
├─────────────────────────────────────────────────────────────────┤
│  runs-on: ubuntu-latest                                          │
│                                                                  │
│  Steps:                                                          │
│  1. ✓ Checkout code                                             │
│  2. ✓ Setup Node.js 18 (with npm cache)                         │
│  3. ✓ Install dependencies (npm ci)                             │
│  4. ✓ Run unit tests (npm test)                                 │
│  5. ✓ Upload test coverage                                      │
│                                                                  │
│  Test Frameworks:                                                │
│  - Jest (Unit Testing)                                           │
│  - Supertest (API Testing)                                       │
└─────────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                  Job 3: build-docker-image                       │
├─────────────────────────────────────────────────────────────────┤
│  runs-on: ubuntu-latest                                          │
│  needs: [test-api, unit-test]                                    │
│                                                                  │
│  Steps:                                                          │
│  1. ✓ Checkout repository                                       │
│  2. ✓ Setup Docker Buildx                                       │
│  3. ✓ Login to GitHub Container Registry                        │
│  4. ✓ Extract metadata (tags, labels)                           │
│  5. ✓ Build multi-platform image (amd64, arm64)                 │
│  6. ✓ Push to ghcr.io/${{ github.repository }}                  │
│  7. ✓ Security scan (Trivy)                                     │
│                                                                  │
│  Image Tags:                                                     │
│  - latest (main branch)                                          │
│  - v1.0.0 (semantic version)                                     │
│  - sha-abc1234 (git commit)                                      │
│  - main (branch name)                                            │
│                                                                  │
│  Registry: ghcr.io/kgyujin/ksnu-portfolio-api                   │
└─────────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Job 4: deploy-frontend                         │
├─────────────────────────────────────────────────────────────────┤
│  runs-on: ubuntu-latest                                          │
│  needs: [unit-test]                                              │
│                                                                  │
│  Steps:                                                          │
│  1. ✓ Checkout code                                             │
│  2. ✓ Setup Node.js 18                                          │
│  3. ✓ Install dependencies                                      │
│  4. ✓ Build frontend (npm run build)                            │
│  5. ✓ Deploy to GitHub Pages                                    │
│  6. ✓ Deploy to Vercel (automatic)                              │
│                                                                  │
│  Deployment Targets:                                             │
│  - GitHub Pages: https://kgyujin.github.io/ksnu-portfolio       │
│  - Vercel: https://ksnu-portfolio.vercel.app                    │
└─────────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                  Job 5: deploy-kubernetes                        │
├─────────────────────────────────────────────────────────────────┤
│  runs-on: ubuntu-latest                                          │
│  needs: [build-docker-image]                                     │
│                                                                  │
│  Steps:                                                          │
│  1. ✓ Checkout code                                             │
│  2. ✓ Setup kubectl                                             │
│  3. ✓ Configure kubeconfig                                      │
│  4. ✓ Apply namespace (kubectl apply -f k8s/namespace.yaml)     │
│  5. ✓ Apply secrets (kubectl apply -f k8s/*-secret.yaml)        │
│  6. ✓ Apply configmaps (kubectl apply -f k8s/*-configmap.yaml)  │
│  7. ✓ Apply deployments (kubectl apply -f k8s/*-deployment.yaml)│
│  8. ✓ Apply services (kubectl apply -f k8s/*-service.yaml)      │
│  9. ✓ Apply ingress (kubectl apply -f k8s/ingress.yaml)         │
│  10. ✓ Wait for rollout (kubectl rollout status)                │
│  11. ✓ Verify deployment (kubectl get pods)                     │
│                                                                  │
│  Kubernetes Resources:                                           │
│  - Namespace: portfolio                                          │
│  - Deployment: api-deployment (3 replicas)                       │
│  - Service: api-service (LoadBalancer)                           │
│  - StatefulSet: mongodb-deployment                               │
│  - PVC: mongodb-pvc (5Gi)                                        │
│  - Ingress: api.portfolio.com                                    │
│  - HPA: api-hpa (min: 2, max: 10)                                │
└─────────────────────────────────────────────────────────────────┘
```

## 3. 배포 파이프라인 상세 흐름

```
┌──────────────────────────────────────────────────────────────────┐
│                    Frontend Deployment Flow                       │
└──────────────────────────────────────────────────────────────────┘

Source Code (main branch)
         │
         ▼
    Git Push
         │
         ▼
┌─────────────────────┐
│  GitHub Actions     │
│  (deploy-react.yml) │
└──────────┬──────────┘
           │
           ├─────────────────────────────────────┐
           │                                     │
           ▼                                     ▼
┌──────────────────────┐            ┌──────────────────────┐
│   GitHub Pages       │            │       Vercel         │
│                      │            │                      │
│  Build Process:      │            │  Build Process:      │
│  1. npm install      │            │  1. Auto-detect      │
│  2. npm run build    │            │  2. Vite build       │
│  3. Deploy to        │            │  3. Edge deploy      │
│     gh-pages branch  │            │  4. CDN cache        │
│                      │            │                      │
│  URL:                │            │  URL:                │
│  kgyujin.github.io/  │            │  ksnu-portfolio.     │
│  ksnu-portfolio      │            │  vercel.app          │
└──────────────────────┘            └──────────────────────┘
           │                                     │
           └──────────────┬──────────────────────┘
                          │
                          ▼
                 ┌────────────────┐
                 │  Health Check  │
                 │  - HTTP 200    │
                 │  - Assets load │
                 └────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│                    Backend Deployment Flow                        │
└──────────────────────────────────────────────────────────────────┘

Docker Image (ghcr.io)
         │
         ▼
┌─────────────────────┐
│  Kubernetes Cluster │
└──────────┬──────────┘
           │
           ├─── kubectl apply -f k8s/namespace.yaml
           │
           ├─── kubectl apply -f k8s/mongodb-secret.yaml
           ├─── kubectl apply -f k8s/api-configmap.yaml
           │
           ├─── kubectl apply -f k8s/mongodb-pvc.yaml
           ├─── kubectl apply -f k8s/mongodb-deployment.yaml
           ├─── kubectl apply -f k8s/mongodb-service.yaml
           │
           ├─── kubectl apply -f k8s/api-deployment.yaml
           │    (pulls ghcr.io/kgyujin/ksnu-portfolio-api:latest)
           │
           ├─── kubectl apply -f k8s/api-service.yaml
           │    (LoadBalancer, exposes port 80)
           │
           ├─── kubectl apply -f k8s/api-hpa.yaml
           │    (Auto-scaling based on CPU/Memory)
           │
           └─── kubectl apply -f k8s/ingress.yaml
                (api.portfolio.example.com)
                          │
                          ▼
                 ┌────────────────┐
                 │  Rolling Update│
                 │  Strategy:     │
                 │  - maxSurge: 1 │
                 │  - maxUnavail:0│
                 └────────┬───────┘
                          │
                          ▼
                 ┌────────────────┐
                 │  Health Check  │
                 │  - Liveness    │
                 │  - Readiness   │
                 └────────────────┘
```

## 4. CI/CD 보안 & 품질 관리

```
┌──────────────────────────────────────────────────────────────────┐
│                     Security & Quality Gates                      │
└──────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  Stage 1: Code Quality Checks                                    │
├─────────────────────────────────────────────────────────────────┤
│  ✓ ESLint (JavaScript/React linting)                             │
│    - Code style enforcement                                      │
│    - Best practices validation                                   │
│    - No console.log in production                                │
│                                                                  │
│  ✓ Prettier (Code formatting)                                    │
│    - Consistent code style                                       │
│    - Auto-formatting                                             │
│                                                                  │
│  ✓ TypeScript Check (if applicable)                             │
│    - Type safety validation                                      │
│    - Compile-time error detection                                │
└─────────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│  Stage 2: Security Scanning                                      │
├─────────────────────────────────────────────────────────────────┤
│  ✓ Trivy (Container image scanning)                              │
│    - CVE vulnerability detection                                 │
│    - OS package vulnerabilities                                  │
│    - Application dependency vulnerabilities                      │
│    - Severity levels: CRITICAL, HIGH, MEDIUM, LOW                │
│                                                                  │
│  ✓ npm audit (Dependency check)                                 │
│    - Known security vulnerabilities                              │
│    - Outdated packages                                           │
│    - License compliance                                          │
│                                                                  │
│  ✓ SAST (Static Application Security Testing)                   │
│    - SQL injection detection                                     │
│    - XSS vulnerability detection                                 │
│    - Hardcoded secrets detection                                 │
└─────────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│  Stage 3: Testing Gates                                          │
├─────────────────────────────────────────────────────────────────┤
│  ✓ Unit Tests (Jest)                                             │
│    - Code coverage > 70%                                         │
│    - All critical paths tested                                   │
│                                                                  │
│  ✓ Integration Tests (Supertest)                                │
│    - API endpoint validation                                     │
│    - Database integration                                        │
│                                                                  │
│  ✓ E2E Tests (Playwright/Cypress)                               │
│    - User flow validation                                        │
│    - Cross-browser testing                                       │
│                                                                  │
│  ✓ Performance Tests                                             │
│    - Load time < 3s                                              │
│    - Lighthouse score > 90                                       │
└─────────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│  Stage 4: Deployment Validation                                  │
├─────────────────────────────────────────────────────────────────┤
│  ✓ Health Checks                                                 │
│    - /health endpoint returns 200                                │
│    - Database connection successful                              │
│    - All services running                                        │
│                                                                  │
│  ✓ Smoke Tests                                                   │
│    - Critical API endpoints accessible                           │
│    - Frontend loads correctly                                    │
│    - Static assets served                                        │
│                                                                  │
│  ✓ Rollback Capability                                           │
│    - Previous version tagged                                     │
│    - Quick rollback if deployment fails                          │
│    - Database migration reversibility                            │
└─────────────────────────────────────────────────────────────────┘
```

## 5. 모니터링 & 알림 시스템

```
┌──────────────────────────────────────────────────────────────────┐
│                   Monitoring & Alerting Pipeline                  │
└──────────────────────────────────────────────────────────────────┘

Production Environment
         │
         ├─── Application Metrics
         │    ├─ Response time
         │    ├─ Error rate
         │    ├─ Request count
         │    └─ Active users
         │
         ├─── Infrastructure Metrics
         │    ├─ CPU usage
         │    ├─ Memory usage
         │    ├─ Disk I/O
         │    └─ Network traffic
         │
         └─── Business Metrics
              ├─ User engagement
              ├─ TensorFlow predictions
              └─ Comment/Guestbook activity
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│              Metrics Collection & Aggregation                    │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐      │
│  │  Prometheus   │  │  CloudWatch   │  │  Datadog      │      │
│  │  (Metrics)    │  │  (AWS Logs)   │  │  (APM)        │      │
│  └───────┬───────┘  └───────┬───────┘  └───────┬───────┘      │
└──────────┼──────────────────┼──────────────────┼───────────────┘
           │                  │                  │
           └──────────────────┼──────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Alert Rules Engine                          │
├─────────────────────────────────────────────────────────────────┤
│  Conditions:                                                     │
│  - CPU > 80% for 5 minutes        → Warning                     │
│  - Memory > 90% for 3 minutes     → Critical                    │
│  - Error rate > 5%                → Critical                    │
│  - Response time > 2s             → Warning                     │
│  - Pod restarts > 3               → Critical                    │
│  - Deployment failed              → Critical                    │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Notification Channels                         │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │    Slack     │  │    Email     │  │   PagerDuty  │         │
│  │  (Instant)   │  │  (Report)    │  │  (On-call)   │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                  │
│  Message Format:                                                 │
│  [CRITICAL] API Service Down                                     │
│  - Service: portfolio-api                                        │
│  - Namespace: portfolio                                          │
│  - Time: 2025-12-05 10:30:00 UTC                                │
│  - Details: Health check failed (timeout)                       │
│  - Action: Auto-rollback initiated                              │
└─────────────────────────────────────────────────────────────────┘
```

## 6. 환경별 배포 전략

```
┌──────────────────────────────────────────────────────────────────┐
│                   Multi-Environment Strategy                      │
└──────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  Development Environment                                         │
│  ├─ Branch: develop                                              │
│  ├─ Auto-deploy: Yes (on push)                                   │
│  ├─ URL: https://dev.ksnu-portfolio.vercel.app                  │
│  ├─ Database: MongoDB Dev Instance                               │
│  └─ Features: Debug mode, Hot reload, Verbose logging           │
└─────────────────────────────────────────────────────────────────┘
                            │
                            ▼ (merge PR)
┌─────────────────────────────────────────────────────────────────┐
│  Staging Environment                                             │
│  ├─ Branch: staging                                              │
│  ├─ Auto-deploy: Yes (after tests pass)                         │
│  ├─ URL: https://staging.ksnu-portfolio.vercel.app             │
│  ├─ Database: MongoDB Staging (production-like data)            │
│  └─ Features: Production build, E2E tests, Load tests           │
└─────────────────────────────────────────────────────────────────┘
                            │
                            ▼ (manual approval)
┌─────────────────────────────────────────────────────────────────┐
│  Production Environment                                          │
│  ├─ Branch: main                                                 │
│  ├─ Auto-deploy: Manual approval required                       │
│  ├─ URL: https://ksnu-portfolio.vercel.app                      │
│  │       https://kgyujin.github.io/ksnu-portfolio               │
│  ├─ Database: MongoDB Production (replicated)                   │
│  ├─ Kubernetes: 3 replicas, HPA enabled                         │
│  └─ Features: Monitoring, Alerting, Auto-rollback               │
└─────────────────────────────────────────────────────────────────┘
```

## 7. 성능 최적화

```
┌──────────────────────────────────────────────────────────────────┐
│                    Build Optimization Pipeline                    │
└──────────────────────────────────────────────────────────────────┘

Source Code
     │
     ├─── Code Splitting (Vite)
     │    └─ Dynamic imports for routes
     │
     ├─── Tree Shaking
     │    └─ Remove unused code
     │
     ├─── Minification
     │    └─ Terser (JS), cssnano (CSS)
     │
     ├─── Asset Optimization
     │    ├─ Image compression (WebP, AVIF)
     │    ├─ SVG optimization
     │    └─ Font subsetting
     │
     ├─── Caching Strategy
     │    ├─ Docker layer caching
     │    ├─ npm dependency cache
     │    └─ Build artifact cache
     │
     └─── CDN Distribution
          ├─ Cloudflare (GitHub Pages)
          ├─ Vercel Edge Network
          └─ Static asset caching (1 year)
                    │
                    ▼
          Production Bundle
          ├─ Main bundle: ~150KB (gzipped)
          ├─ Vendor bundle: ~200KB (gzipped)
          ├─ TensorFlow.js: ~500KB (lazy load)
          └─ Total initial load: ~350KB
```

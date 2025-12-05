# 포트폴리오 프로젝트 아키텍처 문서

## 목차
1. [시스템 아키텍처](#시스템-아키텍처)
2. [데이터베이스 설계 (ERD)](#데이터베이스-설계-erd)
3. [기술 스택](#기술-스택)
4. [API 설계](#api-설계)
5. [배포 아키텍처](#배포-아키텍처)

---

## 시스템 아키텍처

### 전체 시스템 구조

```mermaid
graph TB
    subgraph "클라이언트 계층"
        A[웹 브라우저]
        A1[TensorFlow.js<br/>클라이언트 ML]
    end
    
    subgraph "프론트엔드 (GitHub Pages)"
        B[정적 HTML/CSS/JS]
        B1[Component Loader]
        B2[API Client]
        B3[AI Manager]
        B4[Animation Manager]
        B5[Project Manager]
        B6[Comment Manager]
    end
    
    subgraph "백엔드 (Railway)"
        C[Node.js + Express]
        C1[Routes]
        C2[Controllers]
        C3[Models]
        C4[Middleware]
    end
    
    subgraph "데이터베이스"
        D[(MongoDB Atlas)]
        D1[Comments Collection]
        D2[Stats Collection]
    end
    
    subgraph "CI/CD Pipeline"
        E[GitHub Actions]
        E1[테스트 자동화]
        E2[Docker 빌드]
        E3[K8s 배포]
    end
    
    subgraph "컨테이너 오케스트레이션"
        F[Kubernetes]
        F1[API Pods]
        F2[MongoDB StatefulSet]
        F3[LoadBalancer]
        F4[HPA]
    end
    
    A --> A1
    A --> B
    B --> B1
    B --> B2
    B --> B3
    B1 --> B4
    B1 --> B5
    B1 --> B6
    B2 --> C
    B3 --> A1
    
    C --> C1
    C1 --> C2
    C2 --> C3
    C3 --> D
    C --> C4
    
    D --> D1
    D --> D2
    
    E --> E1
    E --> E2
    E --> E3
    E2 --> F
    
    F --> F1
    F --> F2
    F --> F3
    F --> F4
    
    style A fill:#4CAF50,color:#fff
    style B fill:#2196F3,color:#fff
    style C fill:#FF9800,color:#fff
    style D fill:#9C27B0,color:#fff
    style E fill:#F44336,color:#fff
    style F fill:#00BCD4,color:#fff
```

### 프론트엔드 아키텍처

```mermaid
graph LR
    subgraph "HTML Components"
        H1[header.html]
        H2[about.html]
        H3[introduce.html]
        H4[skills.html]
        H5[projects.html]
        H6[comments.html]
        H7[footer.html]
    end
    
    subgraph "CSS Modules"
        C1[base.css]
        C2[header.css]
        C3[about.css]
        C4[introduce.css]
        C5[skills.css]
        C6[projects.css]
        C7[comments.css]
        C8[footer.css]
        C9[responsive.css]
    end
    
    subgraph "JavaScript Modules"
        J1[componentLoader.js]
        J2[main.js]
        J3[api.js]
        J4[ai.js]
        J5[animation.js]
        J6[projects.js]
        J7[comments.js]
        J8[skills.js]
        J9[ui.js]
    end
    
    H1 --> C2
    H2 --> C3
    H3 --> C4
    H4 --> C5
    H5 --> C6
    H6 --> C7
    H7 --> C8
    
    J1 --> H1
    J1 --> H2
    J1 --> H3
    J1 --> H4
    J1 --> H5
    J1 --> H6
    J1 --> H7
    
    J2 --> J3
    J2 --> J4
    J2 --> J5
    J2 --> J6
    J2 --> J7
    J2 --> J8
    J2 --> J9
    
    style J1 fill:#4CAF50,color:#fff
    style J2 fill:#2196F3,color:#fff
```

### 백엔드 아키텍처

```mermaid
graph TB
    subgraph "Express Server"
        A[server.js]
    end
    
    subgraph "Middleware Layer"
        M1[CORS]
        M2[Helmet]
        M3[Rate Limiter]
        M4[Morgan Logger]
        M5[Error Handler]
    end
    
    subgraph "Routes"
        R1[/api/comments]
        R2[/api/guestbook]
        R3[/api/projects]
        R4[/api/skills]
        R5[/api/stats]
    end
    
    subgraph "Controllers"
        CT1[Comment Controller]
        CT2[Guestbook Controller]
        CT3[Project Controller]
        CT4[Skill Controller]
        CT5[Stats Controller]
    end
    
    subgraph "Models"
        MD1[Comment Model]
        MD2[Validation]
    end
    
    subgraph "Database"
        DB[(MongoDB Atlas)]
    end
    
    A --> M1
    M1 --> M2
    M2 --> M3
    M3 --> M4
    M4 --> R1
    M4 --> R2
    M4 --> R3
    M4 --> R4
    M4 --> R5
    
    R1 --> CT1
    R2 --> CT2
    R3 --> CT3
    R4 --> CT4
    R5 --> CT5
    
    CT1 --> MD1
    CT2 --> MD1
    
    MD1 --> DB
    
    M5 -.오류 처리.-> CT1
    M5 -.오류 처리.-> CT2
    
    style A fill:#FF5722,color:#fff
    style DB fill:#4CAF50,color:#fff
```

---

## 데이터베이스 설계 (ERD)

### MongoDB Collections

```mermaid
erDiagram
    COMMENTS {
        ObjectId _id PK
        String writer
        String password
        String message
        Date createdAt
        Date updatedAt
    }
    
    STATS {
        ObjectId _id PK
        String type
        Number count
        Date timestamp
        String userAgent
        String ipHash
    }
    
    PROJECTS {
        ObjectId _id PK
        String title
        String description
        Array tags
        String thumbnail
        String demoUrl
        String githubUrl
        Date startDate
        Date endDate
        Boolean featured
    }
    
    SKILLS {
        ObjectId _id PK
        String name
        String category
        String icon
        Number proficiency
        Array relatedProjects
    }
    
    COMMENTS ||--o{ STATS : "generates"
    PROJECTS ||--o{ SKILLS : "uses"
```

### Comment 스키마 상세

```javascript
{
  _id: ObjectId,
  writer: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 20,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 4,
    select: false  // 조회 시 제외
  },
  message: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 500,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}
```

### Stats 스키마 상세

```javascript
{
  _id: ObjectId,
  type: {
    type: String,
    enum: ['visit', 'click', 'comment', 'project_view'],
    required: true
  },
  count: {
    type: Number,
    default: 1
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  userAgent: String,
  ipHash: String,
  metadata: {
    type: Map,
    of: Schema.Types.Mixed
  }
}
```

---

## 기술 스택

### 프론트엔드
- **HTML5**: 시맨틱 마크업
- **CSS3**: Flexbox, Grid, Animations
- **JavaScript (ES6+)**: Modules, Async/Await
- **TensorFlow.js 4.15.0**: 클라이언트 측 ML
- **jQuery 3.6.0**: DOM 조작
- **GSAP 3.9.1**: 애니메이션
- **BOM/DOM API**: 브라우저 상호작용

### 백엔드
- **Node.js 18+**: JavaScript 런타임
- **Express 4.18**: 웹 프레임워크
- **MongoDB 8.0**: NoSQL 데이터베이스
- **Mongoose 8.0**: ODM
- **Joi**: 입력 검증
- **Helmet**: 보안 헤더
- **CORS**: Cross-Origin 설정
- **Morgan**: HTTP 로깅

### DevOps & 배포
- **Docker**: 컨테이너화
- **Kubernetes**: 오케스트레이션
- **GitHub Actions**: CI/CD
- **Railway**: PaaS 배포
- **GitHub Pages**: 정적 호스팅
- **MongoDB Atlas**: 클라우드 DB

### 테스트
- **Jest 29.7**: 테스트 프레임워크
- **Supertest 6.3**: HTTP 테스트
- **Coverage**: 70% 이상

---

## API 설계

### REST API 엔드포인트

```mermaid
sequenceDiagram
    participant C as Client
    participant API as Express API
    participant DB as MongoDB
    
    Note over C,DB: 댓글 작성 플로우
    C->>API: POST /api/comments
    API->>API: 입력 검증 (Joi)
    API->>DB: Comment.create()
    DB-->>API: 생성된 댓글
    API-->>C: 201 Created
    
    Note over C,DB: 댓글 조회 플로우
    C->>API: GET /api/comments
    API->>DB: Comment.find()
    DB-->>API: 댓글 목록
    API->>API: 비밀번호 제외
    API-->>C: 200 OK
    
    Note over C,DB: 댓글 수정 플로우
    C->>API: PUT /api/comments/:id
    API->>DB: Comment.findById()
    DB-->>API: 댓글 찾기
    API->>API: 비밀번호 검증
    alt 비밀번호 일치
        API->>DB: Comment.updateOne()
        DB-->>API: 업데이트 완료
        API-->>C: 200 OK
    else 비밀번호 불일치
        API-->>C: 401 Unauthorized
    end
    
    Note over C,DB: 댓글 삭제 플로우
    C->>API: DELETE /api/comments/:id
    API->>DB: Comment.findById()
    DB-->>API: 댓글 찾기
    API->>API: 비밀번호 검증
    alt 비밀번호 일치
        API->>DB: Comment.deleteOne()
        DB-->>API: 삭제 완료
        API-->>C: 200 OK
    else 비밀번호 불일치
        API-->>C: 401 Unauthorized
    end
```

### API 명세

#### 1. 댓글 작성
```http
POST /api/comments
Content-Type: application/json

{
  "writer": "김규진",
  "password": "1234",
  "message": "좋은 포트폴리오네요!"
}

Response: 201 Created
{
  "success": true,
  "data": {
    "_id": "...",
    "writer": "김규진",
    "message": "좋은 포트폴리오네요!",
    "createdAt": "2025-12-02T12:00:00Z"
  }
}
```

#### 2. 댓글 조회
```http
GET /api/comments

Response: 200 OK
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "writer": "김규진",
      "message": "좋은 포트폴리오네요!",
      "createdAt": "2025-12-02T12:00:00Z"
    }
  ]
}
```

#### 3. 댓글 수정
```http
PUT /api/comments/:id
Content-Type: application/json

{
  "password": "1234",
  "message": "수정된 메시지"
}

Response: 200 OK
{
  "success": true,
  "data": {
    "_id": "...",
    "message": "수정된 메시지",
    "updatedAt": "2025-12-02T12:10:00Z"
  }
}
```

#### 4. 댓글 삭제
```http
DELETE /api/comments/:id
Content-Type: application/json

{
  "password": "1234"
}

Response: 200 OK
{
  "success": true,
  "message": "댓글이 삭제되었습니다."
}
```

#### 5. 방문 통계 기록
```http
POST /api/stats/visit

Response: 200 OK
{
  "success": true,
  "message": "방문 기록 완료"
}
```

---

## 배포 아키텍처

### GitHub Pages + Railway 하이브리드 배포

```mermaid
graph TB
    subgraph "개발 환경"
        DEV[로컬 개발]
    end
    
    subgraph "버전 관리"
        GIT[GitHub Repository]
    end
    
    subgraph "CI/CD Pipeline"
        GHA[GitHub Actions]
        TEST[Jest 테스트]
        BUILD[Docker 빌드]
        PUSH[이미지 푸시]
    end
    
    subgraph "프론트엔드 배포"
        GHP[GitHub Pages]
        CDN[Cloudflare CDN]
    end
    
    subgraph "백엔드 배포 (Railway)"
        RAIL[Railway Platform]
        API[Express API]
        DB[(MongoDB Atlas)]
    end
    
    subgraph "Kubernetes 배포 (옵션)"
        K8S[Kubernetes Cluster]
        PODS[API Pods]
        MONGO[MongoDB StatefulSet]
        LB[LoadBalancer]
    end
    
    DEV -->|git push| GIT
    GIT -->|trigger| GHA
    GHA --> TEST
    TEST -->|success| BUILD
    BUILD --> PUSH
    
    PUSH -->|deploy| GHP
    PUSH -->|deploy| RAIL
    PUSH -->|deploy| K8S
    
    GHP --> CDN
    RAIL --> API
    API --> DB
    
    K8S --> PODS
    K8S --> MONGO
    K8S --> LB
    
    style GHA fill:#2088FF,color:#fff
    style GHP fill:#4CAF50,color:#fff
    style RAIL fill:#8B5CF6,color:#fff
    style K8S fill:#326CE5,color:#fff
```

### Docker 컨테이너 구조

```mermaid
graph LR
    subgraph "Docker Compose"
        API[API Container<br/>Node.js 18-alpine]
        MONGO[MongoDB Container<br/>mongo:8.0]
    end
    
    subgraph "볼륨"
        VOL1[mongodb-data]
    end
    
    subgraph "네트워크"
        NET[portfolio-network]
    end
    
    API -->|연결| MONGO
    MONGO -->|마운트| VOL1
    API -.속함.-> NET
    MONGO -.속함.-> NET
    
    style API fill:#68A063,color:#fff
    style MONGO fill:#4DB33D,color:#fff
```

### Kubernetes 배포 구조

```mermaid
graph TB
    subgraph "Ingress Layer"
        ING[Nginx Ingress<br/>api.portfolio.com]
    end
    
    subgraph "Service Layer"
        SVC1[portfolio-api-service<br/>LoadBalancer]
        SVC2[mongodb-service<br/>ClusterIP]
    end
    
    subgraph "Pod Layer"
        POD1[API Pod 1]
        POD2[API Pod 2]
        POD3[MongoDB Pod]
    end
    
    subgraph "Storage Layer"
        PVC[PersistentVolumeClaim<br/>5Gi]
        PV[PersistentVolume]
    end
    
    subgraph "Config Layer"
        CM[ConfigMap<br/>환경변수]
        SEC[Secret<br/>비밀정보]
    end
    
    subgraph "Autoscaling"
        HPA[HorizontalPodAutoscaler<br/>2~10 pods]
    end
    
    ING --> SVC1
    SVC1 --> POD1
    SVC1 --> POD2
    POD1 --> SVC2
    POD2 --> SVC2
    SVC2 --> POD3
    POD3 --> PVC
    PVC --> PV
    
    CM -.config.-> POD1
    CM -.config.-> POD2
    SEC -.secret.-> POD1
    SEC -.secret.-> POD2
    
    HPA -.scale.-> POD1
    HPA -.scale.-> POD2
    
    style ING fill:#009688,color:#fff
    style SVC1 fill:#2196F3,color:#fff
    style HPA fill:#FF9800,color:#fff
```

---

## 성능 최적화

### 프론트엔드 최적화
- ✅ 컴포넌트 동적 로딩
- ✅ CSS/JS 파일 분리 (캐싱 최적화)
- ✅ GSAP를 통한 하드웨어 가속 애니메이션
- ✅ Lazy Loading (이미지, 프로젝트)
- ✅ 클라이언트 사이드 ML (TensorFlow.js)

### 백엔드 최적화
- ✅ MongoDB 인덱싱 (createdAt)
- ✅ Rate Limiting (DDoS 방지)
- ✅ CORS 정책
- ✅ Helmet 보안 헤더
- ✅ 비밀번호 선택적 조회 (`select: false`)

### 배포 최적화
- ✅ Docker 멀티 스테이지 빌드
- ✅ Alpine Linux (경량 이미지)
- ✅ Kubernetes HPA (자동 스케일링)
- ✅ LoadBalancer (트래픽 분산)
- ✅ PersistentVolume (데이터 영속성)

---

## 보안

### 구현된 보안 기능
1. **Helmet**: HTTP 보안 헤더 자동 설정
2. **CORS**: 특정 도메인만 API 접근 허용
3. **Rate Limiting**: IP별 요청 제한
4. **입력 검증**: Joi를 통한 엄격한 검증
5. **비밀번호 보호**: `select: false`로 조회 차단
6. **XSS 방어**: 입력 sanitization
7. **Kubernetes Secret**: 민감 정보 암호화
8. **HTTPS**: TLS/SSL 인증서 적용 가능

---

## 모니터링 & 로깅

### 로깅
- **Morgan**: HTTP 요청 로깅
- **Console**: 개발 환경 디버깅
- **Kubernetes Logs**: `kubectl logs`로 추적

### 헬스체크
```javascript
// 서버 상태 확인
GET /health

Response:
{
  "status": "ok",
  "timestamp": "2025-12-02T12:00:00Z",
  "uptime": 3600,
  "database": "connected"
}
```

---

## 확장 가능성

### 향후 개선 사항
- [ ] Redis 캐싱 레이어 추가
- [ ] WebSocket 실시간 댓글
- [ ] Elasticsearch 전문 검색
- [ ] Prometheus + Grafana 모니터링
- [ ] ELK Stack 로그 분석
- [ ] CDN 통합 (Cloudflare)
- [ ] PWA 전환
- [ ] GraphQL API

---

## 참고 자료
- [Express.js 공식 문서](https://expressjs.com/)
- [MongoDB 공식 문서](https://www.mongodb.com/docs/)
- [Kubernetes 공식 문서](https://kubernetes.io/docs/)
- [TensorFlow.js 가이드](https://www.tensorflow.org/js)
- [GitHub Actions 문서](https://docs.github.com/actions)
- [Docker 베스트 프랙티스](https://docs.docker.com/develop/dev-best-practices/)

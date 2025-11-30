# TensorFlow.js 연동 아키텍처

## 시스템 아키텍처 다이어그램

```mermaid
graph TB
    subgraph "Frontend Layer"
        A[index.html] --> B[TensorFlow.js CDN]
        A --> C[main.js]
    end
    
    subgraph "AI Module"
        C --> D[AIManager]
        D --> E[Model Creation]
        D --> F[Behavior Tracking]
        D --> G[Recommendation System]
        D --> H[Sentiment Analysis]
    end
    
    subgraph "TensorFlow.js Core"
        E --> I[Sequential Model]
        I --> J[Dense Layer 16 units]
        J --> K[Dense Layer 8 units]
        K --> L[Dense Layer 1 unit]
        L --> M[Prediction Output]
    end
    
    subgraph "Data Flow"
        N[User Actions] --> F
        F --> O[Behavior Vector]
        O --> I
        M --> P[Interest Score]
        P --> Q[Recommendations]
        P --> R[UI Enhancements]
    end
    
    style D fill:#4CAF50,stroke:#333,stroke-width:2px,color:#fff
    style I fill:#FF6F00,stroke:#333,stroke-width:2px,color:#fff
    style M fill:#2196F3,stroke:#333,stroke-width:2px,color:#fff
```

## 데이터 흐름 다이어그램

```mermaid
sequenceDiagram
    participant User
    participant Browser
    participant AIManager
    participant TFModel
    participant UI
    
    User->>Browser: 페이지 방문
    Browser->>AIManager: init() 호출
    AIManager->>TFModel: 모델 생성 및 컴파일
    TFModel-->>AIManager: 모델 준비 완료
    
    loop 사용자 행동 추적
        User->>Browser: 스크롤/클릭/호버
        Browser->>AIManager: recordBehavior()
        AIManager->>AIManager: createBehaviorVector()
        AIManager->>TFModel: predict(behaviorVector)
        TFModel-->>AIManager: interestScore
        
        alt 높은 관심도 (>0.7)
            AIManager->>UI: showRecommendations()
            UI-->>User: 추천 콘텐츠 표시
        else 낮은 관심도 (<0.3)
            AIManager->>UI: highlightInteractiveElements()
            UI-->>User: 인터랙티브 요소 강조
        end
    end
```

## 신경망 모델 구조

```mermaid
graph LR
    subgraph "Input Layer"
        I1[Scroll Depth]
        I2[Click Count]
        I3[Time Spent]
        I4[Hover Count]
        I5[Interaction Count]
    end
    
    subgraph "Hidden Layer 1"
        H1[Neuron 1-16]
    end
    
    subgraph "Hidden Layer 2"
        H2[Neuron 1-8]
    end
    
    subgraph "Output Layer"
        O[Interest Score<br/>0-1]
    end
    
    I1 --> H1
    I2 --> H1
    I3 --> H1
    I4 --> H1
    I5 --> H1
    
    H1 --> H2
    H2 --> O
    
    style I1 fill:#E3F2FD,stroke:#1976D2
    style I2 fill:#E3F2FD,stroke:#1976D2
    style I3 fill:#E3F2FD,stroke:#1976D2
    style I4 fill:#E3F2FD,stroke:#1976D2
    style I5 fill:#E3F2FD,stroke:#1976D2
    style H1 fill:#FFF3E0,stroke:#F57C00
    style H2 fill:#FFF3E0,stroke:#F57C00
    style O fill:#E8F5E9,stroke:#388E3C
```

## 기능 모듈 구조

```mermaid
graph TD
    A[AIManager] --> B[Behavior Tracking]
    A --> C[Prediction Model]
    A --> D[Recommendation System]
    A --> E[Sentiment Analysis]
    
    B --> B1[Scroll Tracking]
    B --> B2[Click Tracking]
    B --> B3[Hover Tracking]
    B --> B4[Section View Tracking]
    
    C --> C1[Model Creation]
    C --> C2[Training]
    C --> C3[Prediction]
    
    D --> D1[Calculate Similarity]
    D --> D2[Generate Recommendations]
    D --> D3[Show Content]
    
    E --> E1[Text Analysis]
    E --> E2[Sentiment Score]
    E --> E3[Classification]
    
    style A fill:#673AB7,stroke:#333,stroke-width:3px,color:#fff
    style B fill:#4CAF50,stroke:#333,stroke-width:2px,color:#fff
    style C fill:#FF5722,stroke:#333,stroke-width:2px,color:#fff
    style D fill:#2196F3,stroke:#333,stroke-width:2px,color:#fff
    style E fill:#FFC107,stroke:#333,stroke-width:2px,color:#000
```

## 사용자 행동 분석 프로세스

```mermaid
flowchart TD
    Start([사용자 접속]) --> Init[AI 모듈 초기화]
    Init --> LoadModel[TensorFlow.js 모델 로드]
    LoadModel --> StartTracking[행동 추적 시작]
    
    StartTracking --> CollectData{데이터 수집}
    CollectData -->|스크롤| Scroll[스크롤 깊이 기록]
    CollectData -->|클릭| Click[클릭 횟수 기록]
    CollectData -->|호버| Hover[호버 이벤트 기록]
    CollectData -->|시간| Time[체류 시간 기록]
    
    Scroll --> CreateVector[행동 벡터 생성]
    Click --> CreateVector
    Hover --> CreateVector
    Time --> CreateVector
    
    CreateVector --> CheckData{데이터 충분?}
    CheckData -->|No| CollectData
    CheckData -->|Yes| Predict[관심도 예측]
    
    Predict --> CheckScore{관심도 점수}
    CheckScore -->|High >0.7| Recommend[추천 콘텐츠 제공]
    CheckScore -->|Low <0.3| Highlight[요소 강조]
    CheckScore -->|Medium| Continue[계속 추적]
    
    Recommend --> CollectData
    Highlight --> CollectData
    Continue --> CollectData
    
    style Start fill:#4CAF50,color:#fff
    style LoadModel fill:#FF9800,color:#fff
    style Predict fill:#F44336,color:#fff
    style Recommend fill:#2196F3,color:#fff
    style Highlight fill:#9C27B0,color:#fff
```

## 프로젝트 추천 알고리즘

```mermaid
flowchart LR
    subgraph "입력 데이터"
        A[사용자 행동 패턴]
        B[프로젝트 메타데이터]
        C[과거 상호작용]
    end
    
    subgraph "유사도 계산"
        D[코사인 유사도]
        E[벡터 거리 계산]
    end
    
    subgraph "추천 생성"
        F[상위 N개 선택]
        G[관심도 가중치 적용]
    end
    
    subgraph "출력"
        H[추천 프로젝트 목록]
    end
    
    A --> D
    B --> D
    C --> E
    
    D --> F
    E --> G
    
    F --> H
    G --> H
    
    style D fill:#E91E63,color:#fff
    style E fill:#E91E63,color:#fff
    style H fill:#4CAF50,color:#fff
```

## 실시간 감성 분석 파이프라인

```mermaid
graph LR
    A[댓글 입력] --> B[텍스트 전처리]
    B --> C[형태소 분석]
    C --> D[감성 사전 매칭]
    D --> E[감성 점수 계산]
    E --> F{분류}
    
    F -->|Score > 0.6| G[긍정 😊]
    F -->|Score < 0.4| H[부정 😟]
    F -->|0.4 ≤ Score ≤ 0.6| I[중립 😐]
    
    G --> J[통계 업데이트]
    H --> J
    I --> J
    
    J --> K[피드백 제공]
    
    style A fill:#2196F3,color:#fff
    style E fill:#FF9800,color:#fff
    style G fill:#4CAF50,color:#fff
    style H fill:#F44336,color:#fff
    style I fill:#9E9E9E,color:#fff
    style K fill:#673AB7,color:#fff
```

## 시스템 통합 아키텍처

```mermaid
C4Context
    title System Context - TensorFlow.js 포트폴리오 통합

    Person(user, "사용자", "포트폴리오 방문자")
    
    System(portfolio, "포트폴리오 웹사이트", "GitHub Pages에 호스팅된<br/>정적 웹사이트")
    
    System_Ext(tfjs, "TensorFlow.js", "클라이언트 측<br/>머신러닝 라이브러리")
    
    System_Ext(railway, "Railway API", "백엔드 API 서버<br/>(Node.js + MongoDB)")
    
    System_Ext(cdn, "CDN", "정적 리소스 제공")
    
    Rel(user, portfolio, "방문, 상호작용")
    Rel(portfolio, tfjs, "사용")
    Rel(portfolio, railway, "API 호출")
    Rel(portfolio, cdn, "리소스 로드")
    
    UpdateLayoutConfig($c4ShapeInRow="2", $c4BoundaryInRow="1")
```

## 성능 최적화 전략

```mermaid
mindmap
  root((TensorFlow.js<br/>최적화))
    모델 최적화
      경량화 모델 사용
      레이어 수 최소화
      배치 크기 조정
    메모리 관리
      텐서 dispose
      주기적 cleanup
      메모리 모니터링
    비동기 처리
      Web Workers 활용
      async/await 사용
      백그라운드 실행
    캐싱 전략
      모델 로컬 저장
      예측 결과 캐시
      IndexedDB 활용
```

## 배포 및 모니터링

```mermaid
gitGraph
    commit id: "초기 프로젝트"
    commit id: "기본 기능 구현"
    branch feature/tensorflow
    checkout feature/tensorflow
    commit id: "TensorFlow.js 추가"
    commit id: "AI 모듈 개발"
    commit id: "행동 추적 구현"
    commit id: "추천 시스템 구현"
    checkout main
    merge feature/tensorflow tag: "v2.0-AI"
    commit id: "성능 최적화"
    commit id: "프로덕션 배포"
```

---

## 주요 특징

### 1. 실시간 사용자 행동 분석
- 스크롤 깊이, 클릭, 호버 등 5가지 행동 패턴 추적
- 5초마다 데이터 수집 및 분석
- 관심도 점수 실시간 예측

### 2. 지능형 추천 시스템
- 프로젝트 간 유사도 계산
- 사용자 행동 기반 맞춤형 추천
- 관심도에 따른 동적 UI 조정

### 3. 감성 분석
- 댓글 텍스트의 감성 분류
- 긍정/부정/중립 판별
- 실시간 피드백 제공

### 4. 경량화된 신경망
- Sequential 모델 (3개 레이어)
- 총 파라미터: 약 200개
- 브라우저에서 즉시 실행 가능

---

## 기술 스택

- **TensorFlow.js 4.15.0**: 클라이언트 측 머신러닝
- **Sequential Model**: 간단하고 효율적인 신경망
- **ReLU Activation**: 은닉층 활성화 함수
- **Sigmoid Activation**: 출력층 (0~1 확률)
- **Adam Optimizer**: 최적화 알고리즘
- **Binary Crossentropy**: 손실 함수

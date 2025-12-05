# TensorFlow.js 동작 흐름도

## 1. TensorFlow.js 전체 아키텍처

```
┌──────────────────────────────────────────────────────────────────┐
│                   TensorFlow.js Architecture                      │
└──────────────────────────────────────────────────────────────────┘

Browser Environment
         │
         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Frontend Application                          │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │                   App.jsx (Entry Point)                    │ │
│  │  ┌─────────────────────────────────────────────────────┐  │ │
│  │  │  const { isModelLoaded, interestScore,              │  │ │
│  │  │         projectInterests, topProject }              │  │ │
│  │  │       = useTensorFlow();                            │  │ │
│  │  └───────────────────────┬─────────────────────────────┘  │ │
│  └──────────────────────────┼────────────────────────────────┘ │
│                             │                                   │
│  ┌──────────────────────────▼────────────────────────────────┐ │
│  │            useTensorFlow.js (Custom Hook)                 │ │
│  │  ┌────────────────────────────────────────────────────┐  │ │
│  │  │  State Management                                   │  │ │
│  │  │  - model: TensorFlow Sequential Model               │  │ │
│  │  │  - isModelLoaded: boolean                           │  │ │
│  │  │  - interestScore: 0-1 (starts at 0.1)               │  │ │
│  │  │  - projectInterests: Object<string, number>         │  │ │
│  │  │  - topProject: string                               │  │ │
│  │  └────────────────────────────────────────────────────┘  │ │
│  │                             │                              │ │
│  │  ┌──────────────────────────▼──────────────────────────┐  │ │
│  │  │  Refs (Persistent Data)                             │  │ │
│  │  │  - behaviorData: Array<BehaviorVector>              │  │ │
│  │  │  - projectInteractions: Object<string, Interaction> │  │ │
│  │  │  - lastUpdateTime: timestamp                        │  │ │
│  │  │  - lastActivityTime: timestamp                      │  │ │
│  │  └─────────────────────────────────────────────────────┘  │ │
│  └──────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                             │
         ┌───────────────────┼───────────────────┐
         │                   │                   │
         ▼                   ▼                   ▼
┌────────────────┐  ┌────────────────┐  ┌────────────────┐
│ Model Init     │  │ Behavior Track │  │ Analysis       │
│ (initModel)    │  │ (startTracking)│  │ (analyzeBehavior)│
└────────────────┘  └────────────────┘  └────────────────┘
```

## 2. 모델 초기화 흐름

```
┌──────────────────────────────────────────────────────────────────┐
│                  initializeModel() Function                       │
└──────────────────────────────────────────────────────────────────┘

useEffect(() => { initializeModel(); }, [])
         │
         ▼
┌─────────────────────────────────────────────────────────────────┐
│  Step 1: Set Backend to CPU                                      │
├─────────────────────────────────────────────────────────────────┤
│  await tf.setBackend('cpu');                                     │
│  - Avoid localStorage errors                                     │
│  - Ensure compatibility                                          │
│  - Log: "Backend skip" if already set                            │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│  Step 2: Create Sequential Model                                 │
├─────────────────────────────────────────────────────────────────┤
│  const model = tf.sequential({                                   │
│    layers: [                                                     │
│      tf.layers.dense({                                           │
│        inputShape: [9],     // 9 input features                 │
│        units: 32,            // First hidden layer               │
│        activation: 'relu'                                        │
│      }),                                                         │
│      tf.layers.dropout({ rate: 0.2 }),  // Prevent overfitting  │
│      tf.layers.dense({                                           │
│        units: 16,            // Second hidden layer              │
│        activation: 'relu'                                        │
│      }),                                                         │
│      tf.layers.dropout({ rate: 0.1 }),                          │
│      tf.layers.dense({                                           │
│        units: 8,             // Third hidden layer               │
│        activation: 'relu'                                        │
│      }),                                                         │
│      tf.layers.dense({                                           │
│        units: 1,             // Output layer                     │
│        activation: 'sigmoid' // 0-1 probability                 │
│      })                                                          │
│    ]                                                             │
│  });                                                             │
│                                                                  │
│  Architecture: 9 → 32 → 16 → 8 → 1                              │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│  Step 3: Compile Model                                           │
├─────────────────────────────────────────────────────────────────┤
│  model.compile({                                                 │
│    optimizer: tf.train.adam(0.001),  // Adam optimizer           │
│    loss: 'binaryCrossentropy',       // Binary classification    │
│    metrics: ['accuracy']                                         │
│  });                                                             │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│  Step 4: Set Model & State                                       │
├─────────────────────────────────────────────────────────────────┤
│  setModel(model);                                                │
│  setIsModelLoaded(true);                                         │
│  console.log('Model loaded: 9-feature NN (32-16-8-1)');         │
│  model.summary();  // Print model architecture                   │
└─────────────────────────────────────────────────────────────────┘
```

## 3. 행동 추적 시스템

```
┌──────────────────────────────────────────────────────────────────┐
│              startBehaviorTracking() Function                     │
└──────────────────────────────────────────────────────────────────┘

                     User Interactions
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   Scroll     │  │    Click     │  │   Hover      │
│   Event      │  │    Event     │  │   Event      │
└──────┬───────┘  └──────┬───────┘  └──────┬───────┘
       │                 │                 │
       ▼                 ▼                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                  Event Handler Functions                         │
├─────────────────────────────────────────────────────────────────┤
│  handleScroll()                                                  │
│  ├── Calculate scroll depth (0-1)                               │
│  ├── Detect scroll movement (>50px)                             │
│  ├── Update lastActivityTime                                    │
│  ├── Set isIdle = false                                         │
│  └── Log: "Activity resumed"                                    │
│                                                                  │
│  handleClick(e)                                                  │
│  ├── Base: clickCount++                                         │
│  ├── Update lastActivityTime                                    │
│  ├── Set isIdle = false                                         │
│  ├── Comment button: clickCount += 3                            │
│  │   └── Log: "Comment interaction -> Interest UP UP UP"       │
│  ├── Comment input: clickCount += 2                             │
│  │   └── Log: "Comment input started -> Interest UP UP"        │
│  ├── Project element: clickCount += 1                           │
│  │   ├── Track project clicks                                   │
│  │   └── Log: "Project clicked: {title} -> Interest UP"        │
│  └── Link element: clickCount += 2                              │
│      └── Log: "Link clicked -> Interest UP UP"                  │
│                                                                  │
│  handleMouseOver(e)                                              │
│  ├── Update lastActivityTime                                    │
│  ├── Comment section: hoverCount += 2                           │
│  │   └── Log: "Comment section hovered -> Interest UP"         │
│  └── Project element:                                            │
│      ├── hoverCount++                                            │
│      ├── Track project hovers                                    │
│      ├── Start view time tracking                                │
│      └── Log: "Project hover started: {title}"                  │
│                                                                  │
│  handleMouseOut(e)                                               │
│  └── Calculate view duration for projects                       │
└─────────────────────────────────────────────────────────────────┘
```

## 4. 분석 루프 (2초 간격)

```
┌──────────────────────────────────────────────────────────────────┐
│                Analysis Interval (Every 2 Seconds)                │
└──────────────────────────────────────────────────────────────────┘

setInterval(() => { ... }, 2000)
         │
         ▼
┌─────────────────────────────────────────────────────────────────┐
│  Step 1: Calculate Current Metrics                               │
├─────────────────────────────────────────────────────────────────┤
│  timeSpent = (now - startTime) / 1000                            │
│  idleTime = (now - lastActivityTime) / 1000                      │
│                                                                  │
│  updateSectionTime():                                            │
│  ├── Check if #projects visible                                 │
│  │   └── projectSectionTime += elapsed                          │
│  └── Check if #comments visible                                 │
│      └── commentSectionTime += elapsed                          │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│  Step 2: Calculate Penalties                                     │
├─────────────────────────────────────────────────────────────────┤
│  if (idleTime > 10) {                                            │
│    isIdle = true;                                                │
│    console.log('WARNING: Idle state detected -> Interest DOWN');│
│    idlePenalty = max(0.3, 1.0 - ((idleTime - 10) * 0.05));     │
│    penaltyPercent = ((1 - idlePenalty) * 100).toFixed(0);       │
│    console.log('IDLE ' + idleTime + 's | Penalty: '             │
│                + penaltyPercent + '% decrease');                 │
│  }                                                               │
│                                                                  │
│  if (idleTime > 15 && scrollDepth < 0.3) {                      │
│    scrollPenalty = 0.7;  // 30% penalty                         │
│    console.log('Long stay at top area -> Interest DOWN');       │
│  }                                                               │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│  Step 3: Build Behavior Vector (9 Features)                      │
├─────────────────────────────────────────────────────────────────┤
│  behaviorVector = [                                              │
│    scrollDepth,                    // [0] 0-1                    │
│    min(clickCount / 8, 1) * idlePenalty,  // [1] normalized     │
│    min(timeSpent / 120, 1),        // [2] time in minutes       │
│    min(hoverCount / 5, 1) * idlePenalty,  // [3] normalized     │
│    min((projectSectionTime + commentSectionTime) / 40, 1)       │
│                             * scrollPenalty,  // [4]             │
│    min(projectCount / 6, 1),       // [5] 0-1                    │
│    min(analysisCount / 20, 1),     // [6] analysis rounds        │
│    scrollDepth > 0.5 ? 1 : 0,      // [7] deep scroll flag      │
│    totalProjectClicks > 0 ? 1 : 0  // [8] has clicks flag       │
│  ];                                                              │
│                                                                  │
│  behaviorData.current.push({                                     │
│    timestamp: now,                                               │
│    vector: behaviorVector,                                       │
│    idleTime: idleTime,                                           │
│    idlePenalty: idlePenalty                                      │
│  });                                                             │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│  Step 4: Run Neural Network Inference                            │
├─────────────────────────────────────────────────────────────────┤
│  analyzeBehavior(behaviorVector)                                 │
│         │                                                        │
│         ▼                                                        │
│  inputTensor = tf.tensor2d([behaviorVector])  // Shape: [1, 9]  │
│         │                                                        │
│         ▼                                                        │
│  prediction = model.predict(inputTensor)      // NN inference   │
│         │                                                        │
│         ▼                                                        │
│  prediction.data().then(data => {                               │
│    rawScore = data[0];  // NN output (0-1)                      │
│         │                                                        │
│         ▼                                                        │
│    Calculate weighted actual score:                             │
│    actualScore = 0                                               │
│      + scroll * 0.15      // 15% weight                         │
│      + click * 0.25       // 25% weight                         │
│      + time * 0.10        // 10% weight                         │
│      + hover * 0.15       // 15% weight                         │
│      + section * 0.20     // 20% weight                         │
│      + projects * 0.05    // 5% weight                          │
│      + deepScroll * 0.05  // 5% weight                          │
│      + hasClicks * 0.05;  // 5% weight                          │
│         │                                                        │
│         ▼                                                        │
│    Combine scores:                                               │
│    finalScore = actualScore * 0.7 + rawScore * 0.3;             │
│         │                                                        │
│         ▼                                                        │
│    Apply idle penalty:                                           │
│    if (idlePenalty < 1.0) {                                     │
│      finalScore = finalScore * idlePenalty;                     │
│    }                                                             │
│         │                                                        │
│         ▼                                                        │
│    setInterestScore(finalScore);                                │
│    inputTensor.dispose();   // Free memory                       │
│    prediction.dispose();    // Free memory                       │
│  });                                                             │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│  Step 5: Log Results                                             │
├─────────────────────────────────────────────────────────────────┤
│  console.log('Interest: ' + (finalScore * 100) + '%');          │
│  console.log('  Scroll: ' + (scroll * 100) + '% | ' +           │
│              'Click: ' + (click * 100) + '% | ' +                │
│              'Hover: ' + (hover * 100) + '% | ' +                │
│              'Section: ' + (section * 100) + '%');               │
│                                                                  │
│  if (finalScore > 0.7) {                                         │
│    console.log('HIGH interest - Strong hiring intent');         │
│  } else if (finalScore > 0.4) {                                 │
│    console.log('MEDIUM interest - Continuous exploration');     │
│  } else {                                                        │
│    console.log('LOW interest - More interaction needed');       │
│  }                                                               │
└─────────────────────────────────────────────────────────────────┘
```

## 5. 프로젝트별 관심도 분석

```
┌──────────────────────────────────────────────────────────────────┐
│          analyzeProjectInterest(projectTitle, vector)             │
└──────────────────────────────────────────────────────────────────┘

For each project in projectInteractions:
         │
         ▼
┌─────────────────────────────────────────────────────────────────┐
│  Build Project-Specific Behavior Vector (9 Features)             │
├─────────────────────────────────────────────────────────────────┤
│  projectVector = [                                               │
│    min(projectClicks / 3, 1),      // [0] clicks threshold       │
│    min(projectHovers / 2, 1),      // [1] hovers threshold       │
│    min(projectViewTime / 20, 1),   // [2] view time in seconds   │
│    scrollDepth,                    // [3] overall scroll          │
│    min(timeSpent / 120, 1),        // [4] total time             │
│    projectClicks > 0 ? 1 : 0,      // [5] has clicks flag        │
│    projectHovers > 1 ? 1 : 0,      // [6] multiple hovers flag   │
│    projectViewTime > 3 ? 1 : 0,    // [7] viewed long flag       │
│    min(projectSectionTime / 40, 1) // [8] section time           │
│  ];                                                              │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│  Run Neural Network Inference                                    │
├─────────────────────────────────────────────────────────────────┤
│  inputTensor = tf.tensor2d([projectVector])                      │
│  prediction = model.predict(inputTensor)                         │
│  prediction.data().then(data => {                               │
│    score = data[0];  // 0-1 probability                          │
│    setProjectInterests(prev => ({                                │
│      ...prev,                                                    │
│      [projectTitle]: score                                       │
│    }));                                                          │
│    projectInteractions.current[projectTitle].score = score;     │
│    inputTensor.dispose();                                        │
│    prediction.dispose();                                         │
│  });                                                             │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│  Find Top Project                                                │
├─────────────────────────────────────────────────────────────────┤
│  const top = Object.entries(projectInteractions)                 │
│    .reduce((max, curr) =>                                        │
│      curr[1].score > max[1].score ? curr : max                   │
│    );                                                            │
│  setTopProject(top[0]);                                          │
│  console.log('Top project: ' + top[0] +                          │
│              ' (' + (top[1].score * 100) + '%)');                │
└─────────────────────────────────────────────────────────────────┘
```

## 6. 메모리 관리 & 정리

```
┌──────────────────────────────────────────────────────────────────┐
│                    Memory Management Flow                         │
└──────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  Tensor Creation & Disposal                                      │
├─────────────────────────────────────────────────────────────────┤
│  Every prediction cycle:                                         │
│  1. Create tensors                                               │
│     ├── inputTensor = tf.tensor2d([vector])                     │
│     └── prediction = model.predict(inputTensor)                 │
│                                                                  │
│  2. Use tensors                                                  │
│     └── prediction.data().then(...)                             │
│                                                                  │
│  3. Dispose tensors (CRITICAL!)                                  │
│     ├── inputTensor.dispose()   // Free GPU/CPU memory          │
│     └── prediction.dispose()    // Free GPU/CPU memory          │
│                                                                  │
│  Why? Prevent memory leaks in browser!                          │
└─────────────────────────────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│  Component Cleanup (useEffect return)                            │
├─────────────────────────────────────────────────────────────────┤
│  return () => {                                                  │
│    window.removeEventListener('scroll', handleScroll);          │
│    document.removeEventListener('click', handleClick);          │
│    document.removeEventListener('mouseover', handleMouseOver);  │
│    document.removeEventListener('mouseout', handleMouseOut);    │
│    clearInterval(interval);  // Stop analysis loop               │
│  };                                                              │
└─────────────────────────────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│  getMemoryInfo() - Monitor TensorFlow Memory                     │
├─────────────────────────────────────────────────────────────────┤
│  const memoryInfo = tf.memory();                                 │
│  Returns:                                                        │
│  {                                                               │
│    numTensors: 0,         // Current tensors in memory          │
│    numDataBuffers: 0,     // Data buffers allocated             │
│    numBytes: 0,           // Total bytes used                   │
│    unreliable: false      // Memory tracking reliability        │
│  }                                                               │
│                                                                  │
│  Displayed in TensorFlowMonitor component                        │
└─────────────────────────────────────────────────────────────────┘
```

## 7. 실시간 모니터링 UI

```
┌──────────────────────────────────────────────────────────────────┐
│           TensorFlowMonitor.jsx Component Flow                    │
└──────────────────────────────────────────────────────────────────┘

Props from useTensorFlow():
├── isModelLoaded: boolean
├── interestScore: number (0-1)
├── projectInterests: Object<string, number>
└── topProject: string

         │
         ▼
┌─────────────────────────────────────────────────────────────────┐
│  Render Monitor (left: 20px, bottom: 20px)                       │
├─────────────────────────────────────────────────────────────────┤
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  [Monitor Header]                                          │ │
│  │  - 채용 담당자 관심 프로젝트 예측                            │ │
│  │  - TensorFlow.js Model Status                              │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  [Overall Interest Score]                                  │ │
│  │  - Large percentage display                                │ │
│  │  - Color coding:                                           │ │
│  │    * >70%: #4ade80 (green, HIGH)                          │ │
│  │    * 40-70%: #fbbf24 (yellow, MEDIUM)                     │ │
│  │    * <40%: #ef4444 (red, LOW)                             │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  [Top Project Highlight]                                   │ │
│  │  - Most interested project name                            │ │
│  │  - Interest score (percentage)                             │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  [Project Interest List]                                   │ │
│  │  For each project:                                         │ │
│  │  - Project name                                            │ │
│  │  - Progress bar (visual representation)                    │ │
│  │  - Percentage score                                        │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  [Memory Info]                                             │ │
│  │  - Number of tensors                                       │ │
│  │  - Memory usage (bytes)                                    │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘

Auto-updates every 2 seconds when new predictions arrive
```

## 8. 데이터 흐름 요약

```
┌──────────────────────────────────────────────────────────────────┐
│                  End-to-End Data Flow Diagram                     │
└──────────────────────────────────────────────────────────────────┘

User Interaction
       │
       ├─── Scroll → scrollDepth
       ├─── Click → clickCount, projectClicks
       ├─── Hover → hoverCount, projectHovers, viewTime
       └─── Time → timeSpent, sectionTime
                    │
                    ▼
              Aggregate Metrics
                    │
                    ├─── Every 2 seconds
                    │
                    ▼
          Calculate Behavior Vector
          [9 features: 0-1 normalized]
                    │
                    ├─── Apply penalties (idle, scroll)
                    │
                    ▼
         TensorFlow.js Neural Network
         [9 → 32 → 16 → 8 → 1]
                    │
                    ├─── Inference (~10ms)
                    │
                    ▼
              Raw Prediction (0-1)
                    │
                    ├─── Weighted combination:
                    │    70% actual + 30% NN
                    │
                    ▼
           Final Interest Score (0-1)
                    │
                    ├─── State update
                    │
                    ▼
        React Component Re-render
                    │
                    ├─── TensorFlowMonitor
                    │
                    ▼
           Visual Update in Browser
           (Real-time score display)
```

## 9. 성능 최적화

```
┌──────────────────────────────────────────────────────────────────┐
│                  Performance Optimizations                        │
└──────────────────────────────────────────────────────────────────┘

1. Backend Selection
   └── CPU backend (avoid localStorage errors)
       - Consistent performance
       - No WebGL initialization overhead

2. Memory Management
   ├── Tensor disposal after every prediction
   ├── useRef for persistent data (no re-renders)
   └── Clear event listeners on unmount

3. Analysis Frequency
   └── 2-second interval (balance between responsiveness & CPU)
       - Fast enough for real-time feel
       - Not too frequent to drain battery

4. Model Size
   └── Lightweight architecture (9→32→16→8→1)
       - ~10KB model size
       - <10ms inference time
       - Low memory footprint (~2MB)

5. Async Operations
   └── Non-blocking predictions with .then()
       - UI remains responsive
       - No freezing on model inference

6. Feature Normalization
   └── All features scaled to 0-1
       - Faster convergence
       - Better gradient flow
       - Consistent weights
```

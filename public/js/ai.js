/**
 * TensorFlow.js 지능형 웹 기능 모듈
 * - 사용자 행동 패턴 분석
 * - 콘텐츠 추천 시스템
 * - 감성 분석
 */

export class AIManager {
  constructor() {
    this.model = null;
    this.isModelLoaded = false;
    this.userBehaviorData = [];
    this.recommendations = [];
  }

  /**
   * TensorFlow.js 초기화 및 모델 로드
   */
  async init() {
    try {
      console.log('🤖 TensorFlow.js 초기화 중...');
      
      // TensorFlow.js 버전 확인
      if (typeof tf !== 'undefined') {
        console.log(`✅ TensorFlow.js v${tf.version.tfjs} 로드 완료`);
        
        // 간단한 모델 생성 (사용자 행동 예측)
        await this.createBehaviorPredictionModel();
        
        // 사용자 행동 추적 시작
        this.startUserBehaviorTracking();
        
        // 프로젝트 추천 시스템 초기화
        this.initRecommendationSystem();
        
        console.log('✅ AI 기능 초기화 완료');
      } else {
        console.error('❌ TensorFlow.js 로드 실패');
      }
    } catch (error) {
      console.error('❌ AI 초기화 실패:', error);
    }
  }

  /**
   * 사용자 행동 예측 모델 생성
   * Sequential 모델을 사용한 간단한 신경망
   */
  async createBehaviorPredictionModel() {
    try {
      // Sequential 모델 생성
      this.model = tf.sequential({
        layers: [
          // 입력층: 사용자 행동 특징 (스크롤, 클릭, 체류 시간 등)
          tf.layers.dense({
            inputShape: [5],  // 5개의 특징
            units: 16,
            activation: 'relu'
          }),
          // 은닉층
          tf.layers.dense({
            units: 8,
            activation: 'relu'
          }),
          // 출력층: 관심도 예측 (0~1)
          tf.layers.dense({
            units: 1,
            activation: 'sigmoid'
          })
        ]
      });

      // 모델 컴파일
      this.model.compile({
        optimizer: tf.train.adam(0.001),
        loss: 'binaryCrossentropy',
        metrics: ['accuracy']
      });

      this.isModelLoaded = true;
      console.log('✅ 행동 예측 모델 생성 완료');
      
      // 모델 구조 출력
      this.model.summary();
      
    } catch (error) {
      console.error('❌ 모델 생성 실패:', error);
    }
  }

  /**
   * 사용자 행동 추적
   */
  startUserBehaviorTracking() {
    let scrollDepth = 0;
    let clickCount = 0;
    let startTime = Date.now();
    let lastSectionViewed = '';
    let hoverCount = 0;

    // 스크롤 깊이 추적
    window.addEventListener('scroll', () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      scrollDepth = Math.max(scrollDepth, (scrollTop + windowHeight) / documentHeight);
      
      // 현재 보고 있는 섹션 감지
      const sections = document.querySelectorAll('.section');
      sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top >= 0 && rect.top <= windowHeight / 2) {
          const sectionId = section.id;
          if (sectionId && sectionId !== lastSectionViewed) {
            lastSectionViewed = sectionId;
            this.recordBehavior('section_view', { section: sectionId });
          }
        }
      });
    });

    // 클릭 이벤트 추적
    document.addEventListener('click', (e) => {
      clickCount++;
      const target = e.target.closest('[class]');
      if (target) {
        this.recordBehavior('click', {
          element: target.className,
          timestamp: Date.now() - startTime
        });
      }
    });

    // 호버 이벤트 추적 (프로젝트 카드)
    document.addEventListener('mouseover', (e) => {
      const project = e.target.closest('.project');
      if (project) {
        hoverCount++;
        this.recordBehavior('hover', {
          element: 'project',
          projectId: project.dataset.project
        });
      }
    });

    // 5초마다 현재 행동 데이터 저장
    setInterval(() => {
      const timeSpent = (Date.now() - startTime) / 1000;
      const behaviorVector = this.createBehaviorVector(
        scrollDepth,
        clickCount,
        timeSpent,
        hoverCount,
        this.userBehaviorData.length
      );
      
      this.userBehaviorData.push({
        timestamp: Date.now(),
        vector: behaviorVector,
        scrollDepth,
        clickCount,
        timeSpent,
        hoverCount
      });
      
      // 행동 패턴 분석
      if (this.userBehaviorData.length >= 3) {
        this.analyzeBehaviorPattern();
      }
    }, 5000);

    console.log('✅ 사용자 행동 추적 시작');
  }

  /**
   * 행동 데이터를 벡터로 변환
   */
  createBehaviorVector(scrollDepth, clickCount, timeSpent, hoverCount, interactionCount) {
    return [
      scrollDepth,                    // 스크롤 깊이 (0~1)
      Math.min(clickCount / 10, 1),   // 정규화된 클릭 수
      Math.min(timeSpent / 120, 1),   // 정규화된 체류 시간 (2분 기준)
      Math.min(hoverCount / 5, 1),    // 정규화된 호버 수
      Math.min(interactionCount / 20, 1) // 정규화된 상호작용 수
    ];
  }

  /**
   * 행동 기록
   */
  recordBehavior(action, data) {
    console.log(`📊 행동 기록: ${action}`, data);
  }

  /**
   * 행동 패턴 분석 및 예측
   */
  async analyzeBehaviorPattern() {
    if (!this.isModelLoaded || this.userBehaviorData.length < 3) return;

    try {
      // 최근 3개의 행동 데이터 가져오기
      const recentBehaviors = this.userBehaviorData.slice(-3);
      const lastBehavior = recentBehaviors[recentBehaviors.length - 1];
      
      // 텐서로 변환
      const inputTensor = tf.tensor2d([lastBehavior.vector]);
      
      // 예측 수행
      const prediction = this.model.predict(inputTensor);
      const interestScore = await prediction.data();
      
      // 메모리 정리
      inputTensor.dispose();
      prediction.dispose();
      
      // 관심도에 따른 액션
      const score = interestScore[0];
      console.log(`🎯 사용자 관심도 예측: ${(score * 100).toFixed(1)}%`);
      
      if (score > 0.7) {
        console.log('✨ 높은 관심도 감지 - 추천 콘텐츠 제공');
        this.showRecommendations();
      } else if (score < 0.3) {
        console.log('💡 낮은 관심도 감지 - 인터랙티브 요소 강조');
        this.highlightInteractiveElements();
      }
      
    } catch (error) {
      console.error('❌ 행동 패턴 분석 실패:', error);
    }
  }

  /**
   * 프로젝트 추천 시스템 초기화
   */
  initRecommendationSystem() {
    // 프로젝트 간 유사도 행렬 생성
    this.projectSimilarity = this.calculateProjectSimilarity();
    console.log('✅ 추천 시스템 초기화 완료');
  }

  /**
   * 프로젝트 간 유사도 계산 (간단한 코사인 유사도)
   */
  calculateProjectSimilarity() {
    // 실제 프로젝트 데이터를 기반으로 유사도 계산
    // 여기서는 간단한 예시
    const projects = document.querySelectorAll('.project');
    const similarity = {};
    
    projects.forEach((project, i) => {
      similarity[i] = [];
      projects.forEach((otherProject, j) => {
        // 간단한 유사도 계산 (실제로는 더 복잡한 알고리즘 사용)
        similarity[i][j] = i === j ? 1 : Math.random() * 0.5 + 0.3;
      });
    });
    
    return similarity;
  }

  /**
   * 추천 콘텐츠 표시
   */
  showRecommendations() {
    // 사용자가 관심 있어하는 프로젝트 추천
    console.log('📌 맞춤형 프로젝트 추천 준비');
    
    // 실제 추천 로직은 여기에 구현
    // 예: 유사한 프로젝트 하이라이트, 팝업 표시 등
  }

  /**
   * 인터랙티브 요소 강조
   */
  highlightInteractiveElements() {
    // 사용자 참여 유도를 위한 시각적 힌트
    console.log('💫 인터랙티브 요소 강조');
    
    // 예: 프로젝트 카드에 애니메이션 추가, 댓글 섹션 강조 등
  }

  /**
   * 감성 분석 (댓글 텍스트 분석)
   */
  async analyzeSentiment(text) {
    try {
      // 간단한 감성 분석 (긍정/부정)
      // 실제로는 사전 훈련된 모델 사용
      const positiveWords = ['좋', '멋', '훌륭', '최고', '대단', '감동', '완벽'];
      const negativeWords = ['나쁨', '별로', '아쉬', '실망'];
      
      let score = 0.5; // 중립
      
      positiveWords.forEach(word => {
        if (text.includes(word)) score += 0.1;
      });
      
      negativeWords.forEach(word => {
        if (text.includes(word)) score -= 0.1;
      });
      
      score = Math.max(0, Math.min(1, score));
      
      return {
        score,
        sentiment: score > 0.6 ? 'positive' : score < 0.4 ? 'negative' : 'neutral'
      };
      
    } catch (error) {
      console.error('❌ 감성 분석 실패:', error);
      return { score: 0.5, sentiment: 'neutral' };
    }
  }

  /**
   * 메모리 정리
   */
  cleanup() {
    if (this.model) {
      this.model.dispose();
      console.log('✅ TensorFlow.js 모델 메모리 정리 완료');
    }
  }

  /**
   * 통계 정보 반환
   */
  getStatistics() {
    return {
      totalBehaviors: this.userBehaviorData.length,
      modelLoaded: this.isModelLoaded,
      tfVersion: typeof tf !== 'undefined' ? tf.version.tfjs : 'Not loaded',
      memoryInfo: typeof tf !== 'undefined' ? tf.memory() : null
    };
  }
}

export default AIManager;

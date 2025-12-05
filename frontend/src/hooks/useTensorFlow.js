import { useEffect, useRef, useState } from 'react';
import * as tf from '@tensorflow/tfjs';

export const useTensorFlow = () => {
  const [model, setModel] = useState(null);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [interestScore, setInterestScore] = useState(0.5);
  const behaviorData = useRef([]);

  useEffect(() => {
    initializeModel();
    startBehaviorTracking();
  }, []);

  const initializeModel = async () => {
    try {
      // localStorage 접근 에러 방지
      tf.env().set('IS_BROWSER', false);
      
      console.log('🤖 TensorFlow.js 초기화 중...');
      console.log('✅ TensorFlow.js 버전:', tf.version.tfjs);

      // Sequential 모델 생성
      const sequentialModel = tf.sequential({
        layers: [
          tf.layers.dense({ inputShape: [5], units: 16, activation: 'relu' }),
          tf.layers.dense({ units: 8, activation: 'relu' }),
          tf.layers.dense({ units: 1, activation: 'sigmoid' })
        ]
      });

      sequentialModel.compile({
        optimizer: tf.train.adam(0.001),
        loss: 'binaryCrossentropy',
        metrics: ['accuracy']
      });

      setModel(sequentialModel);
      setIsModelLoaded(true);
      console.log('✅ TensorFlow.js 모델 로드 완료');
      sequentialModel.summary();
    } catch (error) {
      console.error('❌ TensorFlow.js 초기화 실패:', error);
    }
  };

  const startBehaviorTracking = () => {
    let scrollDepth = 0;
    let clickCount = 0;
    let hoverCount = 0;
    const startTime = Date.now();

    // 스크롤 추적
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.pageYOffset;
      scrollDepth = Math.max(scrollDepth, (scrollTop + windowHeight) / documentHeight);
    };

    // 클릭 추적
    const handleClick = () => {
      clickCount++;
    };

    // 호버 추적
    const handleMouseOver = (e) => {
      if (e.target.closest('.project-card, .skill-item')) {
        hoverCount++;
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('click', handleClick);
    document.addEventListener('mouseover', handleMouseOver);

    // 5초마다 행동 분석
    const interval = setInterval(() => {
      const timeSpent = (Date.now() - startTime) / 1000;
      const behaviorVector = [
        scrollDepth,
        Math.min(clickCount / 10, 1),
        Math.min(timeSpent / 120, 1),
        Math.min(hoverCount / 5, 1),
        Math.min(behaviorData.current.length / 20, 1)
      ];

      behaviorData.current.push({
        timestamp: Date.now(),
        vector: behaviorVector
      });

      analyzeBehavior(behaviorVector);
    }, 5000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('click', handleClick);
      document.removeEventListener('mouseover', handleMouseOver);
      clearInterval(interval);
    };
  };

  const analyzeBehavior = async (behaviorVector) => {
    if (!model || !isModelLoaded) return;

    try {
      const inputTensor = tf.tensor2d([behaviorVector]);
      const prediction = model.predict(inputTensor);
      const score = (await prediction.data())[0];

      inputTensor.dispose();
      prediction.dispose();

      setInterestScore(score);
      console.log(`🎯 사용자 관심도: ${(score * 100).toFixed(1)}%`);

      if (score > 0.7) {
        console.log('✨ 높은 관심도 감지 - 추천 콘텐츠 제공');
      } else if (score < 0.3) {
        console.log('💡 낮은 관심도 감지 - 인터랙티브 요소 강조');
      }
    } catch (error) {
      console.error('❌ 행동 분석 실패:', error);
    }
  };

  const getMemoryInfo = () => {
    return tf.memory();
  };

  return {
    isModelLoaded,
    interestScore,
    getMemoryInfo
  };
};

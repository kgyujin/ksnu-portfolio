import React, { useEffect } from 'react';
import Header from './components/Header';
import About from './components/About';
import Introduce from './components/Introduce';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Comments from './components/Comments';
import Footer from './components/Footer';
import { useTensorFlow } from './hooks/useTensorFlow';
import { statsAPI } from './services/api';

// 스타일 import
import './styles/base.css';
import './styles/header.css';
import './styles/responsive.css';

function App() {
  const { isModelLoaded, interestScore } = useTensorFlow();

  useEffect(() => {
    // 방문 통계 기록 (에러 무시)
    statsAPI.recordVisit().catch(() => {});
  }, []);

  return (
    <div className="App" style={{ width: '100%', minHeight: '100vh' }}>
      {/* 별 배경 */}
      <div className="star-container">
        {[...Array(100)].map((_, i) => (
          <div
            key={i}
            className="star"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <Header />
      <main id="main-container">
        <About />
        <Introduce />
        <Skills />
        <Projects />
        <Comments />
      </main>
      <Footer />

      {/* AI 상태 표시 (개발용 - 프로덕션에서는 제거 가능) */}
      {isModelLoaded && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          background: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          padding: '10px',
          borderRadius: '8px',
          fontSize: '12px',
          zIndex: 9999
        }}>
          🤖 AI: {(interestScore * 100).toFixed(0)}%
        </div>
      )}
    </div>
  );
}

export default App;

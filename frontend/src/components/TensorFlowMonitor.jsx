import React, { useState, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';

const TensorFlowMonitor = ({ isModelLoaded, interestScore }) => {
  const [expanded, setExpanded] = useState(false);
  const [memoryInfo, setMemoryInfo] = useState(null);
  const [backend, setBackend] = useState('');

  useEffect(() => {
    if (isModelLoaded) {
      setBackend(tf.getBackend());
      const interval = setInterval(() => {
        const memory = tf.memory();
        setMemoryInfo(memory);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isModelLoaded]);

  if (!isModelLoaded) {
    return (
      <div style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        background: 'rgba(255, 165, 0, 0.9)',
        color: 'white',
        padding: '12px 16px',
        borderRadius: '8px',
        fontSize: '13px',
        fontWeight: 'bold',
        zIndex: 9999,
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
      }}>
        ⏳ TensorFlow.js 로딩 중...
      </div>
    );
  }

  const getInterestLevel = (score) => {
    if (score > 0.7) return { text: '높음 🔥', color: '#4CAF50' };
    if (score > 0.4) return { text: '보통 📊', color: '#FFC107' };
    return { text: '낮음 💤', color: '#F44336' };
  };

  const level = getInterestLevel(interestScore);

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      background: 'rgba(0, 0, 0, 0.95)',
      color: 'white',
      padding: '16px',
      borderRadius: '12px',
      fontSize: '13px',
      zIndex: 9999,
      boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
      border: '1px solid rgba(255,255,255,0.1)',
      minWidth: expanded ? '320px' : '180px',
      transition: 'all 0.3s ease'
    }}>
      <div 
        onClick={() => setExpanded(!expanded)}
        style={{ cursor: 'pointer', userSelect: 'none' }}
      >
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          marginBottom: expanded ? '12px' : '0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '20px' }}>🤖</span>
            <span style={{ fontWeight: 'bold' }}>TensorFlow.js</span>
          </div>
          <span style={{ fontSize: '12px', opacity: 0.7 }}>
            {expanded ? '▼' : '▶'}
          </span>
        </div>
        
        <div style={{ 
          marginTop: '8px',
          padding: '8px',
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '6px'
        }}>
          <div style={{ fontSize: '11px', opacity: 0.7, marginBottom: '4px' }}>
            사용자 관심도
          </div>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between' 
          }}>
            <div style={{ 
              fontSize: '24px', 
              fontWeight: 'bold',
              color: level.color
            }}>
              {(interestScore * 100).toFixed(1)}%
            </div>
            <div style={{ 
              fontSize: '12px',
              color: level.color,
              fontWeight: 'bold'
            }}>
              {level.text}
            </div>
          </div>
        </div>
      </div>

      {expanded && (
        <div style={{ 
          marginTop: '12px', 
          paddingTop: '12px', 
          borderTop: '1px solid rgba(255,255,255,0.1)',
          fontSize: '11px'
        }}>
          <div style={{ marginBottom: '8px' }}>
            <strong>✅ 모델 상태:</strong> 활성
          </div>
          <div style={{ marginBottom: '8px' }}>
            <strong>🔧 Backend:</strong> {backend}
          </div>
          <div style={{ marginBottom: '8px' }}>
            <strong>📦 버전:</strong> {tf.version.tfjs}
          </div>
          
          {memoryInfo && (
            <>
              <div style={{ 
                marginTop: '12px', 
                paddingTop: '8px', 
                borderTop: '1px solid rgba(255,255,255,0.1)' 
              }}>
                <strong>💾 메모리 사용량</strong>
              </div>
              <div style={{ marginTop: '8px', opacity: 0.9 }}>
                <div style={{ marginBottom: '4px' }}>
                  Tensors: {memoryInfo.numTensors}개
                </div>
                <div style={{ marginBottom: '4px' }}>
                  Bytes: {(memoryInfo.numBytes / 1024).toFixed(2)} KB
                </div>
                <div>
                  데이터 버퍼: {memoryInfo.numDataBuffers}개
                </div>
              </div>
            </>
          )}

          <div style={{ 
            marginTop: '12px', 
            paddingTop: '8px', 
            borderTop: '1px solid rgba(255,255,255,0.1)',
            fontSize: '10px',
            opacity: 0.7,
            lineHeight: '1.4'
          }}>
            💡 5초마다 스크롤, 클릭, 호버, 체류시간을 분석하여 사용자 관심도를 실시간으로 예측합니다.
          </div>
        </div>
      )}
    </div>
  );
};

export default TensorFlowMonitor;

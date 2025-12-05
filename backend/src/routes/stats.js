const express = require('express');
const router = express.Router();
const db = require('../config/database');

// 오늘의 방문자 수 증가
router.post('/visit', async (req, res, next) => {
  try {
    // MongoDB 사용 시 별도 구현 필요
    // 현재는 방문 기록만 수신하고 성공 응답 반환
    res.json({ message: 'Visit recorded' });
  } catch (error) {
    next(error);
  }
});

// 방문자 통계 조회
router.get('/', async (req, res, next) => {
  try {
    // MongoDB 사용 시 별도 구현 필요
    res.json({
      recent: [],
      total_visits: 0
    });
  } catch (error) {
    next(error);
  }
});

// 프로젝트별 조회수 통계
router.get('/projects', async (req, res, next) => {
  try {
    // MongoDB 사용 시 별도 구현 필요
    res.json([]);
  } catch (error) {
    next(error);
  }
});

module.exports = router;

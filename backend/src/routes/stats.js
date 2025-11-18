const express = require('express');
const router = express.Router();
const db = require('../config/database');

// 오늘의 방문자 수 증가
router.post('/visit', async (req, res, next) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    await db.query(
      `INSERT INTO visitor_stats (visit_date, visit_count, unique_visitors) 
       VALUES (?, 1, 1) 
       ON DUPLICATE KEY UPDATE 
       visit_count = visit_count + 1`,
      [today]
    );
    
    res.json({ message: 'Visit recorded' });
  } catch (error) {
    next(error);
  }
});

// 방문자 통계 조회
router.get('/', async (req, res, next) => {
  try {
    const [stats] = await db.query(
      'SELECT * FROM visitor_stats ORDER BY visit_date DESC LIMIT 30'
    );
    
    // 총 방문자 수 계산
    const [total] = await db.query(
      'SELECT SUM(visit_count) as total_visits FROM visitor_stats'
    );
    
    res.json({
      recent: stats,
      total_visits: total[0].total_visits || 0
    });
  } catch (error) {
    next(error);
  }
});

// 프로젝트별 조회수 통계
router.get('/projects', async (req, res, next) => {
  try {
    const [projects] = await db.query(
      'SELECT id, title, view_count FROM projects ORDER BY view_count DESC'
    );
    res.json(projects);
  } catch (error) {
    next(error);
  }
});

module.exports = router;

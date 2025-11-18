const express = require('express');
const router = express.Router();
const db = require('../config/database');

// 스킬 목록 조회
router.get('/', async (req, res, next) => {
  try {
    const { category } = req.query;
    
    let query = 'SELECT * FROM skills ORDER BY display_order ASC, name ASC';
    let params = [];
    
    if (category) {
      query = 'SELECT * FROM skills WHERE category = ? ORDER BY display_order ASC, name ASC';
      params = [category];
    }
    
    const [skills] = await db.query(query, params);
    res.json(skills);
  } catch (error) {
    next(error);
  }
});

// 카테고리별 그룹화된 스킬 조회
router.get('/grouped', async (req, res, next) => {
  try {
    const [skills] = await db.query(
      'SELECT * FROM skills ORDER BY category, display_order ASC, name ASC'
    );
    
    // 카테고리별로 그룹화
    const grouped = skills.reduce((acc, skill) => {
      const category = skill.category || 'Other';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(skill);
      return acc;
    }, {});
    
    res.json(grouped);
  } catch (error) {
    next(error);
  }
});

module.exports = router;

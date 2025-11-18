const express = require('express');
const router = express.Router();
const db = require('../config/database');
const Joi = require('joi');

router.get('/', async (req, res, next) => {
  try {
    const [projects] = await db.query(
      'SELECT * FROM projects ORDER BY created_at DESC'
    );
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.json(projects);
  } catch (error) {
    next(error);
  }
});

// 특정 프로젝트 조회 (조회수 증가)
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // 조회수 증가
    await db.query(
      'UPDATE projects SET view_count = view_count + 1 WHERE id = ?',
      [id]
    );
    
    const [projects] = await db.query(
      'SELECT * FROM projects WHERE id = ?',
      [id]
    );
    
    if (projects.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.json(projects[0]);
  } catch (error) {
    next(error);
  }
});

// 추천 프로젝트 조회
router.get('/featured/list', async (req, res, next) => {
  try {
    const [projects] = await db.query(
      'SELECT * FROM projects WHERE is_featured = true ORDER BY view_count DESC'
    );
    res.json(projects);
  } catch (error) {
    next(error);
  }
});

// 프로젝트 생성 (관리자용)
router.post('/', async (req, res, next) => {
  try {
    const schema = Joi.object({
      title: Joi.string().required(),
      period: Joi.string().allow(''),
      description: Joi.string().allow(''),
      skills: Joi.string().allow(''),
      role: Joi.string().allow(''),
      review: Joi.string().allow(''),
      image_url: Joi.string().uri().allow(''),
      project_url: Joi.string().uri().allow(''),
      github_url: Joi.string().uri().allow(''),
      is_featured: Joi.boolean()
    });

    const { error, value } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const [result] = await db.query('INSERT INTO projects SET ?', value);
    res.status(201).json({ id: result.insertId, ...value });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

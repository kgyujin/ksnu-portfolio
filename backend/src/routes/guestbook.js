const express = require('express');
const router = express.Router();
const db = require('../config/database');
const Joi = require('joi');

// 방명록 목록 조회 (승인된 것만)
router.get('/', async (req, res, next) => {
  try {
    const [entries] = await db.query(
      'SELECT id, name, email, message, created_at FROM guestbook WHERE is_approved = true AND is_deleted = false ORDER BY created_at DESC LIMIT 50'
    );
    res.json(entries);
  } catch (error) {
    next(error);
  }
});

// 방명록 작성
router.post('/', async (req, res, next) => {
  try {
    const schema = Joi.object({
      name: Joi.string().max(100).required(),
      email: Joi.string().email().max(255).allow(''),
      message: Joi.string().required(),
      password: Joi.string().min(4).max(20).allow('')
    });

    const { error, value } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // IP 주소 가져오기
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    
    const [result] = await db.query(
      'INSERT INTO guestbook (name, email, message, password, ip_address) VALUES (?, ?, ?, ?, ?)',
      [value.name, value.email, value.message, value.password, ip]
    );

    res.status(201).json({ 
      id: result.insertId,
      message: 'Guestbook entry created successfully'
    });
  } catch (error) {
    next(error);
  }
});

// 방명록 삭제 (비밀번호 확인)
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ error: 'Password is required' });
    }

    const [entries] = await db.query(
      'SELECT password FROM guestbook WHERE id = ? AND is_deleted = false',
      [id]
    );

    if (entries.length === 0) {
      return res.status(404).json({ error: 'Entry not found' });
    }

    if (entries[0].password !== password) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    await db.query(
      'UPDATE guestbook SET is_deleted = true WHERE id = ?',
      [id]
    );

    res.json({ message: 'Entry deleted successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

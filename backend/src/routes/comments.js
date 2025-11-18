const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');

// XSS 방지 - HTML 엔티티 인코딩
function sanitizeInput(input) {
  if (!input) return '';
  return String(input)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

// 입력값 검증
function validateInput(input, maxLength = 500) {
  if (!input || typeof input !== 'string') {
    return { valid: false, message: '입력값이 유효하지 않습니다.' };
  }

  if (input.trim().length === 0) {
    return { valid: false, message: '빈 값은 입력할 수 없습니다.' };
  }

  if (input.length > maxLength) {
    return { valid: false, message: `${maxLength}자를 초과할 수 없습니다.` };
  }

  // 위험한 패턴 검사
  const dangerousPatterns = [
    /<script[\s\S]*?>[\s\S]*?<\/script>/gi,
    /<iframe[\s\S]*?>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<embed[\s\S]*?>/gi,
    /<object[\s\S]*?>/gi,
  ];

  for (const pattern of dangerousPatterns) {
    if (pattern.test(input)) {
      return { valid: false, message: 'HTML 태그나 스크립트는 입력할 수 없습니다.' };
    }
  }

  return { valid: true };
}

/**
 * GET /api/comments
 * 승인된 댓글 목록 조회
 */
router.get('/', async (req, res) => {
  try {
    const comments = await Comment.find({
      isApproved: true,
      isDeleted: false
    })
    .select('-password -ipAddress') // 민감한 정보 제외
    .sort({ createdAt: -1 }) // 최신순 정렬
    .limit(100)
    .lean(); // Plain JavaScript 객체로 변환

    // 프론트엔드 호환을 위한 필드명 변환
    const formattedComments = comments.map(comment => ({
      id: comment._id.toString(),
      name: comment.name,
      message: comment.message,
      created_at: comment.createdAt
    }));

    res.json(formattedComments);
  } catch (error) {
    console.error('댓글 조회 오류:', error);
    res.status(500).json({ 
      error: '댓글을 불러오는데 실패했습니다.',
      message: error.message 
    });
  }
});

/**
 * POST /api/comments
 * 새 댓글 작성
 */
router.post('/', async (req, res) => {
  try {
    const { name, password, message } = req.body;

    // 입력값 검증
    const nameValidation = validateInput(name, 50);
    if (!nameValidation.valid) {
      return res.status(400).json({ error: '이름: ' + nameValidation.message });
    }

    const messageValidation = validateInput(message, 500);
    if (!messageValidation.valid) {
      return res.status(400).json({ error: '댓글: ' + messageValidation.message });
    }

    // 비밀번호 검증
    if (!password || password.length < 4 || password.length > 20) {
      return res.status(400).json({ error: '비밀번호는 4-20자 사이여야 합니다.' });
    }

    // XSS 방지 - 입력값 새니타이즈
    const sanitizedName = sanitizeInput(name.trim());
    const sanitizedMessage = sanitizeInput(message.trim());

    // IP 주소 가져오기
    const ipAddress = req.ip || req.connection.remoteAddress || 'unknown';

    // MongoDB에 댓글 저장 (비밀번호는 모델에서 자동 해시)
    const comment = new Comment({
      name: sanitizedName,
      message: sanitizedMessage,
      password: password, // 모델의 pre-save 훅에서 자동 해시
      ipAddress: ipAddress,
      isApproved: true,
      isDeleted: false
    });

    await comment.save();

    res.status(201).json({
      success: true,
      id: comment._id.toString(),
      message: '댓글이 작성되었습니다.'
    });

  } catch (error) {
    console.error('댓글 작성 오류:', error);
    
    // Mongoose 유효성 검사 에러 처리
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        error: messages.join(', ')
      });
    }
    
    res.status(500).json({ 
      error: '댓글 작성에 실패했습니다.',
      message: error.message 
    });
  }
});

/**
 * DELETE /api/comments/:id
 * 댓글 삭제 (소프트 삭제)
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { password } = req.body;

    // MongoDB ObjectId 검증
    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: '유효하지 않은 댓글 ID입니다.' });
    }

    // 비밀번호 검증
    if (!password || password.length < 4) {
      return res.status(400).json({ error: '비밀번호를 입력해주세요.' });
    }

    // 댓글 조회 (비밀번호 포함)
    const comment = await Comment.findOne({
      _id: id,
      isDeleted: false
    }).select('+password'); // password 필드 명시적으로 포함

    if (!comment) {
      return res.status(404).json({ error: '댓글을 찾을 수 없습니다.' });
    }

    // 비밀번호 확인 (모델의 verifyPassword 메서드 사용)
    const isPasswordValid = comment.verifyPassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: '비밀번호가 일치하지 않습니다.' });
    }

    // 소프트 삭제 (실제 삭제 대신 플래그만 변경)
    comment.isDeleted = true;
    await comment.save();

    res.json({
      success: true,
      message: '댓글이 삭제되었습니다.'
    });

  } catch (error) {
    console.error('댓글 삭제 오류:', error);
    res.status(500).json({ 
      error: '댓글 삭제에 실패했습니다.',
      message: error.message 
    });
  }
});

/**
 * GET /api/comments/count
 * 댓글 수 조회
 */
router.get('/count', async (req, res) => {
  try {
    const count = await Comment.countDocuments({
      isApproved: true,
      isDeleted: false
    });

    res.json({ count });
  } catch (error) {
    console.error('댓글 수 조회 오류:', error);
    res.status(500).json({ 
      error: '댓글 수 조회에 실패했습니다.',
      message: error.message 
    });
  }
});

module.exports = router;

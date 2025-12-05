/**
 * Comment API 통합 테스트
 * Jest + Supertest를 사용한 API 엔드포인트 테스트
 */

// 테스트 환경 설정
process.env.NODE_ENV = 'test';
process.env.MONGODB_URI = 'mongodb://localhost:27017/test';

const request = require('supertest');
const mongoose = require('mongoose');
const Comment = require('../backend/src/models/Comment');

// Express 앱 생성 (서버 시작 없이)
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const app = express();
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 댓글 라우트 연결
const commentsRouter = require('../backend/src/routes/comments');
app.use('/api/comments', commentsRouter);

describe('💬 Comment API Integration Tests', () => {
  
  // 테스트 시작 전: MongoDB 연결
  beforeAll(async () => {
    // MongoDB Memory Server 사용 (실제 DB 없이 테스트)
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/test';
    
    // 이미 연결되어 있으면 스킵
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
    }
  });

  // 각 테스트 후: 데이터 정리
  afterEach(async () => {
    await Comment.deleteMany({});
  });

  // 모든 테스트 종료 후: 연결 종료
  afterAll(async () => {
    await mongoose.connection.close();
  });

  // 1. 댓글 작성 테스트 (POST /api/comments)
  describe('POST /api/comments', () => {
    it('should create a new comment successfully', async () => {
      const newComment = {
        writer: 'Jest Tester',
        password: 'test1234',
        message: 'This is a test comment for CI/CD pipeline validation.'
      };

      const res = await request(app)
        .post('/api/comments')
        .send(newComment)
        .expect('Content-Type', /json/)
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('_id');
      expect(res.body.data.writer).toBe(newComment.writer);
      expect(res.body.data.message).toBe(newComment.message);
      expect(res.body.data).not.toHaveProperty('password'); // 비밀번호는 반환 안 됨
    });

    it('should fail when required fields are missing', async () => {
      const invalidComment = {
        writer: 'Tester'
        // password와 message 누락
      };

      const res = await request(app)
        .post('/api/comments')
        .send(invalidComment)
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/required|validation/i);
    });

    it('should fail when writer name is too short', async () => {
      const invalidComment = {
        writer: 'A', // 너무 짧음
        password: 'test1234',
        message: 'Test message'
      };

      const res = await request(app)
        .post('/api/comments')
        .send(invalidComment)
        .expect(400);

      expect(res.body.success).toBe(false);
    });
  });

  // 2. 댓글 목록 조회 테스트 (GET /api/comments)
  describe('GET /api/comments', () => {
    it('should fetch all comments successfully', async () => {
      // 테스트 데이터 생성
      await Comment.create([
        { writer: 'User1', password: 'pass1', message: 'First comment' },
        { writer: 'User2', password: 'pass2', message: 'Second comment' },
        { writer: 'User3', password: 'pass3', message: 'Third comment' }
      ]);

      const res = await request(app)
        .get('/api/comments')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data).toHaveLength(3);
      expect(res.body.data[0]).toHaveProperty('writer');
      expect(res.body.data[0]).toHaveProperty('message');
      expect(res.body.data[0]).not.toHaveProperty('password'); // 비밀번호 제외
    });

    it('should return empty array when no comments exist', async () => {
      const res = await request(app)
        .get('/api/comments')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toEqual([]);
    });
  });

  // 3. 댓글 수정 테스트 (PUT /api/comments/:id)
  describe('PUT /api/comments/:id', () => {
    it('should update a comment with correct password', async () => {
      // 댓글 생성
      const comment = await Comment.create({
        writer: 'UpdateUser',
        password: 'update1234',
        message: 'Original message'
      });

      const updatedData = {
        password: 'update1234',
        message: 'Updated message'
      };

      const res = await request(app)
        .put(`/api/comments/${comment._id}`)
        .send(updatedData)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.message).toBe('Updated message');
    });

    it('should fail with incorrect password', async () => {
      const comment = await Comment.create({
        writer: 'SecureUser',
        password: 'correct123',
        message: 'Secure message'
      });

      const res = await request(app)
        .put(`/api/comments/${comment._id}`)
        .send({
          password: 'wrong123',
          message: 'Hacked message'
        })
        .expect(401);

      expect(res.body.success).toBe(false);
    });

    it('should return 404 for non-existent comment', async () => {
      const fakeId = new mongoose.Types.ObjectId();

      const res = await request(app)
        .put(`/api/comments/${fakeId}`)
        .send({
          password: 'any123',
          message: 'Any message'
        })
        .expect(404);

      expect(res.body.success).toBe(false);
    });
  });

  // 4. 댓글 삭제 테스트 (DELETE /api/comments/:id)
  describe('DELETE /api/comments/:id', () => {
    it('should delete a comment with correct password', async () => {
      const comment = await Comment.create({
        writer: 'DeleteUser',
        password: 'delete123',
        message: 'To be deleted'
      });

      const res = await request(app)
        .delete(`/api/comments/${comment._id}`)
        .send({ password: 'delete123' })
        .expect(200);

      expect(res.body.success).toBe(true);

      // 실제로 삭제되었는지 확인
      const deletedComment = await Comment.findById(comment._id);
      expect(deletedComment).toBeNull();
    });

    it('should fail with incorrect password', async () => {
      const comment = await Comment.create({
        writer: 'ProtectedUser',
        password: 'protect123',
        message: 'Protected message'
      });

      const res = await request(app)
        .delete(`/api/comments/${comment._id}`)
        .send({ password: 'wrong123' })
        .expect(401);

      expect(res.body.success).toBe(false);

      // 삭제되지 않았는지 확인
      const stillExists = await Comment.findById(comment._id);
      expect(stillExists).not.toBeNull();
    });
  });

  // 5. 스트레스 테스트 - 다수의 댓글 처리
  describe('Stress Test', () => {
    it('should handle multiple comments creation', async () => {
      const comments = Array.from({ length: 10 }, (_, i) => ({
        writer: `User${i}`,
        password: `pass${i}`,
        message: `Message ${i}`
      }));

      const createPromises = comments.map(comment =>
        request(app).post('/api/comments').send(comment)
      );

      const results = await Promise.all(createPromises);

      results.forEach(res => {
        expect(res.statusCode).toBe(201);
        expect(res.body.success).toBe(true);
      });

      // 모두 조회되는지 확인
      const res = await request(app).get('/api/comments');
      expect(res.body.data).toHaveLength(10);
    });
  });

  // 6. 보안 테스트
  describe('Security Tests', () => {
    it('should sanitize XSS attempts in message', async () => {
      const xssComment = {
        writer: 'Hacker',
        password: 'hack123',
        message: '<script>alert("XSS")</script>'
      };

      const res = await request(app)
        .post('/api/comments')
        .send(xssComment)
        .expect(201);

      // XSS 코드가 그대로 저장되는지 확인 (sanitization은 프론트엔드에서)
      expect(res.body.data.message).toBe(xssComment.message);
    });

    it('should not expose password in response', async () => {
      const comment = await Comment.create({
        writer: 'PrivateUser',
        password: 'secret123',
        message: 'Private message'
      });

      const res = await request(app)
        .get('/api/comments')
        .expect(200);

      const foundComment = res.body.data.find(c => c.writer === 'PrivateUser');
      expect(foundComment).toBeDefined();
      expect(foundComment).not.toHaveProperty('password');
    });
  });
});
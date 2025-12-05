const request = require('supertest');
const app = require('../src/app'); // Express App
const Comment = require('../src/models/Comment');

// Mongoose Mocking (DB 연결 없이 테스트)
jest.mock('../src/models/Comment');

describe('💬 Comment API Integration Test', () => {
  
  // 1. 댓글 작성 테스트 (POST /api/comments)
  it('should create a new comment successfully', async () => {
    const newComment = {
      writer: 'Tester',
      password: '1234',
      message: 'This is a test comment for CI/CD pipeline.'
    };

    // Mock: save()가 성공했다고 가정
    Comment.create.mockResolvedValue(newComment);

    const res = await request(app)
      .post('/api/comments')
      .send(newComment);

    expect(res.statusCode).toBe(201); // 201 Created 확인
    expect(res.body.success).toBe(true);
    expect(res.body.data.writer).toBe(newComment.writer);
  });

  // 2. 댓글 목록 조회 테스트 (GET /api/comments)
  it('should fetch all comments', async () => {
    const mockComments = [
      { writer: 'User1', message: 'Hello' },
      { writer: 'User2', message: 'World' }
    ];

    // Mock: find()가 데이터를 반환한다고 가정
    Comment.find.mockResolvedValue(mockComments);

    const res = await request(app).get('/api/comments');

    expect(res.statusCode).toBe(200); // 200 OK 확인
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBe(2);
  });

  // 3. 유효성 검사 실패 테스트 (400 Bad Request)
  it('should return 400 if required fields are missing', async () => {
    const res = await request(app)
      .post('/api/comments')
      .send({ writer: 'NoMessageUser' }); // 메시지 누락

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Validation Error');
  });
});
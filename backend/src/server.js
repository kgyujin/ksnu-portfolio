require('dotenv').config({ path: '../.env' });
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/database');

const projectRoutes = require('./routes/projects');
const guestbookRoutes = require('./routes/guestbook');
const skillsRoutes = require('./routes/skills');
const statsRoutes = require('./routes/stats');
const commentsRoutes = require('./routes/comments');

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB 연결
connectDB();

// 보안 미들웨어
app.use(helmet());

// CORS 설정
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:8080',
  credentials: true
}));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15분
  max: 100 // 최대 100개 요청
});
app.use('/api/', limiter);

// 로깅
app.use(morgan('combined'));

// Body parser
app.use(express.json({ charset: 'utf-8' }));
app.use(express.urlencoded({ extended: true }));

// UTF-8 응답 헤더 설정
app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/projects', projectRoutes);
app.use('/api/guestbook', guestbookRoutes);
app.use('/api/skills', skillsRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/comments', commentsRoutes);

// 404 핸들러
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// 에러 핸들러
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  });
});

// 서버 시작
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 API Server is running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Database: MongoDB Atlas`);
});

module.exports = app;

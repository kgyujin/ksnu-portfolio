const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    const dbName = process.env.DB_NAME || 'portfolio';

    if (!mongoURI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    // MongoDB 연결 옵션
    const options = {
      dbName: dbName,
      serverSelectionTimeoutMS: 5000, // 5초 타임아웃
      socketTimeoutMS: 45000,
    };

    // MongoDB 연결
    await mongoose.connect(mongoURI, options);

    console.log('✅ MongoDB connected successfully');
    console.log(`📦 Database: ${dbName}`);
    console.log(`🌍 Host: ${mongoose.connection.host}`);

    // 연결 에러 핸들링
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });

    // 연결 끊김 핸들링
    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  MongoDB disconnected');
    });

    // 프로세스 종료 시 연결 정리
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('🔌 MongoDB connection closed through app termination');
      process.exit(0);
    });

  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;

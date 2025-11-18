const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || 'localhost',
  port: process.env.MYSQL_PORT || 3306,
  user: process.env.MYSQL_USER || 'portfolio_user',
  password: process.env.MYSQL_PASSWORD || 'portfolio_pass',
  database: process.env.MYSQL_DATABASE || 'portfolio_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  charset: 'utf8mb4'
});

// 연결 테스트 및 문자셋 설정
pool.getConnection()
  .then(async connection => {
    // UTF-8 설정 명시적으로 적용
    await connection.query("SET NAMES 'utf8mb4' COLLATE 'utf8mb4_unicode_ci'");
    await connection.query("SET CHARACTER SET utf8mb4");
    await connection.query("SET character_set_connection=utf8mb4");
    console.log('✅ Database connected successfully with UTF-8 encoding');
    connection.release();
  })
  .catch(err => {
    console.error('❌ Database connection failed:', err.message);
  });

module.exports = pool;

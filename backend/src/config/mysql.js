const mysql = require('mysql2/promise');

// MySQL 연결 풀 설정
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'portfolio_db',
  port: process.env.MYSQL_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

// 연결 테스트
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ MySQL 연결 성공');
    connection.release();
    return true;
  } catch (error) {
    console.log('⚠️  MySQL 연결 실패 (선택적 기능)');
    return false;
  }
}

// 초기화 시 연결 테스트 (실패해도 계속 진행)
testConnection().catch(() => {});

module.exports = { pool, testConnection };

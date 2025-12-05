const { pool } = require('../config/mysql');

class Project {
  // 프로젝트 목록 조회
  static async findAll() {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM projects WHERE is_deleted = 0 ORDER BY created_at DESC'
      );
      return rows;
    } catch (error) {
      console.log('MySQL 조회 실패, 기본 데이터 반환');
      return [];
    }
  }

  // 프로젝트 상세 조회
  static async findById(id) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM projects WHERE id = ? AND is_deleted = 0',
        [id]
      );
      return rows[0] || null;
    } catch (error) {
      console.log('MySQL 조회 실패');
      return null;
    }
  }

  // 프로젝트 생성
  static async create(projectData) {
    try {
      const { title, description, tech_stack, start_date, end_date, image_url } = projectData;
      const [result] = await pool.execute(
        'INSERT INTO projects (title, description, tech_stack, start_date, end_date, image_url) VALUES (?, ?, ?, ?, ?, ?)',
        [title, description, tech_stack, start_date, end_date, image_url]
      );
      return result.insertId;
    } catch (error) {
      console.log('MySQL 삽입 실패');
      return null;
    }
  }

  // 프로젝트 수정
  static async update(id, projectData) {
    try {
      const { title, description, tech_stack, start_date, end_date, image_url } = projectData;
      const [result] = await pool.execute(
        'UPDATE projects SET title = ?, description = ?, tech_stack = ?, start_date = ?, end_date = ?, image_url = ?, updated_at = NOW() WHERE id = ?',
        [title, description, tech_stack, start_date, end_date, image_url, id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.log('MySQL 업데이트 실패');
      return false;
    }
  }

  // 프로젝트 삭제 (소프트 삭제)
  static async delete(id) {
    try {
      const [result] = await pool.execute(
        'UPDATE projects SET is_deleted = 1, updated_at = NOW() WHERE id = ?',
        [id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.log('MySQL 삭제 실패');
      return false;
    }
  }
}

module.exports = Project;

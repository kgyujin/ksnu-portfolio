-- 포트폴리오 데이터베이스 초기화 스크립트

CREATE DATABASE IF NOT EXISTS portfolio_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE portfolio_db;

-- 프로젝트 테이블
CREATE TABLE IF NOT EXISTS projects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  tech_stack VARCHAR(500),
  start_date DATE,
  end_date DATE,
  image_url VARCHAR(500),
  github_url VARCHAR(500),
  demo_url VARCHAR(500),
  is_deleted TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_created_at (created_at),
  INDEX idx_is_deleted (is_deleted)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 기술 스택 테이블
CREATE TABLE IF NOT EXISTS skills (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  category VARCHAR(50),
  icon_url VARCHAR(500),
  proficiency INT DEFAULT 50,
  order_index INT DEFAULT 0,
  is_active TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_category (category),
  INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 방문자 통계 테이블
CREATE TABLE IF NOT EXISTS visit_stats (
  id INT AUTO_INCREMENT PRIMARY KEY,
  visit_date DATE NOT NULL,
  visit_count INT DEFAULT 0,
  unique_visitors INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_date (visit_date),
  INDEX idx_visit_date (visit_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 샘플 데이터 삽입
INSERT INTO projects (title, description, tech_stack, start_date, end_date, image_url) VALUES
('국립생태원', '연구원들이 공지사항 및 자료를 관리하고 데이터를 효율적으로 분류 및 조회할 수 있게 지원하는 데이터 관리 웹 사이트', 'Spring, MySQL, Tomcat', '2022-11-28', '2023-11-10', '/img/projects/project1.png'),
('대구어린이세상', '어린이와 가족들이 다양한 교육 콘텐츠와 서비스를 이용할 수 있는 웹 사이트', 'eGov, Oracle Database, Tomcat', '2023-03-31', '2023-07-26', '/img/projects/project2.png'),
('도서 관리 프로그램', '사용자가 손쉽게 도서와 회원을 관리할 수 있도록 C#으로 개발된 도서 관리 프로그램', 'C#(WPF .NET), MySQL', '2022-05-16', '2022-06-29', '/img/projects/project3.png');

INSERT INTO skills (name, category, icon_url, proficiency, order_index) VALUES
('Java', 'Backend', '/img/skills/Java-Light.svg', 85, 1),
('Spring', 'Backend', '/img/skills/Spring-Light.svg', 80, 2),
('Python', 'Backend', '/img/skills/Python-Light.svg', 75, 3),
('JavaScript', 'Frontend', '/img/skills/JavaScript.svg', 80, 4),
('React', 'Frontend', '/img/skills/React-Light.svg', 75, 5),
('MySQL', 'Database', '/img/skills/MySQL-Light.svg', 70, 6),
('Git', 'Tools', '/img/skills/Git.svg', 85, 7),
('Docker', 'DevOps', '/img/skills/Docker.svg', 65, 8);

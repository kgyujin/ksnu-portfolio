-- ====================================
-- 포트폴리오 데이터베이스 초기화 스크립트
-- ====================================

/*!40101 SET NAMES utf8mb4 */;
/*!40101 SET CHARACTER_SET_CLIENT=utf8mb4 */;
/*!40101 SET CHARACTER_SET_RESULTS=utf8mb4 */;
/*!40101 SET COLLATION_CONNECTION=utf8mb4_unicode_ci */;

-- 데이터베이스가 없으면 생성 (docker-compose에서 이미 생성하지만 명시)
CREATE DATABASE IF NOT EXISTS portfolio_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE portfolio_db;

-- ====================================
-- 프로젝트 테이블
-- ====================================
CREATE TABLE IF NOT EXISTS projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL COMMENT '프로젝트 제목',
    period VARCHAR(100) COMMENT '프로젝트 기간',
    description TEXT COMMENT '프로젝트 설명',
    skills TEXT COMMENT '사용 기술 스택 (JSON 또는 쉼표로 구분)',
    role TEXT COMMENT '담당 역할',
    review TEXT COMMENT '프로젝트 회고',
    image_url VARCHAR(500) COMMENT '프로젝트 대표 이미지 URL',
    project_url VARCHAR(500) COMMENT '프로젝트 링크',
    github_url VARCHAR(500) COMMENT 'GitHub 저장소 URL',
    view_count INT DEFAULT 0 COMMENT '조회수',
    is_featured BOOLEAN DEFAULT FALSE COMMENT '추천 프로젝트 여부',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_view_count (view_count),
    INDEX idx_featured (is_featured),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='프로젝트 정보 테이블';

-- ====================================
-- 방명록 테이블
-- ====================================
CREATE TABLE IF NOT EXISTS guestbook (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL COMMENT '작성자 이름',
    email VARCHAR(255) COMMENT '작성자 이메일',
    message TEXT NOT NULL COMMENT '방명록 메시지',
    password VARCHAR(255) COMMENT '비밀번호 (해시)',
    ip_address VARCHAR(45) COMMENT 'IP 주소',
    is_approved BOOLEAN DEFAULT TRUE COMMENT '승인 여부',
    is_deleted BOOLEAN DEFAULT FALSE COMMENT '삭제 여부',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_approved (is_approved),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='방명록 테이블';

-- ====================================
-- 스킬 테이블
-- ====================================
CREATE TABLE IF NOT EXISTS skills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL COMMENT '스킬 이름',
    category VARCHAR(50) COMMENT '카테고리 (언어, 프레임워크, 도구 등)',
    proficiency ENUM('Beginner', 'Intermediate', 'Advanced', 'Expert') DEFAULT 'Intermediate' COMMENT '숙련도',
    icon_url VARCHAR(500) COMMENT '아이콘 이미지 URL',
    display_order INT DEFAULT 0 COMMENT '표시 순서',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_skill_name (name),
    INDEX idx_category (category),
    INDEX idx_display_order (display_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='보유 스킬 테이블';

-- ====================================
-- 방문자 통계 테이블
-- ====================================
CREATE TABLE IF NOT EXISTS visitor_stats (
    id INT AUTO_INCREMENT PRIMARY KEY,
    visit_date DATE NOT NULL COMMENT '방문 날짜',
    visit_count INT DEFAULT 1 COMMENT '방문 횟수',
    unique_visitors INT DEFAULT 1 COMMENT '순 방문자 수',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_visit_date (visit_date),
    INDEX idx_visit_date (visit_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='방문자 통계 테이블';

-- ====================================
-- 샘플 데이터 삽입
-- ====================================

-- 프로젝트 샘플 데이터
INSERT INTO projects (title, period, description, skills, role, review, image_url, view_count, is_featured) VALUES
('국립생태원', '2022년 11월 28일 → 2023년 11월 10일', '연구원들이 공지사항 및 자료를 관리하고 데이터를 효율적으로 분류 및 조회할 수 있게 지원하는 데이터 관리 웹 사이트', 'Spring, MySQL, Tomcat', '자료 등록 및 관리 기능 구현, 리포트 제작 및 관리, 서버 및 데이터베이스 관리, 보안 강화', '엑셀 데이터 추출 등의 기능 개발을 통해 실무적 기술 능력을 한 단계 발전', 'img/projects/project1.png', 150, TRUE),
('대구어린이세상', '2023년 3월 31일 → 2023년 7월 26일', '어린이와 가족들이 다양한 교육 콘텐츠와 서비스를 이용할 수 있는 웹 사이트', 'eGov, Oracle Database, Tomcat', '게시판 구현 및 유지보수, API 테스트 및 구현, 서버 및 데이터베이스 관리, 보안 강화', '트래픽과 API 관련 다양한 예외 상황을 팀원들과 협력해 해결함으로써, 문제에 대처할 수 있는 능력 향상', 'img/projects/project2.png', 230, TRUE),
('도서 관리 프로그램', '2022년 5월 16일 → 2022년 6월 29일', '사용자가 손쉽게 도서와 회원을 관리할 수 있도록 C#으로 개발된 도서 관리 프로그램', 'C#(WPF .NET), MySQL', '전체 프로그램 설계 및 개발, 사용자 경험 개선', '사용자가 도서 및 회원 정보를 효율적으로 관리하고, 도서의 대여 및 반납 프로세스를 손쉽게 처리할 수 있는 프로그램을 제공', 'img/projects/project3.png', 89, FALSE),
('이무아', '2022년 3월 24일 → 2022년 6월 24일', '인공지능을 활용한 사물 인식 모바일 앱', 'Android Studio, Java, TensorFlow', '애플리케이션 개발 및 구현, PPT 제작', '학습한 이미지들을 혼동하는 문제를 해결하기 위해 다량의 이미지를 학습시키고, 다양한 각도에서 사물을 인식할 수 있도록 개선', 'img/projects/project4.png', 124, FALSE),
('TIL', '2022년 7월 11일 → 2022년 8월 17일', '일일 학습 내용을 정리하고 Contributions에 기록을 남기며 개발 의지를 고취시킨 웹 사이드 프로젝트', 'Node.js, Docsify, Markdown', '프로젝트 전체 기획, 개발, 배포', 'Docsify 초기 사용 시 해당 기술과 관련 문서들을 학습하고 프로젝트에 적용하는 데 시간이 필요했으나 학습 동기 유지 및 개발에 대한 열정을 높일 수 있었으며, Contributions에 기록을 남기는 부수적 효과와 각 기술에 대한 이해도 향상', 'img/projects/project5.png', 95, FALSE),
('CI3 학습 노트', '2022년 4월 28일 → 2022년 6월 23일', '학습 내용을 체계적으로 되돌아볼 수 있는 웹 기반 학습 노트', 'PHP, CodeIgniter, XAMPP, MySQL', '프로젝트 개발 및 배포, 데이터베이스 관리', '사용자 인터페이스 사용성 개선 작업을 통해 사용자 경험 향상을 도모하고, PHP와 CodeIgniter에 대한 이해도 향상', 'img/projects/project6.png', 67, FALSE);

-- 스킬 샘플 데이터
INSERT INTO skills (name, category, proficiency, icon_url, display_order) VALUES
('Java', 'Language', 'Advanced', 'img/skills/Java-Light.svg', 1),
('Spring', 'Framework', 'Advanced', 'img/skills/Spring-Light.svg', 2),
('JavaScript', 'Language', 'Intermediate', 'img/skills/JavaScript.svg', 3),
('React', 'Framework', 'Intermediate', 'img/skills/React-Light.svg', 4),
('MySQL', 'Database', 'Advanced', 'img/skills/MySQL-Light.svg', 5),
('Python', 'Language', 'Intermediate', 'img/skills/Python-Light.svg', 6),
('C#', 'Language', 'Intermediate', 'img/skills/CS.svg', 7),
('Git', 'Tool', 'Advanced', 'img/skills/Git.svg', 8),
('Docker', 'Tool', 'Intermediate', 'img/skills/Docker.svg', 9),
('GitHub Actions', 'Tool', 'Intermediate', 'img/skills/GithubActions-Light.svg', 10);

-- 방명록 샘플 데이터
INSERT INTO guestbook (name, email, message, is_approved) VALUES
('방문자1', 'visitor1@example.com', '멋진 포트폴리오네요! 프로젝트들이 인상적입니다.', TRUE),
('방문자2', 'visitor2@example.com', '웹 개발 실력이 훌륭하시네요. 응원합니다!', TRUE),
('개발자A', 'developer@example.com', '코드 구조가 깔끔하고 좋습니다. 많은 도움이 되었습니다.', TRUE);

-- 방문자 통계 초기 데이터
INSERT INTO visitor_stats (visit_date, visit_count, unique_visitors) VALUES
(CURDATE(), 1, 1);

-- ====================================
-- 인덱스 최적화 및 통계 업데이트
-- ====================================
ANALYZE TABLE projects;
ANALYZE TABLE guestbook;
ANALYZE TABLE skills;
ANALYZE TABLE visitor_stats;

-- ====================================
-- 완료 메시지
-- ====================================
SELECT 'Database initialization completed successfully!' AS Status;

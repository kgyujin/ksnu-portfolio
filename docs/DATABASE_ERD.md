# 데이터베이스 ERD (Entity Relationship Diagram)

## 1. MongoDB 스키마 (NoSQL)

```
┌─────────────────────────────────────────────────────────────────┐
│                         MongoDB Database                         │
│                         (portfolio)                              │
└─────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│                    Collection: comments                     │
├────────────────────────────────────────────────────────────┤
│  _id              : ObjectId (PK)                          │
│  name             : String (required, max: 50)             │
│  content          : String (required, max: 500)            │
│  password         : String (hashed, required)              │
│  projectId        : String (optional, indexed)             │
│  parentId         : ObjectId (optional, self-reference)    │
│  createdAt        : Date (default: now)                    │
│  updatedAt        : Date (auto-update)                     │
│  isDeleted        : Boolean (default: false)               │
│  ipAddress        : String (optional)                      │
│  userAgent        : String (optional)                      │
├────────────────────────────────────────────────────────────┤
│  Indexes:                                                   │
│  - projectId (1)                                           │
│  - createdAt (-1)                                          │
│  - isDeleted (1)                                           │
└────────────────────────────────────────────────────────────┘
                    │
                    │ (Self-Reference)
                    │
                    └──────────┐
                               │
                               ▼
                    ┌──────────────────┐
                    │  Nested Replies  │
                    │  (parentId ref)  │
                    └──────────────────┘

┌────────────────────────────────────────────────────────────┐
│                  Collection: guestbook                      │
├────────────────────────────────────────────────────────────┤
│  _id              : ObjectId (PK)                          │
│  name             : String (required, max: 50)             │
│  email            : String (optional, validated)           │
│  message          : String (required, max: 1000)           │
│  rating           : Number (1-5, optional)                 │
│  isPublic         : Boolean (default: true)                │
│  createdAt        : Date (default: now)                    │
│  updatedAt        : Date (auto-update)                     │
│  likes            : Number (default: 0)                    │
│  views            : Number (default: 0)                    │
│  ipAddress        : String (optional)                      │
├────────────────────────────────────────────────────────────┤
│  Indexes:                                                   │
│  - createdAt (-1)                                          │
│  - isPublic (1)                                            │
│  - rating (1)                                              │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│                   Collection: sessions                      │
├────────────────────────────────────────────────────────────┤
│  _id              : String (PK, session ID)                │
│  expires          : Date (TTL index)                       │
│  session          : Object (session data)                  │
│    ├─ userId      : String                                 │
│    ├─ role        : String (admin/user)                    │
│    └─ loginAt     : Date                                   │
├────────────────────────────────────────────────────────────┤
│  Indexes:                                                   │
│  - expires (1, TTL: auto-delete)                           │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│                Collection: tensorflow_logs                  │
├────────────────────────────────────────────────────────────┤
│  _id              : ObjectId (PK)                          │
│  sessionId        : String (indexed)                       │
│  timestamp        : Date (default: now)                    │
│  interestScore    : Number (0-1)                           │
│  behaviorVector   : Array<Number> (9 features)             │
│    ├─ [0] scrollDepth                                      │
│    ├─ [1] clickCount                                       │
│    ├─ [2] timeSpent                                        │
│    ├─ [3] hoverCount                                       │
│    ├─ [4] sectionTime                                      │
│    ├─ [5] projectCount                                     │
│    ├─ [6] analysisCount                                    │
│    ├─ [7] deepScroll (boolean)                             │
│    └─ [8] hasClicks (boolean)                              │
│  projectInterests : Object<String, Number>                 │
│  topProject       : String                                 │
│  idleTime         : Number (seconds)                       │
│  idlePenalty      : Number (0.3-1.0)                       │
│  userAgent        : String                                 │
│  ipAddress        : String                                 │
├────────────────────────────────────────────────────────────┤
│  Indexes:                                                   │
│  - sessionId (1)                                           │
│  - timestamp (-1)                                          │
└────────────────────────────────────────────────────────────┘
```

## 2. MySQL 스키마 (Relational)

```
┌─────────────────────────────────────────────────────────────────┐
│                          MySQL Database                          │
│                         (portfolio_db)                           │
└─────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│                      Table: projects                        │
├────────────────────────────────────────────────────────────┤
│  id               : INT AUTO_INCREMENT (PK)                │
│  title            : VARCHAR(255) NOT NULL                  │
│  description      : TEXT                                   │
│  tech_stack       : VARCHAR(500)                           │
│  start_date       : DATE                                   │
│  end_date         : DATE                                   │
│  image_url        : VARCHAR(500)                           │
│  github_url       : VARCHAR(500)                           │
│  demo_url         : VARCHAR(500)                           │
│  is_deleted       : TINYINT(1) DEFAULT 0                   │
│  created_at       : TIMESTAMP DEFAULT CURRENT_TIMESTAMP    │
│  updated_at       : TIMESTAMP DEFAULT CURRENT_TIMESTAMP    │
│                     ON UPDATE CURRENT_TIMESTAMP            │
├────────────────────────────────────────────────────────────┤
│  Indexes:                                                   │
│  - idx_created_at (created_at)                             │
│  - idx_is_deleted (is_deleted)                             │
├────────────────────────────────────────────────────────────┤
│  Constraints:                                               │
│  - title NOT NULL                                          │
│  - start_date <= end_date (CHECK)                          │
└────────────────────────────────────────────────────────────┘
                    │
                    │ 1:N
                    │
                    ▼
┌────────────────────────────────────────────────────────────┐
│                  Table: project_images                      │
├────────────────────────────────────────────────────────────┤
│  id               : INT AUTO_INCREMENT (PK)                │
│  project_id       : INT (FK → projects.id)                 │
│  image_url        : VARCHAR(500) NOT NULL                  │
│  image_order      : INT DEFAULT 0                          │
│  alt_text         : VARCHAR(255)                           │
│  created_at       : TIMESTAMP DEFAULT CURRENT_TIMESTAMP    │
├────────────────────────────────────────────────────────────┤
│  Indexes:                                                   │
│  - idx_project_id (project_id)                             │
│  - idx_image_order (image_order)                           │
├────────────────────────────────────────────────────────────┤
│  Foreign Keys:                                              │
│  - project_id → projects(id) ON DELETE CASCADE             │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│                       Table: skills                         │
├────────────────────────────────────────────────────────────┤
│  id               : INT AUTO_INCREMENT (PK)                │
│  name             : VARCHAR(100) NOT NULL                  │
│  category         : VARCHAR(50)                            │
│  icon_url         : VARCHAR(500)                           │
│  proficiency      : INT DEFAULT 50                         │
│  order_index      : INT DEFAULT 0                          │
│  is_active        : TINYINT(1) DEFAULT 1                   │
│  created_at       : TIMESTAMP DEFAULT CURRENT_TIMESTAMP    │
│  updated_at       : TIMESTAMP DEFAULT CURRENT_TIMESTAMP    │
│                     ON UPDATE CURRENT_TIMESTAMP            │
├────────────────────────────────────────────────────────────┤
│  Indexes:                                                   │
│  - idx_category (category)                                 │
│  - idx_is_active (is_active)                               │
│  - idx_order_index (order_index)                           │
├────────────────────────────────────────────────────────────┤
│  Constraints:                                               │
│  - name NOT NULL UNIQUE                                    │
│  - proficiency BETWEEN 0 AND 100 (CHECK)                   │
│  - category IN ('Frontend', 'Backend', 'Database',         │
│                  'DevOps', 'Tools', 'Languages') (CHECK)   │
└────────────────────────────────────────────────────────────┘
                    │
                    │ N:M
                    │
                    ▼
┌────────────────────────────────────────────────────────────┐
│                 Table: project_skills                       │
├────────────────────────────────────────────────────────────┤
│  id               : INT AUTO_INCREMENT (PK)                │
│  project_id       : INT (FK → projects.id)                 │
│  skill_id         : INT (FK → skills.id)                   │
│  usage_level      : INT DEFAULT 50                         │
│  created_at       : TIMESTAMP DEFAULT CURRENT_TIMESTAMP    │
├────────────────────────────────────────────────────────────┤
│  Indexes:                                                   │
│  - idx_project_id (project_id)                             │
│  - idx_skill_id (skill_id)                                 │
│  - unique_project_skill (project_id, skill_id) UNIQUE      │
├────────────────────────────────────────────────────────────┤
│  Foreign Keys:                                              │
│  - project_id → projects(id) ON DELETE CASCADE             │
│  - skill_id → skills(id) ON DELETE CASCADE                 │
└────────────────────────────────────────────────────────────┘
                    │
                    │
                    ▼
┌────────────────────────────────────────────────────────────┐
│                     Table: visit_stats                      │
├────────────────────────────────────────────────────────────┤
│  id               : INT AUTO_INCREMENT (PK)                │
│  visit_date       : DATE NOT NULL UNIQUE                   │
│  visit_count      : INT DEFAULT 0                          │
│  unique_visitors  : INT DEFAULT 0                          │
│  page_views       : INT DEFAULT 0                          │
│  avg_session_time : INT DEFAULT 0 (seconds)                │
│  bounce_rate      : DECIMAL(5,2) DEFAULT 0.00              │
│  created_at       : TIMESTAMP DEFAULT CURRENT_TIMESTAMP    │
│  updated_at       : TIMESTAMP DEFAULT CURRENT_TIMESTAMP    │
│                     ON UPDATE CURRENT_TIMESTAMP            │
├────────────────────────────────────────────────────────────┤
│  Indexes:                                                   │
│  - unique_date (visit_date) UNIQUE                         │
│  - idx_visit_date (visit_date)                             │
├────────────────────────────────────────────────────────────┤
│  Constraints:                                               │
│  - visit_date NOT NULL                                     │
│  - visit_count >= 0 (CHECK)                                │
│  - unique_visitors >= 0 (CHECK)                            │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│                      Table: users                           │
├────────────────────────────────────────────────────────────┤
│  id               : INT AUTO_INCREMENT (PK)                │
│  username         : VARCHAR(50) NOT NULL UNIQUE            │
│  email            : VARCHAR(100) NOT NULL UNIQUE           │
│  password_hash    : VARCHAR(255) NOT NULL                  │
│  role             : ENUM('admin', 'user') DEFAULT 'user'   │
│  is_active        : TINYINT(1) DEFAULT 1                   │
│  last_login       : TIMESTAMP NULL                         │
│  created_at       : TIMESTAMP DEFAULT CURRENT_TIMESTAMP    │
│  updated_at       : TIMESTAMP DEFAULT CURRENT_TIMESTAMP    │
│                     ON UPDATE CURRENT_TIMESTAMP            │
├────────────────────────────────────────────────────────────┤
│  Indexes:                                                   │
│  - unique_username (username) UNIQUE                       │
│  - unique_email (email) UNIQUE                             │
│  - idx_role (role)                                         │
│  - idx_is_active (is_active)                               │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│                    Table: audit_logs                        │
├────────────────────────────────────────────────────────────┤
│  id               : BIGINT AUTO_INCREMENT (PK)             │
│  user_id          : INT (FK → users.id)                    │
│  action           : VARCHAR(50) NOT NULL                   │
│  entity_type      : VARCHAR(50)                            │
│  entity_id        : INT                                    │
│  old_value        : JSON                                   │
│  new_value        : JSON                                   │
│  ip_address       : VARCHAR(45)                            │
│  user_agent       : VARCHAR(255)                           │
│  created_at       : TIMESTAMP DEFAULT CURRENT_TIMESTAMP    │
├────────────────────────────────────────────────────────────┤
│  Indexes:                                                   │
│  - idx_user_id (user_id)                                   │
│  - idx_created_at (created_at)                             │
│  - idx_action (action)                                     │
│  - idx_entity (entity_type, entity_id)                     │
├────────────────────────────────────────────────────────────┤
│  Foreign Keys:                                              │
│  - user_id → users(id) ON DELETE SET NULL                  │
└────────────────────────────────────────────────────────────┘
```

## 3. 데이터베이스 관계도 (Combined View)

```
┌─────────────────────────────────────────────────────────────────┐
│                    Hybrid Database Architecture                  │
└─────────────────────────────────────────────────────────────────┘

         MySQL (Relational)              MongoDB (NoSQL)
┌──────────────────────────────┐  ┌──────────────────────────┐
│                              │  │                          │
│  ┌────────────────────┐      │  │  ┌────────────────────┐ │
│  │     projects       │      │  │  │    comments        │ │
│  │  (id, title, ...)  │◄─────┼──┼──│  (projectId ref)   │ │
│  └────────┬───────────┘      │  │  └────────────────────┘ │
│           │                  │  │           │              │
│           │ 1:N              │  │           │ Self-Ref     │
│           │                  │  │           └──────┐       │
│  ┌────────▼───────────┐      │  │                  ▼       │
│  │  project_images    │      │  │  ┌────────────────────┐ │
│  │  (project_id FK)   │      │  │  │  Nested Replies    │ │
│  └────────────────────┘      │  │  │  (parentId)        │ │
│                              │  │  └────────────────────┘ │
│  ┌────────────────────┐      │  │                          │
│  │      skills        │      │  │  ┌────────────────────┐ │
│  │  (id, name, ...)   │      │  │  │    guestbook       │ │
│  └────────┬───────────┘      │  │  │  (name, message)   │ │
│           │                  │  │  └────────────────────┘ │
│           │ N:M              │  │                          │
│           │                  │  │  ┌────────────────────┐ │
│  ┌────────▼───────────┐      │  │  │    sessions        │ │
│  │  project_skills    │      │  │  │  (session data)    │ │
│  │  (many-to-many)    │      │  │  └────────────────────┘ │
│  └────────────────────┘      │  │                          │
│                              │  │  ┌────────────────────┐ │
│  ┌────────────────────┐      │  │  │ tensorflow_logs    │ │
│  │   visit_stats      │      │  │  │  (behavior data)   │ │
│  │  (analytics)       │      │  │  └────────────────────┘ │
│  └────────────────────┘      │  │                          │
│                              │  └──────────────────────────┘
│  ┌────────────────────┐      │
│  │      users         │      │
│  │  (authentication)  │      │
│  └────────┬───────────┘      │
│           │ 1:N              │
│           │                  │
│  ┌────────▼───────────┐      │
│  │   audit_logs       │      │
│  │  (user_id FK)      │      │
│  └────────────────────┘      │
│                              │
└──────────────────────────────┘

         Application Layer
┌─────────────────────────────────┐
│     Backend API (Node.js)       │
│  ┌──────────────────────────┐  │
│  │  MySQL2 Driver           │  │
│  │  - projects              │  │
│  │  - skills                │  │
│  │  - stats                 │  │
│  └──────────────────────────┘  │
│  ┌──────────────────────────┐  │
│  │  Mongoose ODM            │  │
│  │  - comments              │  │
│  │  - guestbook             │  │
│  │  - tensorflow_logs       │  │
│  └──────────────────────────┘  │
└─────────────────────────────────┘
```

## 4. 데이터베이스 선택 기준

| 데이터 타입 | 데이터베이스 | 이유 |
|------------|-------------|------|
| 프로젝트 정보 | MySQL | 구조화된 데이터, 관계형 필요 |
| 기술 스택 | MySQL | 프로젝트와 N:M 관계 |
| 방문 통계 | MySQL | 집계 쿼리, ACID 트랜잭션 |
| 댓글/방명록 | MongoDB | 유연한 스키마, 중첩 구조 |
| 세션 데이터 | MongoDB | TTL 인덱스, 빠른 읽기/쓰기 |
| TensorFlow 로그 | MongoDB | 대량 로그, 배열 데이터 |

## 5. 백업 전략

```
┌──────────────────────────────────────────────────────────────┐
│                       Backup Strategy                         │
│                                                               │
│  MySQL Backup (Automated Daily)                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  mysqldump --all-databases                              │ │
│  │  Retention: 7 days (daily) + 4 weeks (weekly)          │ │
│  │  Location: AWS S3 / Google Cloud Storage               │ │
│  │  Encryption: AES-256                                    │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                               │
│  MongoDB Backup (Automated Daily)                            │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  mongodump --archive                                    │ │
│  │  Retention: 7 days (daily) + 4 weeks (weekly)          │ │
│  │  Location: AWS S3 / Google Cloud Storage               │ │
│  │  Encryption: AES-256                                    │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                               │
│  Recovery Time Objective (RTO): < 1 hour                     │
│  Recovery Point Objective (RPO): < 24 hours                  │
└──────────────────────────────────────────────────────────────┘
```

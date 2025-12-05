# 클라이언트-서버 데이터 흐름도

## 1. 전체 데이터 흐름 개요

```
┌──────────────────────────────────────────────────────────────────┐
│                   Client-Server Data Flow                         │
└──────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    Client (Browser)                              │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │                 React Application                          │ │
│  │  ┌─────────────────────────────────────────────────────┐  │ │
│  │  │  Components                                          │  │ │
│  │  │  - Header.jsx                                        │  │ │
│  │  │  - Projects.jsx                                      │  │ │
│  │  │  - Skills.jsx                                        │  │ │
│  │  │  - Comments.jsx                                      │  │ │
│  │  │  - TensorFlowMonitor.jsx                            │  │ │
│  │  └──────────────────┬──────────────────────────────────┘  │ │
│  │                     │                                       │ │
│  │  ┌──────────────────▼──────────────────────────────────┐  │ │
│  │  │  API Service Layer (services/api.js)                │  │ │
│  │  │  - fetchProjects()                                   │  │ │
│  │  │  - fetchSkills()                                     │  │ │
│  │  │  - fetchComments()                                   │  │ │
│  │  │  - createComment()                                   │  │ │
│  │  │  - deleteComment()                                   │  │ │
│  │  └──────────────────┬──────────────────────────────────┘  │ │
│  └─────────────────────┼─────────────────────────────────────┘ │
└────────────────────────┼───────────────────────────────────────┘
                         │
                         │ HTTP/HTTPS (REST API)
                         │ JSON Format
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                  Backend Server (Node.js)                        │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │              Express.js Application                        │ │
│  │  ┌─────────────────────────────────────────────────────┐  │ │
│  │  │  Middleware Stack                                    │  │ │
│  │  │  - CORS (cross-origin handling)                      │  │ │
│  │  │  - body-parser (JSON parsing)                        │  │ │
│  │  │  - morgan (logging)                                  │  │ │
│  │  │  - helmet (security headers)                         │  │ │
│  │  └──────────────────┬──────────────────────────────────┘  │ │
│  │                     │                                       │ │
│  │  ┌──────────────────▼──────────────────────────────────┐  │ │
│  │  │  Route Handlers                                      │  │ │
│  │  │  - /api/projects   → projectsRouter                  │  │ │
│  │  │  - /api/skills     → skillsRouter                    │  │ │
│  │  │  - /api/comments   → commentsRouter                  │  │ │
│  │  │  - /api/guestbook  → guestbookRouter                 │  │ │
│  │  │  - /api/stats      → statsRouter                     │  │ │
│  │  └──────────────────┬──────────────────────────────────┘  │ │
│  │                     │                                       │ │
│  │  ┌──────────────────▼──────────────────────────────────┐  │ │
│  │  │  Controllers                                         │  │ │
│  │  │  - Validate input                                    │  │ │
│  │  │  - Business logic                                    │  │ │
│  │  │  - Call models                                       │  │ │
│  │  │  - Format response                                   │  │ │
│  │  └──────────────────┬──────────────────────────────────┘  │ │
│  │                     │                                       │ │
│  │  ┌──────────────────▼──────────────────────────────────┐  │ │
│  │  │  Models (ORM/ODM)                                    │  │ │
│  │  │  - Mongoose (MongoDB)                                │  │ │
│  │  │  - MySQL2 (MySQL)                                    │  │ │
│  │  └──────────────────┬──────────────────────────────────┘  │ │
│  └─────────────────────┼─────────────────────────────────────┘ │
└────────────────────────┼───────────────────────────────────────┘
                         │
         ┌───────────────┴───────────────┐
         │                               │
         ▼                               ▼
┌──────────────────┐            ┌──────────────────┐
│    MongoDB       │            │      MySQL       │
│  (NoSQL)         │            │  (Relational)    │
│                  │            │                  │
│  Collections:    │            │  Tables:         │
│  - comments      │            │  - projects      │
│  - guestbook     │            │  - skills        │
│  - sessions      │            │  - visit_stats   │
└──────────────────┘            └──────────────────┘
```

## 2. API 엔드포인트별 데이터 흐름

### 2.1 프로젝트 조회 (GET /api/projects)

```
┌──────────────────────────────────────────────────────────────────┐
│              GET /api/projects Data Flow                          │
└──────────────────────────────────────────────────────────────────┘

Browser → Projects.jsx component
         │
         ├─ useEffect(() => { fetchProjects(); }, [])
         │
         ▼
    services/api.js
         │
         ├─ const response = await fetch(
         │    'http://localhost:3000/api/projects',
         │    { method: 'GET', headers: { 'Content-Type': 'application/json' } }
         │  );
         │
         ▼
    HTTP GET Request
         │
         │ Request Headers:
         │ ├─ Accept: application/json
         │ ├─ Origin: http://localhost:5173
         │ └─ User-Agent: Mozilla/5.0...
         │
         ▼
┌─────────────────────────────────────────────────────────────────┐
│  Backend: Express.js Server                                      │
├─────────────────────────────────────────────────────────────────┤
│  1. CORS Middleware                                              │
│     ├─ Check Origin header                                       │
│     ├─ Add CORS headers to response                              │
│     └─ Allow: GET, POST, PUT, DELETE                             │
│                                                                  │
│  2. Router: /api/projects                                        │
│     └─ Match route → projectsRouter.get('/')                     │
│                                                                  │
│  3. Controller: getProjects()                                    │
│     ├─ const connection = await pool.getConnection();           │
│     ├─ const [rows] = await connection.query(                   │
│     │    'SELECT * FROM projects WHERE is_deleted = 0           │
│     │     ORDER BY created_at DESC'                              │
│     │  );                                                        │
│     ├─ connection.release();                                     │
│     └─ return res.json({ success: true, data: rows });          │
└─────────────────────────────────────────────────────────────────┘
         │
         ▼
    MySQL Query Execution
         │
         ├─ Table: projects
         ├─ Filter: is_deleted = 0
         └─ Sort: created_at DESC
         │
         ▼
    SQL Result: Array of Project Objects
         │
         ▼
    HTTP Response (JSON)
         │
         │ Response Body:
         │ {
         │   "success": true,
         │   "data": [
         │     {
         │       "id": 1,
         │       "title": "국립생태원",
         │       "description": "...",
         │       "tech_stack": "Spring, MySQL, Tomcat",
         │       "start_date": "2022-11-28",
         │       "end_date": "2023-11-10",
         │       "image_url": "/img/projects/project1.png",
         │       "github_url": "https://github.com/...",
         │       "demo_url": "https://...",
         │       "created_at": "2024-12-01T00:00:00.000Z"
         │     },
         │     ...
         │   ]
         │ }
         │
         │ Response Headers:
         │ ├─ Content-Type: application/json
         │ ├─ Access-Control-Allow-Origin: *
         │ └─ X-Powered-By: Express
         │
         ▼
    Browser receives response
         │
         ├─ response.json() → Parse JSON
         │
         ▼
    React State Update
         │
         ├─ setProjects(data)
         │
         ▼
    Component Re-render
         │
         └─ Display projects in UI
```

### 2.2 댓글 생성 (POST /api/comments)

```
┌──────────────────────────────────────────────────────────────────┐
│              POST /api/comments Data Flow                         │
└──────────────────────────────────────────────────────────────────┘

Browser → Comments.jsx component
         │
         ├─ User fills form:
         │  - name: "홍길동"
         │  - content: "훌륭한 프로젝트입니다!"
         │  - password: "1234"
         │
         ├─ User clicks submit button
         │
         ▼
    handleSubmit(e)
         │
         ├─ e.preventDefault()
         ├─ Validate input (length, required fields)
         │
         ▼
    services/api.js → createComment()
         │
         ├─ const response = await fetch(
         │    'http://localhost:3000/api/comments',
         │    {
         │      method: 'POST',
         │      headers: { 'Content-Type': 'application/json' },
         │      body: JSON.stringify({
         │        name: "홍길동",
         │        content: "훌륭한 프로젝트입니다!",
         │        password: "1234"
         │      })
         │    }
         │  );
         │
         ▼
    HTTP POST Request
         │
         │ Request Headers:
         │ ├─ Content-Type: application/json
         │ ├─ Content-Length: 123
         │ └─ Origin: http://localhost:5173
         │
         │ Request Body (JSON):
         │ {
         │   "name": "홍길동",
         │   "content": "훌륭한 프로젝트입니다!",
         │   "password": "1234"
         │ }
         │
         ▼
┌─────────────────────────────────────────────────────────────────┐
│  Backend: Express.js Server                                      │
├─────────────────────────────────────────────────────────────────┤
│  1. CORS Middleware                                              │
│     └─ Add CORS headers                                          │
│                                                                  │
│  2. body-parser Middleware                                       │
│     ├─ Parse JSON body                                           │
│     └─ req.body = { name: "홍길동", content: "...", ... }        │
│                                                                  │
│  3. Router: /api/comments                                        │
│     └─ Match route → commentsRouter.post('/')                    │
│                                                                  │
│  4. Controller: createComment()                                  │
│     ├─ Validate input:                                           │
│     │  - name: required, max 50 chars                            │
│     │  - content: required, max 500 chars                        │
│     │  - password: required, min 4 chars                         │
│     │                                                            │
│     ├─ Hash password:                                            │
│     │  const hashedPassword = await bcrypt.hash(                │
│     │    req.body.password, 10                                   │
│     │  );                                                        │
│     │                                                            │
│     ├─ Create comment document:                                  │
│     │  const comment = new Comment({                             │
│     │    name: req.body.name,                                    │
│     │    content: req.body.content,                              │
│     │    password: hashedPassword,                               │
│     │    ipAddress: req.ip,                                      │
│     │    userAgent: req.get('User-Agent'),                       │
│     │    createdAt: new Date()                                   │
│     │  });                                                       │
│     │                                                            │
│     ├─ Save to MongoDB:                                          │
│     │  await comment.save();                                     │
│     │                                                            │
│     └─ return res.status(201).json({                            │
│          success: true,                                          │
│          data: comment,                                          │
│          message: "댓글이 등록되었습니다."                         │
│        });                                                       │
└─────────────────────────────────────────────────────────────────┘
         │
         ▼
    MongoDB Insert Operation
         │
         ├─ Collection: comments
         ├─ Document:
         │  {
         │    _id: ObjectId("..."),
         │    name: "홍길동",
         │    content: "훌륭한 프로젝트입니다!",
         │    password: "$2b$10$...", (bcrypt hash)
         │    ipAddress: "127.0.0.1",
         │    userAgent: "Mozilla/5.0...",
         │    createdAt: ISODate("2024-12-05T10:30:00.000Z"),
         │    isDeleted: false
         │  }
         │
         ▼
    HTTP Response (JSON)
         │
         │ Status: 201 Created
         │
         │ Response Body:
         │ {
         │   "success": true,
         │   "data": {
         │     "_id": "...",
         │     "name": "홍길동",
         │     "content": "훌륭한 프로젝트입니다!",
         │     "createdAt": "2024-12-05T10:30:00.000Z"
         │   },
         │   "message": "댓글이 등록되었습니다."
         │ }
         │
         ▼
    Browser receives response
         │
         ├─ response.json() → Parse JSON
         │
         ▼
    React State Update
         │
         ├─ setComments([newComment, ...comments])
         ├─ Clear form inputs
         ├─ Show success message
         │
         ▼
    Component Re-render
         │
         └─ Display new comment in list
```

### 2.3 댓글 삭제 (DELETE /api/comments/:id)

```
┌──────────────────────────────────────────────────────────────────┐
│            DELETE /api/comments/:id Data Flow                     │
└──────────────────────────────────────────────────────────────────┘

Browser → Comments.jsx component
         │
         ├─ User clicks delete button on comment
         │
         ├─ Prompt for password:
         │  const password = prompt("댓글 비밀번호를 입력하세요:");
         │
         ▼
    handleDelete(commentId, password)
         │
         ├─ if (!password) return;  // User cancelled
         │
         ▼
    services/api.js → deleteComment()
         │
         ├─ const response = await fetch(
         │    `http://localhost:3000/api/comments/${commentId}`,
         │    {
         │      method: 'DELETE',
         │      headers: { 'Content-Type': 'application/json' },
         │      body: JSON.stringify({ password })
         │    }
         │  );
         │
         ▼
    HTTP DELETE Request
         │
         │ URL: /api/comments/674f1234567890abcdef1234
         │
         │ Request Body:
         │ { "password": "1234" }
         │
         ▼
┌─────────────────────────────────────────────────────────────────┐
│  Backend: Express.js Server                                      │
├─────────────────────────────────────────────────────────────────┤
│  1. Router: /api/comments/:id                                    │
│     ├─ Extract commentId from URL params                         │
│     └─ Match route → commentsRouter.delete('/:id')               │
│                                                                  │
│  2. Controller: deleteComment()                                  │
│     ├─ const { id } = req.params;                                │
│     ├─ const { password } = req.body;                            │
│     │                                                            │
│     ├─ Find comment in MongoDB:                                  │
│     │  const comment = await Comment.findById(id);               │
│     │                                                            │
│     ├─ Check if comment exists:                                  │
│     │  if (!comment) {                                           │
│     │    return res.status(404).json({                           │
│     │      success: false,                                       │
│     │      message: "댓글을 찾을 수 없습니다."                     │
│     │    });                                                     │
│     │  }                                                         │
│     │                                                            │
│     ├─ Verify password:                                          │
│     │  const isMatch = await bcrypt.compare(                     │
│     │    password,                                               │
│     │    comment.password                                        │
│     │  );                                                        │
│     │                                                            │
│     ├─ if (!isMatch) {                                           │
│     │    return res.status(401).json({                           │
│     │      success: false,                                       │
│     │      message: "비밀번호가 일치하지 않습니다."                 │
│     │    });                                                     │
│     │  }                                                         │
│     │                                                            │
│     ├─ Soft delete (update isDeleted flag):                     │
│     │  comment.isDeleted = true;                                 │
│     │  await comment.save();                                     │
│     │                                                            │
│     └─ return res.json({                                         │
│          success: true,                                          │
│          message: "댓글이 삭제되었습니다."                         │
│        });                                                       │
└─────────────────────────────────────────────────────────────────┘
         │
         ▼
    MongoDB Update Operation
         │
         ├─ Find document by _id
         ├─ Update: { isDeleted: true }
         └─ Save changes
         │
         ▼
    HTTP Response (JSON)
         │
         │ Status: 200 OK
         │
         │ Response Body:
         │ {
         │   "success": true,
         │   "message": "댓글이 삭제되었습니다."
         │ }
         │
         ▼
    Browser receives response
         │
         ├─ response.json() → Parse JSON
         │
         ▼
    React State Update
         │
         ├─ setComments(comments.filter(c => c._id !== commentId))
         ├─ Show success message
         │
         ▼
    Component Re-render
         │
         └─ Remove comment from UI
```

## 3. 에러 처리 흐름

```
┌──────────────────────────────────────────────────────────────────┐
│                    Error Handling Flow                            │
└──────────────────────────────────────────────────────────────────┘

Client Request
      │
      ▼
Backend receives request
      │
      ├─── Validation Error (400)
      │    ├─ Invalid input format
      │    ├─ Missing required fields
      │    └─ Response: { success: false, message: "..." }
      │
      ├─── Authentication Error (401)
      │    ├─ Invalid password
      │    ├─ Expired token
      │    └─ Response: { success: false, message: "..." }
      │
      ├─── Authorization Error (403)
      │    ├─ Insufficient permissions
      │    └─ Response: { success: false, message: "..." }
      │
      ├─── Not Found Error (404)
      │    ├─ Resource doesn't exist
      │    └─ Response: { success: false, message: "..." }
      │
      ├─── Database Error (500)
      │    ├─ Connection failed
      │    ├─ Query error
      │    ├─ Log error to console
      │    └─ Response: { success: false, message: "서버 오류" }
      │
      └─── Network Error
           ├─ Timeout
           ├─ Connection refused
           └─ Response: catch block in frontend
                │
                ▼
          Frontend Error Handling
                │
                ├─ Display error message to user
                ├─ Log to console
                ├─ Show retry button (if applicable)
                └─ Rollback optimistic UI updates
```

## 4. 실시간 데이터 동기화

```
┌──────────────────────────────────────────────────────────────────┐
│               Real-time Data Synchronization                      │
└──────────────────────────────────────────────────────────────────┘

Scenario: Multiple users viewing comments

User A Browser                    Backend                User B Browser
      │                              │                          │
      ├─── GET /api/comments ────────►                          │
      │                              │                          │
      │◄─── Comments [A, B, C] ──────┤                          │
      │                              │                          │
      │                              │◄─── GET /api/comments ───┤
      │                              │                          │
      │                              ├─── Comments [A, B, C] ───►
      │                              │                          │
User A posts new comment D           │                          │
      │                              │                          │
      ├─── POST /api/comments ───────►                          │
      │    (Comment D)               │                          │
      │                              ├─── Save to MongoDB       │
      │                              │                          │
      │◄─── Success ─────────────────┤                          │
      │                              │                          │
      ├─ Update local state          │                          │
      │  [D, A, B, C]                │                          │
      │                              │                          │
      │                              │                User B still sees
      │                              │                [A, B, C]
      │                              │                          │
User B manually refreshes            │                          │
      │                              │                          │
      │                              │◄─── GET /api/comments ───┤
      │                              │                          │
      │                              ├─── Comments [D, A, B, C] ►
      │                              │                          │
      │                              │                ├─ Update state
      │                              │                │  [D, A, B, C]
      │                              │                │
      │                              │                ▼
      │                              │        User B now sees D

Note: For true real-time sync, implement WebSocket or Server-Sent Events
```

## 5. 캐싱 전략

```
┌──────────────────────────────────────────────────────────────────┐
│                      Caching Strategy                             │
└──────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  Browser Cache (Client-side)                                     │
├─────────────────────────────────────────────────────────────────┤
│  Static Assets:                                                  │
│  ├─ Cache-Control: max-age=31536000 (1 year)                    │
│  ├─ Images: /img/projects/*, /img/skills/*                      │
│  ├─ CSS: /assets/*.css                                           │
│  └─ JS: /assets/*.js                                             │
│                                                                  │
│  API Responses:                                                  │
│  ├─ React Query (optional):                                      │
│  │  - Cache duration: 5 minutes                                  │
│  │  - Stale while revalidate                                     │
│  │  - Background refetch                                         │
│  │                                                               │
│  └─ Manual caching with useState:                                │
│     - Store in component state                                   │
│     - Refetch on mount or user action                            │
└─────────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│  CDN Cache (Vercel/GitHub Pages)                                │
├─────────────────────────────────────────────────────────────────┤
│  - Global edge network                                           │
│  - Automatic cache invalidation on deployment                    │
│  - Gzip/Brotli compression                                       │
│  - HTTP/2 multiplexing                                           │
└─────────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│  Backend Cache (Optional - Redis)                               │
├─────────────────────────────────────────────────────────────────┤
│  Frequently accessed data:                                       │
│  ├─ Projects list: TTL 1 hour                                    │
│  ├─ Skills list: TTL 1 hour                                      │
│  └─ Visit stats: TTL 5 minutes                                   │
│                                                                  │
│  Cache invalidation:                                             │
│  └─ On data update (POST, PUT, DELETE)                          │
└─────────────────────────────────────────────────────────────────┘
```

## 6. 보안 데이터 흐름

```
┌──────────────────────────────────────────────────────────────────┐
│                  Security Data Flow Layers                        │
└──────────────────────────────────────────────────────────────────┘

Client Request
      │
      ├─ HTTPS Encryption (TLS 1.3)
      │
      ▼
┌─────────────────────────────────────────────────────────────────┐
│  Layer 1: Network Security                                       │
├─────────────────────────────────────────────────────────────────┤
│  - HTTPS enforced                                                │
│  - Cloudflare DDoS protection                                    │
│  - Rate limiting (100 req/min per IP)                            │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│  Layer 2: Application Security                                   │
├─────────────────────────────────────────────────────────────────┤
│  CORS Policy:                                                    │
│  - Origin whitelist: [localhost:5173, vercel.app, github.io]    │
│  - Methods: GET, POST, PUT, DELETE                               │
│  - Credentials: false (no cookies)                               │
│                                                                  │
│  Input Validation:                                               │
│  - express-validator                                             │
│  - Sanitize HTML (prevent XSS)                                   │
│  - Escape SQL (prevent injection)                                │
│                                                                  │
│  Security Headers (Helmet.js):                                   │
│  - X-Content-Type-Options: nosniff                               │
│  - X-Frame-Options: DENY                                         │
│  - X-XSS-Protection: 1; mode=block                               │
│  - Content-Security-Policy: ...                                  │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│  Layer 3: Authentication & Authorization                         │
├─────────────────────────────────────────────────────────────────┤
│  Password Handling:                                              │
│  - bcrypt hashing (cost factor: 10)                              │
│  - Never store plaintext                                         │
│  - Compare hash on authentication                                │
│                                                                  │
│  Session Management (if applicable):                             │
│  - JWT tokens (HttpOnly cookies)                                 │
│  - Short expiration (15 minutes)                                 │
│  - Refresh token mechanism                                       │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│  Layer 4: Data Security                                          │
├─────────────────────────────────────────────────────────────────┤
│  Environment Variables:                                          │
│  - Sensitive data in .env (not in git)                           │
│  - Kubernetes Secrets (production)                               │
│                                                                  │
│  Database Security:                                              │
│  - MongoDB authentication enabled                                │
│  - MySQL user with limited privileges                            │
│  - Connection strings encrypted                                  │
│  - Regular backups                                               │
└─────────────────────────────────────────────────────────────────┘
```

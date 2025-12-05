# 컴포넌트 구조도

## 1. React 컴포넌트 계층 구조

```
┌──────────────────────────────────────────────────────────────────┐
│                    Component Hierarchy Tree                       │
└──────────────────────────────────────────────────────────────────┘

                          App.jsx
                         (Root)
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
   useTensorFlow()      Styles             Star Container
   (Custom Hook)        Imports            (Background)
        │                                       │
        ├─ isModelLoaded                       ├─ 100 star divs
        ├─ interestScore                       └─ Random positions
        ├─ projectInterests
        └─ topProject
        │
        ▼
┌─────────────────────────────────────────────────────────────────┐
│                       Main Component Tree                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   Header.jsx                                                     │
│   ├─ Navigation                                                  │
│   │  ├─ Logo/Name                                                │
│   │  └─ Nav Links (About, Skills, Projects, Comments)           │
│   └─ Mobile Menu Toggle                                          │
│                                                                  │
│   ┌──────────────────────────────────────────────────────────┐  │
│   │              main#main-container                          │  │
│   │                                                           │  │
│   │  About.jsx                                                │  │
│   │  ├─ Profile Image                                         │  │
│   │  ├─ Introduction Text                                     │  │
│   │  └─ Contact Info                                          │  │
│   │                                                           │  │
│   │  Introduce.jsx                                            │  │
│   │  ├─ Timeline Component                                    │  │
│   │  │  ├─ Education History                                  │  │
│   │  │  ├─ Work Experience                                    │  │
│   │  │  └─ Certifications                                     │  │
│   │  └─ Achievement Cards                                     │  │
│   │                                                           │  │
│   │  Skills.jsx                                               │  │
│   │  ├─ useEffect(() => fetchSkills())                        │  │
│   │  ├─ Skill Categories                                      │  │
│   │  │  ├─ Frontend                                           │  │
│   │  │  ├─ Backend                                            │  │
│   │  │  ├─ Database                                           │  │
│   │  │  ├─ DevOps                                             │  │
│   │  │  └─ Tools                                              │  │
│   │  └─ Skill Cards                                           │  │
│   │     ├─ Icon                                               │  │
│   │     ├─ Name                                               │  │
│   │     └─ Proficiency Bar                                    │  │
│   │                                                           │  │
│   │  Projects.jsx                                             │  │
│   │  ├─ useEffect(() => fetchProjects())                      │  │
│   │  ├─ Filter/Sort Controls                                  │  │
│   │  └─ Project Grid                                          │  │
│   │     └─ Project Cards (map)                                │  │
│   │        ├─ Image                                           │  │
│   │        ├─ Title                                           │  │
│   │        ├─ Description                                     │  │
│   │        ├─ Tech Stack Tags                                 │  │
│   │        ├─ Date Range                                      │  │
│   │        └─ Links (GitHub, Demo)                            │  │
│   │                                                           │  │
│   │  Comments.jsx                                             │  │
│   │  ├─ useEffect(() => fetchComments())                      │  │
│   │  ├─ Comment Form                                          │  │
│   │  │  ├─ Name Input                                         │  │
│   │  │  ├─ Content Textarea                                   │  │
│   │  │  ├─ Password Input                                     │  │
│   │  │  └─ Submit Button                                      │  │
│   │  └─ Comment List                                          │  │
│   │     └─ Comment Items (map)                                │  │
│   │        ├─ Author Name                                     │  │
│   │        ├─ Content                                         │  │
│   │        ├─ Timestamp                                       │  │
│   │        └─ Delete Button                                   │  │
│   └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│   Footer.jsx                                                     │
│   ├─ Copyright Info                                              │
│   ├─ Social Links                                                │
│   │  ├─ GitHub                                                   │
│   │  ├─ LinkedIn                                                 │
│   │  └─ Email                                                    │
│   └─ Additional Links                                            │
│                                                                  │
│   TensorFlowMonitor.jsx                                          │
│   ├─ Props: { isModelLoaded, interestScore,                     │
│   │           projectInterests, topProject }                     │
│   ├─ Position: fixed (left: 20px, bottom: 20px)                 │
│   ├─ Expandable/Collapsible                                      │
│   └─ Display Sections                                            │
│      ├─ Model Status                                             │
│      ├─ Overall Interest Score (large %)                         │
│      ├─ Top Project Highlight                                    │
│      ├─ Project Interest List                                    │
│      │  └─ Project Cards (map projectInterests)                  │
│      │     ├─ Project Name                                       │
│      │     ├─ Progress Bar                                       │
│      │     └─ Score Percentage                                   │
│      └─ Memory Info                                              │
│         ├─ Tensors Count                                         │
│         └─ Memory Usage                                          │
└─────────────────────────────────────────────────────────────────┘
```

## 2. 컴포넌트 상세 구조

### 2.1 App.jsx (Root Component)

```jsx
┌──────────────────────────────────────────────────────────────────┐
│                          App.jsx                                  │
├──────────────────────────────────────────────────────────────────┤
│  Imports:                                                         │
│  ├─ React, { useEffect }                                         │
│  ├─ All child components                                         │
│  ├─ useTensorFlow hook                                           │
│  ├─ statsAPI service                                             │
│  └─ CSS styles                                                   │
│                                                                  │
│  State/Hooks:                                                    │
│  └─ const { isModelLoaded, interestScore,                       │
│              projectInterests, topProject } = useTensorFlow();   │
│                                                                  │
│  Effects:                                                        │
│  └─ useEffect(() => {                                            │
│       statsAPI.recordVisit().catch(() => {});                   │
│     }, []);                                                      │
│                                                                  │
│  Render:                                                         │
│  └─ <div className="App">                                       │
│       ├─ Star background (100 divs)                             │
│       ├─ <Header />                                             │
│       ├─ <main id="main-container">                             │
│       │    ├─ <About />                                         │
│       │    ├─ <Introduce />                                     │
│       │    ├─ <Skills />                                        │
│       │    ├─ <Projects />                                      │
│       │    └─ <Comments />                                      │
│       │  </main>                                                │
│       ├─ <Footer />                                             │
│       └─ <TensorFlowMonitor                                     │
│            isModelLoaded={isModelLoaded}                         │
│            interestScore={interestScore}                         │
│            projectInterests={projectInterests}                   │
│            topProject={topProject}                               │
│          />                                                      │
│     </div>                                                       │
└──────────────────────────────────────────────────────────────────┘
```

### 2.2 Header.jsx (Navigation)

```jsx
┌──────────────────────────────────────────────────────────────────┐
│                        Header.jsx                                 │
├──────────────────────────────────────────────────────────────────┤
│  State:                                                           │
│  └─ const [mobileMenuOpen, setMobileMenuOpen] = useState(false); │
│                                                                  │
│  Functions:                                                      │
│  ├─ toggleMobileMenu() - Toggle mobile menu visibility          │
│  └─ handleNavClick(sectionId) - Smooth scroll to section        │
│                                                                  │
│  Render:                                                         │
│  └─ <header className="header">                                 │
│       ├─ <div className="logo">포트폴리오</div>                  │
│       ├─ <nav className="nav">                                  │
│       │    ├─ <a href="#about">About</a>                        │
│       │    ├─ <a href="#skills">Skills</a>                      │
│       │    ├─ <a href="#projects">Projects</a>                  │
│       │    └─ <a href="#comments">Comments</a>                  │
│       │  </nav>                                                 │
│       └─ <button className="mobile-menu-toggle"                 │
│                  onClick={toggleMobileMenu}>                     │
│            ☰                                                     │
│          </button>                                               │
│     </header>                                                    │
│                                                                  │
│  Features:                                                       │
│  ├─ Sticky header (position: fixed)                             │
│  ├─ Responsive design (mobile hamburger menu)                   │
│  └─ Smooth scroll navigation                                    │
└──────────────────────────────────────────────────────────────────┘
```

### 2.3 Skills.jsx (Skills Display)

```jsx
┌──────────────────────────────────────────────────────────────────┐
│                        Skills.jsx                                 │
├──────────────────────────────────────────────────────────────────┤
│  State:                                                           │
│  ├─ const [skills, setSkills] = useState([]);                    │
│  ├─ const [loading, setLoading] = useState(true);                │
│  ├─ const [error, setError] = useState(null);                    │
│  └─ const [selectedCategory, setSelectedCategory] = useState('All');│
│                                                                  │
│  Effects:                                                        │
│  └─ useEffect(() => {                                            │
│       const loadSkills = async () => {                          │
│         try {                                                    │
│           const data = await skillsAPI.getAll();                │
│           setSkills(data);                                       │
│         } catch (err) {                                          │
│           setError(err.message);                                 │
│         } finally {                                              │
│           setLoading(false);                                     │
│         }                                                        │
│       };                                                         │
│       loadSkills();                                              │
│     }, []);                                                      │
│                                                                  │
│  Functions:                                                      │
│  ├─ filterByCategory(category) - Filter skills by category      │
│  └─ getSkillColor(proficiency) - Get color based on level       │
│                                                                  │
│  Render:                                                         │
│  └─ <section id="skills" className="skills-section">            │
│       ├─ <h2>기술 스택</h2>                                      │
│       ├─ Category Filter Buttons                                │
│       │    ├─ All                                               │
│       │    ├─ Frontend                                          │
│       │    ├─ Backend                                           │
│       │    ├─ Database                                          │
│       │    ├─ DevOps                                            │
│       │    └─ Tools                                             │
│       └─ <div className="skills-grid">                          │
│            {skills.map(skill =>                                  │
│              <div key={skill.id} className="skill-card">        │
│                <img src={skill.icon_url} alt={skill.name} />    │
│                <h3>{skill.name}</h3>                             │
│                <div className="proficiency-bar">                 │
│                  <div className="proficiency-fill"              │
│                       style={{ width: `${skill.proficiency}%` }}/>│
│                </div>                                            │
│                <span>{skill.proficiency}%</span>                 │
│              </div>                                              │
│            )}                                                    │
│          </div>                                                  │
│     </section>                                                   │
└──────────────────────────────────────────────────────────────────┘
```

### 2.4 Projects.jsx (Project Gallery)

```jsx
┌──────────────────────────────────────────────────────────────────┐
│                       Projects.jsx                                │
├──────────────────────────────────────────────────────────────────┤
│  State:                                                           │
│  ├─ const [projects, setProjects] = useState([]);                │
│  ├─ const [loading, setLoading] = useState(true);                │
│  ├─ const [error, setError] = useState(null);                    │
│  ├─ const [sortBy, setSortBy] = useState('latest');              │
│  └─ const [searchTerm, setSearchTerm] = useState('');            │
│                                                                  │
│  Effects:                                                        │
│  └─ useEffect(() => {                                            │
│       const loadProjects = async () => {                        │
│         try {                                                    │
│           const data = await projectsAPI.getAll();              │
│           setProjects(data);                                     │
│         } catch (err) {                                          │
│           setError(err.message);                                 │
│         } finally {                                              │
│           setLoading(false);                                     │
│         }                                                        │
│       };                                                         │
│       loadProjects();                                            │
│     }, []);                                                      │
│                                                                  │
│  Functions:                                                      │
│  ├─ sortProjects(projects, sortBy) - Sort projects              │
│  ├─ filterProjects(projects, searchTerm) - Filter by keyword    │
│  └─ formatDate(dateString) - Format date display                │
│                                                                  │
│  Render:                                                         │
│  └─ <section id="projects" className="projects-section">        │
│       ├─ <h2>프로젝트</h2>                                       │
│       ├─ Controls                                                │
│       │    ├─ Search Input                                      │
│       │    └─ Sort Dropdown (latest/oldest/name)                │
│       └─ <div className="projects-grid">                        │
│            {projects.map(project =>                              │
│              <div key={project.id}                               │
│                   className="project-card"                       │
│                   data-project-id={project.id}>                  │
│                <img src={project.image_url} />                   │
│                <div className="project-info">                    │
│                  <h3>{project.title}</h3>                        │
│                  <p>{project.description}</p>                    │
│                  <div className="tech-stack">                    │
│                    {project.tech_stack.split(',').map(tech =>   │
│                      <span className="tech-tag">{tech}</span>    │
│                    )}                                            │
│                  </div>                                          │
│                  <div className="project-dates">                 │
│                    {formatDate(project.start_date)} -            │
│                    {formatDate(project.end_date)}                │
│                  </div>                                          │
│                  <div className="project-links">                 │
│                    <a href={project.github_url}>GitHub</a>       │
│                    <a href={project.demo_url}>Demo</a>           │
│                  </div>                                          │
│                </div>                                            │
│              </div>                                              │
│            )}                                                    │
│          </div>                                                  │
│     </section>                                                   │
└──────────────────────────────────────────────────────────────────┘
```

### 2.5 Comments.jsx (Comment System)

```jsx
┌──────────────────────────────────────────────────────────────────┐
│                       Comments.jsx                                │
├──────────────────────────────────────────────────────────────────┤
│  State:                                                           │
│  ├─ const [comments, setComments] = useState([]);                │
│  ├─ const [loading, setLoading] = useState(true);                │
│  ├─ const [formData, setFormData] = useState({                   │
│  │    name: '', content: '', password: ''                        │
│  │  });                                                          │
│  ├─ const [submitting, setSubmitting] = useState(false);         │
│  └─ const [message, setMessage] = useState(null);                │
│                                                                  │
│  Effects:                                                        │
│  └─ useEffect(() => {                                            │
│       const loadComments = async () => {                        │
│         const data = await commentsAPI.getAll();                │
│         setComments(data);                                       │
│         setLoading(false);                                       │
│       };                                                         │
│       loadComments();                                            │
│     }, []);                                                      │
│                                                                  │
│  Functions:                                                      │
│  ├─ handleInputChange(e) - Update form data                     │
│  ├─ handleSubmit(e) - Submit new comment                        │
│  │    ├─ Validate input                                         │
│  │    ├─ POST /api/comments                                     │
│  │    ├─ Update state with new comment                          │
│  │    └─ Clear form                                             │
│  ├─ handleDelete(commentId) - Delete comment                    │
│  │    ├─ Prompt for password                                    │
│  │    ├─ DELETE /api/comments/:id                               │
│  │    └─ Remove from state                                      │
│  └─ formatTimestamp(date) - Format relative time                │
│                                                                  │
│  Render:                                                         │
│  └─ <section id="comments" className="comments-section">        │
│       ├─ <h2>방명록</h2>                                         │
│       ├─ Comment Form                                            │
│       │    <form onSubmit={handleSubmit}>                        │
│       │      <input name="name" placeholder="이름"               │
│       │             value={formData.name}                        │
│       │             onChange={handleInputChange} />              │
│       │      <textarea name="content" placeholder="내용"         │
│       │                value={formData.content}                  │
│       │                onChange={handleInputChange} />           │
│       │      <input type="password" name="password"             │
│       │             placeholder="비밀번호"                        │
│       │             value={formData.password}                    │
│       │             onChange={handleInputChange} />              │
│       │      <button type="submit" disabled={submitting}>       │
│       │        {submitting ? '등록 중...' : '등록'}              │
│       │      </button>                                           │
│       │    </form>                                               │
│       └─ Comment List                                            │
│            <div className="comments-list">                       │
│              {comments.map(comment =>                            │
│                <div key={comment._id} className="comment-item"> │
│                  <div className="comment-header">                │
│                    <span className="author">{comment.name}</span>│
│                    <span className="timestamp">                  │
│                      {formatTimestamp(comment.createdAt)}        │
│                    </span>                                       │
│                  </div>                                          │
│                  <p className="comment-content">                 │
│                    {comment.content}                             │
│                  </p>                                            │
│                  <button className="delete-btn"                  │
│                          onClick={() => handleDelete(comment._id)}>│
│                    삭제                                           │
│                  </button>                                       │
│                </div>                                            │
│              )}                                                  │
│            </div>                                                │
│     </section>                                                   │
└──────────────────────────────────────────────────────────────────┘
```

### 2.6 TensorFlowMonitor.jsx (AI Monitor)

```jsx
┌──────────────────────────────────────────────────────────────────┐
│                   TensorFlowMonitor.jsx                           │
├──────────────────────────────────────────────────────────────────┤
│  Props:                                                           │
│  ├─ isModelLoaded: boolean                                       │
│  ├─ interestScore: number (0-1)                                  │
│  ├─ projectInterests: Object<string, number>                     │
│  └─ topProject: string                                           │
│                                                                  │
│  State:                                                           │
│  ├─ const [expanded, setExpanded] = useState(true);              │
│  └─ const [memoryInfo, setMemoryInfo] = useState(null);          │
│                                                                  │
│  Effects:                                                        │
│  └─ useEffect(() => {                                            │
│       const interval = setInterval(() => {                      │
│         const info = tf.memory();                                │
│         setMemoryInfo(info);                                     │
│       }, 5000);                                                  │
│       return () => clearInterval(interval);                     │
│     }, []);                                                      │
│                                                                  │
│  Functions:                                                      │
│  ├─ toggleExpanded() - Toggle monitor visibility                │
│  ├─ getScoreColor(score) - Get color based on score             │
│  │    ├─ >0.7: green (HIGH)                                     │
│  │    ├─ 0.4-0.7: yellow (MEDIUM)                               │
│  │    └─ <0.4: red (LOW)                                        │
│  └─ formatScore(score) - Format as percentage                   │
│                                                                  │
│  Render:                                                         │
│  └─ <div className="tensorflow-monitor"                         │
│           style={{ left: '20px', bottom: '20px' }}>             │
│       ├─ Header                                                  │
│       │    ├─ Title: "채용 담당자 관심 프로젝트 예측"             │
│       │    ├─ Model Status Badge                                │
│       │    └─ Expand/Collapse Button                            │
│       ├─ {expanded && (                                          │
│       │    <>                                                    │
│       │      Overall Interest Score                             │
│       │      <div className="score-display">                     │
│       │        <span style={{ color: getScoreColor(score) }}>   │
│       │          {formatScore(interestScore)}                    │
│       │        </span>                                           │
│       │      </div>                                              │
│       │                                                          │
│       │      Top Project Highlight                              │
│       │      {topProject && (                                    │
│       │        <div className="top-project">                     │
│       │          <strong>{topProject}</strong>                   │
│       │          <span>{formatScore(projectInterests[topProject])}│
│       │          </span>                                         │
│       │        </div>                                            │
│       │      )}                                                  │
│       │                                                          │
│       │      Project Interest List                              │
│       │      <div className="project-list">                      │
│       │        {Object.entries(projectInterests).map(([name, score]) =>│
│       │          <div key={name} className="project-item">      │
│       │            <span>{name}</span>                           │
│       │            <div className="progress-bar">                │
│       │              <div className="progress-fill"             │
│       │                   style={{ width: `${score * 100}%` }}/>│
│       │            </div>                                        │
│       │            <span>{formatScore(score)}</span>             │
│       │          </div>                                          │
│       │        )}                                                │
│       │      </div>                                              │
│       │                                                          │
│       │      Memory Info                                         │
│       │      {memoryInfo && (                                    │
│       │        <div className="memory-info">                     │
│       │          <div>Tensors: {memoryInfo.numTensors}</div>     │
│       │          <div>Memory: {(memoryInfo.numBytes / 1024).toFixed(0)} KB│
│       │          </div>                                          │
│       │        </div>                                            │
│       │      )}                                                  │
│       │    </>                                                   │
│       │  )}                                                      │
│     </div>                                                       │
│                                                                  │
│  Styling:                                                        │
│  ├─ position: fixed                                             │
│  ├─ left: 20px, bottom: 20px                                    │
│  ├─ z-index: 1000                                               │
│  ├─ background: rgba(0, 0, 0, 0.8)                              │
│  ├─ border-radius: 12px                                         │
│  └─ padding: 15px                                               │
└──────────────────────────────────────────────────────────────────┘
```

## 3. 서비스 레이어 구조

```
┌──────────────────────────────────────────────────────────────────┐
│                   services/api.js Structure                       │
└──────────────────────────────────────────────────────────────────┘

const API_BASE_URL = 'http://localhost:3000/api';

┌─────────────────────────────────────────────────────────────────┐
│  projectsAPI                                                     │
├─────────────────────────────────────────────────────────────────┤
│  - getAll() → GET /api/projects                                  │
│  - getById(id) → GET /api/projects/:id                           │
│  - create(data) → POST /api/projects                             │
│  - update(id, data) → PUT /api/projects/:id                      │
│  - delete(id) → DELETE /api/projects/:id                         │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  skillsAPI                                                       │
├─────────────────────────────────────────────────────────────────┤
│  - getAll() → GET /api/skills                                    │
│  - getByCategory(category) → GET /api/skills?category=...       │
│  - create(data) → POST /api/skills                               │
│  - update(id, data) → PUT /api/skills/:id                        │
│  - delete(id) → DELETE /api/skills/:id                           │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  commentsAPI                                                     │
├─────────────────────────────────────────────────────────────────┤
│  - getAll() → GET /api/comments                                  │
│  - getByProject(projectId) → GET /api/comments?projectId=...    │
│  - create(data) → POST /api/comments                             │
│  - delete(id, password) → DELETE /api/comments/:id               │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  guestbookAPI                                                    │
├─────────────────────────────────────────────────────────────────┤
│  - getAll() → GET /api/guestbook                                 │
│  - create(data) → POST /api/guestbook                            │
│  - delete(id) → DELETE /api/guestbook/:id                        │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  statsAPI                                                        │
├─────────────────────────────────────────────────────────────────┤
│  - recordVisit() → POST /api/stats/visit                         │
│  - getStats() → GET /api/stats                                   │
│  - getDailyStats(date) → GET /api/stats/daily?date=...          │
└─────────────────────────────────────────────────────────────────┘

Helper Functions:
├─ handleResponse(response) - Parse & error handling
├─ handleError(error) - Centralized error handling
└─ buildUrl(endpoint, params) - URL construction
```

## 4. 커스텀 훅 구조

```
┌──────────────────────────────────────────────────────────────────┐
│               hooks/useTensorFlow.js Structure                    │
└──────────────────────────────────────────────────────────────────┘

export const useTensorFlow = () => {
  // State
  ├─ model: tf.Sequential
  ├─ isModelLoaded: boolean
  ├─ interestScore: number (0-1)
  ├─ projectInterests: Object<string, number>
  └─ topProject: string

  // Refs (persistent, no re-render)
  ├─ behaviorData: Array<BehaviorVector>
  ├─ projectInteractions: Object<string, Interaction>
  ├─ lastUpdateTime: timestamp
  └─ lastActivityTime: timestamp

  // Functions
  ├─ initializeModel()
  │   ├─ Set CPU backend
  │   ├─ Create Sequential model (9→32→16→8→1)
  │   ├─ Compile with Adam optimizer
  │   └─ Set state
  │
  ├─ startBehaviorTracking()
  │   ├─ Add event listeners (scroll, click, hover)
  │   ├─ Start 2s interval analysis
  │   └─ Return cleanup function
  │
  ├─ analyzeBehavior(vector)
  │   ├─ Create tensor from vector
  │   ├─ Run model.predict()
  │   ├─ Calculate weighted score
  │   ├─ Apply penalties
  │   ├─ Update state
  │   └─ Dispose tensors
  │
  ├─ analyzeProjectInterest(title, vector)
  │   ├─ Similar to analyzeBehavior
  │   └─ Update projectInterests state
  │
  └─ getMemoryInfo()
      └─ return tf.memory()

  // Cleanup
  └─ useEffect cleanup
      ├─ Remove event listeners
      └─ Clear interval

  // Return
  return {
    isModelLoaded,
    interestScore,
    projectInterests,
    topProject,
    getMemoryInfo
  };
};
```

## 5. 컴포넌트 간 데이터 흐름

```
┌──────────────────────────────────────────────────────────────────┐
│              Component Communication Patterns                     │
└──────────────────────────────────────────────────────────────────┘

Parent → Child (Props)
  App → TensorFlowMonitor
    ├─ isModelLoaded={isModelLoaded}
    ├─ interestScore={interestScore}
    ├─ projectInterests={projectInterests}
    └─ topProject={topProject}

Child → Parent (Callback Props)
  CommentForm → Comments
    └─ onSubmit={(data) => handleCreateComment(data)}

Sibling Communication (via Parent State)
  Header ←→ Main Sections
    ├─ Header triggers scroll
    └─ Sections update on scroll (via event listeners)

Global State (Custom Hook)
  useTensorFlow() (used in App)
    ├─ Provides TensorFlow state
    └─ No prop drilling needed

Service Layer (API Calls)
  Components → services/api.js → Backend
    ├─ Projects.jsx → projectsAPI.getAll()
    ├─ Skills.jsx → skillsAPI.getAll()
    └─ Comments.jsx → commentsAPI.create(data)
```

## 6. 스타일링 구조

```
┌──────────────────────────────────────────────────────────────────┐
│                      CSS Architecture                             │
└──────────────────────────────────────────────────────────────────┘

styles/
├── base.css (Global styles, CSS variables, resets)
│   ├─ :root { --primary-color, --secondary-color, ... }
│   ├─ * { box-sizing, margin, padding }
│   └─ body, html { font-family, background, ... }
│
├── header.css (Header & navigation styles)
│   ├─ .header { position: fixed, z-index: 1000 }
│   ├─ .nav { display: flex, gap: 20px }
│   └─ .mobile-menu-toggle { display: none on desktop }
│
├── about.css (About section styles)
├── introduce.css (Introduce section & timeline styles)
├── skills.css (Skills grid & card styles)
├── projects.css (Projects grid & card styles)
├── comments.css (Comments form & list styles)
├── footer.css (Footer styles)
│
└── responsive.css (Media queries for all breakpoints)
    ├─ @media (max-width: 1200px) { ... }
    ├─ @media (max-width: 768px) { ... }
    └─ @media (max-width: 480px) { ... }

Component-specific styles:
└── Inline styles for dynamic values
    ├─ TensorFlowMonitor: score color
    ├─ Projects: tech tags
    └─ Skills: proficiency bars
```

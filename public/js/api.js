import AppConfig from './config.js';

class APIClient {
  constructor() {
    this.baseURL = AppConfig.currentAPIBaseURL;
    this.isEnabled = AppConfig.isAPIEnabled;
  }

  async request(endpoint, options = {}) {
    // 프로덕션(GitHub Pages)에서는 항상 정적 데이터 사용
    if (!this.isEnabled) {
      console.info(`📦 Using static data for ${endpoint} (GitHub Pages mode)`);
      return this.getFallbackData(endpoint);
    }

    // 로컬 개발 환경에서는 API 시도
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };

    try {
      const response = await fetch(url, config);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.warn(`⚠️ API request failed for ${endpoint}, using fallback data:`, error.message);
      return this.getFallbackData(endpoint);
    }
  }

  getFallbackData(endpoint) {
    // API 실패 시 정적 데이터 반환 (GitHub Pages 대응)
    const fallbackData = {
      '/projects': [
        {
          id: 1,
          title: '국립생태원',
          period: '2022년 11월 28일 → 2023년 11월 10일',
          description: '연구원들이 공지사항 및 자료를 관리하고 데이터를 효율적으로 분류 및 조회할 수 있게 지원하는 데이터 관리 웹 사이트',
          skills: 'Spring, MySQL, Tomcat',
          role: '자료 등록 및 관리 기능 구현, 리포트 제작 및 관리, 서버 및 데이터베이스 관리, 보안 강화',
          review: '엑셀 데이터 추출 등의 기능 개발을 통해 실무적 기술 능력을 한 단계 발전',
          image_url: 'img/projects/project1.png',
          view_count: 150,
          is_featured: 1
        },
        {
          id: 2,
          title: '대구어린이세상',
          period: '2023년 3월 31일 → 2023년 7월 26일',
          description: '어린이와 가족들이 다양한 교육 콘텐츠와 서비스를 이용할 수 있는 웹 사이트',
          skills: 'eGov, Oracle Database, Tomcat',
          role: '게시판 구현 및 유지보수, API 테스트 및 구현, 서버 및 데이터베이스 관리, 보안 강화',
          review: '트래픽과 API 관련 다양한 예외 상황을 팀원들과 협력해 해결함으로써, 문제에 대처할 수 있는 능력 향상',
          image_url: 'img/projects/project2.png',
          view_count: 230,
          is_featured: 1,
          issues: JSON.stringify([{
            title: '트래픽 과부하',
            description: '오픈 초기, 대량의 사용자 유입으로 인한 서버 트래픽 과부하 문제를 경험했습니다.'
          }])
        },
        {
          id: 3,
          title: '도서 관리 프로그램',
          period: '2022년 5월 16일 → 2022년 6월 29일',
          description: '사용자가 손쉽게 도서와 회원을 관리할 수 있도록 C#으로 개발된 도서 관리 프로그램',
          skills: 'C#(WPF .NET), MySQL',
          role: '전체 프로그램 설계 및 개발, 사용자 경험 개선',
          review: '사용자가 도서 및 회원 정보를 효율적으로 관리하고, 도서의 대여 및 반납 프로세스를 손쉽게 처리할 수 있는 프로그램을 제공',
          image_url: 'img/projects/project3.png',
          view_count: 89
        },
        {
          id: 4,
          title: '이무아',
          period: '2022년 3월 24일 → 2022년 6월 24일',
          description: '인공지능을 활용한 사물 인식 모바일 앱',
          skills: 'Android Studio, Java, TensorFlow',
          role: '애플리케이션 개발 및 구현, PPT 제작',
          review: '학습한 이미지들을 혼동하는 문제를 해결하기 위해 다량의 이미지를 학습시키고, 다양한 각도에서 사물을 인식할 수 있도록 개선',
          image_url: 'img/projects/project4.png',
          view_count: 124
        },
        {
          id: 5,
          title: 'TIL',
          period: '2022년 7월 11일 → 2022년 8월 17일',
          description: '일일 학습 내용을 정리하고 Contributions에 기록을 남기며 개발 의지를 고취시킨 웹 사이드 프로젝트',
          skills: 'Node.js, Docsify, Markdown',
          role: '프로젝트 전체 기획, 개발, 배포',
          review: 'Docsify 초기 사용 시 해당 기술과 관련 문서들을 학습하고 프로젝트에 적용하는 데 시간이 필요했으나 학습 동기 유지 및 개발에 대한 열정을 높일 수 있었으며, Contributions에 기록을 남기는 부수적 효과와 각 기술에 대한 이해도 향상',
          image_url: 'img/projects/project5.png',
          view_count: 95
        },
        {
          id: 6,
          title: 'CI3 학습 노트',
          period: '2022년 4월 28일 → 2022년 6월 23일',
          description: '학습 내용을 체계적으로 되돌아볼 수 있는 웹 기반 학습 노트',
          skills: 'PHP, CodeIgniter, XAMPP, MySQL',
          role: '프로젝트 개발 및 배포, 데이터베이스 관리',
          review: '사용자 인터페이스 사용성 개선 작업을 통해 사용자 경험 향상을 도모하고, PHP와 CodeIgniter에 대한 이해도 향상',
          image_url: 'img/projects/project6.png',
          view_count: 67
        }
      ],
      '/projects/featured/list': [],
      '/stats/visit': { success: true, message: 'Using static mode' },
      '/stats': { totalVisits: 0, uniqueVisitors: 0 },
      '/stats/projects': { totalProjects: 6 },
      '/comments': [
        {
          id: 1,
          name: '방문자',
          message: '포트폴리오 구경하고 갑니다!',
          created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
        }
      ]
    };

    // 동적 엔드포인트 처리
    if (endpoint.startsWith('/projects/') && endpoint !== '/projects/featured/list') {
      const id = parseInt(endpoint.split('/')[2]);
      const project = fallbackData['/projects'].find(p => p.id === id);
      return project || null;
    }

    return fallbackData[endpoint] || null;
  }

  async getProjects() {
    return this.request('/projects');
  }

  async getProject(id) {
    return this.request(`/projects/${id}`);
  }

  async getFeaturedProjects() {
    return this.request('/projects/featured/list');
  }

  async getGuestbook() {
    return this.request('/guestbook');
  }

  async createGuestbookEntry(data) {
    return this.request('/guestbook', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async deleteGuestbookEntry(id, password) {
    return this.request(`/guestbook/${id}`, {
      method: 'DELETE',
      body: JSON.stringify({ password })
    });
  }

  async getSkills(category = null) {
    const endpoint = category ? `/skills?category=${category}` : '/skills';
    return this.request(endpoint);
  }

  async getGroupedSkills() {
    return this.request('/skills/grouped');
  }

  async recordVisit() {
    return this.request('/stats/visit', {
      method: 'POST'
    });
  }

  async getStats() {
    return this.request('/stats');
  }

  async getProjectStats() {
    return this.request('/stats/projects');
  }

  async getComments() {
    const result = await this.request('/comments');
    // 항상 배열을 반환하도록 보장
    return Array.isArray(result) ? result : [];
  }

  async createComment(data) {
    // GitHub Pages(정적 모드)에서는 작성 불가
    if (!this.isEnabled) {
      console.warn('📦 GitHub Pages에서는 댓글 작성이 지원되지 않습니다.');
      throw new Error('GitHub Pages에서는 댓글 작성이 지원되지 않습니다. 로컬 환경에서 테스트해주세요.');
    }
    
    return this.request('/comments', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async deleteComment(id, password) {
    // GitHub Pages(정적 모드)에서는 삭제 불가
    if (!this.isEnabled) {
      console.warn('📦 GitHub Pages에서는 댓글 삭제가 지원되지 않습니다.');
      throw new Error('GitHub Pages에서는 댓글 삭제가 지원되지 않습니다. 로컬 환경에서 테스트해주세요.');
    }
    
    return this.request(`/comments/${id}`, {
      method: 'DELETE',
      body: JSON.stringify({ password })
    });
  }
}

export default new APIClient();

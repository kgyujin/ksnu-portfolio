const AppConfig = {
  opentutorials: {
    tawkPropertyId: '691bd930359b501954478dc0',
    enableChat: true,
    disqusShortname: 'web1-2',
    enableComments: false,
    googleAnalyticsId: 'G-8V88XDK5Y8',
    enableAnalytics: true,
  },
  
  video: {
    localVideo: {
      src: 'img/projects/project3_3.mp4',
      title: '프로젝트 데모 영상',
      containerId: 'video-container-1',
      poster: 'img/projects/project3.png'
    }
  },
  
  youtube: {
    videos: []
  },
  
  api: {
    // GitHub Pages는 정적 호스팅만 지원하므로 백엔드 API를 사용하지 않습니다
    // 로컬 개발 시에만 Docker로 실행한 백엔드를 사용합니다
    development: {
      baseURL: 'http://localhost:3000/api',
      enabled: true  // 로컬에서는 API 사용
    },
    production: {
      baseURL: '',  // GitHub Pages에서는 API 사용 안 함
      enabled: false  // 프로덕션에서는 정적 데이터 사용
    }
  },
  
  site: {
    title: 'KSNU Portfolio',
    description: '개발자 포트폴리오',
    author: 'KSNU',
    url: 'https://kgyujin.github.io/ksnu-portfolio/',
  },
  
  get isProduction() {
    return window.location.hostname !== 'localhost' && 
           window.location.hostname !== '127.0.0.1';
  },
  
  get currentAPIBaseURL() {
    return this.isProduction ? this.api.production.baseURL : this.api.development.baseURL;
  },
  
  get isAPIEnabled() {
    return this.isProduction ? this.api.production.enabled : this.api.development.enabled;
  }
};

export default AppConfig;

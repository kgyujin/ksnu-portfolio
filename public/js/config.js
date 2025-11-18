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
    // 개발 환경: Docker 백엔드 API 사용
    development: {
      baseURL: 'http://localhost:3000/api',
      enabled: true,
      useDataAPI: false
    },
    // 프로덕션 환경: Railway 백엔드 API 사용
    production: {
      baseURL: 'https://ksnu-portfolio-production.up.railway.app/api',  // Railway 배포 후 URL로 변경
      enabled: true,
      useDataAPI: false
    }
  },
  
  site: {
    title: 'KSNU Portfolio',
    description: '개발자 포트폴리오',
    author: 'KSNU',
    url: 'https://kgyujin.github.io/ksnu-portfolio/',
  },
  
  get isProduction() {
    const hostname = window.location.hostname;
    const isLocal = hostname === 'localhost' || 
                    hostname === '127.0.0.1' || 
                    hostname === '';
    return !isLocal;
  },
  
  get currentAPIBaseURL() {
    return this.isProduction ? this.api.production.baseURL : this.api.development.baseURL;
  },
  
  get isAPIEnabled() {
    // 항상 API 활성화 (Railway가 배포되어 있으므로)
    return true;
  }
};

export default AppConfig;

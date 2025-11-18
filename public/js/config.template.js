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
    // 프로덕션 환경: MongoDB Data API 직접 사용
    production: {
      baseURL: '',
      enabled: false,
      useDataAPI: true,
      dataAPI: {
        url: '${MONGODB_DATA_API_URL}',
        key: '${MONGODB_DATA_API_KEY}',
        dataSource: '${MONGODB_DATA_SOURCE}',
        database: '${MONGODB_DATABASE}'
      }
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

import APIClient from './api.js';
import { AnimationManager } from './animation.js';
import { ProjectManager } from './projects.js';
import { SkillManager } from './skills.js';
import { UIManager } from './ui.js';
import { TypingAnimation } from './typing.js';
import { CommentManager } from './comments.js';
import OpentutorialsManager from './opentutorials.js';
import AppConfig from './config.js';

class App {
  constructor() {
    this.api = APIClient;
    this.animationManager = new AnimationManager();
    this.projectManager = new ProjectManager(this.api);
    this.skillManager = new SkillManager();
    this.uiManager = new UIManager();
    this.commentManager = new CommentManager(this.api);
    
    this.opentutorials = new OpentutorialsManager({
      enableChat: AppConfig.opentutorials.enableChat,
      enableComments: AppConfig.opentutorials.enableComments,
      enableAnalytics: AppConfig.opentutorials.enableAnalytics,
      tawkPropertyId: AppConfig.opentutorials.tawkPropertyId,
      tawkWidgetId: AppConfig.opentutorials.tawkWidgetId,
      disqusShortname: AppConfig.opentutorials.disqusShortname,
      googleAnalyticsId: AppConfig.opentutorials.googleAnalyticsId
    });
    
    console.log(`🚀 Environment: ${AppConfig.isProduction ? 'Production' : 'Development'}`);
    console.log(`📡 API URL: ${AppConfig.currentAPIBaseURL}`);
  }

  async init() {
    try {
      await this.api.recordVisit();
      
      this.animationManager.init();
      await this.projectManager.init();
      this.skillManager.init();
      this.uiManager.init();
      await this.commentManager.init();
      
      this.opentutorials.init();
      this.opentutorials.trackPageView(window.location.pathname);
      this.setupAnalyticsTracking();
      
      const typingAnimation = new TypingAnimation('dynamic-text', [
        "기록하며",
        "배우며",
        "도전하며",
        "탐구하며",
        "생각하며"
      ]);
      typingAnimation.start();
      
      console.log('✅ Application initialized successfully');
    } catch (error) {
      console.error('❌ Application initialization failed:', error);
    }
  }
  
  setupAnalyticsTracking() {
    document.querySelectorAll('.project').forEach(project => {
      project.addEventListener('click', () => {
        const projectTitle = project.querySelector('h3')?.textContent || 'Unknown';
        this.opentutorials.trackEvent('project_click', {
          project_name: projectTitle,
          event_category: 'engagement',
          event_label: projectTitle
        });
      });
    });
    
    document.querySelectorAll('.icons a').forEach(link => {
      link.addEventListener('click', () => {
        const linkName = link.getAttribute('aria-label') || 'Unknown';
        this.opentutorials.trackEvent('social_link_click', {
          link_name: linkName,
          event_category: 'social',
          event_label: linkName
        });
      });
    });
    
    document.querySelectorAll('a[target="_blank"]').forEach(link => {
      link.addEventListener('click', () => {
        const href = link.href;
        this.opentutorials.trackEvent('external_link_click', {
          link_url: href,
          event_category: 'outbound',
          event_label: href
        });
      });
    });
    
    console.log('✅ 코드의 힘 - Analytics 이벤트 추적 설정 완료');
  }
}

// 컴포넌트 로드 완료 후 앱 초기화
window.addEventListener('componentsLoaded', () => {
  const app = new App();
  app.init();
});

// DOMContentLoaded는 컴포넌트 로더에서 처리하므로 백업용으로만 사용
document.addEventListener('DOMContentLoaded', () => {
  // 컴포넌트 로더가 없는 경우를 대비한 백업 초기화
  setTimeout(() => {
    if (!document.querySelector('#about')) {
      console.log('컴포넌트 로더 없이 직접 초기화');
      const app = new App();
      app.init();
    }
  }, 100);
});

document.oncontextmenu = function() { return false; };

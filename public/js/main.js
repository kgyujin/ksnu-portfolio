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
        "✍️기록하며",
        "📖배우며",
        "🏆도전하며",
        "🔍탐구하며",
        "💭생각하며"
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

document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.init();
});

document.oncontextmenu = function() { return false; };

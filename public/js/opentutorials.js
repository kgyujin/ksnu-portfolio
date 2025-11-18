export class OpentutorialsManager {
  constructor(config = {}) {
    this.config = {
      enableChat: config.enableChat !== false,
      enableComments: config.enableComments !== false,
      enableAnalytics: config.enableAnalytics !== false,
      tawkPropertyId: config.tawkPropertyId || '57a72994c11fe69b0bd8fa90',
      disqusShortname: config.disqusShortname || 'web1-2',
      googleAnalyticsId: config.googleAnalyticsId || 'G-XXXXXXXXXX'
    };
  }

  init() {
    if (this.config.enableChat) {
      this.initTawkChat();
    }
    if (this.config.enableAnalytics) {
      this.initGoogleAnalytics();
    }
    console.log('✅ 코드의 힘 - Opentutorials 모듈 초기화 완료');
  }

  initTawkChat() {
    if (window.Tawk_API) {
      console.log('⚠️ Tawk.to already loaded');
      return;
    }

    try {
      window.Tawk_API = window.Tawk_API || {};
      window.Tawk_LoadStart = new Date();

      const script = document.createElement('script');
      script.async = true;
      script.src = `https://embed.tawk.to/${this.config.tawkPropertyId}/default`;
      script.charset = 'UTF-8';
      script.setAttribute('crossorigin', '*');

      const firstScript = document.getElementsByTagName('script')[0];
      firstScript.parentNode.insertBefore(script, firstScript);

      console.log('✅ 코드의 힘 - Tawk.to 채팅 로드 완료');
    } catch (error) {
      console.error('❌ 코드의 힘 - Tawk.to 로드 실패:', error);
    }
  }

  initDisqusComments(containerId = 'disqus_thread', pageConfig = {}) {
      const container = document.getElementById(containerId);
    if (!container) {
      console.warn('⚠️ Disqus 컨테이너를 찾을 수 없습니다:', containerId);
      return;
    }    if (window.DISQUS) {
      console.log('⚠️ Disqus already loaded');
      return;
    }

    try {
      window.disqus_config = function () {
        this.page.url = pageConfig.url || window.location.href;
        this.page.identifier = pageConfig.identifier || window.location.pathname;
      };

      const script = document.createElement('script');
      script.src = `https://${this.config.disqusShortname}.disqus.com/embed.js`;
      script.setAttribute('data-timestamp', +new Date());
      (document.head || document.body).appendChild(script);

      console.log('✅ 코드의 힘 - Disqus 댓글 로드 완료');
    } catch (error) {
      console.error('❌ 코드의 힘 - Disqus 로드 실패:', error);
    }
  }

  createYouTubeEmbed(videoId, options = {}) {
    const {
      width = 560,
      height = 315,
      autoplay = 0,
      controls = 1,
      rel = 0
    } = options;

    const iframe = document.createElement('iframe');
    iframe.width = width;
    iframe.height = height;
    iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=${autoplay}&controls=${controls}&rel=${rel}`;
    iframe.frameBorder = '0';
    iframe.allowFullscreen = true;
    iframe.setAttribute('allowfullscreen', '');
    
    console.log('✅ 코드의 힘 - YouTube 비디오 생성:', videoId);
    return iframe;
  }

  insertYouTubeVideo(containerId, videoId, options = {}) {
    const container = document.getElementById(containerId);
    if (!container) {
      console.warn('⚠️ YouTube 컨테이너를 찾을 수 없습니다:', containerId);
      return;
    }

    const iframe = this.createYouTubeEmbed(videoId, options);
    container.appendChild(iframe);
    console.log('✅ 코드의 힘 - YouTube 비디오 삽입 완료');
  }

  initGoogleAnalytics() {
    if (window.gtag) {
      console.log('⚠️ Google Analytics already loaded');
      return;
    }

    try {
      const script1 = document.createElement('script');
      script1.async = true;
      script1.src = `https://www.googletagmanager.com/gtag/js?id=${this.config.googleAnalyticsId}`;
      document.head.appendChild(script1);

      window.dataLayer = window.dataLayer || [];
      function gtag() {
        window.dataLayer.push(arguments);
      }
      window.gtag = gtag;
      
      gtag('js', new Date());
      gtag('config', this.config.googleAnalyticsId);

      console.log('✅ 코드의 힘 - Google Analytics 로드 완료');
    } catch (error) {
      console.error('❌ 코드의 힘 - Google Analytics 로드 실패:', error);
    }
  }

  trackEvent(eventName, parameters = {}) {
    if (window.gtag) {
      window.gtag('event', eventName, parameters);
      console.log('📊 코드의 힘 - GA 이벤트 추적:', eventName, parameters);
    } else {
      console.warn('⚠️ 코드의 힘 - Google Analytics가 로드되지 않았습니다');
    }
  }

  trackPageView(pagePath) {
    if (window.gtag) {
      window.gtag('config', this.config.googleAnalyticsId, {
        page_path: pagePath
      });
      console.log('📊 코드의 힘 - GA 페이지뷰 추적:', pagePath);
    }
  }
}

export function createDisqusContainer(parentElement) {
  const container = document.createElement('div');
  container.id = 'disqus_thread';
  container.style.marginTop = '40px';
  
  if (parentElement) {
    parentElement.appendChild(container);
  }
  
  return container;
}

export function createVideoContainer(parentElement, containerId = 'video-container') {
  const container = document.createElement('div');
  container.id = containerId;
  container.style.marginTop = '20px';
  container.style.textAlign = 'center';
  
  if (parentElement) {
    parentElement.appendChild(container);
  }
  
  return container;
}

export default OpentutorialsManager;

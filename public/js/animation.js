export class AnimationManager {
  constructor() {
    this.sections = document.querySelectorAll('.section');
    this.observerOptions = {
      root: null,
      threshold: 0.1,
      rootMargin: '0px'
    };
  }

  init() {
    this.setupIntersectionObserver();
    this.setupScrollAnimation();
  }

  setupIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, this.observerOptions);

    this.sections.forEach(section => {
      observer.observe(section);
    });
  }

  setupScrollAnimation() {
    let isAnimating = false;
    
    document.addEventListener('scroll', () => {
      if (!isAnimating) {
        window.requestAnimationFrame(() => {
          this.updateActiveSections();
          isAnimating = false;
        });
        isAnimating = true;
      }
    });
  }

  updateActiveSections() {
    this.sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      const viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
      
      if (!(rect.bottom < 0 || rect.top - viewHeight >= 0)) {
        section.classList.add('visible');
      }
    });
  }

  static typeWriter(element, text, speed = 100, callback) {
    let i = 0;
    const type = () => {
      if (i < text.length) {
        element.innerHTML = text.substring(0, i + 1);
        i++;
        setTimeout(type, speed);
      } else if (callback) {
        setTimeout(callback, 700);
      }
    };
    type();
  }

  static deleteText(element, callback, speed = 50) {
    let text = element.innerHTML;
    let i = text.length;
    const del = () => {
      if (i >= 0) {
        element.innerHTML = text.substring(0, i);
        i--;
        setTimeout(del, speed);
      } else if (callback) {
        callback();
      }
    };
    del();
  }
}

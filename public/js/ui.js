export class UIManager {
  constructor() {
    this.pagination = document.querySelector('.pagination');
    this.sections = document.querySelectorAll('.section');
    this.dots = [];
    this.isAnimating = false;
  }

  init() {
    this.setupPagination();
    this.setupStars();
  }
  setupPagination() {
    this.sections.forEach((section, index) => {
      const dot = document.createElement('div');
      dot.classList.add('dot');
      if (index === 0) dot.classList.add('active');
      dot.setAttribute('data-index', index);
      dot.setAttribute('role', 'button');
      dot.setAttribute('aria-label', `섹션 ${index + 1}`);
      this.pagination.appendChild(dot);
      this.dots.push(dot);
    });

    this.dots.forEach(dot => {
      dot.addEventListener('click', () => {
        const index = parseInt(dot.getAttribute('data-index'));
        this.scrollToSection(index);
      });
    });
  }

  scrollToSection(index) {
    if (this.isAnimating || index < 0 || index >= this.sections.length) return;
    this.isAnimating = true;
    
    const section = this.sections[index];
    window.scrollTo({
      top: section.offsetTop,
      behavior: 'smooth'
    });
    
    setTimeout(() => {
      this.isAnimating = false;
      this.updateActiveDot(index);
    }, 1000);
  }

  updateActiveDot(index) {
    this.dots.forEach(dot => dot.classList.remove('active'));
    if (this.dots[index]) {
      this.dots[index].classList.add('active');
    }
  }

  setupStars() {
    let starCount = window.innerWidth <= 768 ? 50 : 100;
    this.createStars(starCount);
    
    window.addEventListener('resize', () => {
      starCount = window.innerWidth <= 768 ? 50 : 100;
      this.createStars(starCount);
    });
  }

  createStars(count) {
    let starContainer = document.querySelector('.star-container');
    
    if (starContainer) {
      starContainer.innerHTML = '';
    } else {
      starContainer = document.createElement('div');
      starContainer.className = 'star-container';
      document.body.appendChild(starContainer);
    }

    for (let i = 0; i < count; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      star.style.top = `${Math.random() * 100}vh`;
      star.style.left = `${Math.random() * 100}vw`;
      star.style.animationDuration = `${Math.random() * 1.5 + 1}s`;
      starContainer.appendChild(star);
    }
  }

  isMobile() {
    return window.innerWidth <= 768;
  }
}

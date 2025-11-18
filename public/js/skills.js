export class SkillManager {
  constructor() {
    this.skillsList = document.getElementById('skills-list');
    this.skillsItems = [];
  }

  init() {
    if (!this.skillsList) return;
    
    this.skillsItems = Array.from(this.skillsList.children);
    this.setupAnimation();
  }

  setupAnimation() {
    this.shuffleSkills();
    this.animateSkills();
  }

  shuffleSkills() {
    for (let i = this.skillsItems.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.skillsItems[i], this.skillsItems[j]] = [this.skillsItems[j], this.skillsItems[i]];
    }
    this.skillsItems.forEach(item => this.skillsList.appendChild(item));
  }

  animateSkills() {
    if (typeof gsap === 'undefined') {
      console.warn('GSAP not loaded, skipping skills animation');
      return;
    }

    gsap.to("#skills-list", {
      xPercent: -100 * (this.skillsItems.length / 4),
      ease: "none",
      duration: 20 * (this.skillsItems.length / 4),
      onComplete: () => {
        this.shuffleSkills();
        this.animateSkills();
      }
    });
  }
}

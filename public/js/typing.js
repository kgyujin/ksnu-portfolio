export class TypingAnimation {
  constructor(elementId, phrases) {
    this.element = document.getElementById(elementId);
    this.phrases = phrases;
    this.currentIndex = 0;
  }

  start() {
    if (!this.element) return;
    this.animate();
  }

  animate() {
    if (this.currentIndex < this.phrases.length) {
      this.typeText(this.phrases[this.currentIndex], () => {
        this.currentIndex++;
        if (this.currentIndex >= this.phrases.length) {
          this.currentIndex = 1;
        }
        setTimeout(() => {
          this.deleteText(() => {
            this.element.innerHTML = this.phrases[0];
            this.animate();
          });
        }, 2000);
      });
    }
  }

  typeText(text, callback) {
    let i = 0;
    const type = () => {
      if (i < text.length) {
        this.element.innerHTML = text.substring(0, i + 1);
        i++;
        setTimeout(type, 100);
      } else if (callback) {
        setTimeout(callback, 700);
      }
    };
    type();
  }

  deleteText(callback) {
    let text = this.element.innerHTML;
    let i = text.length;
    const del = () => {
      if (i >= 0) {
        this.element.innerHTML = text.substring(0, i);
        i--;
        setTimeout(del, 50);
      } else if (callback) {
        callback();
      }
    };
    del();
  }
}

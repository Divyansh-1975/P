let highestZ = 1;
class Paper {
  holdingPaper = false;
  touchActive = false;
  touchID = null;
  touchX = 0;
  touchY = 0;
  mouseTouchX = 0;
  mouseTouchY = 0;
  mouseX = 0;
  mouseY = 0;
  prevMouseX = 0;
  prevMouseY = 0;
  prevTouchX = 0;
  prevTouchY = 0;
  velX = 0;
  velY = 0;
  rotation = Math.random() * 30 - 15;
  currentPaperX = 0;
  currentPaperY = 0;
  rotating = false;

  init(paper) {
    document.addEventListener('mousemove', (e) => {
      if (!this.touchActive && !this.rotating && this.holdingPaper) {
        this.velX = e.clientX - this.prevTouchX;
        this.velY = e.clientY - this.prevTouchY;
        this.currentPaperX += this.velX;
        this.currentPaperY += this.velY;
        this.prevTouchX = e.clientX;
        this.prevTouchY = e.clientY;
        this.updatePaperTransform(paper);
      }
    });

    paper.addEventListener('mousedown', (e) => {
      if(this.holdingPaper) return;
      this.holdingPaper = true;
      paper.style.zIndex = highestZ;
      highestZ += 1;
      if(e.button === 0) {
        this.mouseTouchX = this.mouseX;
        this.mouseTouchY = this.mouseY;
        this.prevMouseX = this.mouseX;
        this.prevMouseY = this.mouseY;
        this.touchX = this.prevTouchX = e.clientX;
        this.touchY = this.prevTouchY = e.clientY;
      }
      if(e.button === 2) {
        this.rotating = true;
      }
    });

    window.addEventListener('mouseup', () => {
      this.holdingPaper = false;
      this.rotating = false;
    });

    // Touch Events
    paper.addEventListener('touchstart', (e) => {
      e.preventDefault();
      if (this.holdingPaper) return;
      const touch = e.changedTouches[0];
      this.touchID = touch.identifier;
      this.touchX = touch.clientX;
      this.touchY = touch.clientY;
      this.prevTouchX = touch.clientX;
      this.prevTouchY = touch.clientY;
      this.holdingPaper = true;
      this.touchActive = true;
      this.rotating = false;
      paper.style.zIndex = highestZ;
      highestZ += 1;
    });

    paper.addEventListener('touchmove', (e) => {
      e.preventDefault();
      if (!this.touchActive) return;
      const touch = Array.from(e.changedTouches).find(t => t.identifier === this.touchID);
      if (!touch) return;
      const newX = touch.clientX;
      const newY = touch.clientY;
      this.velX = newX - this.prevTouchX;
      this.velY = newY - this.prevTouchY;
      this.prevTouchX = newX;
      this.prevTouchY = newY;
      this.currentPaperX += this.velX;
      this.currentPaperY += this.velY;
      this.updatePaperTransform(paper);
    });

    paper.addEventListener('touchend', (e) => {
      e.preventDefault();
      const touch = Array.from(e.changedTouches).find(t => t.identifier === this.touchID);
      if (!touch) return;
      this.holdingPaper = false;
      this.touchActive = false;
      this.touchID = null;
    });

    // Context Menu Event
    paper.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      this.rotating = true;
    });

    window.addEventListener('mouseup', () => {
      if (this.rotating) {
        this.rotating = false;
      }
    });
  }

  updatePaperTransform(paper) {
    paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
  }
}

const papers = Array.from(document.querySelectorAll('.paper'));
papers.forEach(paper => {
  const p = new Paper();
  p.init(paper);
});

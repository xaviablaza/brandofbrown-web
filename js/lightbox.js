// Lightbox/Image gallery functionality
class Lightbox {
  constructor() {
    this.lightbox = document.getElementById('lightbox');
    this.lightboxImage = document.getElementById('lightboxImage');
    this.closeButton = document.getElementById('lightboxClose');
    this.prevButton = document.getElementById('lightboxPrev');
    this.nextButton = document.getElementById('lightboxNext');
    
    this.images = [];
    this.currentIndex = 0;
    
    this.init();
  }

  init() {
    if (!this.lightbox) return;
    
    // Close button
    if (this.closeButton) {
      this.closeButton.addEventListener('click', () => this.close());
    }
    
    // Navigation buttons
    if (this.prevButton) {
      this.prevButton.addEventListener('click', () => this.prev());
    }
    
    if (this.nextButton) {
      this.nextButton.addEventListener('click', () => this.next());
    }
    
    // Close on background click
    this.lightbox.addEventListener('click', (e) => {
      if (e.target === this.lightbox) {
        this.close();
      }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (!this.lightbox.classList.contains('lightbox--active')) return;
      
      switch (e.key) {
        case 'Escape':
          this.close();
          break;
        case 'ArrowLeft':
          this.prev();
          break;
        case 'ArrowRight':
          this.next();
          break;
      }
    });
    
    // Click main product image to open lightbox
    const mainImage = document.getElementById('mainImage');
    if (mainImage) {
      mainImage.addEventListener('click', () => {
        this.open(0);
      });
    }
  }

  setImages(images) {
    this.images = images;
  }

  open(index = 0) {
    if (!this.images || this.images.length === 0) return;
    
    this.currentIndex = index;
    this.updateImage();
    this.lightbox.classList.add('lightbox--active');
    document.body.style.overflow = 'hidden';
  }

  close() {
    this.lightbox.classList.remove('lightbox--active');
    document.body.style.overflow = '';
  }

  updateImage() {
    if (this.lightboxImage && this.images[this.currentIndex]) {
      this.lightboxImage.src = this.images[this.currentIndex];
    }
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
    this.updateImage();
  }

  prev() {
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
    this.updateImage();
  }
}

// Initialize and expose globally
document.addEventListener('DOMContentLoaded', () => {
  window.Lightbox = new Lightbox();
});

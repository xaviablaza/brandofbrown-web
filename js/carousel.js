// Carousel functionality
class Carousel {
  constructor(carouselId) {
    this.carousel = document.getElementById(carouselId);
    if (!this.carousel) return;
    
    this.track = this.carousel.querySelector('.carousel__track');
    this.slides = Array.from(this.track.querySelectorAll('.carousel__slide'));
    this.prevButton = this.carousel.querySelector('.carousel__button--prev');
    this.nextButton = this.carousel.querySelector('.carousel__button--next');
    this.dots = Array.from(this.carousel.querySelectorAll('.carousel__dot'));
    
    this.currentIndex = 0;
    this.autoPlayInterval = null;
    
    this.init();
  }

  init() {
    // Button event listeners
    if (this.prevButton) {
      this.prevButton.addEventListener('click', () => this.prevSlide());
    }
    
    if (this.nextButton) {
      this.nextButton.addEventListener('click', () => this.nextSlide());
    }
    
    // Dot event listeners
    this.dots.forEach((dot, index) => {
      dot.addEventListener('click', () => this.goToSlide(index));
    });
    
    // Touch support for mobile
    this.addTouchSupport();
    
    // Auto-play
    this.startAutoPlay();
    
    // Pause on hover
    this.carousel.addEventListener('mouseenter', () => this.stopAutoPlay());
    this.carousel.addEventListener('mouseleave', () => this.startAutoPlay());
  }

  goToSlide(index) {
    this.currentIndex = index;
    const offset = -100 * index;
    this.track.style.transform = `translateX(${offset}%)`;
    
    // Update dots
    this.dots.forEach((dot, i) => {
      dot.classList.toggle('carousel__dot--active', i === index);
    });
  }

  nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.slides.length;
    this.goToSlide(this.currentIndex);
  }

  prevSlide() {
    this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
    this.goToSlide(this.currentIndex);
  }

  startAutoPlay() {
    if (CONFIG && CONFIG.carousel) {
      this.autoPlayInterval = setInterval(() => {
        this.nextSlide();
      }, CONFIG.carousel.autoPlayInterval);
    }
  }

  stopAutoPlay() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
      this.autoPlayInterval = null;
    }
  }

  addTouchSupport() {
    let touchStartX = 0;
    let touchEndX = 0;
    
    this.carousel.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    });
    
    this.carousel.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      this.handleSwipe(touchStartX, touchEndX);
    });
  }

  handleSwipe(startX, endX) {
    const threshold = 50;
    const diff = startX - endX;
    
    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        this.nextSlide();
      } else {
        this.prevSlide();
      }
    }
  }
}

// Initialize carousel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const heroCarousel = new Carousel('heroCarousel');
});

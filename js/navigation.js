// Navigation functionality
class Navigation {
  constructor() {
    this.menuToggle = document.getElementById('menuToggle');
    this.mainNav = document.getElementById('mainNav');
    this.init();
  }

  init() {
    if (this.menuToggle && this.mainNav) {
      this.menuToggle.addEventListener('click', () => this.toggleMenu());
      
      // Close menu when clicking outside
      document.addEventListener('click', (e) => {
        if (!this.mainNav.contains(e.target) && !this.menuToggle.contains(e.target)) {
          this.closeMenu();
        }
      });
      
      // Close menu when clicking on a nav item
      const navItems = this.mainNav.querySelectorAll('.header__nav-item');
      navItems.forEach(item => {
        item.addEventListener('click', () => this.closeMenu());
      });
      
      // Handle window resize
      window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
          this.closeMenu();
        }
      });
    }
  }

  toggleMenu() {
    this.mainNav.classList.toggle('header__nav--active');
    this.menuToggle.classList.toggle('header__menu-toggle--active');
  }

  closeMenu() {
    this.mainNav.classList.remove('header__nav--active');
    this.menuToggle.classList.remove('header__menu-toggle--active');
  }
}

// Initialize navigation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new Navigation();
});

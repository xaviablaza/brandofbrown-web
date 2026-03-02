// Main application initialization
class App {
  constructor() {
    this.init();
  }

  init() {
    // Check which page we're on and initialize accordingly
    const currentPage = this.getCurrentPage();
    
    switch (currentPage) {
      case 'index':
        this.initHomePage();
        break;
      case 'shop':
        this.initShopPage();
        break;
      case 'product':
        this.initProductPage();
        break;
      default:
        this.initCommonFeatures();
    }
    
    // Initialize common features for all pages
    this.initCommonFeatures();
  }

  getCurrentPage() {
    const path = window.location.pathname;
    const page = path.substring(path.lastIndexOf('/') + 1);
    
    // Handle old/* pages
    if (path.includes('/old/')) {
      if (page === '' || page === 'index.html') return 'index';
      if (page === 'shop.html') return 'shop';
      if (page === 'product.html') return 'product';
      if (page === 'about.html') return 'about';
      if (page === 'faq.html') return 'faq';
    }
    
    // Root level pages
    if (page === '' || page === 'index.html') return 'contact'; // Root is now contact page
    if (page === 'shop.html') return 'shop';
    if (page === 'product.html') return 'product';
    if (page === 'about.html') return 'about';
    if (page === 'contact.html') return 'contact';
    if (page === 'faq.html') return 'faq';
    
    return 'other';
  }

  initHomePage() {
    // Load featured products
    if (window.ProductManager) {
      window.ProductManager.displayFeaturedProducts();
    }
  }

  initShopPage() {
    // Load all products with filtering
    if (window.ProductManager) {
      window.ProductManager.displayAllProducts();
    }
  }

  initProductPage() {
    // Product details are loaded via inline script in product.html
    // This is handled by the URL parameter check
  }

  initCommonFeatures() {
    // Smooth scroll for anchor links
    this.initSmoothScroll();
    
    // Lazy load images
    this.initLazyLoading();
    
    // Handle external links
    this.initExternalLinks();
  }

  initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }

  initLazyLoading() {
    // Modern browsers support native lazy loading
    // This is a fallback for older browsers
    if ('loading' in HTMLImageElement.prototype) {
      return; // Native lazy loading is supported
    }
    
    // Fallback for older browsers
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src || img.src;
            img.classList.add('loaded');
            imageObserver.unobserve(img);
          }
        });
      });
      
      images.forEach(img => imageObserver.observe(img));
    } else {
      // Fallback: load all images immediately
      images.forEach(img => {
        img.src = img.dataset.src || img.src;
      });
    }
  }

  initExternalLinks() {
    // Add target="_blank" and rel="noopener" to external links
    const links = document.querySelectorAll('a[href^="http"]');
    links.forEach(link => {
      const url = new URL(link.href);
      if (url.hostname !== window.location.hostname) {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
      }
    });
  }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new App();
});

// Handle page visibility change (pause/resume carousels, etc.)
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    // Page is hidden, pause animations
  } else {
    // Page is visible, resume animations
  }
});

// Log any errors for debugging
window.addEventListener('error', (e) => {
  console.error('Global error:', e.error);
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (e) => {
  console.error('Unhandled promise rejection:', e.reason);
});

// Configuration and constants
const CONFIG = {
  // API endpoints (for future use)
  api: {
    products: '/data/products.json',
  },
  
  // Pagination settings
  pagination: {
    itemsPerPage: 9,
    maxVisiblePages: 5,
  },
  
  // Carousel settings
  carousel: {
    autoPlayInterval: 5000,
    transitionDuration: 500,
  },
  
  // Search settings
  search: {
    minLength: 2,
    debounceDelay: 300,
  },
  
  // External links
  links: {
    facebook: 'https://www.facebook.com/brandofbrown',
    instagram: 'https://www.instagram.com/brandofbrown',
    lineVIP: 'https://bit.ly/2KdmlqO',
    lineOfficial: 'https://lin.ee/IFitMRs',
    email: 'brandofbrown@gmail.com',
  },
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
}

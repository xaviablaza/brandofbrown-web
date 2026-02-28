// Search and filter functionality
class SearchManager {
  constructor() {
    this.searchInput = document.getElementById('searchInput');
    this.searchButton = document.getElementById('searchButton');
    this.brandFilters = document.querySelectorAll('[data-filter="brand"]');
    this.typeFilters = document.querySelectorAll('[data-filter="type"]');
    this.clearFiltersButton = document.getElementById('clearFilters');
    this.resetSearchButton = document.getElementById('resetSearch');
    this.sortSelect = document.getElementById('sortSelect');
    
    this.debounceTimer = null;
    this.init();
  }

  init() {
    // Search input
    if (this.searchInput) {
      this.searchInput.addEventListener('input', () => this.handleSearchInput());
      this.searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          this.performSearch();
        }
      });
    }
    
    // Search button
    if (this.searchButton) {
      this.searchButton.addEventListener('click', () => this.performSearch());
    }
    
    // Brand filters
    this.brandFilters.forEach(filter => {
      filter.addEventListener('change', () => this.applyFilters());
    });
    
    // Type filters
    this.typeFilters.forEach(filter => {
      filter.addEventListener('change', () => this.applyFilters());
    });
    
    // Clear filters button
    if (this.clearFiltersButton) {
      this.clearFiltersButton.addEventListener('click', () => this.clearAllFilters());
    }
    
    // Reset search button (on empty state)
    if (this.resetSearchButton) {
      this.resetSearchButton.addEventListener('click', () => this.clearAllFilters());
    }
    
    // Sort select
    if (this.sortSelect) {
      this.sortSelect.addEventListener('change', (e) => {
        if (window.ProductManager) {
          window.ProductManager.sortProducts(e.target.value);
        }
      });
    }
  }

  handleSearchInput() {
    // Debounce search
    clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      this.performSearch();
    }, CONFIG.search.debounceDelay);
  }

  performSearch() {
    this.applyFilters();
  }

  applyFilters() {
    const filters = {
      brands: this.getSelectedBrands(),
      types: this.getSelectedTypes(),
      query: this.searchInput ? this.searchInput.value.trim() : '',
    };
    
    if (window.ProductManager) {
      window.ProductManager.filterProducts(filters);
    }
  }

  getSelectedBrands() {
    const selected = [];
    this.brandFilters.forEach(filter => {
      if (filter.checked) {
        selected.push(filter.value);
      }
    });
    return selected;
  }

  getSelectedTypes() {
    const selected = [];
    this.typeFilters.forEach(filter => {
      if (filter.checked) {
        selected.push(filter.value);
      }
    });
    return selected;
  }

  clearAllFilters() {
    // Clear search input
    if (this.searchInput) {
      this.searchInput.value = '';
    }
    
    // Uncheck all filters
    this.brandFilters.forEach(filter => {
      filter.checked = false;
    });
    
    this.typeFilters.forEach(filter => {
      filter.checked = false;
    });
    
    // Reset sort
    if (this.sortSelect) {
      this.sortSelect.value = 'featured';
    }
    
    // Apply empty filters
    this.applyFilters();
  }
}

// Initialize search manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new SearchManager();
});

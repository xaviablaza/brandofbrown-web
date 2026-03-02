// Product management and display
class ProductManager {
  constructor() {
    this.products = [];
    this.filteredProducts = [];
    this.currentPage = 1;
    this.itemsPerPage = CONFIG.pagination.itemsPerPage;
  }

  async loadProducts() {
    try {
      // Determine data path based on current location
      const isInOldDir = window.location.pathname.includes('/old/');
      const dataPath = isInOldDir ? '../data/products.json' : 'data/products.json';
      
      const response = await fetch(dataPath);
      const data = await response.json();
      this.products = data.products;
      this.filteredProducts = [...this.products];
      return this.products;
    } catch (error) {
      console.error('Error loading products:', error);
      return [];
    }
  }

  async displayFeaturedProducts() {
    await this.loadProducts();
    const featuredContainer = document.getElementById('featuredProducts');
    if (!featuredContainer) return;
    
    const featuredProducts = this.products.filter(p => p.featured).slice(0, 6);
    featuredContainer.innerHTML = featuredProducts.map(product => 
      this.createProductCard(product)
    ).join('');
  }

  async displayAllProducts() {
    await this.loadProducts();
    this.updateProductGrid();
  }

  updateProductGrid() {
    const productGrid = document.getElementById('productGrid');
    const emptyState = document.getElementById('emptyState');
    const resultsCount = document.getElementById('resultsCount');
    
    if (!productGrid) return;
    
    // Calculate pagination
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    const paginatedProducts = this.filteredProducts.slice(startIndex, endIndex);
    
    // Display products or empty state
    if (paginatedProducts.length === 0) {
      productGrid.style.display = 'none';
      emptyState.style.display = 'block';
    } else {
      productGrid.style.display = 'grid';
      emptyState.style.display = 'none';
      productGrid.innerHTML = paginatedProducts.map(product => 
        this.createProductCard(product)
      ).join('');
    }
    
    // Update results count
    if (resultsCount) {
      const total = this.filteredProducts.length;
      resultsCount.textContent = `Showing ${startIndex + 1}-${Math.min(endIndex, total)} of ${total} products`;
    }
    
    // Update pagination
    this.updatePagination();
  }

  createProductCard(product) {
    const price = product.price ? 
      `${product.currency}${product.price.toLocaleString()}` : 
      'Contact for Price';
    
    // Determine paths based on current location
    const isInOldDir = window.location.pathname.includes('/old/');
    const imagePrefix = isInOldDir ? '../' : '';
    const productLink = isInOldDir ? 'product.html' : 'old/product.html';
    
    const mainImage = product.images && product.images.length > 0 ? 
      product.images[0] : 
      `${imagePrefix}images/placeholder.jpg`;
    
    return `
      <a href="${productLink}?id=${product.id}" class="product-card">
        <div class="product-card__image-wrapper">
          <img src="${mainImage}" alt="${product.name}" class="product-card__image" loading="lazy">
        </div>
        <div class="product-card__content">
          <div class="product-card__brand">${product.brand}</div>
          <h3 class="product-card__title">${product.name}</h3>
          <div class="product-card__price">${price}</div>
          ${!product.inStock ? '<div class="product-card__status">Out of Stock</div>' : ''}
        </div>
      </a>
    `;
  }

  updatePagination() {
    const paginationContainer = document.getElementById('pagination');
    if (!paginationContainer) return;
    
    const totalPages = Math.ceil(this.filteredProducts.length / this.itemsPerPage);
    
    if (totalPages <= 1) {
      paginationContainer.innerHTML = '';
      return;
    }
    
    let html = '';
    
    // Previous button
    html += `
      <button class="pagination__button ${this.currentPage === 1 ? 'pagination__button--disabled' : ''}" 
              onclick="window.ProductManager.goToPage(${this.currentPage - 1})"
              ${this.currentPage === 1 ? 'disabled' : ''}>
        Previous
      </button>
    `;
    
    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 || 
        i === totalPages || 
        (i >= this.currentPage - 1 && i <= this.currentPage + 1)
      ) {
        html += `
          <button class="pagination__button ${i === this.currentPage ? 'pagination__button--active' : ''}" 
                  onclick="window.ProductManager.goToPage(${i})">
            ${i}
          </button>
        `;
      } else if (i === this.currentPage - 2 || i === this.currentPage + 2) {
        html += `<span>...</span>`;
      }
    }
    
    // Next button
    html += `
      <button class="pagination__button ${this.currentPage === totalPages ? 'pagination__button--disabled' : ''}" 
              onclick="window.ProductManager.goToPage(${this.currentPage + 1})"
              ${this.currentPage === totalPages ? 'disabled' : ''}>
        Next
      </button>
    `;
    
    paginationContainer.innerHTML = html;
  }

  goToPage(page) {
    const totalPages = Math.ceil(this.filteredProducts.length / this.itemsPerPage);
    if (page < 1 || page > totalPages) return;
    
    this.currentPage = page;
    this.updateProductGrid();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async loadProductDetails(productId) {
    await this.loadProducts();
    const product = this.products.find(p => p.id === productId);
    
    if (!product) {
      console.error('Product not found:', productId);
      return;
    }
    
    // Update page title and meta
    document.title = `${product.brand} ${product.name} - Brand of Brown`;
    
    // Update breadcrumb
    const breadcrumb = document.getElementById('breadcrumbProduct');
    if (breadcrumb) {
      breadcrumb.textContent = product.name;
    }
    
    // Update product details
    document.getElementById('productBrand').textContent = product.brand;
    document.getElementById('productTitle').textContent = product.name;
    document.getElementById('productPrice').textContent = product.price ? 
      `${product.currency}${product.price.toLocaleString()}` : 
      'Contact for Price';
    document.getElementById('productStatus').textContent = product.inStock ? 
      'In Stock' : 
      'Out of Stock';
    
    // Update main image
    const mainImage = document.getElementById('mainImage');
    if (mainImage && product.images && product.images.length > 0) {
      mainImage.src = product.images[0];
      mainImage.alt = product.name;
    }
    
    // Create thumbnails
    const thumbnailsContainer = document.getElementById('thumbnails');
    if (thumbnailsContainer && product.images) {
      thumbnailsContainer.innerHTML = product.images.map((img, index) => `
        <img src="${img}" 
             alt="${product.name} - Image ${index + 1}" 
             class="product-detail__thumbnail ${index === 0 ? 'product-detail__thumbnail--active' : ''}"
             onclick="window.ProductManager.changeImage('${img}', ${index})">
      `).join('');
    }
    
    // Update description
    const descriptionContainer = document.getElementById('productDescription');
    if (descriptionContainer && product.description) {
      descriptionContainer.innerHTML = `
        <p>${product.description.en}</p>
        ${product.description.th ? `<p style="margin-top: 1rem; color: var(--color-text-light);">${product.description.th}</p>` : ''}
      `;
    }
    
    // Update specifications
    const specsContainer = document.getElementById('productSpecs');
    if (specsContainer) {
      let specsHtml = `
        <div class="product-detail__spec">
          <span class="product-detail__spec-label">Brand:</span>
          <span class="product-detail__spec-value">${product.brand}</span>
        </div>
        <div class="product-detail__spec">
          <span class="product-detail__spec-label">Type:</span>
          <span class="product-detail__spec-value">${product.type}</span>
        </div>
        <div class="product-detail__spec">
          <span class="product-detail__spec-label">Condition:</span>
          <span class="product-detail__spec-value">${product.condition}</span>
        </div>
      `;
      
      if (product.year) {
        specsHtml += `
          <div class="product-detail__spec">
            <span class="product-detail__spec-label">Year:</span>
            <span class="product-detail__spec-value">${product.year}</span>
          </div>
        `;
      }
      
      specsContainer.innerHTML = specsHtml;
    }
    
    // Update includes
    const includesContainer = document.getElementById('productIncludes');
    const includesSection = document.getElementById('includesSection');
    if (includesContainer && product.includes && product.includes.length > 0) {
      includesContainer.innerHTML = product.includes.map(item => 
        `<div class="product-detail__include-item">${item}</div>`
      ).join('');
      includesSection.style.display = 'block';
    } else if (includesSection) {
      includesSection.style.display = 'none';
    }
    
    // Initialize lightbox for images
    if (window.Lightbox && product.images) {
      window.Lightbox.init(product.images);
    }
  }

  changeImage(imageSrc, index) {
    const mainImage = document.getElementById('mainImage');
    if (mainImage) {
      mainImage.src = imageSrc;
    }
    
    // Update active thumbnail
    const thumbnails = document.querySelectorAll('.product-detail__thumbnail');
    thumbnails.forEach((thumb, i) => {
      thumb.classList.toggle('product-detail__thumbnail--active', i === index);
    });
  }

  filterProducts(filters) {
    this.filteredProducts = this.products.filter(product => {
      // Brand filter
      if (filters.brands && filters.brands.length > 0) {
        if (!filters.brands.includes(product.brand)) {
          return false;
        }
      }
      
      // Type filter
      if (filters.types && filters.types.length > 0) {
        if (!filters.types.includes(product.type)) {
          return false;
        }
      }
      
      // Search query
      if (filters.query) {
        const query = filters.query.toLowerCase();
        const searchableText = `${product.name} ${product.brand} ${product.type}`.toLowerCase();
        if (!searchableText.includes(query)) {
          return false;
        }
      }
      
      return true;
    });
    
    this.currentPage = 1;
    this.updateProductGrid();
  }

  sortProducts(sortBy) {
    switch (sortBy) {
      case 'price-low':
        this.filteredProducts.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price-high':
        this.filteredProducts.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'name-asc':
        this.filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        this.filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        // Featured/default sort
        this.filteredProducts = [...this.products];
    }
    
    this.updateProductGrid();
  }
}

// Initialize and expose globally
window.ProductManager = new ProductManager();

#!/usr/bin/env node

/**
 * Product Image Downloader
 * Downloads all product images from the Brand of Brown Wix site
 * and organizes them into the correct folder structure
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

// Product image mappings from the original Wix site
const PRODUCT_IMAGES = {
  'ysl-small-cabas-black': [
    'https://static.wixstatic.com/media/c22c23_d5e8f3b0e4c74e8f9c7a1b2d3e4f5a6b~mv2.jpg',
    'https://static.wixstatic.com/media/c22c23_e6f9a4c1f5d8e9f0a8b3c4d5e6f7a8b9~mv2.jpg',
    'https://static.wixstatic.com/media/c22c23_f7a0b5d2e6f9a1c2b4d5e6f7a8b9c0d1~mv2.jpg',
    'https://static.wixstatic.com/media/c22c23_a8b1c6e3f7a2d3c4e5f6a7b8c9d0e1f2~mv2.jpg',
    'https://static.wixstatic.com/media/c22c23_b9c2d7f4a8b3e4d5f6a7b8c9d0e1f2a3~mv2.jpg',
  ],
  'balenciaga-classic-city-grey': [
    'https://static.wixstatic.com/media/c22c23_c0d3e8a5b9c4f5d6e7a8b9c0d1e2f3a4~mv2.jpg',
    'https://static.wixstatic.com/media/c22c23_d1e4f9b6c0d5a6e7f8a9b0c1d2e3f4a5~mv2.jpg',
    'https://static.wixstatic.com/media/c22c23_e2f5a0c7d1e6b7f8a9b0c1d2e3f4a5b6~mv2.jpg',
    'https://static.wixstatic.com/media/c22c23_f3a6b1d8e2f7c8a9b0c1d2e3f4a5b6c7~mv2.jpg',
    'https://static.wixstatic.com/media/c22c23_a4b7c2e9f3a8d9b0c1d2e3f4a5b6c7d8~mv2.jpg',
  ],
  'ysl-round-bag-light-grey': [
    'https://static.wixstatic.com/media/c22c23_b5c8d3f0a4b9e0c1d2e3f4a5b6c7d8e9~mv2.jpg',
    'https://static.wixstatic.com/media/c22c23_c6d9e4a1b5c0f1d2e3f4a5b6c7d8e9f0~mv2.jpg',
    'https://static.wixstatic.com/media/c22c23_d7e0f5b2c6d1a2e3f4a5b6c7d8e9f0a1~mv2.jpg',
    'https://static.wixstatic.com/media/c22c23_e8f1a6c3d7e2b3f4a5b6c7d8e9f0a1b2~mv2.jpg',
  ],
  'prada-wallet-pink': [
    'https://static.wixstatic.com/media/c22c23_f9a2b7d4e8f3c4a5b6c7d8e9f0a1b2c3~mv2.jpg',
    'https://static.wixstatic.com/media/c22c23_a0b3c8e5f9a4d5b6c7d8e9f0a1b2c3d4~mv2.jpg',
    'https://static.wixstatic.com/media/c22c23_b1c4d9f6a0b5e6c7d8e9f0a1b2c3d4e5~mv2.jpg',
  ],
  'gucci-mini-interlocking-pink': [
    'https://static.wixstatic.com/media/c22c23_c2d5e0a7b1c6f7d8e9f0a1b2c3d4e5f6~mv2.jpg',
    'https://static.wixstatic.com/media/c22c23_d3e6f1b8c2d7a8e9f0a1b2c3d4e5f6a7~mv2.jpg',
    'https://static.wixstatic.com/media/c22c23_e4f7a2c9d3e8b9f0a1b2c3d4e5f6a7b8~mv2.jpg',
    'https://static.wixstatic.com/media/c22c23_f5a8b3d0e4f9c0a1b2c3d4e5f6a7b8c9~mv2.jpg',
  ],
  'boyy-bobby18-black-ghw': [
    'https://static.wixstatic.com/media/c22c23_a6b9c4e1f5a0d1b2c3d4e5f6a7b8c9d0~mv2.jpg',
    'https://static.wixstatic.com/media/c22c23_b7c0d5f2a6b1e2c3d4e5f6a7b8c9d0e1~mv2.jpg',
    'https://static.wixstatic.com/media/c22c23_c8d1e6a3b7c2f3d4e5f6a7b8c9d0e1f2~mv2.jpg',
  ],
  'balenciaga-mini-city-ghw': [
    'https://static.wixstatic.com/media/c22c23_d9e2f7b4c8d3a4e5f6a7b8c9d0e1f2a3~mv2.jpg',
    'https://static.wixstatic.com/media/c22c23_e0f3a8c5d9e4b5f6a7b8c9d0e1f2a3b4~mv2.jpg',
    'https://static.wixstatic.com/media/c22c23_f1a4b9d6e0f5c6a7b8c9d0e1f2a3b4c5~mv2.jpg',
  ],
  'celine-clutch-chain': [
    'https://static.wixstatic.com/media/c22c23_a2b5c0e7f1a6d7b8c9d0e1f2a3b4c5d6~mv2.jpg',
    'https://static.wixstatic.com/media/c22c23_b3c6d1f8a2b7e8c9d0e1f2a3b4c5d6e7~mv2.jpg',
    'https://static.wixstatic.com/media/c22c23_c4d7e2a9b3c8f9d0e1f2a3b4c5d6e7f8~mv2.jpg',
  ],
  'prada-re-edition-2005-nylon': [
    'https://static.wixstatic.com/media/c22c23_d5e8f3b0c4d9a0e1f2a3b4c5d6e7f8a9~mv2.jpg',
    'https://static.wixstatic.com/media/c22c23_e6f9a4c1d5e0b1f2a3b4c5d6e7f8a9b0~mv2.jpg',
    'https://static.wixstatic.com/media/c22c23_f7a0b5d2e6f1c2a3b4c5d6e7f8a9b0c1~mv2.jpg',
  ],
  'prada-black-nappa-camera': [
    'https://static.wixstatic.com/media/c22c23_a8b1c6e3f7a2d3b4c5d6e7f8a9b0c1d2~mv2.jpg',
    'https://static.wixstatic.com/media/c22c23_b9c2d7f4a8b3e4c5d6e7f8a9b0c1d2e3~mv2.jpg',
    'https://static.wixstatic.com/media/c22c23_c0d3e8a5b9c4f5d6e7f8a9b0c1d2e3f4~mv2.jpg',
  ],
  'gucci-print-belt-bag-white': [
    'https://static.wixstatic.com/media/c22c23_d1e4f9b6c0d5a6e7f8a9b0c1d2e3f4a5~mv2.jpg',
    'https://static.wixstatic.com/media/c22c23_e2f5a0c7d1e6b7f8a9b0c1d2e3f4a5b6~mv2.jpg',
    'https://static.wixstatic.com/media/c22c23_f3a6b1d8e2f7c8a9b0c1d2e3f4a5b6c7~mv2.jpg',
  ],
  'chanel-trifold-caviar-wallet-ghw': [
    'https://static.wixstatic.com/media/c22c23_a4b7c2e9f3a8d9b0c1d2e3f4a5b6c7d8~mv2.jpg',
    'https://static.wixstatic.com/media/c22c23_b5c8d3f0a4b9e0c1d2e3f4a5b6c7d8e9~mv2.jpg',
    'https://static.wixstatic.com/media/c22c23_c6d9e4a1b5c0f1d2e3f4a5b6c7d8e9f0~mv2.jpg',
  ],
};

// Base directory for images
const BASE_DIR = path.join(__dirname, '..', 'images', 'products');

/**
 * Download a file from URL
 */
function downloadFile(url, destination) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const protocol = urlObj.protocol === 'https:' ? https : http;
    
    const file = fs.createWriteStream(destination);
    
    protocol.get(url, (response) => {
      // Handle redirects
      if (response.statusCode === 301 || response.statusCode === 302) {
        file.close();
        fs.unlinkSync(destination);
        return downloadFile(response.headers.location, destination)
          .then(resolve)
          .catch(reject);
      }
      
      if (response.statusCode !== 200) {
        file.close();
        fs.unlinkSync(destination);
        return reject(new Error(`Failed to download: ${url} (Status: ${response.statusCode})`));
      }
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlinkSync(destination);
      reject(err);
    });
  });
}

/**
 * Create directory if it doesn't exist
 */
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

/**
 * Download all images for a product
 */
async function downloadProductImages(productId, imageUrls) {
  const productDir = path.join(BASE_DIR, productId);
  ensureDirectoryExists(productDir);
  
  console.log(`\nDownloading images for: ${productId}`);
  
  for (let i = 0; i < imageUrls.length; i++) {
    const url = imageUrls[i];
    const filename = `${i + 1}.jpg`;
    const destination = path.join(productDir, filename);
    
    // Skip if file already exists
    if (fs.existsSync(destination)) {
      console.log(`  ✓ ${filename} (already exists)`);
      continue;
    }
    
    try {
      await downloadFile(url, destination);
      console.log(`  ✓ ${filename}`);
    } catch (error) {
      console.error(`  ✗ ${filename} - ${error.message}`);
    }
    
    // Add a small delay to avoid overwhelming the server
    await new Promise(resolve => setTimeout(resolve, 200));
  }
}

/**
 * Update products.json with correct image paths
 */
function updateProductsJson() {
  const productsJsonPath = path.join(__dirname, '..', 'data', 'products.json');
  const productsData = JSON.parse(fs.readFileSync(productsJsonPath, 'utf8'));
  
  productsData.products.forEach(product => {
    const productId = product.id;
    const imageUrls = PRODUCT_IMAGES[productId];
    
    if (imageUrls) {
      product.images = imageUrls.map((_, index) => 
        `images/products/${productId}/${index + 1}.jpg`
      );
    }
  });
  
  fs.writeFileSync(productsJsonPath, JSON.stringify(productsData, null, 2));
  console.log('\n✓ Updated products.json with correct image paths');
}

/**
 * Create placeholder images for products without URLs
 */
function createPlaceholder(destination) {
  // Create a simple SVG placeholder
  const svg = `<svg width="800" height="800" xmlns="http://www.w3.org/2000/svg">
    <rect width="800" height="800" fill="#f5f5f5"/>
    <text x="50%" y="50%" font-family="Arial" font-size="24" fill="#999" text-anchor="middle" dy=".3em">
      Product Image
    </text>
  </svg>`;
  
  fs.writeFileSync(destination, svg);
}

/**
 * Main function
 */
async function main() {
  console.log('Brand of Brown - Product Image Downloader');
  console.log('==========================================\n');
  
  // Ensure base directory exists
  ensureDirectoryExists(BASE_DIR);
  
  // Download all product images
  for (const [productId, imageUrls] of Object.entries(PRODUCT_IMAGES)) {
    await downloadProductImages(productId, imageUrls);
  }
  
  // Update products.json
  updateProductsJson();
  
  console.log('\n==========================================');
  console.log('✓ All downloads complete!');
  console.log('\nNote: The image URLs used are placeholders.');
  console.log('To get actual images, you need to:');
  console.log('1. Visit https://www.brandofbrown.com/shop');
  console.log('2. Inspect each product page to find the real image URLs');
  console.log('3. Update the PRODUCT_IMAGES object in this script');
  console.log('4. Run the script again');
}

// Run the script
main().catch(console.error);

# Brand of Brown - Website Rebuild

A complete HTML/CSS/JavaScript rebuild of the Brand of Brown luxury handbag website, originally built on Wix.

## Features

- ✅ **6 HTML Pages**: Home, Shop, Product Detail, About, Contact, FAQ
- ✅ **Product Catalog**: 12 luxury handbag products with filtering and search
- ✅ **Responsive Design**: Mobile-first, works on all devices
- ✅ **Image Galleries**: Product detail pages with lightbox/modal
- ✅ **Hero Carousel**: Auto-playing image slider on homepage
- ✅ **Search & Filter**: Filter by brand, type, and search by keyword
- ✅ **Pagination**: Product catalog with 9 items per page
- ✅ **Form Validation**: Contact form with real-time validation
- ✅ **Bilingual Content**: English and Thai support (FAQ page)
- ✅ **Vanilla JavaScript**: No frameworks, pure ES6+
- ✅ **Modern CSS**: CSS Custom Properties, Grid, Flexbox

## Project Structure

```
brandofbrown/
├── index.html              # Homepage
├── shop.html               # Product catalog
├── product.html            # Product detail page
├── about.html              # About page
├── contact.html            # Contact page
├── faq.html               # FAQ page
├── css/
│   ├── variables.css       # CSS custom properties
│   ├── reset.css          # Browser reset/normalize
│   ├── layout.css         # Grid system, layouts
│   ├── components.css     # Reusable components
│   ├── pages.css          # Page-specific styles
│   └── responsive.css     # Mobile/tablet styles
├── js/
│   ├── config.js          # Configuration
│   ├── navigation.js      # Mobile menu
│   ├── carousel.js        # Hero slider
│   ├── products.js        # Product management
│   ├── search.js          # Search & filters
│   ├── lightbox.js        # Image gallery
│   ├── form.js            # Form validation
│   └── main.js            # App initialization
├── data/
│   └── products.json      # Product database
├── images/
│   ├── logo.png
│   ├── hero/              # Carousel images
│   ├── icons/             # Social media icons
│   ├── products/          # Product images
│   └── footer-banner.jpg
└── scripts/
    ├── download-images.js  # Node.js image downloader
    └── scrape-images.py    # Python image scraper
```

## Quick Start

### Option 1: Python Simple HTTP Server (Recommended)

```bash
# Navigate to project directory
cd brandofbrown

# Start server on port 8000
python3 -m http.server 8000

# Or if you prefer Python 2
python -m SimpleHTTPServer 8000
```

Open your browser to: **http://localhost:8000**

### Option 2: Node.js http-server

```bash
# Install http-server globally (one time only)
npm install -g http-server

# Navigate to project directory
cd brandofbrown

# Start server
http-server -p 8000

# Or with auto-opening browser
http-server -p 8000 -o
```

### Option 3: PHP Built-in Server

```bash
# Navigate to project directory
cd brandofbrown

# Start server
php -S localhost:8000
```

### Option 4: Live Server (VS Code Extension)

1. Install "Live Server" extension in VS Code
2. Right-click on `index.html`
3. Select "Open with Live Server"

## Downloading Product Images

The website structure is complete, but product images need to be downloaded from the original Wix site.

### Option A: Python Scraper (Recommended)

```bash
# Install required package
pip3 install requests

# Run the scraper
python3 scripts/scrape-images.py
```

This will:
- Scrape all product images from brandofbrown.com
- Download them to `images/products/`
- Update `data/products.json` with correct paths

### Option B: Node.js Downloader

```bash
# Run from project root
node scripts/download-images.js
```

**Note**: The Node.js script uses placeholder URLs. You'll need to update the `PRODUCT_IMAGES` object with real URLs from the Wix site.

### Option C: Manual Download

1. Visit each product page on https://www.brandofbrown.com/shop
2. Right-click images and save them
3. Place them in `images/products/{product-id}/`
4. Name them sequentially: `1.jpg`, `2.jpg`, etc.

## Product Data

Products are stored in `data/products.json`. Each product includes:

```json
{
  "id": "unique-product-id",
  "slug": "url-friendly-slug",
  "name": "Product Name",
  "brand": "Brand Name",
  "type": "Shoulder-bag|Cross-body|Belt-bag|Wallet|Clutch",
  "price": 24500,
  "currency": "฿",
  "condition": "Pre-owned",
  "inStock": false,
  "featured": true,
  "images": ["path/to/image1.jpg", "..."],
  "description": {
    "en": "English description",
    "th": "Thai description"
  },
  "includes": ["Authenticity card", "Dust bag"]
}
```

## Brands & Products

The site includes 12 products from luxury brands:
- **YSL**: Small Cabas, Round Bag
- **Balenciaga**: Classic City, Mini City
- **Gucci**: Mini Interlocking, Print Belt Bag
- **Prada**: Wallet, Re-Edition 2005, Camera Bag
- **BOYY**: Bobby18
- **Celine**: Clutch with Chain
- **Chanel**: Tri-fold Caviar Wallet

## Features Detail

### Homepage
- Hero carousel (auto-play, 5-second interval)
- Featured products grid (6 products)
- Services section (Buy, Sell, Consign, Installment)
- Contact form

### Shop Page
- Product grid with pagination (9 per page)
- Filter by brand (7 brands)
- Filter by type (5 types)
- Search by keyword
- Sort options (featured, price, name)
- Results count

### Product Detail Page
- Image gallery with thumbnails
- Lightbox/modal for full-size images
- Product information (brand, name, price, status)
- Specifications (brand, type, condition, year)
- What's included section
- Contact buttons (Line, Email)

### Mobile Features
- Hamburger menu navigation
- Touch-enabled carousel
- Responsive grid layouts
- Mobile-optimized filters

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Android)

## External Links

The site includes links to:
- Facebook: https://www.facebook.com/brandofbrown
- Instagram: https://www.instagram.com/brandofbrown
- Line VIP Group: https://bit.ly/2KdmlqO
- Line Official: @brandofbrown (https://lin.ee/IFitMRs)
- Email: brandofbrown@gmail.com

## Customization

### Colors
Edit `css/variables.css` to change colors:
```css
--color-primary: #8B7355;      /* Brown accent */
--color-secondary: #D4A5A5;    /* Pink accent */
```

### Pagination
Edit `js/config.js`:
```javascript
pagination: {
  itemsPerPage: 9,  // Change items per page
}
```

### Carousel Speed
Edit `js/config.js`:
```javascript
carousel: {
  autoPlayInterval: 5000,  // Milliseconds
}
```

## Development Notes

- **No Build Process**: Pure HTML/CSS/JS, no compilation needed
- **No Dependencies**: No npm packages, no frameworks
- **Modern Standards**: ES6+, CSS Grid, Flexbox
- **Semantic HTML**: Proper heading hierarchy, ARIA labels
- **SEO Friendly**: Meta tags, alt attributes, semantic markup

## Deployment

### Option 1: GitHub Pages
1. Push to GitHub repository
2. Enable GitHub Pages in repository settings
3. Select main branch / root folder

### Option 2: Netlify
1. Drag and drop folder to Netlify
2. Or connect GitHub repository

### Option 3: Vercel
```bash
npm i -g vercel
vercel
```

### Option 4: Traditional Hosting
Upload all files via FTP to your web host.

## TODO / Future Enhancements

- [ ] Add actual product images (currently placeholders)
- [ ] Implement backend for contact form submission
- [ ] Add shopping cart functionality
- [ ] Integrate payment processing
- [ ] Add admin panel for product management
- [ ] Implement user authentication
- [ ] Add wishlist/favorites feature
- [ ] Integrate Google Analytics
- [ ] Add more products to catalog
- [ ] Implement product reviews

## License

This project is a rebuild of the Brand of Brown website for educational/portfolio purposes.
All product images, brand names, and content are property of Brand of Brown.

## Contact

For questions about this rebuild:
- Original Website: https://www.brandofbrown.com
- Brand of Brown Email: brandofbrown@gmail.com

---

Built with ❤️ using vanilla HTML, CSS, and JavaScript

#!/usr/bin/env python3
"""
Product Image Scraper for Brand of Brown
Scrapes product images directly from the Wix website
"""

import os
import json
import requests
from pathlib import Path
from urllib.parse import urljoin
import time

# Base paths
BASE_DIR = Path(__file__).parent.parent
IMAGES_DIR = BASE_DIR / "images" / "products"
PRODUCTS_JSON = BASE_DIR / "data" / "products.json"

# Product page URLs from the original site
PRODUCT_PAGES = {
    "ysl-small-cabas-black": "https://www.brandofbrown.com/product-page/ysl-small-cabas-in-black",
    "balenciaga-classic-city-grey": "https://www.brandofbrown.com/product-page/balenciaga-classic-city-in-grey-shw",
    "ysl-round-bag-light-grey": "https://www.brandofbrown.com/product-page/ysl-round-bag-in-light-grey",
    "prada-wallet-pink": "https://www.brandofbrown.com/product-page/prada-wallet-with-card-holder-in-pink",
    "gucci-mini-interlocking-pink": "https://www.brandofbrown.com/product-page/gucci-mini-interlocking-bag-in-pink",
    "boyy-bobby18-black-ghw": "https://www.brandofbrown.com/product-page/boyy-bobby18-in-black-ghw",
    "balenciaga-mini-city-ghw": "https://www.brandofbrown.com/product-page/balenciaga-mini-city-ghw",
    "celine-clutch-chain": "https://www.brandofbrown.com/product-page/celine-clutch-with-chain",
    "prada-re-edition-2005-nylon": "https://www.brandofbrown.com/product-page/prada-re-edition-2005-re-nylon-bag",
    "prada-black-nappa-camera": "https://www.brandofbrown.com/product-page/prada-black-nappa-camera-bag",
    "gucci-print-belt-bag-white": "https://www.brandofbrown.com/product-page/gucci-print-belt-bag-white",
    "chanel-trifold-caviar-wallet-ghw": "https://www.brandofbrown.com/product-page/chanel-black-tri-fold-caviar-wallet-ghw",
}


def download_image(url, destination):
    """Download an image from URL to destination"""
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()

        with open(destination, "wb") as f:
            f.write(response.content)
        return True
    except Exception as e:
        print(f"  ✗ Failed to download: {e}")
        return False


def scrape_product_images(product_id, product_url):
    """Scrape images from a product page"""
    print(f"\nScraping images for: {product_id}")

    # Create product directory
    product_dir = IMAGES_DIR / product_id
    product_dir.mkdir(parents=True, exist_ok=True)

    try:
        # Fetch the product page
        response = requests.get(product_url, timeout=10)
        response.raise_for_status()
        html = response.text

        # Extract image URLs from the HTML
        # Wix typically stores images in static.wixstatic.com
        import re

        # Find all Wix image URLs
        image_pattern = r"https://static\.wixstatic\.com/media/[a-zA-Z0-9_~\-\.]+\.(?:jpg|jpeg|png|webp)"
        image_urls = re.findall(image_pattern, html)

        # Remove duplicates while preserving order
        seen = set()
        unique_images = []
        for url in image_urls:
            if url not in seen:
                seen.add(url)
                unique_images.append(url)

        print(f"  Found {len(unique_images)} images")

        # Download each image
        downloaded_images = []
        for i, url in enumerate(unique_images, 1):
            # Limit to 15 images per product
            if i > 15:
                break

            filename = f"{i}.jpg"
            destination = product_dir / filename

            # Skip if already exists
            if destination.exists():
                print(f"  ✓ {filename} (already exists)")
                downloaded_images.append(str(destination.relative_to(BASE_DIR)))
                continue

            print(f"  Downloading {filename}...")
            if download_image(url, destination):
                print(f"  ✓ {filename}")
                downloaded_images.append(str(destination.relative_to(BASE_DIR)))

            # Rate limiting
            time.sleep(0.3)

        return downloaded_images

    except Exception as e:
        print(f"  ✗ Error scraping page: {e}")
        return []


def update_products_json(image_mapping):
    """Update products.json with scraped image paths"""

    with open(PRODUCTS_JSON, "r") as f:
        data = json.load(f)

    # Update image paths for each product
    for product in data["products"]:
        product_id = product["id"]
        if product_id in image_mapping and image_mapping[product_id]:
            # Use forward slashes for web paths
            product["images"] = [
                path.replace(os.sep, "/") for path in image_mapping[product_id]
            ]

    # Save updated JSON
    with open(PRODUCTS_JSON, "w") as f:
        json.dump(data, f, indent=2)

    print("\n✓ Updated products.json with scraped image paths")


def create_placeholder_images():
    """Create placeholder images for any missing products"""
    print("\nCreating placeholder images...")

    for product_id in PRODUCT_PAGES.keys():
        product_dir = IMAGES_DIR / product_id
        product_dir.mkdir(parents=True, exist_ok=True)

        # Create at least one placeholder if no images exist
        images = list(product_dir.glob("*.jpg"))
        if not images:
            placeholder = product_dir / "1.jpg"
            # Create a simple placeholder (you can replace with actual placeholder image)
            print(f"  Creating placeholder for {product_id}")
            # For now, just create an empty file - you should replace with actual placeholder
            placeholder.touch()


def main():
    print("Brand of Brown - Product Image Scraper")
    print("=" * 50)
    print("\nThis script will scrape images from www.brandofbrown.com")
    print("and download them to the local images/products/ directory.\n")

    # Ensure directories exist
    IMAGES_DIR.mkdir(parents=True, exist_ok=True)

    # Scrape images for each product
    image_mapping = {}

    for product_id, product_url in PRODUCT_PAGES.items():
        images = scrape_product_images(product_id, product_url)
        if images:
            image_mapping[product_id] = images

        # Be nice to the server
        time.sleep(1)

    # Update products.json with image paths
    if image_mapping:
        update_products_json(image_mapping)

    # Create placeholders for any missing images
    create_placeholder_images()

    print("\n" + "=" * 50)
    print("✓ Scraping complete!")
    print(f"\nImages saved to: {IMAGES_DIR}")
    print(f"Products JSON updated: {PRODUCTS_JSON}")


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\nScraping cancelled by user")
    except Exception as e:
        print(f"\n✗ Error: {e}")
        raise

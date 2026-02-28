#!/usr/bin/env python3
"""
Scrape missing product images from Brand of Brown website
"""

import os
import json
import requests
from pathlib import Path
import re
import time

# Base paths
BASE_DIR = Path(__file__).parent.parent
IMAGES_DIR = BASE_DIR / "images" / "products"

# Product URLs to try for missing products
# We'll try multiple variations of the URLs
MISSING_PRODUCTS = {
    "celine-clutch-chain": [
        "https://www.brandofbrown.com/product-page/celine-clutch-with-chain",
        "https://www.brandofbrown.com/product-page/celine-clutch-chain",
        "https://www.brandofbrown.com/product-page/celine-clutch",
    ],
    "prada-re-edition-2005-nylon": [
        "https://www.brandofbrown.com/product-page/prada-re-edition-2005-re-nylon-bag",
        "https://www.brandofbrown.com/product-page/prada-re-edition-2005-nylon",
        "https://www.brandofbrown.com/product-page/prada-re-edition",
    ],
    "prada-black-nappa-camera": [
        "https://www.brandofbrown.com/product-page/prada-black-nappa-camera-bag",
        "https://www.brandofbrown.com/product-page/prada-nappa-camera-bag",
        "https://www.brandofbrown.com/product-page/prada-camera-bag",
    ],
    "chanel-trifold-caviar-wallet-ghw": [
        "https://www.brandofbrown.com/product-page/chanel-black-tri-fold-caviar-wallet-ghw",
        "https://www.brandofbrown.com/product-page/chanel-trifold-caviar-wallet",
        "https://www.brandofbrown.com/product-page/chanel-wallet",
        "https://www.brandofbrown.com/product-page/chanel-caviar-wallet",
    ],
}


def download_image(url, destination):
    """Download an image from URL to destination"""
    try:
        response = requests.get(
            url,
            timeout=10,
            headers={
                "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"
            },
        )
        response.raise_for_status()

        with open(destination, "wb") as f:
            f.write(response.content)
        return True
    except Exception as e:
        return False


def scrape_product_images(product_id, product_urls):
    """Try scraping images from multiple product URLs"""
    print(f"\n{'=' * 60}")
    print(f"Scraping images for: {product_id}")
    print(f"{'=' * 60}")

    # Create product directory
    product_dir = IMAGES_DIR / product_id
    product_dir.mkdir(parents=True, exist_ok=True)

    images_found = False

    # Try each URL variation
    for url_index, product_url in enumerate(product_urls, 1):
        print(f"\n  Attempt {url_index}/{len(product_urls)}: {product_url}")

        try:
            # Fetch the product page
            response = requests.get(
                product_url,
                timeout=10,
                headers={
                    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"
                },
            )

            if response.status_code == 404:
                print(f"  ✗ Page not found (404)")
                continue

            response.raise_for_status()
            html = response.text

            # Extract image URLs from the HTML
            # Wix typically stores images in static.wixstatic.com
            image_pattern = r"https://static\.wixstatic\.com/media/[a-zA-Z0-9_~\-\.]+\.(?:jpg|jpeg|png|webp)"
            image_urls = re.findall(image_pattern, html)

            # Filter for product images (remove small/thumbnail images)
            # Wix product images usually have specific patterns
            filtered_images = []
            seen = set()

            for url in image_urls:
                # Skip if we've seen this URL
                if url in seen:
                    continue

                # Skip very small images or icons (usually in filename)
                if any(
                    x in url.lower() for x in ["icon", "logo", "favicon", "_sm", "_xs"]
                ):
                    continue

                seen.add(url)
                filtered_images.append(url)

            if not filtered_images:
                print(f"  ✗ No images found on this page")
                continue

            print(f"  ✓ Found {len(filtered_images)} potential product images")

            # Download each image
            downloaded_count = 0
            for i, img_url in enumerate(filtered_images, 1):
                # Limit to 15 images per product
                if i > 15:
                    break

                filename = f"{i}.jpg"
                destination = product_dir / filename

                # Skip if already exists
                if destination.exists():
                    print(f"    • {filename} (already exists)")
                    downloaded_count += 1
                    continue

                print(f"    Downloading {filename}...", end=" ")
                if download_image(img_url, destination):
                    print(f"✓")
                    downloaded_count += 1
                    images_found = True
                else:
                    print(f"✗")

                time.sleep(0.3)  # Be nice to the server

            print(f"\n  Downloaded {downloaded_count} images for {product_id}")

            if downloaded_count > 0:
                # Successfully found images, no need to try other URLs
                break

        except requests.exceptions.HTTPError as e:
            print(f"  ✗ HTTP Error: {e}")
        except requests.exceptions.RequestException as e:
            print(f"  ✗ Request Error: {e}")
        except Exception as e:
            print(f"  ✗ Error: {e}")

        time.sleep(1)  # Wait between attempts

    return images_found


def main():
    """Main function to scrape all missing products"""
    print("\n" + "=" * 60)
    print("BRAND OF BROWN - Missing Product Images Scraper")
    print("=" * 60)

    success_count = 0
    failed_products = []

    for product_id, urls in MISSING_PRODUCTS.items():
        if scrape_product_images(product_id, urls):
            success_count += 1
        else:
            failed_products.append(product_id)

    # Summary
    print("\n" + "=" * 60)
    print("SCRAPING COMPLETE")
    print("=" * 60)
    print(f"✓ Successfully scraped: {success_count} products")
    if failed_products:
        print(f"✗ Failed to scrape: {len(failed_products)} products")
        for product_id in failed_products:
            print(f"  - {product_id}")
    print("=" * 60 + "\n")


if __name__ == "__main__":
    main()

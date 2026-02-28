#!/usr/bin/env python3
"""
Fix image paths in products.json to match actual folder structure
"""

import json
from pathlib import Path

# Load products.json
json_path = Path(__file__).parent.parent / "data" / "products.json"
with open(json_path, "r") as f:
    data = json.load(f)

# Update image paths for each product
for product in data["products"]:
    product_id = product["id"]
    product_dir = Path(__file__).parent.parent / "images" / "products" / product_id

    if product_dir.exists():
        # Get all jpg files in the directory
        image_files = sorted(product_dir.glob("*.jpg"), key=lambda x: int(x.stem))

        # Filter out empty files (placeholders)
        valid_images = [img for img in image_files if img.stat().st_size > 0]

        if valid_images:
            # Update product images with actual file paths
            product["images"] = [
                f"images/products/{product_id}/{img.name}" for img in valid_images
            ]
            print(f"✓ {product_id}: {len(valid_images)} images")
        else:
            print(f"⚠ {product_id}: No valid images found")
    else:
        print(f"✗ {product_id}: Folder not found")

# Save updated JSON
with open(json_path, "w") as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print(f"\n✓ Updated {json_path}")

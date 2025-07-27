#!/usr/bin/env python3
"""
Script to help add Hardika's profile photo to the website
"""
import os
import shutil
from PIL import Image
import sys

def optimize_image(input_path, output_path, max_size=(1000, 1000), quality=85):
    """
    Optimize image for web use
    """
    try:
        with Image.open(input_path) as img:
            # Convert to RGB if necessary
            if img.mode in ('RGBA', 'LA', 'P'):
                img = img.convert('RGB')
            
            # Resize if too large
            img.thumbnail(max_size, Image.Resampling.LANCZOS)
            
            # Save optimized image
            img.save(output_path, 'JPEG', quality=quality, optimize=True)
            
            return True
    except Exception as e:
        print(f"Error optimizing image: {e}")
        return False

def add_profile_photo():
    """
    Add and optimize Hardika's profile photo
    """
    print("🎨 Hardika Makeover - Profile Photo Setup")
    print("=" * 50)
    
    # Check if assets/images directory exists
    assets_dir = "assets/images"
    if not os.path.exists(assets_dir):
        print(f"❌ Assets directory not found: {assets_dir}")
        return False
    
    # Look for potential photo files
    photo_files = []
    for file in os.listdir("."):
        if file.lower().startswith("hardika") and file.lower().endswith(('.jpg', '.jpeg', '.png')):
            photo_files.append(file)
    
    if not photo_files:
        print("❌ No Hardika photo files found in current directory")
        print("📝 Please add hardikaphoto2.jpg to the current directory first")
        return False
    
    print("📸 Found potential photo files:")
    for i, file in enumerate(photo_files, 1):
        size = os.path.getsize(file) / 1024  # KB
        print(f"   {i}. {file} ({size:.1f} KB)")
    
    # If hardikaphoto2.jpg exists, use it directly
    target_file = "hardikaphoto2.jpg"
    if target_file in photo_files:
        source_file = target_file
        print(f"✅ Using {target_file}")
    else:
        # Let user choose
        try:
            choice = int(input(f"\nSelect photo file (1-{len(photo_files)}): ")) - 1
            source_file = photo_files[choice]
        except (ValueError, IndexError):
            print("❌ Invalid selection")
            return False
    
    # Optimize and copy the image
    source_path = source_file
    target_path = os.path.join(assets_dir, "hardikaphoto2.jpg")
    
    print(f"🔄 Optimizing and copying {source_file}...")
    
    if optimize_image(source_path, target_path):
        # Get file size
        size = os.path.getsize(target_path) / 1024  # KB
        print(f"✅ Profile photo added successfully!")
        print(f"📁 Location: {target_path}")
        print(f"📊 Optimized size: {size:.1f} KB")
        print(f"🌐 The photo will now appear in the About section")
        
        # Update assets README
        update_assets_readme()
        
        return True
    else:
        print("❌ Failed to optimize image")
        return False

def update_assets_readme():
    """
    Update the assets README with the new photo
    """
    readme_path = "assets/README.md"
    if os.path.exists(readme_path):
        try:
            with open(readme_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Update the current images section
            updated_content = content.replace(
                "### Current Images:\n- **hardikalogo.png** - Main logo file used throughout the website",
                """### Current Images:
- **hardikalogo.png** - Main logo file used throughout the website
  - Used in: Navigation, Footer, Admin Dashboard, Loading Screen, Favicon
  - Dimensions: Responsive (auto-scaled)
  - Format: PNG with transparency
- **hardikaphoto2.jpg** - Hardika's professional profile photo
  - Used in: About section
  - Dimensions: Optimized for web (max 1000x1000px)
  - Format: JPEG optimized for web"""
            )
            
            with open(readme_path, 'w', encoding='utf-8') as f:
                f.write(updated_content)
            
            print("📝 Updated assets documentation")
        except Exception as e:
            print(f"⚠️  Could not update README: {e}")

def main():
    """
    Main function
    """
    if len(sys.argv) > 1 and sys.argv[1] == "--help":
        print("Usage: python add_profile_photo.py")
        print("This script helps add and optimize Hardika's profile photo")
        print("\nSteps:")
        print("1. Place hardikaphoto2.jpg in the current directory")
        print("2. Run this script")
        print("3. The photo will be optimized and added to assets/images/")
        return
    
    success = add_profile_photo()
    
    if success:
        print("\n🎉 Setup Complete!")
        print("💡 Next steps:")
        print("   1. Refresh your website")
        print("   2. Check the About section")
        print("   3. Verify the photo displays correctly")
        print("   4. Test on mobile devices")
    else:
        print("\n❌ Setup failed. Please check the instructions above.")

if __name__ == "__main__":
    main()

// Image Cropping Configuration
// This file allows you to easily configure how each image should be cropped

const imageCropConfig = {
    // Configuration for each image in your slider
    images: {
        'p0.jpg': {
            cropMode: 'crop-smart',      // Cropping style
            objectFit: 'cover',          // How image fits in container
            objectPosition: 'center 25%' // Custom position if needed
        },
        'p1.jpg': {
            cropMode: 'crop-face',
            objectFit: 'cover',
            objectPosition: 'center 30%'
        },
        'p2.jpg': {
            cropMode: 'crop-portrait',
            objectFit: 'cover',
            objectPosition: 'center 20%'
        },
        'p3.jpg': {
            cropMode: 'crop-smart',
            objectFit: 'cover',
            objectPosition: 'center 25%'
        }
    },
    
    // Global settings
    global: {
        defaultCropMode: 'crop-smart',
        defaultObjectFit: 'cover',
        enableSmartCrop: true,  // Automatically detect best crop based on image dimensions
        enableLazyLoading: true
    },
    
    // Crop mode definitions
    cropModes: {
        'crop-smart': {
            description: 'Intelligent cropping focusing on upper 25% of image',
            objectPosition: 'center 25%',
            bestFor: 'portraits, makeup shots'
        },
        'crop-face': {
            description: 'Focus on upper 30% for close-up face shots',
            objectPosition: 'center 30%',
            bestFor: 'close-up portraits, headshots'
        },
        'crop-portrait': {
            description: 'Portrait crop focusing on upper 20%',
            objectPosition: 'center 20%',
            bestFor: 'full portrait shots'
        },
        'crop-landscape': {
            description: 'Standard center cropping',
            objectPosition: 'center center',
            bestFor: 'landscape images, wide shots'
        },
        'crop-top': {
            description: 'Focus on top portion of image',
            objectPosition: 'center top',
            bestFor: 'images with important top content'
        },
        'crop-bottom': {
            description: 'Focus on bottom portion of image',
            objectPosition: 'center bottom',
            bestFor: 'full body shots, outfit displays'
        },
        'crop-left': {
            description: 'Focus on left side of image',
            objectPosition: 'left center',
            bestFor: 'side profiles, left-oriented compositions'
        },
        'crop-right': {
            description: 'Focus on right side of image',
            objectPosition: 'right center',
            bestFor: 'side profiles, right-oriented compositions'
        }
    }
};

// Function to apply configuration to images
function applyCropConfiguration() {
    const slides = document.querySelectorAll('.slide');
    
    slides.forEach((slide, index) => {
        const img = slide.querySelector('img');
        if (!img) return;
        
        // Get image filename from src
        const src = img.src;
        const filename = src.substring(src.lastIndexOf('/') + 1);
        
        // Get configuration for this image
        const config = imageCropConfig.images[filename];
        
        if (config) {
            // Apply specific configuration
            img.className = img.className.replace(/crop-\w+/g, '');
            img.classList.add(config.cropMode);
            img.style.objectFit = config.objectFit;
            
            if (config.objectPosition) {
                img.style.objectPosition = config.objectPosition;
            }
        } else {
            // Apply default configuration
            img.classList.add(imageCropConfig.global.defaultCropMode);
            img.style.objectFit = imageCropConfig.global.defaultObjectFit;
        }
    });
}

// Function to update crop configuration for a specific image
function updateImageCrop(filename, cropMode, objectFit = 'cover', objectPosition = null) {
    // Update configuration
    if (!imageCropConfig.images[filename]) {
        imageCropConfig.images[filename] = {};
    }
    
    imageCropConfig.images[filename].cropMode = cropMode;
    imageCropConfig.images[filename].objectFit = objectFit;
    
    if (objectPosition) {
        imageCropConfig.images[filename].objectPosition = objectPosition;
    }
    
    // Apply changes immediately
    applyCropConfiguration();
    
    console.log(`Updated crop configuration for ${filename}:`, imageCropConfig.images[filename]);
}

// Function to get crop recommendations based on image analysis
function getCropRecommendations(img) {
    const aspectRatio = img.naturalWidth / img.naturalHeight;
    const recommendations = [];
    
    if (aspectRatio > 1.5) {
        recommendations.push({
            mode: 'crop-landscape',
            reason: 'Wide aspect ratio - landscape crop recommended'
        });
    } else if (aspectRatio < 0.8) {
        recommendations.push({
            mode: 'crop-portrait',
            reason: 'Tall aspect ratio - portrait crop recommended'
        });
        recommendations.push({
            mode: 'crop-face',
            reason: 'Good for close-up portraits'
        });
    } else {
        recommendations.push({
            mode: 'crop-smart',
            reason: 'Balanced aspect ratio - smart crop recommended'
        });
    }
    
    return recommendations;
}

// Initialize crop configuration when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Wait a bit for images to load, then apply configuration
    setTimeout(() => {
        if (imageCropConfig.global.enableSmartCrop) {
            applySmartCrop();
        } else {
            applyCropConfiguration();
        }
    }, 1000);
});

// Export configuration for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = imageCropConfig;
}

// Make functions available globally
window.imageCropConfig = imageCropConfig;
window.applyCropConfiguration = applyCropConfiguration;
window.updateImageCrop = updateImageCrop;
window.getCropRecommendations = getCropRecommendations;

// Console helper functions for easy testing
console.log('Image Crop Configuration loaded. Available functions:');
console.log('- applyCropConfiguration(): Apply all crop settings');
console.log('- updateImageCrop(filename, cropMode): Update specific image crop');
console.log('- getCropRecommendations(imgElement): Get crop suggestions');
console.log('');
console.log('Example usage:');
console.log('updateImageCrop("p0.jpg", "crop-face")');
console.log('updateImageCrop("p1.jpg", "crop-portrait")');

// Mobile Navigation
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar background on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(0, 0, 0, 0.98)';
    } else {
        navbar.style.background = 'rgba(0, 0, 0, 0.95)';
    }
});

// Portfolio tabs functionality
const tabButtons = document.querySelectorAll('.tab-button');
const tabContents = document.querySelectorAll('.tab-content');

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        const targetTab = button.getAttribute('data-tab');
        
        // Remove active class from all buttons and contents
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        
        // Add active class to clicked button and corresponding content
        button.classList.add('active');
        document.getElementById(targetTab).classList.add('active');
        
        // Load content based on tab
        if (targetTab === 'photos') {
            loadPhotoGallery();
        } else if (targetTab === 'reels') {
            loadReelsGallery();
        }
    });
});

// Portfolio images
const portfolioImages = [
    'assets/images/p0.jpg',
    'assets/images/p1.jpg',
    'assets/images/p2.jpg',
    'assets/images/p3.jpg',
    'assets/images/p6.jpeg',
    'assets/images/p7.jpeg',
    'assets/images/p8.jpeg',
    'assets/images/p9.jpeg',
    'assets/images/p44.jpeg',
    'assets/images/hardikaphoto2.jpg',
    'assets/images/hardikaphoto3.jpg'
];

// Load photo gallery
function loadPhotoGallery() {
    const photoGallery = document.querySelector('.photo-gallery');
    photoGallery.innerHTML = '';
    
    portfolioImages.forEach((image, index) => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        galleryItem.innerHTML = `
            <img src="${image}" alt="Makeup Portfolio ${index + 1}" loading="lazy">
            <div class="gallery-overlay">
                <i class="fas fa-search-plus"></i>
            </div>
        `;
        
        galleryItem.addEventListener('click', () => {
            openLightbox(image, index);
        });
        
        photoGallery.appendChild(galleryItem);
    });
}

// Reels videos
const reelsVideos = [
    'assets/images/v0.mp4',
    'assets/images/v1.mp4',
    'assets/images/v2.mp4',
    'assets/images/v3.mp4',
    'assets/images/v4.mp4',
    'assets/images/v5.mp4',
    'assets/images/v6.mp4',
    'assets/images/v7.mp4'
];

// Load reels gallery
function loadReelsGallery() {
    const reelsGallery = document.querySelector('.reels-gallery');
    reelsGallery.innerHTML = '';

    reelsVideos.forEach((video, index) => {
        const reelItem = document.createElement('div');
        reelItem.className = 'reel-item';
        reelItem.innerHTML = `
            <video
                class="reel-video"
                preload="metadata"
                muted
                loop
                playsinline
            >
                <source src="${video}" type="video/mp4">
                Your browser does not support the video tag.
            </video>
            <div class="reel-overlay">
                <div class="play-button">
                    <i class="fas fa-play"></i>
                </div>
                <div class="reel-info">
                    <p>Makeup Reel ${index + 1}</p>
                </div>
            </div>
        `;

        // Add click event to play/pause video
        const videoElement = reelItem.querySelector('.reel-video');
        const playButton = reelItem.querySelector('.play-button');
        const overlay = reelItem.querySelector('.reel-overlay');

        reelItem.addEventListener('click', () => {
            if (videoElement.paused) {
                // Pause all other videos
                document.querySelectorAll('.reel-video').forEach(v => {
                    if (v !== videoElement) {
                        v.pause();
                        v.parentElement.querySelector('.reel-overlay').style.opacity = '1';
                        v.parentElement.querySelector('.play-button i').className = 'fas fa-play';
                    }
                });

                // Play this video
                videoElement.play();
                overlay.style.opacity = '0';
                playButton.querySelector('i').className = 'fas fa-pause';
            } else {
                // Pause this video
                videoElement.pause();
                overlay.style.opacity = '1';
                playButton.querySelector('i').className = 'fas fa-play';
            }
        });

        // Reset overlay when video ends
        videoElement.addEventListener('ended', () => {
            overlay.style.opacity = '1';
            playButton.querySelector('i').className = 'fas fa-play';
        });

        // Handle video loading errors
        videoElement.addEventListener('error', () => {
            reelItem.innerHTML = `
                <div class="reel-error">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>Video unavailable</p>
                    <small>Reel ${index + 1}</small>
                </div>
            `;
        });

        // Add loading state
        videoElement.addEventListener('loadstart', () => {
            overlay.style.background = 'rgba(0, 0, 0, 0.6)';
        });

        videoElement.addEventListener('canplay', () => {
            overlay.style.background = 'rgba(0, 0, 0, 0.4)';
        });

        reelsGallery.appendChild(reelItem);
    });
}

// Lightbox functionality
let currentImageIndex = 0;

function openLightbox(imageSrc, index) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    
    lightbox.style.display = 'block';
    lightboxImg.src = imageSrc;
    currentImageIndex = index;
    
    // Prevent body scroll when lightbox is open
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function showPrevImage() {
    currentImageIndex = (currentImageIndex - 1 + portfolioImages.length) % portfolioImages.length;
    document.getElementById('lightbox-img').src = portfolioImages[currentImageIndex];
}

function showNextImage() {
    currentImageIndex = (currentImageIndex + 1) % portfolioImages.length;
    document.getElementById('lightbox-img').src = portfolioImages[currentImageIndex];
}

// Lightbox event listeners
document.querySelector('.close-lightbox').addEventListener('click', closeLightbox);
document.querySelector('.prev-btn').addEventListener('click', showPrevImage);
document.querySelector('.next-btn').addEventListener('click', showNextImage);

// Close lightbox when clicking outside the image
document.getElementById('lightbox').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) {
        closeLightbox();
    }
});

// Keyboard navigation for lightbox
document.addEventListener('keydown', (e) => {
    const lightbox = document.getElementById('lightbox');
    if (lightbox.style.display === 'block') {
        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowLeft') {
            showPrevImage();
        } else if (e.key === 'ArrowRight') {
            showNextImage();
        }
    }
});

// Map functionality
function initMap() {
    // Map is loaded via iframe, no additional JavaScript needed
    console.log('Map loaded successfully');
}

// Enhanced contact buttons
function enhanceContactButtons() {
    const whatsappBtn = document.querySelector('.whatsapp-btn');
    const callBtn = document.querySelector('.call-btn');

    if (whatsappBtn) {
        whatsappBtn.addEventListener('click', function() {
            // Track WhatsApp click
            console.log('WhatsApp button clicked');
        });
    }

    if (callBtn) {
        callBtn.addEventListener('click', function() {
            // Track call button click
            console.log('Call button clicked');
        });
    }
}

// Scroll to contact function
function scrollToContact() {
    document.getElementById('contact').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Image Slider Functionality
let currentSlideIndex = 0;
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');
let slideInterval;

// Initialize slider
function initSlider() {
    if (slides.length === 0) return;

    // Start auto-slide
    startAutoSlide();

    // Add touch/swipe support for mobile
    addTouchSupport();
}

// Change slide function
function changeSlide(direction) {
    if (slides.length === 0) return;

    // Remove active class from current slide and dot
    slides[currentSlideIndex].classList.remove('active');
    dots[currentSlideIndex].classList.remove('active');

    // Calculate new slide index
    currentSlideIndex += direction;

    // Handle wrap around
    if (currentSlideIndex >= slides.length) {
        currentSlideIndex = 0;
    } else if (currentSlideIndex < 0) {
        currentSlideIndex = slides.length - 1;
    }

    // Add active class to new slide and dot
    slides[currentSlideIndex].classList.add('active');
    dots[currentSlideIndex].classList.add('active');

    // Restart auto-slide timer
    restartAutoSlide();
}

// Go to specific slide
function currentSlide(slideIndex) {
    if (slides.length === 0) return;

    // Remove active class from current slide and dot
    slides[currentSlideIndex].classList.remove('active');
    dots[currentSlideIndex].classList.remove('active');

    // Set new slide index (convert from 1-based to 0-based)
    currentSlideIndex = slideIndex - 1;

    // Add active class to new slide and dot
    slides[currentSlideIndex].classList.add('active');
    dots[currentSlideIndex].classList.add('active');

    // Restart auto-slide timer
    restartAutoSlide();
}

// Auto-slide functionality
function startAutoSlide() {
    slideInterval = setInterval(() => {
        changeSlide(1);
    }, 5000); // Change slide every 5 seconds
}

function stopAutoSlide() {
    clearInterval(slideInterval);
}

function restartAutoSlide() {
    stopAutoSlide();
    startAutoSlide();
}

// Touch/Swipe support for mobile
function addTouchSupport() {
    const slider = document.querySelector('.image-slider');
    if (!slider) return;

    let startX = 0;
    let endX = 0;

    slider.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    });

    slider.addEventListener('touchend', (e) => {
        endX = e.changedTouches[0].clientX;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = startX - endX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe left - next slide
                changeSlide(1);
            } else {
                // Swipe right - previous slide
                changeSlide(-1);
            }
        }
    }
}

// Pause auto-slide when user hovers over slider
function addHoverPause() {
    const slider = document.querySelector('.image-slider');
    if (!slider) return;

    slider.addEventListener('mouseenter', stopAutoSlide);
    slider.addEventListener('mouseleave', startAutoSlide);
}

// Keyboard navigation support
function addKeyboardSupport() {
    document.addEventListener('keydown', (e) => {
        // Only handle keyboard events when slider is visible
        const slider = document.querySelector('.image-slider');
        if (!slider || slides.length === 0) return;

        switch(e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                changeSlide(-1);
                break;
            case 'ArrowRight':
                e.preventDefault();
                changeSlide(1);
                break;
            case ' ': // Spacebar
                e.preventDefault();
                changeSlide(1);
                break;
            case 'Escape':
                // Stop auto-slide when escape is pressed
                stopAutoSlide();
                break;
        }
    });
}

// Preload images for better performance
function preloadImages() {
    slides.forEach(slide => {
        const img = slide.querySelector('img');
        if (img && img.src) {
            const preloadImg = new Image();
            preloadImg.src = img.src;
        }
    });
}

// Image Cropping Functions
function setCropMode(slideIndex, cropClass) {
    if (slides.length === 0 || slideIndex < 0 || slideIndex >= slides.length) return;

    const img = slides[slideIndex].querySelector('img');
    if (img) {
        // Remove existing crop classes
        img.className = img.className.replace(/crop-\w+/g, '');
        // Add new crop class
        img.classList.add(cropClass);
    }
}

function setAllCropMode(cropClass) {
    slides.forEach(slide => {
        const img = slide.querySelector('img');
        if (img) {
            // Remove existing crop classes
            img.className = img.className.replace(/crop-\w+/g, '');
            // Add new crop class
            img.classList.add(cropClass);
        }
    });
}

function setObjectFit(fitMode) {
    slides.forEach(slide => {
        const img = slide.querySelector('img');
        if (img) {
            img.style.objectFit = fitMode;
            // Add background for contain and scale-down modes
            if (fitMode === 'contain' || fitMode === 'scale-down') {
                img.style.background = 'var(--primary-black)';
            } else {
                img.style.background = 'transparent';
            }
        }
    });
}

// Smart crop detection based on image dimensions
function applySmartCrop() {
    slides.forEach((slide, index) => {
        const img = slide.querySelector('img');
        if (img) {
            img.onload = function() {
                const aspectRatio = this.naturalWidth / this.naturalHeight;

                if (aspectRatio > 1.5) {
                    // Wide image - use landscape crop
                    setCropMode(index, 'crop-landscape');
                } else if (aspectRatio < 0.8) {
                    // Tall image - use portrait crop
                    setCropMode(index, 'crop-portrait');
                } else {
                    // Square-ish image - use smart crop
                    setCropMode(index, 'crop-smart');
                }
            };

            // Trigger load event if image is already loaded
            if (img.complete) {
                img.onload();
            }
        }
    });
}

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    // Initialize photo gallery by default
    loadPhotoGallery();

    // Initialize image slider with all features
    initSlider();
    addHoverPause();
    addKeyboardSupport();
    preloadImages();

    // Initialize map and contact buttons
    initMap();
    enhanceContactButtons();

    // Add animation classes to elements
    const animatedElements = document.querySelectorAll('.service-card, .testimonial-card, .about-content, .contact-content');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Testimonials slider (auto-rotate)
let currentTestimonial = 0;
const testimonials = document.querySelectorAll('.testimonial-card');

function rotateTestimonials() {
    testimonials.forEach((testimonial, index) => {
        testimonial.style.opacity = index === currentTestimonial ? '1' : '0.7';
        testimonial.style.transform = index === currentTestimonial ? 'scale(1.05)' : 'scale(1)';
    });
    
    currentTestimonial = (currentTestimonial + 1) % testimonials.length;
}

// Start testimonial rotation
setInterval(rotateTestimonials, 4000);

// Add loading animation
window.addEventListener('load', () => {
    const loader = document.createElement('div');
    loader.innerHTML = `
        <div style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: var(--primary-black);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            transition: opacity 0.5s ease;
        ">
            <div style="
                text-align: center;
                color: var(--gold);
            ">
                <div style="
                    width: 50px;
                    height: 50px;
                    border: 3px solid rgba(255, 215, 0, 0.3);
                    border-top: 3px solid var(--gold);
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin: 0 auto 1rem;
                "></div>
                <img src="assets/images/hardikalogo.png" alt="Hardika Makeover" style="height: 60px; width: auto; max-width: 200px; object-fit: contain; margin-top: 1rem;">
            </div>
        </div>
    `;
    
    // Add spin animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(loader);
    
    setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(loader);
        }, 500);
    }, 1500);
});

// Add parallax effect to hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroImage = document.querySelector('.hero-image img');
    if (heroImage) {
        heroImage.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Add hover effects to service cards
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
    });
});

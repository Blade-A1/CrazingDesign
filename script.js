// List of all images in the Materials folder
const images = [
    'Airbrush-IMAGE-ENHANCER-1770564650665-1770564650666.png',
    'Airbrush-IMAGE-ENHANCER-1771654607422-1771654607422.png',
    'Azerga Avatarka.png',
    'Azerga Banner.png',
    'IMG_20260201_141712_890.png',
    'ODOBLI GEZT (SAVE).jpg',
    'Odobli Gezt.png',
    'Untitled10_20260224210131.png',
    'Untitled11_20260302160448 (1).png',
    'Untitled11_20260308130354.png',
    'Untitled13_20260308152918.png',
    'Untitled15_20260303163750.png',
    'Untitled16_20260303205805.png',
    'Untitled16_20260308212047.png',
    'Untitled1_20260221160036.png',
    'Untitled2_20260109162146.png',
    'Untitled2_20260221160403.png',
    'Untitled2_20260226215541.png',
    'Untitled3_20260221170430.png',
    'Untitled4_20260227162510.png',
    'Untitled6_20260310141804.png',
    'Untitled7_20260222143620.jpg',
    'Untitled8_20260210213448.png',
    'Untitled8_20260307135133.png'
];

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    loadGallery();
    setupNavigation();
    setupScrollAnimations();
    setupParallax();
    setupSmoothScroll();
});

function loadGallery() {
    const gallery = document.getElementById('gallery');
    
    images.forEach((image, index) => {
        // Create gallery item
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        
        // Create image element
        const imgElement = document.createElement('img');
        imgElement.src = `Materials/${encodeURIComponent(image)}`;
        imgElement.alt = image;
        imgElement.loading = 'lazy';
        
        // Handle image load error
        imgElement.onerror = function() {
            console.warn(`Failed to load image: ${image}`);
            galleryItem.style.opacity = '0.5';
            galleryItem.title = 'Image failed to load';
        };
        
        // Create overlay with image name
        const overlay = document.createElement('div');
        overlay.className = 'gallery-item-overlay';
        
        const itemName = document.createElement('div');
        itemName.className = 'gallery-item-name';
        itemName.textContent = formatImageName(image);
        
        overlay.appendChild(itemName);
        
        // Add click to fullscreen
        galleryItem.addEventListener('click', function() {
            openFullscreen(image);
        });
        
        // Append elements
        galleryItem.appendChild(imgElement);
        galleryItem.appendChild(overlay);
        
        // Add to gallery
        gallery.appendChild(galleryItem);
    });
    
    console.log(`✅ Loaded ${images.length} images to gallery`);
}

function formatImageName(filename) {
    // Remove file extension and clean up the name
    let name = filename.replace(/\.[^.]+$/, '');
    
    // Replace underscores and dashes with spaces
    name = name.replace(/[_-]/g, ' ');
    
    // Remove timestamps and numbers
    name = name.replace(/\s*\d{10,}\s*/g, ' ');
    
    // Clean up extra spaces
    name = name.replace(/\s+/g, ' ').trim();
    
    // Remove common prefixes
    name = name.replace(/^Untitled\s*/i, '');
    name = name.replace(/^Airbrush\s*/i, '');
    
    // Capitalize words
    name = name.split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    
    return name || 'Design';
}

function openFullscreen(imagePath) {
    // Create fullscreen overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.95);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 99999;
        cursor: pointer;
        animation: fadeIn 0.3s ease;
        backdrop-filter: blur(5px);
    `;
    
    const img = document.createElement('img');
    img.src = `Materials/${encodeURIComponent(imagePath)}`;
    img.style.cssText = `
        max-width: 90vw;
        max-height: 90vh;
        object-fit: contain;
        border-radius: 8px;
        box-shadow: 0 0 40px rgba(99, 102, 241, 0.6);
        animation: fadeIn 0.4s ease;
    `;
    
    const closeBtn = document.createElement('div');
    closeBtn.innerHTML = '✕';
    closeBtn.style.cssText = `
        position: absolute;
        top: 25px;
        right: 35px;
        font-size: 50px;
        color: #ffffff;
        cursor: pointer;
        transition: all 0.3s ease;
        font-weight: bold;
        text-shadow: 0 0 10px rgba(0, 0, 0, 0.8);
    `;
    
    closeBtn.onmouseover = function() { 
        this.style.transform = 'scale(1.3) rotate(90deg)';
        this.style.color = '#6366f1';
    };
    
    closeBtn.onmouseout = function() { 
        this.style.transform = 'scale(1) rotate(0deg)';
        this.style.color = '#ffffff';
    };
    
    overlay.appendChild(img);
    overlay.appendChild(closeBtn);
    
    // Close on click
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay || e.target === closeBtn) {
            overlay.remove();
        }
    });
    
    // Close on Escape key
    function closeOnEscape(e) {
        if (e.key === 'Escape') {
            overlay.remove();
            document.removeEventListener('keydown', closeOnEscape);
        }
    }
    document.addEventListener('keydown', closeOnEscape);
    
    // Navigate with arrow keys
    function navigateImages(e) {
        if (e.key === 'ArrowLeft') {
            const currentIndex = images.indexOf(imagePath);
            const prevImage = images[(currentIndex - 1 + images.length) % images.length];
            overlay.remove();
            document.removeEventListener('keydown', closeOnEscape);
            document.removeEventListener('keydown', navigateImages);
            openFullscreen(prevImage);
        } else if (e.key === 'ArrowRight') {
            const currentIndex = images.indexOf(imagePath);
            const nextImage = images[(currentIndex + 1) % images.length];
            overlay.remove();
            document.removeEventListener('keydown', closeOnEscape);
            document.removeEventListener('keydown', navigateImages);
            openFullscreen(nextImage);
        }
    }
    document.addEventListener('keydown', navigateImages);
    
    document.body.appendChild(overlay);
}

// Setup navigation
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

// Setup scroll animations
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.gallery-item').forEach(item => {
        observer.observe(item);
    });
}

// Add animations dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }

    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// Setup parallax effect on scroll
function setupParallax() {
    const heroBlocks = document.querySelectorAll('.hero-block');
    
    window.addEventListener('scroll', function() {
        const scrollY = window.scrollY;
        
        heroBlocks.forEach((block, index) => {
            const speed = 0.5 + (index * 0.1);
            block.style.transform = `translateY(${scrollY * speed}px) rotate(${scrollY * 0.05}deg)`;
        });
    });
}

// Setup smooth scroll with enhanced transitions
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
    
    // Animate elements on scroll into view
    const observerOptions = {
        threshold: 0.05,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.animation = 'fadeInUp 0.8s ease-out forwards';
            }
        });
    }, observerOptions);
    
    // Observe interactive elements
    document.querySelectorAll('.social-card, .portfolio-subtitle, .connect-subtitle').forEach(el => {
        observer.observe(el);
    });
}

// Add enhanced transition feedback on all buttons
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.btn, .social-card, .gallery-item').forEach(element => {
        element.addEventListener('mousedown', function() {
            this.style.transform = (this.style.transform || '') + ' scale(0.98)';
        });
        
        element.addEventListener('mouseup', function() {
            this.style.transform = this.style.transform.replace(' scale(0.98)', '');
        });
    });
});

console.log('🎮 Portfolio loaded successfully!');



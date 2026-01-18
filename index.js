// ================== MOBILE MENU TOGGLE ==================
const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
const navMenu = document.querySelector('.nav-menu');

if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
        mobileMenuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        if (navMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });
}

// Close mobile menu when clicking on a link
const navLinks = document.querySelectorAll('.nav-menu a');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (mobileMenuToggle) {
            mobileMenuToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (navMenu.classList.contains('active') && 
        !navMenu.contains(e.target) && 
        !mobileMenuToggle.contains(e.target)) {
        mobileMenuToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// ================== HERO SLIDER ==================
const slides = document.querySelectorAll('.slide');
const tabs = document.querySelectorAll('.tab');
let currentSlide = 0;
const slideInterval = 6000; // 6 seconds as per Japanese comment (6秒)
const totalSlides = slides.length;

function showSlide(index) {
    // Remove active class from all slides
    slides.forEach(slide => slide.classList.remove('active'));
    slides[index].classList.add('active');
    
    // Update tabs
    tabs.forEach(tab => tab.classList.remove('active'));
    tabs[index].classList.add('active');
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    showSlide(currentSlide);
}

// Auto-play slider - loops 5 slides (ループでスライドショーが5枚分流れる)
let sliderTimer = setInterval(nextSlide, slideInterval);

// Tab click handlers
tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => {
        currentSlide = index;
        showSlide(currentSlide);
        // Reset timer when user manually changes slide
        clearInterval(sliderTimer);
        sliderTimer = setInterval(nextSlide, slideInterval);
    });
});

// Pause slider on hover (desktop only)
const heroSection = document.querySelector('.hero');
if (window.innerWidth > 768) {
    heroSection.addEventListener('mouseenter', () => {
        clearInterval(sliderTimer);
    });

    heroSection.addEventListener('mouseleave', () => {
        sliderTimer = setInterval(nextSlide, slideInterval);
    });
}

// ================== COUPON BANNER ==================
const couponBanner = document.getElementById('coupon-banner');
const closeCouponBtn = document.getElementById('close-coupon');

if (closeCouponBtn) {
    closeCouponBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        couponBanner.classList.add('hide');
        setTimeout(() => {
            couponBanner.style.display = 'none';
        }, 300);
    });
}

// ================== READ MORE BUTTON ==================
const readMoreBtns = document.querySelectorAll('.read-more-btn');
readMoreBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = btn.getAttribute('href');
        
        if (targetId && targetId !== '#') {
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const targetPosition = targetSection.offsetTop;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// ================== TOUCH SWIPE SUPPORT ==================
let touchStartX = 0;
let touchEndX = 0;
let touchStartY = 0;
let touchEndY = 0;

heroSection.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
});

heroSection.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const verticalSwipe = Math.abs(touchEndY - touchStartY);
    const horizontalSwipe = Math.abs(touchEndX - touchStartX);
    
    // Only handle horizontal swipes (ignore vertical scrolling)
    if (horizontalSwipe > verticalSwipe) {
        if (touchEndX < touchStartX - swipeThreshold) {
            // Swipe left - next slide
            nextSlide();
            clearInterval(sliderTimer);
            sliderTimer = setInterval(nextSlide, slideInterval);
        }
        
        if (touchEndX > touchStartX + swipeThreshold) {
            // Swipe right - previous slide
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            showSlide(currentSlide);
            clearInterval(sliderTimer);
            sliderTimer = setInterval(nextSlide, slideInterval);
        }
    }
}

// ================== KEYBOARD NAVIGATION ==================
document.addEventListener('keydown', (e) => {
    // Only on desktop
    if (window.innerWidth > 768) {
        if (e.key === 'ArrowLeft') {
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            showSlide(currentSlide);
            clearInterval(sliderTimer);
            sliderTimer = setInterval(nextSlide, slideInterval);
        } else if (e.key === 'ArrowRight') {
            nextSlide();
            clearInterval(sliderTimer);
            sliderTimer = setInterval(nextSlide, slideInterval);
        }
    }
});

// ================== PRELOAD IMAGES ==================
function preloadNextSlide() {
    const nextIndex = (currentSlide + 1) % totalSlides;
    const nextSlide = slides[nextIndex];
    const bgImage = window.getComputedStyle(nextSlide).backgroundImage;
    
    if (bgImage && bgImage !== 'none') {
        const img = new Image();
        const url = bgImage.slice(4, -1).replace(/"/g, '');
        img.src = url;
    }
}

// Preload next slide periodically
setInterval(preloadNextSlide, slideInterval - 500);

// ================== PERFORMANCE OPTIMIZATION ==================
// Pause slider when tab is not visible
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        clearInterval(sliderTimer);
    } else {
        sliderTimer = setInterval(nextSlide, slideInterval);
    }
});

// ================== RESPONSIVE HANDLING ==================
let isDesktop = window.innerWidth > 768;

window.addEventListener('resize', () => {
    const wasDesktop = isDesktop;
    isDesktop = window.innerWidth > 768;
    
    // Close mobile menu if resized to desktop
    if (isDesktop && !wasDesktop) {
        navMenu.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// ================== INITIALIZATION ==================


// Preload first few images on page load
window.addEventListener('load', () => {
    // Preload first 2 slides
    for (let i = 0; i < Math.min(2, totalSlides); i++) {
        const slide = slides[i];
        const bgImage = window.getComputedStyle(slide).backgroundImage;
        if (bgImage && bgImage !== 'none') {
            const img = new Image();
            const url = bgImage.slice(4, -1).replace(/"/g, '');
            img.src = url;
        }
    }
});

// CAMPAIGN CAROUSEL CONTROLS
const campaignCarousel = document.querySelector('.campaign-carousel');
const prevBtn = document.querySelector('.campaign-nav .carousel-prev');
const nextBtn = document.querySelector('.campaign-nav .carousel-next');
const campaignThumbs = document.querySelectorAll('.campaign-thumb');
let isPC = window.innerWidth > 992;

if (isPC && campaignCarousel) {
    // PC: Infinite scrolling carousel
    const originalSlides = Array.from(document.querySelectorAll('.campaign-slide'));
    const slideCount = originalSlides.length;
    
    // Clone slides twice for seamless loop
    originalSlides.forEach(slide => {
        campaignCarousel.appendChild(slide.cloneNode(true));
    });
    
    const slideWidth = 470; // 450px + 20px gap
    let offset = 0;
    let animationId = null;
    const speed = 0.5;
    
    function animate() {
        offset -= speed;
        const resetPoint = -(slideCount * slideWidth);
        
        if (offset <= resetPoint) {
            offset = 0;
        }
        
        campaignCarousel.style.transform = `translateX(${offset}px)`;
        animationId = requestAnimationFrame(animate);
    }
    
    animate();
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            offset -= slideWidth;
        });
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            offset += slideWidth;
        });
    }
} else if (campaignCarousel) {
    // Mobile: Standard slideshow (preserved original behavior)
    const campaignSlides = document.querySelectorAll('.campaign-slide');
    let currentCampaign = 0;
    let campaignTimer;
    
    function updateMobileSlide() {
        campaignSlides.forEach((slide, i) => {
            slide.classList.toggle('active', i === currentCampaign);
        });
        campaignThumbs.forEach((thumb, i) => {
            thumb.classList.toggle('active', i === currentCampaign);
        });
    }
    
    function nextMobileSlide() {
        currentCampaign = (currentCampaign + 1) % campaignSlides.length;
        updateMobileSlide();
    }
    
    function prevMobileSlide() {
        currentCampaign = (currentCampaign - 1 + campaignSlides.length) % campaignSlides.length;
        updateMobileSlide();
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextMobileSlide();
            clearInterval(campaignTimer);
            campaignTimer = setInterval(nextMobileSlide, 3000);
        });
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevMobileSlide();
            clearInterval(campaignTimer);
            campaignTimer = setInterval(nextMobileSlide, 3000);
        });
    }
    
    campaignThumbs.forEach((thumb, index) => {
        thumb.addEventListener('click', () => {
            currentCampaign = index;
            updateMobileSlide();
            clearInterval(campaignTimer);
            campaignTimer = setInterval(nextMobileSlide, 3000);
        });
    });
    
    campaignTimer = setInterval(nextMobileSlide, 3000);
    updateMobileSlide();
}

// ================== NEWSLETTER FORM SUBMIT ==================
const newsletterForm = document.querySelector('.newsletter-form form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // Add actual subscription logic here
        newsletterForm.reset();
    });
}

// ================== ABOUT SCROLL SCRUB ==================

const aboutSection = document.querySelector('.about-section');
const aboutImages = document.querySelector('.about-images');

window.addEventListener('scroll', () => {
    const sectionTop = aboutSection.offsetTop;
    const sectionHeight = aboutSection.offsetHeight;
    const scrollY = window.scrollY;

    const start = sectionTop;
    const end = sectionTop + sectionHeight - window.innerHeight;

    if (scrollY < start || scrollY > end) return;

    const progress = (scrollY - start) / (end - start);

    const maxTranslate =
        aboutImages.scrollHeight - window.innerHeight;

    aboutImages.style.transform = `translateY(-${progress * maxTranslate}px)`;
});



// ================== NEW ARRIVAL PRODUCTS ==================
const products = [
    { img: 'product1.jpg', name: '果実ブレンド', price: '¥1,980 (税込)' },
    { img: 'product2.jpg', name: '[限定 40%OFF] コールドブリューコーヒー (色のボトル) 330ml 1本', price: '¥648 (税込)' },
    { img: 'product3.jpg', name: '水出しコーヒーパック COLD BREW Refresh (コーヒーパック コールドブリューリフレッシュ) 5パック', price: '¥1,180 (税込)' },
    { img: 'product4.jpg', name: 'フアンリープレンド', price: '¥1,780 (税込)' },
    { img: 'product1.jpg', name: 'コーヒープリン H', price: '¥1,780 (税込)' },
    { img: 'product2.jpg', name: '果実ブレンド', price: '¥1,980 (税込)' },
    { img: 'product3.jpg', name: '[限定 40%OFF] コールドブリューコーヒー', price: '¥648 (税込)' },
    { img: 'product4.jpg', name: '水出しコーヒーパック COLD BREW Refresh', price: '¥1,180 (税込)' }
];

function renderNewArrivals() {
    const grid = document.querySelector('.product-grid');
    if (!grid) return;

    grid.innerHTML = '';
    const isMobile = window.innerWidth <= 768;
    const numToShow = isMobile ? 4 : 10;

    for (let i = 0; i < numToShow; i++) {
        const product = products[i];
        const item = document.createElement('div');
        item.classList.add('product-item');
        item.innerHTML = `
            <div class="product-image-wrapper">
                <img src="./images/new.png" alt="New" class="new-badge">
                <img src="./images/${product.img}" alt="${product.name}" class="product-image">
            </div>
            <p class="product-name">${product.name}</p>
            <p class="product-price">${product.price}</p>
        `;
        grid.appendChild(item);
    }
}

// Call on load and resize
window.addEventListener('load', renderNewArrivals);
window.addEventListener('resize', renderNewArrivals);

// ================== RANKING PRODUCTS ==================
const rankingProducts = {
    bestseller: [
        { img: 'product1.jpg', name: '果実ブレンド', price: '¥1,980 (税込)', rank: '1.png' },
        { img: 'product2.jpg', name: '[限定 40%OFF] コールドブリューコーヒー (色のボトル) 330ml 1本', price: '¥648 (税込)', rank: '2.png' },
        { img: 'product3.jpg', name: '水出しコーヒーパック COLD BREW Refresh (コーヒーパック コールドブリューリフレッシュ) 5パック (917g分)', price: '¥1,180 (税込)', rank: '3.png' },
        { img: 'product4.jpg', name: 'マンデリープレンド', price: '¥1,780 (税込)', rank: '4.png' }
    ],
    gift: [
        { img: 'product2.jpg', name: 'ギフトセット A', price: '¥3,980 (税込)', rank: '1.png' },
        { img: 'product3.jpg', name: 'ギフトセット B', price: '¥2,980 (税込)', rank: '2.png' },
        { img: 'product1.jpg', name: 'ギフトセット C', price: '¥4,980 (税込)', rank: '3.png' },
        { img: 'product4.jpg', name: 'ギフトセット D', price: '¥2,480 (税込)', rank: '4.png' }
    ]
};

let currentRankingTab = 'bestseller';

function renderRanking(tab = 'bestseller') {
    const grid = document.querySelector('.ranking-grid');
    if (!grid) return;

    grid.innerHTML = '';
    const products = rankingProducts[tab];

    products.forEach(product => {
        const item = document.createElement('div');
        item.classList.add('product-item');
        item.innerHTML = `
            <div class="product-image-wrapper">
                <img src="./images/${product.rank}" alt="Rank ${product.rank.charAt(0)}" class="rank-badge">
                <img src="./images/${product.img}" alt="${product.name}" class="product-image">
            </div>
            <p class="product-name">${product.name}</p>
            <p class="product-price">${product.price}</p>
        `;
        grid.appendChild(item);
    });
}

// Ranking tab switching
const rankingTabs = document.querySelectorAll('.ranking-tab');
rankingTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        rankingTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const tabName = tab.getAttribute('data-tab');
        currentRankingTab = tabName;
        renderRanking(tabName);
    });
});

// Call on load
window.addEventListener('load', () => renderRanking('bestseller'));
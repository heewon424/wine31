// Register GSAP Plugins
gsap.registerPlugin(ScrollTrigger);

// Initialize Lenis (Smooth Scrolling)
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
});

// Lenis와 GSAP ScrollTrigger 연동 (필수)
lenis.on('scroll', ScrollTrigger.update);

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);


// Custom Cursor Logic
const cursorDot = document.querySelector('.cursor-dot');
const cursorCircle = document.querySelector('.cursor-circle');
let mouseX = 0;
let mouseY = 0;
let cursorX = 0;
let cursorY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Dot follows immediately
    gsap.to(cursorDot, {
        x: mouseX,
        y: mouseY,
        duration: 0
    });
});

// Circle follows with delay
gsap.ticker.add(() => {
    const dt = 1.0 - Math.pow(1.0 - 0.2, gsap.ticker.deltaRatio());
    cursorX += (mouseX - cursorX) * dt;
    cursorY += (mouseY - cursorY) * dt;

    gsap.set(cursorCircle, { x: cursorX, y: cursorY });
});

// Hover States
const hoverables = document.querySelectorAll('a, button, .menu-toggle, .menu-row');
hoverables.forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
});

// Loader Animation
window.addEventListener('load', () => {
    const loaderTL = gsap.timeline();

    loaderTL.to('.loader-logo', {
        opacity: 1,
        y: 0,
        duration: 0.5, // Reduced to 0.5s for quick impact
        ease: 'power4.out',
        delay: 0.1
    })
        .to('.loader', {
            y: '-100%',
            duration: 0.8, // Snappier exit (0.8s)
            ease: 'power4.inOut',
            delay: 0 // No wait time, immediate transition
        })
        .from('.hero-title .line', {
            y: 100,
            opacity: 0,
            duration: 1.5,
            stagger: 0.2,
            ease: 'power4.out'
        }, "-=0.8")
        .to('.hero-subtitle', {
            opacity: 1,
            duration: 1
        }, "-=1")
        .add(() => {
            document.body.classList.remove('loading');
        });
});

// Menu Toggle (Fix for functionality)
const menuToggle = document.querySelector('.menu-toggle');
const menuOverlay = document.querySelector('.menu-overlay');
const menuLinks = document.querySelectorAll('.menu-link');

function toggleMenu() {
    const isActive = menuToggle.classList.contains('active');

    if (isActive) {
        menuToggle.classList.remove('active');
        menuOverlay.classList.remove('active');
        lenis.start(); // Resume scrolling
    } else {
        menuToggle.classList.add('active');
        menuOverlay.classList.add('active');
        lenis.stop(); // Stop scrolling
    }
}

menuToggle.addEventListener('click', toggleMenu);

menuLinks.forEach(link => {
    link.addEventListener('click', () => {
        toggleMenu(); // Close menu on link click
        // Allow time for menu to close before scrolling
        // Lenis handles the smooth scroll automatically via anchor links
    });
});

// Parallax Hero
gsap.to('.hero-bg', {
    yPercent: 30,
    ease: 'none',
    scrollTrigger: {
        trigger: '.hero-section',
        start: 'top top',
        end: 'bottom top',
        scrub: true
    }
});

// Hero Mouse Parallax
const heroSection = document.querySelector('.hero-section');
const heroTitle = document.querySelector('.hero-title');

heroSection.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 20; // -10 to 10
    const y = (e.clientY / window.innerHeight - 0.5) * 20; // -10 to 10

    gsap.to(heroTitle, {
        x: x,
        y: y,
        duration: 2,
        ease: 'power2.out'
    });
});

// Philosophy Text Reveal (Refined)
const textElements = document.querySelectorAll('.reveal-text p');
gsap.from(textElements, {
    y: 100,
    opacity: 0,
    duration: 1.5,
    stagger: 0.2, // Stagger each line by 0.2s
    ease: 'power4.out',
    scrollTrigger: {
        trigger: '.reveal-text',
        start: 'top 80%',
    }
});

// Spatial Images Parallax


gsap.from('.item-1 img', {
    scale: 1.15,
    yPercent: -5,
    ease: 'none',
    scrollTrigger: {
        trigger: '.item-1',
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
    }
});

gsap.from('.item-3 img', {
    scale: 1.15,
    yPercent: 5,
    ease: 'none',
    scrollTrigger: {
        trigger: '.item-3',
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
    }
});

// Wine Items Reveal - 카테고리별 개별 트리거
document.querySelectorAll('.wine-category').forEach((category) => {
    const items = category.querySelectorAll('.wine-item');
    gsap.fromTo(items,
        { y: 30, opacity: 0 },
        {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.06,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: category,
                start: 'top 85%',
                once: true,
                onEnter: () => {
                    gsap.set(items, { clearProps: 'all' });
                }
            }
        }
    );
});


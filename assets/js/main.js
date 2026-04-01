// ============================================
// PixelPort - Main JavaScript
// Fixed Hamburger Menu with Brand Logo
// ============================================

// DOM Elements
const htmlRoot = document.getElementById('htmlRoot');
const themeToggle = document.getElementById('themeToggle');
const rtlToggle = document.getElementById('rtlToggle');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const homeDropdown = document.getElementById('homeDropdown');
const newsletterForm = document.getElementById('newsletterForm');

// ============================================
// Theme Management (Dark/Light Mode)
// ============================================
const savedTheme = localStorage.getItem('theme') || 'dark';
htmlRoot.setAttribute('data-theme', savedTheme);

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const currentTheme = htmlRoot.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        htmlRoot.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        themeToggle.style.transform = 'rotate(360deg)';
        setTimeout(() => {
            themeToggle.style.transform = '';
        }, 300);
    });
}

// ============================================
// RTL Management (Right-to-Left)
// ============================================
const savedDir = localStorage.getItem('dir') || 'ltr';
htmlRoot.setAttribute('dir', savedDir);

if (rtlToggle) {
    rtlToggle.addEventListener('click', () => {
        const currentDir = htmlRoot.getAttribute('dir');
        const newDir = currentDir === 'ltr' ? 'rtl' : 'ltr';
        
        htmlRoot.setAttribute('dir', newDir);
        localStorage.setItem('dir', newDir);
        
        rtlToggle.style.transform = 'scale(0.95)';
        setTimeout(() => {
            rtlToggle.style.transform = '';
        }, 200);
    });
}

// ============================================
// Create Menu Header with Brand Logo
// ============================================
function createMenuHeader() {
    const navMenu = document.getElementById('navMenu');
    if (!navMenu) return;
    
    // Check if header already exists - if yes, don't recreate
    if (navMenu.querySelector('.nav-menu-header')) {
        return;
    }
    
    // Store the existing children
    const existingChildren = Array.from(navMenu.children);
    
    // Create menu header
    const menuHeader = document.createElement('div');
    menuHeader.className = 'nav-menu-header';
    menuHeader.innerHTML = `
        <a href="index.html" class="nav-menu-logo">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <rect x="2" y="6" width="20" height="12" rx="2"/>
                <path d="M8 6V4h8v2M12 18v2M7 10h2M15 10h2"/>
            </svg>
            <span class="nav-menu-logo-text">PIXEL<span>PORT</span></span>
        </a>
        <button class="nav-menu-close" id="menuCloseBtn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
        </button>
    `;
    
    // Create container for menu items
    const menuItemsContainer = document.createElement('div');
    menuItemsContainer.className = 'nav-menu-items';
    
    // Move all existing children to the container
    existingChildren.forEach(child => {
        menuItemsContainer.appendChild(child);
    });
    
    // Create footer
    const menuFooter = document.createElement('div');
    menuFooter.className = 'nav-menu-footer';
    menuFooter.innerHTML = `
        <div class="menu-footer-text">
            © ${new Date().getFullYear()} PixelPort<br>
            Preserving gaming history, one cartridge at a time.
        </div>
    `;
    
    // Clear navMenu and append new structure
    navMenu.innerHTML = '';
    navMenu.appendChild(menuHeader);
    navMenu.appendChild(menuItemsContainer);
    navMenu.appendChild(menuFooter);
}

// ============================================
// UNIQUE HAMBURGER MENU - Fixed Version
// ============================================
function initUniqueHamburger() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    
    if (!hamburger || !navMenu) {
        console.log('Hamburger or navMenu not found');
        return;
    }
    
    // Create overlay if not exists
    let overlay = document.querySelector('.menu-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'menu-overlay';
        document.body.appendChild(overlay);
    }
    
    // Add ripple effect to hamburger
    if (!hamburger.querySelector('.hamburger-ripple')) {
        const ripple = document.createElement('span');
        ripple.className = 'hamburger-ripple';
        hamburger.appendChild(ripple);
    }
    
    // Close menu function
    function closeMenu() {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
        document.body.classList.remove('menu-open');
        
        // Close any open dropdowns
        document.querySelectorAll('.dropdown.active').forEach(dropdown => {
            dropdown.classList.remove('active');
        });
    }
    
    // Open menu function
    function openMenu() {
        navMenu.classList.add('active');
        hamburger.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        document.body.classList.add('menu-open');
    }
    
    // Hamburger click event
    hamburger.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        // Ripple effect
        const ripple = hamburger.querySelector('.hamburger-ripple');
        if (ripple) {
            ripple.style.width = '100px';
            ripple.style.height = '100px';
            setTimeout(() => {
                ripple.style.width = '0';
                ripple.style.height = '0';
            }, 400);
        }
        
        if (navMenu.classList.contains('active')) {
            closeMenu();
        } else {
            openMenu();
        }
    });
    
    // Close menu when clicking overlay
    overlay.addEventListener('click', closeMenu);
    
    // Close menu when clicking on links (except dropdown triggers)
    navMenu.querySelectorAll('a:not(.dropdown-trigger)').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 1024) {
                closeMenu();
            }
        });
    });
    
    // Handle close button
    const closeBtn = document.getElementById('menuCloseBtn');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeMenu);
    }
    
    // Close menu on window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 1024 && navMenu.classList.contains('active')) {
            closeMenu();
        }
    });
}

// ============================================
// Home Dropdown Menu - Desktop & Mobile
// ============================================
function initHomeDropdown() {
    const homeDropdown = document.getElementById('homeDropdown');
    if (!homeDropdown) return;
    
    const dropdownParent = homeDropdown.closest('.dropdown');
    if (!dropdownParent) return;
    
    // Add mobile arrow indicator
    if (window.innerWidth <= 1024 && !homeDropdown.querySelector('.mobile-arrow')) {
        const arrow = document.createElement('span');
        arrow.className = 'mobile-arrow';
        arrow.innerHTML = '▼';
        arrow.style.marginLeft = '8px';
        arrow.style.fontSize = '10px';
        arrow.style.transition = 'transform 0.3s ease';
        homeDropdown.appendChild(arrow);
    }
    
    // Desktop dropdown (hover)
    if (window.innerWidth > 1024) {
        dropdownParent.addEventListener('mouseenter', function() {
            const dropdownMenu = this.querySelector('.dropdown-menu');
            if (dropdownMenu) {
                dropdownMenu.style.opacity = '1';
                dropdownMenu.style.visibility = 'visible';
                dropdownMenu.style.transform = 'translateY(0)';
            }
        });
        
        dropdownParent.addEventListener('mouseleave', function() {
            const dropdownMenu = this.querySelector('.dropdown-menu');
            if (dropdownMenu) {
                dropdownMenu.style.opacity = '';
                dropdownMenu.style.visibility = '';
                dropdownMenu.style.transform = '';
            }
        });
    }
    
    // Mobile dropdown (click)
    if (window.innerWidth <= 1024) {
        homeDropdown.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Close other dropdowns
            document.querySelectorAll('.dropdown.active').forEach(dropdown => {
                if (dropdown !== dropdownParent) {
                    dropdown.classList.remove('active');
                }
            });
            
            // Toggle current
            dropdownParent.classList.toggle('active');
            
            // Update arrow rotation
            const arrow = this.querySelector('.mobile-arrow');
            if (arrow) {
                arrow.style.transform = dropdownParent.classList.contains('active') ? 'rotate(180deg)' : 'rotate(0deg)';
            }
        });
    }
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 1024 && !dropdownParent.contains(e.target)) {
            dropdownParent.classList.remove('active');
        }
    });
}

// ============================================
// Search Functionality
// ============================================
function performSearch(searchTerm) {
    searchTerm = searchTerm.toLowerCase().trim();
    const products = document.querySelectorAll('.product-card');
    let visibleCount = 0;
    
    if (products.length === 0) return;
    
    products.forEach(product => {
        const title = product.querySelector('.product-title')?.textContent.toLowerCase() || '';
        const consoleName = product.querySelector('.product-console')?.textContent.toLowerCase() || '';
        
        if (title.includes(searchTerm) || consoleName.includes(searchTerm) || searchTerm === '') {
            product.style.display = 'block';
            visibleCount++;
        } else {
            product.style.display = 'none';
        }
    });
    
    const productsGrid = document.querySelector('.products-grid');
    const existingNoResults = document.querySelector('.no-results');
    
    if (visibleCount === 0 && searchTerm !== '') {
        if (!existingNoResults) {
            const noResultsMsg = document.createElement('div');
            noResultsMsg.className = 'no-results';
            noResultsMsg.innerHTML = `
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <circle cx="11" cy="11" r="8"/>
                    <path d="M21 21L16 16"/>
                </svg>
                <p>No games found matching "${searchTerm}"</p>
                <small>Try searching with different keywords</small>
            `;
            productsGrid?.appendChild(noResultsMsg);
        }
    } else {
        if (existingNoResults) existingNoResults.remove();
    }
}

// Initialize search
const desktopSearch = document.getElementById('searchInput');
if (desktopSearch) {
    let searchTimeout;
    desktopSearch.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => performSearch(e.target.value), 300);
    });
}

const mobileSearch = document.getElementById('mobileSearchInput');
if (mobileSearch) {
    let mobileSearchTimeout;
    mobileSearch.addEventListener('input', (e) => {
        clearTimeout(mobileSearchTimeout);
        mobileSearchTimeout = setTimeout(() => performSearch(e.target.value), 300);
    });
}

// ============================================
// Newsletter Form
// ============================================
if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const emailInput = newsletterForm.querySelector('input');
        const email = emailInput?.value.trim();
        
        if (email && email.includes('@') && email.includes('.')) {
            const button = newsletterForm.querySelector('button');
            const originalHTML = button.innerHTML;
            
            button.innerHTML = `
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 6L9 17l-5-5"/>
                </svg>
                SUBSCRIBED!
            `;
            button.style.background = '#10b981';
            
            setTimeout(() => {
                button.innerHTML = originalHTML;
                button.style.background = '';
            }, 3000);
            
            emailInput.value = '';
            
            const subscribedEmails = JSON.parse(localStorage.getItem('newsletterEmails') || '[]');
            if (!subscribedEmails.includes(email)) {
                subscribedEmails.push(email);
                localStorage.setItem('newsletterEmails', JSON.stringify(subscribedEmails));
            }
            
            showToast('Thanks for subscribing! 🎮', 'success');
        } else {
            const button = newsletterForm.querySelector('button');
            const originalHTML = button.innerHTML;
            
            button.innerHTML = `
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
                INVALID EMAIL
            `;
            button.style.background = '#ef4444';
            
            setTimeout(() => {
                button.innerHTML = originalHTML;
                button.style.background = '';
            }, 3000);
            
            showToast('Please enter a valid email address', 'error');
        }
    });
}

// ============================================
// Header Scroll Effect
// ============================================
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (!header) return;
    
    if (window.scrollY > 100) {
        header.style.background = htmlRoot.getAttribute('data-theme') === 'dark' 
            ? 'rgba(10, 10, 15, 0.98)' 
            : 'rgba(255, 255, 255, 0.98)';
        header.style.backdropFilter = 'blur(12px)';
    } else {
        header.style.background = htmlRoot.getAttribute('data-theme') === 'dark' 
            ? 'rgba(10, 10, 15, 0.95)' 
            : 'rgba(255, 255, 255, 0.95)';
        header.style.backdropFilter = 'blur(10px)';
    }
});

// ============================================
// Intersection Observer for Animations
// ============================================
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

document.querySelectorAll('.category-card, .product-card, .service-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
});

// ============================================
// Window Load Handler
// ============================================
window.addEventListener('load', () => {
    // Animate visible elements
    document.querySelectorAll('.category-card, .product-card, .service-card').forEach(el => {
        if (el.getBoundingClientRect().top < window.innerHeight) {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }
    });
    
    // Update copyright year
    const yearSpan = document.querySelector('.footer-bottom p');
    if (yearSpan) {
        const currentYear = new Date().getFullYear();
        yearSpan.innerHTML = yearSpan.innerHTML.replace(/2024|2025/, currentYear);
    }
});

// ============================================
// Toast Notification Function
// ============================================
window.showToast = function(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.innerHTML = `
        <div class="toast-icon">${type === 'success' ? '✓' : type === 'error' ? '✗' : 'ℹ'}</div>
        <div class="toast-message">${message}</div>
    `;
    toast.style.cssText = `
        position: fixed;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%) translateY(100px);
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 12px 24px;
        border-radius: 50px;
        z-index: 10000;
        font-size: 14px;
        font-weight: 500;
        display: flex;
        align-items: center;
        gap: 10px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        transition: transform 0.3s ease;
        font-family: 'Inter', sans-serif;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.transform = 'translateX(-50%) translateY(0)';
    }, 10);
    
    setTimeout(() => {
        toast.style.transform = 'translateX(-50%) translateY(100px)';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
};

// ============================================
// Add CSS Animations for Hamburger Menu
// ============================================
const animationStyles = `
    @keyframes slideInMenu {
        from {
            opacity: 0;
            transform: translateX(20px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    .menu-open {
        overflow: hidden;
    }
    
    .menu-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.6);
        backdrop-filter: blur(6px);
        z-index: 999;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
    }
    
    .menu-overlay.active {
        opacity: 1;
        visibility: visible;
    }
    
    .hamburger-ripple {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 0;
        height: 0;
        background: radial-gradient(circle, rgba(196, 69, 12, 0.4) 0%, transparent 80%);
        border-radius: 50%;
        transform: translate(-50%, -50%);
        transition: width 0.4s, height 0.4s;
        pointer-events: none;
    }
    
    .nav-menu-header {
        padding: 24px 28px 16px;
        border-bottom: 1px solid var(--card-border);
        margin-bottom: 8px;
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    .nav-menu-logo {
        display: flex;
        align-items: center;
        gap: 10px;
        text-decoration: none;
    }
    
    .nav-menu-logo svg {
        width: 32px;
        height: 32px;
        stroke: var(--primary);
        stroke-width: 1.5;
    }
    
    .nav-menu-logo-text {
        font-family: 'Space Mono', monospace;
        font-weight: 700;
        font-size: 1.5rem;
        letter-spacing: -0.02em;
        color: var(--body-color);
    }
    
    .nav-menu-logo-text span {
        color: var(--primary);
    }
    
    .nav-menu-close {
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--gray-100);
        border: none;
        border-radius: 50%;
        cursor: pointer;
        transition: all 0.3s ease;
        color: var(--gray-500);
    }
    
    .nav-menu-close:hover {
        background: var(--gray-200);
        transform: rotate(90deg);
        color: var(--danger);
    }
    
    .nav-menu-items {
        width: 100%;
        padding: 0 28px;
        flex: 1;
    }
    
    .nav-menu-footer {
        padding: 20px 28px 30px;
        border-top: 1px solid var(--card-border);
        margin-top: auto;
        width: 100%;
    }
    
    .menu-footer-text {
        font-size: 0.7rem;
        color: var(--gray-500);
        text-align: center;
        line-height: 1.5;
    }
    
    @media (max-width: 480px) {
        .nav-menu-header {
            padding: 20px 20px 12px;
        }
        
        .nav-menu-logo svg {
            width: 28px;
            height: 28px;
        }
        
        .nav-menu-logo-text {
            font-size: 1.25rem;
        }
        
        .nav-menu-close {
            width: 28px;
            height: 28px;
        }
        
        .nav-menu-items {
            padding: 0 20px;
        }
        
        .nav-menu-footer {
            padding: 16px 20px 24px;
        }
    }
`;

// Add styles if not already present
if (!document.getElementById('hamburger-animations')) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'hamburger-animations';
    styleSheet.textContent = animationStyles;
    document.head.appendChild(styleSheet);
}

// ============================================
// Initialize All Components
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // First create the menu header structure
    createMenuHeader();
    
    // Then initialize hamburger functionality
    initUniqueHamburger();
    
    // Initialize dropdown
    initHomeDropdown();
    
    // Add active class to current page link
    const currentPath = window.location.pathname;
    document.querySelectorAll('.nav-menu a').forEach(link => {
        const href = link.getAttribute('href');
        if (href && (href === currentPath || (currentPath.includes(href) && href !== '/'))) {
            link.classList.add('current-page');
        }
    });
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { performSearch, showToast };
}
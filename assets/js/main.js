// ============================================
// PixelPort - Main JavaScript
// Fixed Hamburger Menu | Clean Navigation
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
// HAMBURGER MENU - Mobile Functionality
// ============================================
function initHamburgerMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    
    if (!hamburger || !navMenu) return;
    
    // Create overlay if not exists
    let overlay = document.querySelector('.menu-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'menu-overlay';
        document.body.appendChild(overlay);
    }
    
    // Add brand logo to hamburger menu if not already present (for mobile)
    if (!navMenu.querySelector('.mobile-brand-logo') && window.innerWidth <= 1024) {
        const brandLogo = document.createElement('div');
        brandLogo.className = 'mobile-brand-logo';
        brandLogo.innerHTML = `
            <a href="index.html" class="mobile-logo-link">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="1.5">
                    <rect x="2" y="6" width="20" height="12" rx="2"/>
                    <path d="M8 6V4h8v2M12 18v2M7 10h2M15 10h2"/>
                </svg>
                <span class="mobile-logo-text">PIXEL<span>PORT</span></span>
            </a>
            <button class="mobile-menu-close" id="mobileMenuCloseBtn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
            </button>
        `;
        navMenu.insertBefore(brandLogo, navMenu.firstChild);
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
    
    // Close button functionality
    const closeBtn = document.querySelector('.mobile-menu-close');
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
// Mobile Dropdown Handler - Fix for Hamburger Menu
// ============================================
function initMobileDropdown() {
    const dropdownTriggers = document.querySelectorAll('.dropdown-trigger');
    
    dropdownTriggers.forEach(trigger => {
        // Add mobile arrow if not present
        if (window.innerWidth <= 1024 && !trigger.querySelector('.mobile-arrow')) {
            const arrow = document.createElement('span');
            arrow.className = 'mobile-arrow';
            arrow.innerHTML = '▼';
            trigger.appendChild(arrow);
        }
        
        // Remove existing click listeners to avoid duplicates
        const newTrigger = trigger.cloneNode(true);
        trigger.parentNode.replaceChild(newTrigger, trigger);
        
        newTrigger.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const dropdown = this.closest('.dropdown');
            if (!dropdown) return;
            
            // Close all other dropdowns
            document.querySelectorAll('.dropdown.active').forEach(d => {
                if (d !== dropdown) {
                    d.classList.remove('active');
                    // Update arrow rotation for closed dropdowns
                    const otherArrow = d.querySelector('.mobile-arrow');
                    if (otherArrow) otherArrow.style.transform = 'rotate(0deg)';
                }
            });
            
            // Toggle current dropdown
            dropdown.classList.toggle('active');
            
            // Update arrow rotation
            const arrow = this.querySelector('.mobile-arrow');
            if (arrow) {
                arrow.style.transform = dropdown.classList.contains('active') ? 'rotate(180deg)' : 'rotate(0deg)';
            }
        });
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 1024) {
            if (!e.target.closest('.dropdown')) {
                document.querySelectorAll('.dropdown.active').forEach(dropdown => {
                    dropdown.classList.remove('active');
                    const arrow = dropdown.querySelector('.mobile-arrow');
                    if (arrow) arrow.style.transform = 'rotate(0deg)';
                });
            }
        }
    });
}

// ============================================
// Home Dropdown Menu - Desktop (Hover)
// ============================================
function initDesktopDropdown() {
    const homeDropdown = document.getElementById('homeDropdown');
    if (!homeDropdown) return;
    
    const dropdownParent = homeDropdown.closest('.dropdown');
    if (!dropdownParent) return;
    
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
}

// ============================================
// Highlight Active Dropdown Item
// ============================================
function highlightActiveDropdown() {
    const currentPath = window.location.pathname;
    const dropdownItems = document.querySelectorAll('.dropdown-item a');
    
    dropdownItems.forEach(item => {
        const href = item.getAttribute('href');
        if (href === currentPath || (currentPath.includes(href) && href !== '/' && href !== '')) {
            item.classList.add('active');
            // Also highlight the parent dropdown trigger
            const parentDropdown = item.closest('.dropdown');
            if (parentDropdown) {
                const trigger = parentDropdown.querySelector('.dropdown-trigger');
                if (trigger) {
                    trigger.classList.add('active-link');
                }
            }
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
// Add CSS for Mobile Brand Logo
// ============================================
const mobileBrandStyles = `
    .mobile-brand-logo {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px 24px;
        border-bottom: 1px solid var(--card-border);
        margin-bottom: 8px;
        width: 100%;
        flex-shrink: 0;
    }
    
    .mobile-logo-link {
        display: flex;
        align-items: center;
        gap: 10px;
        text-decoration: none;
    }
    
    .mobile-logo-link svg {
        width: 28px;
        height: 28px;
        stroke: var(--primary);
    }
    
    .mobile-logo-text {
        font-family: 'Space Mono', monospace;
        font-weight: 700;
        font-size: 1.25rem;
        letter-spacing: -0.02em;
        color: var(--body-color);
    }
    
    .mobile-logo-text span {
        color: var(--primary);
    }
    
    .mobile-menu-close {
        width: 36px;
        height: 36px;
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
    
    .mobile-menu-close:hover {
        background: var(--gray-200);
        transform: rotate(90deg);
        color: var(--danger);
    }
    
    @media (max-width: 480px) {
        .mobile-brand-logo {
            padding: 16px 20px;
        }
        
        .mobile-logo-text {
            font-size: 1rem;
        }
        
        .mobile-logo-link svg {
            width: 24px;
            height: 24px;
        }
        
        .mobile-menu-close {
            width: 32px;
            height: 32px;
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
    
    .mobile-arrow {
        margin-left: 8px;
        font-size: 10px;
        transition: transform 0.3s ease;
    }
    
    .dropdown.active .mobile-arrow {
        transform: rotate(180deg);
    }
`;

// Add styles if not already present
if (!document.getElementById('mobile-brand-styles')) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'mobile-brand-styles';
    styleSheet.textContent = mobileBrandStyles;
    document.head.appendChild(styleSheet);
}

// ============================================
// Initialize All Components
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize hamburger menu with brand logo
    initHamburgerMenu();
    
    // Initialize mobile dropdown handler
    initMobileDropdown();
    
    // Initialize desktop dropdown (hover)
    initDesktopDropdown();
    
    // Highlight active dropdown items
    highlightActiveDropdown();
    
    // Add active class to current page link
    const currentPath = window.location.pathname;
    document.querySelectorAll('.nav-menu > li > a').forEach(link => {
        const href = link.getAttribute('href');
        if (href && (href === currentPath || (currentPath === '/' && href === 'index.html'))) {
            link.classList.add('active');
        }
    });
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { performSearch, showToast };
}

// ============================================
// ACTIVE PAGE HIGHLIGHTING
// Marks which page you are currently on
// ============================================

function highlightCurrentPage() {
    // Get current page filename
    const currentPath = window.location.pathname;
    const currentPage = currentPath.split('/').pop() || 'index.html';
    
    // Get all navigation links
    const allLinks = document.querySelectorAll('.nav-menu a, .footer-links a, .auth-link');
    
    // Remove any existing active classes first
    allLinks.forEach(link => {
        link.classList.remove('active', 'current-page', 'active-link');
    });
    
    // Highlight main navigation links
    document.querySelectorAll('.nav-menu > li > a, .dropdown-item a').forEach(link => {
        const href = link.getAttribute('href');
        if (href) {
            const linkPage = href.split('/').pop();
            
            // Check if this link matches current page
            if (linkPage === currentPage) {
                link.classList.add('active', 'current-page');
                
                // Also highlight parent dropdown if this is a dropdown item
                const parentDropdown = link.closest('.dropdown');
                if (parentDropdown) {
                    const dropdownTrigger = parentDropdown.querySelector('.dropdown-trigger');
                    if (dropdownTrigger) {
                        dropdownTrigger.classList.add('active-link');
                    }
                }
            }
        }
    });
    
    // Highlight footer links
    document.querySelectorAll('.footer-links a').forEach(link => {
        const href = link.getAttribute('href');
        if (href) {
            const linkPage = href.split('/').pop();
            if (linkPage === currentPage) {
                link.classList.add('active');
            }
        }
    });
    
    // Special handling for index/home page
    if (currentPage === 'index.html' || currentPage === '' || currentPath === '/' || currentPath === '/index.html') {
        // Highlight Home link in main navigation
        document.querySelectorAll('.nav-menu > li > a[href="index.html"], .dropdown-item a[href="index.html"]').forEach(link => {
            link.classList.add('active', 'current-page');
            
            const parentDropdown = link.closest('.dropdown');
            if (parentDropdown) {
                const dropdownTrigger = parentDropdown.querySelector('.dropdown-trigger');
                if (dropdownTrigger) {
                    dropdownTrigger.classList.add('active-link');
                }
            }
        });
        
        // Also highlight Home 1 in dropdown if it exists
        const home1Link = document.querySelector('.dropdown-item a[href="index.html"]');
        if (home1Link) {
            home1Link.classList.add('active');
        }
    }
    
    // Special handling for Home 2 (Marketplace) page
    if (currentPage === 'home2.html') {
        const home2Link = document.querySelector('.dropdown-item a[href="home2.html"]');
        if (home2Link) {
            home2Link.classList.add('active');
            
            const parentDropdown = home2Link.closest('.dropdown');
            if (parentDropdown) {
                const dropdownTrigger = parentDropdown.querySelector('.dropdown-trigger');
                if (dropdownTrigger) {
                    dropdownTrigger.classList.add('active-link');
                }
            }
        }
    }
    
    // Special handling for Shop page
    if (currentPage === 'shop.html') {
        const shopLink = document.querySelector('.nav-menu > li > a[href="shop.html"]');
        if (shopLink) {
            shopLink.classList.add('active');
        }
    }
    
    // Special handling for About page
    if (currentPage === 'about.html') {
        const aboutLink = document.querySelector('.nav-menu > li > a[href="about.html"]');
        if (aboutLink) {
            aboutLink.classList.add('active');
        }
    }
    
    // Special handling for Contact page
    if (currentPage === 'contact.html') {
        const contactLink = document.querySelector('.nav-menu > li > a[href="contact.html"]');
        if (contactLink) {
            contactLink.classList.add('active');
        }
    }
    
    // Special handling for Cart page
    if (currentPage === 'cart.html') {
        const cartIcon = document.querySelector('.cart-icon');
        if (cartIcon) {
            cartIcon.classList.add('active');
        }
    }
    
    // Log current page for debugging
    console.log(`Current page: ${currentPage}`);
}

// ============================================
// ADD ACTIVE CLASS TO BREADCRUMB OR PAGE TITLE
// ============================================
function updatePageTitleHighlight() {
    const currentPath = window.location.pathname;
    const currentPage = currentPath.split('/').pop() || 'index.html';
    
    // Update page title in hero section if exists
    const pageTitleElement = document.querySelector('.page-header h1, .about-hero h1, .contact-hero h1, .cart-hero h1');
    if (pageTitleElement) {
        // Already has title, no need to change
    }
    
    // Update document title for better UX
    let pageName = '';
    switch(currentPage) {
        case 'index.html':
            pageName = 'Home';
            break;
        case 'home2.html':
            pageName = 'Marketplace';
            break;
        case 'shop.html':
            pageName = 'Shop';
            break;
        case 'about.html':
            pageName = 'About Us';
            break;
        case 'contact.html':
            pageName = 'Contact';
            break;
        case 'cart.html':
            pageName = 'Shopping Cart';
            break;
        default:
            pageName = 'PixelPort';
    }
    
    // Update browser title if needed
    if (!document.title.includes(pageName) && pageName !== 'PixelPort') {
        document.title = `${pageName} | PixelPort`;
    }
}

// ============================================
// ADD CSS FOR ACTIVE STATE
// ============================================
const activePageStyles = `
    /* Active Page Styling */
    .nav-menu > li > a.active,
    .dropdown-item a.active,
    .footer-links a.active,
    .auth-link.active {
        color: var(--primary) !important;
        font-weight: 600 !important;
    }
    
    .nav-menu > li > a.active::after {
        width: 100% !important;
    }
    
    .dropdown-trigger.active-link {
        color: var(--primary) !important;
    }
    
    .dropdown-trigger.active-link .dropdown-arrow {
        stroke: var(--primary) !important;
    }
    
    .cart-icon.active {
        background: var(--primary) !important;
        color: white !important;
    }
    
    /* Current page indicator */
    .current-page {
        position: relative;
    }
    
    /* Breadcrumb style for active page */
    .page-active {
        background: var(--primary);
        color: white;
        padding: 4px 12px;
        border-radius: 20px;
        display: inline-block;
    }
`;

// Add styles if not already present
if (!document.getElementById('active-page-styles')) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'active-page-styles';
    styleSheet.textContent = activePageStyles;
    document.head.appendChild(styleSheet);
}

// ============================================
// INITIALIZE ON PAGE LOAD
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    highlightCurrentPage();
    updatePageTitleHighlight();
});

// Also run on window load to ensure all elements are loaded
window.addEventListener('load', () => {
    highlightCurrentPage();
});

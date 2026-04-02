// ============================================
// Authentication Module - Login & Register
// ============================================

// DOM Elements
const loginNavLink = document.getElementById('loginNavLink');
const registerNavLink = document.getElementById('registerNavLink');
const footerLoginLink = document.getElementById('footerLoginLink');
const footerRegisterLink = document.getElementById('footerRegisterLink');
const loginModal = document.getElementById('loginModal');
const registerModal = document.getElementById('registerModal');
const closeLoginModal = document.getElementById('closeLoginModal');
const closeRegisterModal = document.getElementById('closeRegisterModal');
const switchToRegister = document.getElementById('switchToRegister');
const switchToLogin = document.getElementById('switchToLogin');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const authLinks = document.getElementById('authLinks');
const userMenu = document.getElementById('userMenu');
const userNameSpan = document.getElementById('userName');
const userMenuTrigger = document.getElementById('userMenuTrigger');
const userDropdownMenu = document.getElementById('userDropdownMenu');

// ============================================
// Modal Functions — FIXED: set display before active class
// ============================================
function openLoginModal() {
    if (loginModal) {
        loginModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        setTimeout(() => loginModal.classList.add('active'), 10);
    }
}

function openRegisterModal() {
    if (registerModal) {
        registerModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        setTimeout(() => registerModal.classList.add('active'), 10);
    }
}

function closeLoginModalFunc() {
    if (loginModal) {
        loginModal.classList.remove('active');
        document.body.style.overflow = '';
        setTimeout(() => { loginModal.style.display = 'none'; }, 300);
    }
}

function closeRegisterModalFunc() {
    if (registerModal) {
        registerModal.classList.remove('active');
        document.body.style.overflow = '';
        setTimeout(() => { registerModal.style.display = 'none'; }, 300);
    }
}

function switchToRegisterModal() {
    closeLoginModalFunc();
    setTimeout(() => openRegisterModal(), 320);
}

function switchToLoginModal() {
    closeRegisterModalFunc();
    setTimeout(() => openLoginModal(), 320);
}

// ============================================
// Event Listeners for Auth Links
// ============================================
if (loginNavLink) {
    loginNavLink.addEventListener('click', (e) => {
        e.preventDefault();
        openLoginModal();
    });
}

if (registerNavLink) {
    registerNavLink.addEventListener('click', (e) => {
        e.preventDefault();
        openRegisterModal();
    });
}

if (footerLoginLink) {
    footerLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        openLoginModal();
    });
}

if (footerRegisterLink) {
    footerRegisterLink.addEventListener('click', (e) => {
        e.preventDefault();
        openRegisterModal();
    });
}

// Close buttons
if (closeLoginModal) {
    closeLoginModal.addEventListener('click', closeLoginModalFunc);
}

if (closeRegisterModal) {
    closeRegisterModal.addEventListener('click', closeRegisterModalFunc);
}

// Switch between modals
if (switchToRegister) {
    switchToRegister.addEventListener('click', (e) => {
        e.preventDefault();
        switchToRegisterModal();
    });
}

if (switchToLogin) {
    switchToLogin.addEventListener('click', (e) => {
        e.preventDefault();
        switchToLoginModal();
    });
}

// Close modal when clicking outside/overlay
if (loginModal) {
    loginModal.addEventListener('click', (e) => {
        if (e.target === loginModal || e.target.classList.contains('modal-overlay')) {
            closeLoginModalFunc();
        }
    });
}

if (registerModal) {
    registerModal.addEventListener('click', (e) => {
        if (e.target === registerModal || e.target.classList.contains('modal-overlay')) {
            closeRegisterModalFunc();
        }
    });
}

// Close on ESC key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeLoginModalFunc();
        closeRegisterModalFunc();
    }
});

// ============================================
// Login Form Submission
// ============================================
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const email = loginForm.querySelector('input[type="email"]').value.trim();
        const password = loginForm.querySelector('input[type="password"]').value;

        if (!email || !password) {
            showToast('Please fill in all fields', 'error');
            return;
        }

        const users = JSON.parse(localStorage.getItem('pixelportUsers') || '[]');
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            localStorage.setItem('pixelportUser', JSON.stringify(user));
            showToast(`Welcome back, ${user.name}!`, 'success');
            closeLoginModalFunc();
            updateAuthUI(user);
        } else {
            showToast('Invalid email or password', 'error');
        }
    });
}

// ============================================
// Register Form Submission
// ============================================
if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = registerForm.querySelector('input[type="text"]').value.trim();
        const email = registerForm.querySelector('input[type="email"]').value.trim();
        const password = registerForm.querySelectorAll('input[type="password"]')[0].value;
        const confirmPassword = registerForm.querySelectorAll('input[type="password"]')[1].value;
        const termsChecked = registerForm.querySelector('input[type="checkbox"]').checked;

        if (!name || !email || !password || !confirmPassword) {
            showToast('Please fill in all fields', 'error');
            return;
        }
        if (password !== confirmPassword) {
            showToast('Passwords do not match', 'error');
            return;
        }
        if (password.length < 6) {
            showToast('Password must be at least 6 characters', 'error');
            return;
        }
        if (!termsChecked) {
            showToast('Please agree to the Terms of Service', 'error');
            return;
        }

        const users = JSON.parse(localStorage.getItem('pixelportUsers') || '[]');
        if (users.some(u => u.email === email)) {
            showToast('Email already registered', 'error');
            return;
        }

        const newUser = {
            id: Date.now(),
            name,
            email,
            password,
            createdAt: new Date().toISOString()
        };

        users.push(newUser);
        localStorage.setItem('pixelportUsers', JSON.stringify(users));
        localStorage.setItem('pixelportUser', JSON.stringify(newUser));

        showToast('Account created successfully!', 'success');
        closeRegisterModalFunc();
        updateAuthUI(newUser);
    });
}

// ============================================
// Update UI After Login
// ============================================
function updateAuthUI(user) {
    if (authLinks) authLinks.style.display = 'none';

    if (userMenu) {
        userMenu.style.display = 'block';
        if (userNameSpan) userNameSpan.textContent = user.name.split(' ')[0];
    }

    const footerLoginLinkEl = document.getElementById('footerLoginLink');
    const footerRegisterLinkEl = document.getElementById('footerRegisterLink');
    if (footerLoginLinkEl) footerLoginLinkEl.style.display = 'none';
    if (footerRegisterLinkEl) footerRegisterLinkEl.style.display = 'none';
}

// ============================================
// User Menu Dropdown Toggle
// ============================================
if (userMenuTrigger && userDropdownMenu) {
    userMenuTrigger.addEventListener('click', (e) => {
        e.stopPropagation();
        userDropdownMenu.classList.toggle('active');
    });

    document.addEventListener('click', () => {
        userDropdownMenu.classList.remove('active');
    });
}

// ============================================
// Logout
// ============================================
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('pixelportUser');
        showToast('Logged out successfully', 'info');
        setTimeout(() => window.location.reload(), 1000);
    });
}

// ============================================
// Check if already logged in on page load
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    const savedUser = localStorage.getItem('pixelportUser');
    if (savedUser) updateAuthUI(JSON.parse(savedUser));
});

// ============================================
// Toast Notification
// ============================================
function showToast(message, type = 'success') {
    const existingToast = document.querySelector('.toast-notification');
    if (existingToast) existingToast.remove();

    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 12px 24px;
        border-radius: 12px;
        z-index: 9999;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        font-size: 14px;
        font-weight: 500;
        display: flex;
        align-items: center;
        gap: 10px;
    `;

    toast.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
            ${type === 'success'
                ? '<path d="M20 6L9 17l-5-5"/>'
                : type === 'error'
                ? '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>'
                : '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>'}
        </svg>
        <span>${message}</span>
    `;

    document.body.appendChild(toast);
    setTimeout(() => { toast.style.opacity = '0'; setTimeout(() => toast.remove(), 300); }, 3000);
}

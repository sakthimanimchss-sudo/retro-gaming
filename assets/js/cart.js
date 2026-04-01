// ============================================
// Shopping Cart Functionality
// ============================================

let cart = JSON.parse(localStorage.getItem('pixelportCart')) || [];

function saveCart() {
    localStorage.setItem('pixelportCart', JSON.stringify(cart));
    updateCartCount();
}

function updateCartCount() {
    const cartCountElements = document.querySelectorAll('.cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    cartCountElements.forEach(element => {
        element.textContent = totalItems;
        element.classList.add('cart-count-animation');
        setTimeout(() => element.classList.remove('cart-count-animation'), 300);
    });
}

/* ✅ FIXED FUNCTION */
function addToCart(product, e) {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
        showToast(`${product.title} quantity updated`, 'success');
    } else {
        cart.push({ ...product, quantity: 1 });
        showToast(`${product.title} added to cart!`, 'success');
    }
    
    saveCart();
    
    /* ✅ FIX HERE */
    if (e) {
        const btn = e.target;
        const originalText = btn.textContent;
        btn.textContent = '✓ ADDED!';
        btn.style.background = '#10b981';

        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = '';
        }, 1000);
    }
}

function removeFromCart(productId) {
    const product = cart.find(item => item.id === productId);
    if (product) {
        cart = cart.filter(item => item.id !== productId);
        saveCart();
        showToast(`${product.title} removed from cart`, 'info');
        if (document.getElementById('cartContainer')) updateCartDisplay();
    }
}

function updateQuantity(productId, newQuantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        if (newQuantity <= 0) {
            removeFromCart(productId);
        } else {
            item.quantity = newQuantity;
            saveCart();
            if (document.getElementById('cartContainer')) updateCartDisplay();
        }
    }
}

function getCartTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

function getCartItemCount() {
    return cart.reduce((total, item) => total + item.quantity, 0);
}

/* ========================= */
/* CLICK EVENT FIXED */
/* ========================= */

document.addEventListener('click', (e) => {
    if (e.target.classList.contains('add-to-cart')) {
        const card = e.target.closest('.product-card');

        if (card) {
            addToCart({
                id: parseInt(card.dataset.id),
                title: card.querySelector('.product-title')?.textContent,
                console: card.querySelector('.product-console')?.textContent,
                condition: card.querySelector('.product-condition')?.textContent?.replace('Condition: ', ''),
                price: parseFloat(card.querySelector('.product-price')?.textContent.replace('$', '')),
                image: card.querySelector('img')?.src
            }, e);   // ✅ PASS EVENT HERE
        }
    }
});

document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
});
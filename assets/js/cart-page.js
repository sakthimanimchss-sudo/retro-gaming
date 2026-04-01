// ============================================
// PixelPort - Cart Page JavaScript
// Shopping Cart Management | Dynamic Updates
// ============================================

// Cart Data Structure
let cart = [];

// Load cart from localStorage
function loadCart() {
    const savedCart = localStorage.getItem('pixelportCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    } else {
        // Sample cart data for demo
        cart = [
            {
                id: 1,
                name: "Super Mario Bros. 3",
                console: "Nintendo Entertainment System (NES)",
                condition: "Excellent",
                grade: "8.5/10",
                price: 29.99,
                quantity: 1,
                image: "https://images.unsplash.com/photo-1603569283847-aa295f0d016a?w=120&h=120&fit=crop",
                seller: "RetroGameHunter",
                badge: null
            },
            {
                id: 2,
                name: "Sonic the Hedgehog 2",
                console: "Sega Genesis",
                condition: "Good",
                grade: "7.0/10",
                price: 19.99,
                quantity: 2,
                image: "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=120&h=120&fit=crop",
                seller: "ClassicGamingCo",
                badge: null
            },
            {
                id: 3,
                name: "The Legend of Zelda: Ocarina of Time",
                console: "Nintendo 64",
                condition: "Like New",
                grade: "9.2/10",
                price: 49.99,
                quantity: 1,
                image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=120&h=120&fit=crop",
                seller: "ZeldaCollector",
                badge: "Collector's Edition"
            }
        ];
        saveCart();
    }
    renderCart();
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('pixelportCart', JSON.stringify(cart));
    updateCartCount();
}

// Update cart count in header
function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountElements = document.querySelectorAll('.cart-count');
    cartCountElements.forEach(el => {
        el.textContent = totalItems;
    });
    
    // Update cart item count in header
    const cartItemCountSpan = document.getElementById('cartItemCount');
    if (cartItemCountSpan) {
        cartItemCountSpan.textContent = totalItems;
    }
}

// Render cart items
function renderCart() {
    const cartContainer = document.getElementById('cartContainer');
    const cartSummary = document.getElementById('cartSummary');
    
    if (!cartContainer) return;
    
    if (cart.length === 0) {
        // Empty cart view
        cartContainer.innerHTML = `
            <div class="empty-cart">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <circle cx="9" cy="21" r="1"/>
                    <circle cx="20" cy="21" r="1"/>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                </svg>
                <p>Your cart is empty</p>
                <a href="shop.html" class="btn-primary">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                    Start Shopping
                </a>
            </div>
        `;
        
        if (cartSummary) {
            cartSummary.innerHTML = `
                <h3>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <path d="M20 12V8H4v4M12 4v16M8 4h8M4 12h16M4 12v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4"/>
                        <circle cx="12" cy="12" r="2"/>
                    </svg>
                    Order Summary
                </h3>
                <div class="empty-cart-summary">
                    <p style="text-align: center; color: var(--gray-500); padding: 2rem 0;">Add items to your cart to see order summary</p>
                </div>
            `;
        }
        return;
    }
    
    // Render cart items
    cartContainer.innerHTML = cart.map(item => `
        <div class="cart-item" data-id="${item.id}">
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="cart-item-details">
                <h3 class="cart-item-title">${item.name}</h3>
                <p class="cart-item-console">${item.console}</p>
                <div class="cart-item-meta">
                    <span class="cart-item-condition">Condition: ${item.condition}</span>
                    <span class="cart-item-grade">Grade: ${item.grade}</span>
                    ${item.badge ? `<span class="cart-item-badge collector">${item.badge}</span>` : ''}
                </div>
                <div class="cart-item-seller">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                        <circle cx="12" cy="7" r="4"/>
                    </svg>
                    Sold by: ${item.seller}
                </div>
            </div>
            <div class="cart-item-price-info">
                <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                <div class="quantity-control">
                    <button class="quantity-btn minus" data-id="${item.id}">-</button>
                    <span class="quantity-value">${item.quantity}</span>
                    <button class="quantity-btn plus" data-id="${item.id}">+</button>
                </div>
                <div class="cart-item-subtotal">Subtotal: $${(item.price * item.quantity).toFixed(2)}</div>
            </div>
            <button class="remove-item" data-id="${item.id}" title="Remove item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
            </button>
        </div>
    `).join('');
    
    // Render order summary
    renderOrderSummary();
    
    // Attach event listeners
    attachCartEventListeners();
}

// Render order summary
function renderOrderSummary() {
    const cartSummary = document.getElementById('cartSummary');
    if (!cartSummary) return;
    
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 100 ? 0 : 8.99;
    const tax = subtotal * 0.09;
    const discount = cart.length > 2 ? 5.00 : 0;
    const total = subtotal + shipping + tax - discount;
    
    cartSummary.innerHTML = `
        <h3>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M20 12V8H4v4M12 4v16M8 4h8M4 12h16M4 12v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4"/>
                <circle cx="12" cy="12" r="2"/>
            </svg>
            Order Summary
        </h3>
        
        <div class="summary-details">
            <div class="summary-row">
                <span>Subtotal</span>
                <span>$${subtotal.toFixed(2)}</span>
            </div>
            <div class="summary-row">
                <span>Shipping</span>
                <span>${shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
            </div>
            <div class="summary-row">
                <span>Tax (Estimated)</span>
                <span>$${tax.toFixed(2)}</span>
            </div>
            ${discount > 0 ? `
            <div class="summary-row discount">
                <span>Discount</span>
                <span>- $${discount.toFixed(2)}</span>
            </div>
            ` : ''}
            <div class="summary-row total">
                <span>Total</span>
                <span>$${total.toFixed(2)}</span>
            </div>
        </div>
        
        <div class="promo-code">
            <input type="text" placeholder="Enter promo code" id="promoInput">
            <button class="apply-promo" id="applyPromoBtn">Apply</button>
        </div>
        
        <button class="btn-primary checkout-btn" id="checkoutBtn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
            Proceed to Checkout
        </button>
        
        <div class="payment-methods">
            <p>Secure payment methods</p>
            <div class="payment-icons">
                <svg viewBox="0 0 38 24" xmlns="http://www.w3.org/2000/svg" width="38" height="24">
                    <path d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z" fill="#142688"/>
                    <path d="M14.4 16.7h-2.3l1.9-8.5h2.3l-1.9 8.5zm4.8-6.5c-.4-.2-.9-.3-1.4-.3-1.4 0-2.4.8-2.4 1.9 0 .8.6 1.3 1.4 1.5.8.2 1.1.4 1.1.7 0 .5-.6.7-1.2.7-.8 0-1.5-.2-2-.4l-.3-.1-.4 1.6c.5.2 1.2.3 1.9.3 1.6 0 2.6-.8 2.6-1.9 0-.9-.7-1.3-1.5-1.6-.6-.2-1-.4-1-.7 0-.3.3-.5.9-.5.6 0 1.1.1 1.5.2l.2.1.4-1.4z" fill="#fff"/>
                </svg>
                <svg viewBox="0 0 38 24" xmlns="http://www.w3.org/2000/svg" width="38" height="24">
                    <path d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z" fill="#000"/>
                    <path d="M19 6.5c-3.3 0-6 2.7-6 6s2.7 6 6 6 6-2.7 6-6-2.7-6-6-6z" fill="#FF5F00"/>
                    <path d="M23 12c0 2.2-1.8 4-4 4s-4-1.8-4-4 1.8-4 4-4 4 1.8 4 4z" fill="#F79E1B"/>
                </svg>
                <svg viewBox="0 0 38 24" xmlns="http://www.w3.org/2000/svg" width="38" height="24">
                    <path d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z" fill="#006FCF"/>
                    <path d="M9.4 8.2h1.9l1.5 4.5 1.5-4.5h1.9l-2.6 7.2h-1.7l-2.5-7.2zM18.9 8.2h1.9v7.2h-1.9zM26.1 8.2h-2.5v7.2h2.5c1.8 0 2.9-1.2 2.9-3.6 0-2.4-1.1-3.6-2.9-3.6z" fill="#fff"/>
                </svg>
            </div>
        </div>
        
        <div class="secure-checkout">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            100% Secure Checkout
        </div>
    `;
    
    // Attach checkout event listener
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            showToast('Proceeding to checkout...', 'success');
            setTimeout(() => {
                window.location.href = 'checkout.html';
            }, 1000);
        });
    }
    
    // Attach promo code listener
    const applyPromoBtn = document.getElementById('applyPromoBtn');
    const promoInput = document.getElementById('promoInput');
    if (applyPromoBtn && promoInput) {
        applyPromoBtn.addEventListener('click', () => {
            const code = promoInput.value.trim().toUpperCase();
            if (code === 'WELCOME10') {
                showToast('Promo code applied! 10% off', 'success');
                // Apply discount logic here
            } else if (code === 'FREESHIP') {
                showToast('Free shipping applied!', 'success');
            } else {
                showToast('Invalid promo code', 'error');
            }
        });
    }
}

// Attach cart event listeners
function attachCartEventListeners() {
    // Quantity buttons
    document.querySelectorAll('.quantity-btn.minus').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(btn.dataset.id);
            updateQuantity(id, -1);
        });
    });
    
    document.querySelectorAll('.quantity-btn.plus').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(btn.dataset.id);
            updateQuantity(id, 1);
        });
    });
    
    // Remove buttons
    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(btn.dataset.id);
            removeItem(id);
        });
    });
}

// Update item quantity
function updateQuantity(id, change) {
    const itemIndex = cart.findIndex(item => item.id === id);
    if (itemIndex !== -1) {
        const newQuantity = cart[itemIndex].quantity + change;
        if (newQuantity > 0 && newQuantity <= 10) {
            cart[itemIndex].quantity = newQuantity;
            saveCart();
            renderCart();
            showToast('Cart updated', 'success');
        } else if (newQuantity <= 0) {
            removeItem(id);
        } else {
            showToast('Maximum quantity is 10', 'error');
        }
    }
}

// Remove item from cart
function removeItem(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    renderCart();
    showToast('Item removed from cart', 'info');
}

// Clear entire cart
function clearCart() {
    if (cart.length > 0 && confirm('Are you sure you want to clear your entire cart?')) {
        cart = [];
        saveCart();
        renderCart();
        showToast('Cart cleared', 'info');
    }
}

// Add to cart function (for recommended products)
function addToCart(product) {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
        existingItem.quantity += 1;
        showToast(`${product.name} quantity updated`, 'success');
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
        showToast(`${product.name} added to cart`, 'success');
    }
    saveCart();
    renderCart();
}

// Toast notification
function showToast(message, type = 'success') {
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
}

// Initialize recommended products
function initRecommendedProducts() {
    const recommendedGrid = document.getElementById('recommendedProducts');
    if (!recommendedGrid) return;
    
    const recommendedProducts = [
        {
            id: 4,
            name: "Final Fantasy VII",
            console: "PlayStation",
            price: 59.99,
            image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=200&h=200&fit=crop",
            badge: "Hot",
            condition: "Excellent",
            grade: "9.0/10",
            seller: "RPGCollector"
        },
        {
            id: 5,
            name: "Pokémon Red Version",
            console: "Game Boy",
            price: 44.99,
            image: "https://images.unsplash.com/photo-1587923623987-c7e4081beb0f?w=200&h=200&fit=crop",
            badge: "Limited",
            condition: "Good",
            grade: "7.5/10",
            seller: "PokemonMaster"
        },
        {
            id: 6,
            name: "Halo: Combat Evolved",
            console: "Xbox",
            price: 24.99,
            image: "https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=200&h=200&fit=crop",
            badge: null,
            condition: "Excellent",
            grade: "8.8/10",
            seller: "HaloCollector"
        },
        {
            id: 7,
            name: "Crash Bandicoot",
            console: "PlayStation",
            price: 39.99,
            image: "https://images.unsplash.com/photo-1592155931584-901ac15763e3?w=200&h=200&fit=crop",
            badge: null,
            condition: "Like New",
            grade: "8.2/10",
            seller: "NaughtyDogFan"
        }
    ];
    
    recommendedGrid.innerHTML = recommendedProducts.map(product => `
        <div class="product-card" data-id="${product.id}">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
                ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-console">${product.console}</p>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <button class="add-to-cart" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}" data-console="${product.console}" data-image="${product.image}">Add to Cart</button>
            </div>
        </div>
    `).join('');
    
    // Attach add to cart listeners for recommended products
    document.querySelectorAll('.recommended-grid .add-to-cart').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const product = {
                id: parseInt(btn.dataset.id),
                name: btn.dataset.name,
                console: btn.dataset.console,
                price: parseFloat(btn.dataset.price),
                image: btn.dataset.image,
                condition: "Excellent",
                grade: "8.0/10",
                seller: "PixelPort Seller",
                badge: null
            };
            addToCart(product);
        });
    });
}

// Initialize clear cart button
function initClearCart() {
    const clearBtn = document.getElementById('clearCartBtn');
    if (clearBtn) {
        clearBtn.addEventListener('click', clearCart);
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    loadCart();
    initRecommendedProducts();
    initClearCart();
    
    // Update cart count from main cart.js if exists
    if (typeof window.updateCartCount === 'function') {
        window.updateCartCount = updateCartCount;
    }
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { loadCart, saveCart, addToCart, removeItem, clearCart };
}
// ============================================
// Shop Page - Products, Filters, Sorting, Pagination
// ============================================

// Sample Product Data (24 products for demonstration)
const allProducts = [
    { id: 1, title: "Super Mario Bros. 3", console: "Nintendo", category: "nintendo", price: 29.99, condition: "excellent", stock: "in-stock", rating: 4.9, image: "https://images.unsplash.com/photo-1603569283847-aa295f0d016a?w=400&h=400&fit=crop", badge: "Rare" },
    { id: 2, title: "Sonic the Hedgehog 2", console: "Sega", category: "sega", price: 19.99, condition: "good", stock: "in-stock", rating: 4.7, image: "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=400&h=400&fit=crop" },
    { id: 3, title: "The Legend of Zelda: Ocarina of Time", console: "Nintendo", category: "nintendo", price: 49.99, condition: "like-new", stock: "in-stock", rating: 5.0, image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=400&fit=crop", badge: "Collector's" },
    { id: 4, title: "Final Fantasy VII", console: "PlayStation", category: "playstation", price: 59.99, condition: "excellent", stock: "low-stock", rating: 4.9, image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=400&fit=crop", badge: "Rare" },
    { id: 5, title: "Halo: Combat Evolved", console: "Xbox", category: "xbox", price: 24.99, condition: "good", stock: "in-stock", rating: 4.8, image: "https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=400&h=400&fit=crop" },
    { id: 6, title: "Pokémon Red Version", console: "Game Boy", category: "gameboy", price: 44.99, condition: "excellent", stock: "low-stock", rating: 4.9, image: "https://images.unsplash.com/photo-1587923623987-c7e4081beb0f?w=400&h=400&fit=crop", badge: "Limited" },
    { id: 7, title: "Street Fighter II", console: "SNES", category: "nintendo", price: 34.99, condition: "very-good", stock: "in-stock", rating: 4.7, image: "https://images.unsplash.com/photo-1551103782-8ab5aafd00c1?w=400&h=400&fit=crop" },
    { id: 8, title: "Crash Bandicoot", console: "PlayStation", category: "playstation", price: 39.99, condition: "good", stock: "in-stock", rating: 4.6, image: "https://images.unsplash.com/photo-1592155931584-901ac15763e3?w=400&h=400&fit=crop" },
    { id: 9, title: "Pong", console: "Atari", category: "atari", price: 14.99, condition: "fair", stock: "in-stock", rating: 4.2, image: "https://images.unsplash.com/photo-1600978256345-fa2d0b2c25b4?w=400&h=400&fit=crop" },
    { id: 10, title: "Metal Slug", console: "Neo Geo", category: "neogeo", price: 89.99, condition: "excellent", stock: "low-stock", rating: 4.9, image: "https://images.unsplash.com/photo-1551103782-8ab5aafd00c1?w=400&h=400&fit=crop", badge: "Rare" },
    { id: 11, title: "Donkey Kong Country", console: "SNES", category: "nintendo", price: 32.99, condition: "good", stock: "in-stock", rating: 4.8, image: "https://images.unsplash.com/photo-1603569283847-aa295f0d016a?w=400&h=400&fit=crop" },
    { id: 12, title: "GoldenEye 007", console: "Nintendo", category: "nintendo", price: 39.99, condition: "like-new", stock: "in-stock", rating: 4.8, image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=400&fit=crop" },
];

// State
let currentProducts = [...allProducts];
let currentCategory = 'all';
let currentCondition = 'all';
let currentSort = 'featured';
let currentPage = 1;
let currentView = 'grid';
let minPrice = 0;
let maxPrice = 200;
let productsPerPage = 12;

// DOM Elements
const productsGrid = document.getElementById('shopProductsGrid');
const resultsCountSpan = document.getElementById('resultsCount');
const sortSelect = document.getElementById('sortSelect');
const categoryLinks = document.querySelectorAll('#categoryFilter a');
const conditionLinks = document.querySelectorAll('#conditionFilter a');
const resetBtn = document.getElementById('resetFilters');
const priceMinInput = document.getElementById('priceMin');
const priceMaxInput = document.getElementById('priceMax');
const minPriceSpan = document.getElementById('minPrice');
const maxPriceSpan = document.getElementById('maxPrice');
const viewBtns = document.querySelectorAll('.view-btn');
const prevBtn = document.querySelector('.pagination .prev');
const nextBtn = document.querySelector('.pagination .next');
const pageNumbersDiv = document.getElementById('pageNumbers');

// Filter Functions
function filterProducts() {
    let filtered = [...allProducts];
    
    // Filter by category
    if (currentCategory !== 'all') {
        filtered = filtered.filter(p => p.category === currentCategory);
    }
    
    // Filter by condition
    if (currentCondition !== 'all') {
        filtered = filtered.filter(p => p.condition === currentCondition);
    }
    
    // Filter by price
    filtered = filtered.filter(p => p.price >= minPrice && p.price <= maxPrice);
    
    // Sort
    filtered.sort((a, b) => {
        switch(currentSort) {
            case 'price-low': return a.price - b.price;
            case 'price-high': return b.price - a.price;
            case 'popular': return b.rating - a.rating;
            default: return 0;
        }
    });
    
    currentProducts = filtered;
    currentPage = 1;
    updateResults();
    renderProducts();
    renderPagination();
}

function updateResults() {
    resultsCountSpan.textContent = currentProducts.length;
}

function renderProducts() {
    const start = (currentPage - 1) * productsPerPage;
    const end = start + productsPerPage;
    const pageProducts = currentProducts.slice(start, end);
    
    if (pageProducts.length === 0) {
        productsGrid.innerHTML = `
            <div class="no-results-shop">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <circle cx="11" cy="11" r="8"/>
                    <path d="M21 21L16 16"/>
                </svg>
                <p>No products found</p>
                <small>Try adjusting your filters</small>
            </div>
        `;
        return;
    }
    
    productsGrid.innerHTML = pageProducts.map(product => `
        <div class="product-card" data-id="${product.id}">
            <div class="product-image">
                <img src="${product.image}" alt="${product.title}">
                ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.title}</h3>
                <p class="product-console">${product.console}</p>
                <p class="product-condition">Condition: ${product.condition.charAt(0).toUpperCase() + product.condition.slice(1)}</p>
                <div class="product-price">$${product.price}</div>
                <button class="add-to-cart">Add to Cart</button>
            </div>
        </div>
    `).join('');
}

function renderPagination() {
    const totalPages = Math.ceil(currentProducts.length / productsPerPage);
    
    if (totalPages <= 1) {
        prevBtn.disabled = true;
        nextBtn.disabled = true;
        pageNumbersDiv.innerHTML = '';
        return;
    }
    
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
    
    let pagesHtml = '';
    const maxVisible = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);
    
    if (endPage - startPage + 1 < maxVisible) {
        startPage = Math.max(1, endPage - maxVisible + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
        pagesHtml += `<button class="page-number ${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
    }
    
    pageNumbersDiv.innerHTML = pagesHtml;
    
    document.querySelectorAll('.page-number').forEach(btn => {
        btn.addEventListener('click', () => {
            currentPage = parseInt(btn.dataset.page);
            renderProducts();
            renderPagination();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });
}

// Event Listeners
if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
        currentSort = e.target.value;
        filterProducts();
    });
}

if (categoryLinks.length) {
    categoryLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            categoryLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            currentCategory = link.dataset.category;
            filterProducts();
        });
    });
}

if (conditionLinks.length) {
    conditionLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            conditionLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            currentCondition = link.dataset.condition;
            filterProducts();
        });
    });
}

if (resetBtn) {
    resetBtn.addEventListener('click', () => {
        currentCategory = 'all';
        currentCondition = 'all';
        currentSort = 'featured';
        minPrice = 0;
        maxPrice = 200;
        
        categoryLinks.forEach(l => l.classList.remove('active'));
        document.querySelector('#categoryFilter a[data-category="all"]').classList.add('active');
        conditionLinks.forEach(l => l.classList.remove('active'));
        document.querySelector('#conditionFilter a[data-condition="all"]').classList.add('active');
        sortSelect.value = 'featured';
        
        if (priceMinInput) priceMinInput.value = 0;
        if (priceMaxInput) priceMaxInput.value = 200;
        if (minPriceSpan) minPriceSpan.textContent = 0;
        if (maxPriceSpan) maxPriceSpan.textContent = 200;
        
        filterProducts();
    });
}

if (priceMinInput && priceMaxInput) {
    priceMinInput.addEventListener('input', (e) => {
        minPrice = parseInt(e.target.value);
        if (minPriceSpan) minPriceSpan.textContent = minPrice;
        if (minPrice > maxPrice) {
            maxPrice = minPrice;
            priceMaxInput.value = minPrice;
            if (maxPriceSpan) maxPriceSpan.textContent = minPrice;
        }
        filterProducts();
    });
    
    priceMaxInput.addEventListener('input', (e) => {
        maxPrice = parseInt(e.target.value);
        if (maxPriceSpan) maxPriceSpan.textContent = maxPrice;
        if (maxPrice < minPrice) {
            minPrice = maxPrice;
            priceMinInput.value = maxPrice;
            if (minPriceSpan) minPriceSpan.textContent = maxPrice;
        }
        filterProducts();
    });
}

if (viewBtns.length) {
    viewBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            viewBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentView = btn.dataset.view;
            
            if (currentView === 'list') {
                productsGrid.classList.add('list-view');
            } else {
                productsGrid.classList.remove('list-view');
            }
        });
    });
}

if (prevBtn) {
    prevBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderProducts();
            renderPagination();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });
}

if (nextBtn) {
    nextBtn.addEventListener('click', () => {
        const totalPages = Math.ceil(currentProducts.length / productsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            renderProducts();
            renderPagination();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });
}

// Initialize
filterProducts();
renderPagination();

// Search functionality for shop page
const shopSearchInput = document.getElementById('searchInput');
const mobileShopSearch = document.getElementById('mobileSearchInput');

function performShopSearch(searchTerm) {
    searchTerm = searchTerm.toLowerCase().trim();
    if (!searchTerm) {
        filterProducts();
        return;
    }
    
    const filtered = allProducts.filter(product => 
        product.title.toLowerCase().includes(searchTerm) ||
        product.console.toLowerCase().includes(searchTerm)
    );
    
    currentProducts = filtered;
    currentPage = 1;
    updateResults();
    renderProducts();
    renderPagination();
}

if (shopSearchInput) {
    let searchTimeout;
    shopSearchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => performShopSearch(e.target.value), 300);
    });
}

if (mobileShopSearch) {
    let mobileSearchTimeout;
    mobileShopSearch.addEventListener('input', (e) => {
        clearTimeout(mobileSearchTimeout);
        mobileSearchTimeout = setTimeout(() => performShopSearch(e.target.value), 300);
    });
}
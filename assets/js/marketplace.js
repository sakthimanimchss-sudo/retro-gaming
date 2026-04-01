// Marketplace Filtering & Sorting
document.addEventListener('DOMContentLoaded', function() {
    const categoryPills = document.querySelectorAll('.category-pill');
    const sortSelect = document.getElementById('sortSelect');
    const conditionSelect = document.getElementById('conditionSelect');
    const resultsCountSpan = document.getElementById('resultsCount');
    const productsGrid = document.getElementById('marketplaceProducts');
    
    let currentCategory = 'all';
    let currentSort = 'featured';
    let currentCondition = 'all';
    
    function getProducts() {
        return Array.from(document.querySelectorAll('#marketplaceProducts .product-card'));
    }
    
    function filterProducts() {
        let products = getProducts();
        
        // Filter by category
        if (currentCategory !== 'all') {
            products = products.filter(product => 
                product.dataset.category === currentCategory
            );
        }
        
        // Filter by condition
        if (currentCondition !== 'all') {
            products = products.filter(product => 
                product.dataset.condition === currentCondition
            );
        }
        
        // Sort products
        products.sort((a, b) => {
            const priceA = parseFloat(a.dataset.price);
            const priceB = parseFloat(b.dataset.price);
            
            switch(currentSort) {
                case 'price-low':
                    return priceA - priceB;
                case 'price-high':
                    return priceB - priceA;
                default:
                    return 0;
            }
        });
        
        // Update results count
        resultsCountSpan.textContent = products.length;
        
        // Reorder DOM
        products.forEach(product => {
            productsGrid.appendChild(product);
        });
    }
    
    // Category filter
    categoryPills.forEach(pill => {
        pill.addEventListener('click', () => {
            categoryPills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            currentCategory = pill.dataset.category;
            filterProducts();
        });
    });
    
    // Sort filter
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            currentSort = e.target.value;
            filterProducts();
        });
    }
    
    // Condition filter
    if (conditionSelect) {
        conditionSelect.addEventListener('change', (e) => {
            currentCondition = e.target.value;
            filterProducts();
        });
    }
});// Marketplace Filtering & Sorting
document.addEventListener('DOMContentLoaded', function() {
    const categoryPills = document.querySelectorAll('.category-pill');
    const sortSelect = document.getElementById('sortSelect');
    const conditionSelect = document.getElementById('conditionSelect');
    const resultsCountSpan = document.getElementById('resultsCount');
    const productsGrid = document.getElementById('marketplaceProducts');
    
    let currentCategory = 'all';
    let currentSort = 'featured';
    let currentCondition = 'all';
    
    function getProducts() {
        return Array.from(document.querySelectorAll('#marketplaceProducts .product-card'));
    }
    
    function filterProducts() {
        let products = getProducts();
        
        // Filter by category
        if (currentCategory !== 'all') {
            products = products.filter(product => 
                product.dataset.category === currentCategory
            );
        }
        
        // Filter by condition
        if (currentCondition !== 'all') {
            products = products.filter(product => 
                product.dataset.condition === currentCondition
            );
        }
        
        // Sort products
        products.sort((a, b) => {
            const priceA = parseFloat(a.dataset.price);
            const priceB = parseFloat(b.dataset.price);
            
            switch(currentSort) {
                case 'price-low':
                    return priceA - priceB;
                case 'price-high':
                    return priceB - priceA;
                default:
                    return 0;
            }
        });
        
        // Update results count
        resultsCountSpan.textContent = products.length;
        
        // Reorder DOM
        products.forEach(product => {
            productsGrid.appendChild(product);
        });
    }
    
    // Category filter
    categoryPills.forEach(pill => {
        pill.addEventListener('click', () => {
            categoryPills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            currentCategory = pill.dataset.category;
            filterProducts();
        });
    });
    
    // Sort filter
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            currentSort = e.target.value;
            filterProducts();
        });
    }
    
    // Condition filter
    if (conditionSelect) {
        conditionSelect.addEventListener('change', (e) => {
            currentCondition = e.target.value;
            filterProducts();
        });
    }
});
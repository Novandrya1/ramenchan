// Homepage functionality - Menu Preview Only
document.addEventListener('DOMContentLoaded', function() {
    // Load menu preview
    function loadMenuPreview() {
        const menuItems = db.getData('menu').slice(0, 6); // Show only 6 items
        const menuPreviewGrid = document.getElementById('menu-preview-grid');
        
        if (menuPreviewGrid) {
            menuPreviewGrid.innerHTML = menuItems.map(item => `
                <div class="menu-preview-card" data-category="${item.category}">
                    <div class="menu-image">
                        <img src="${item.image}" alt="${item.name}">
                        <div class="menu-badge">${item.category.toUpperCase()}</div>
                    </div>
                    <div class="menu-info">
                        <h3>${item.name}</h3>
                        <div class="menu-rating">
                            <span class="stars">★★★★★</span>
                            <span class="rating-text">(4.8)</span>
                        </div>
                        <p class="menu-description">${item.description}</p>
                        <div class="menu-footer">
                            <span class="menu-price">Rp ${item.price.toLocaleString()}</span>
                            <button class="add-to-cart-btn" onclick="addToCartPreview(${item.id})">
                                <i data-feather="plus"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `).join('');
            
            // Re-initialize feather icons
            feather.replace();
        }
    }
    
    // Category filter for menu preview
    const categoryNavBtns = document.querySelectorAll('.category-nav-btn');
    const menuPreviewCards = document.querySelectorAll('.menu-preview-card');
    
    categoryNavBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.getAttribute('data-category');
            
            // Update active button
            categoryNavBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Filter cards
            menuPreviewCards.forEach(card => {
                if (category === 'all' || card.getAttribute('data-category') === category) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
    
    // Add to cart from preview
    window.addToCartPreview = function(menuId) {
        const menuItem = db.getData('menu').find(item => item.id === menuId);
        if (menuItem) {
            cartManager.addItem(menuItem);
            
            // Show feedback
            const btn = event.target.closest('.add-to-cart-btn');
            const originalHTML = btn.innerHTML;
            btn.innerHTML = '<i data-feather="check"></i>';
            btn.style.background = '#28a745';
            
            setTimeout(() => {
                btn.innerHTML = originalHTML;
                btn.style.background = '';
                feather.replace();
            }, 1000);
        }
    };
    
    // Load data on page load
    setTimeout(() => {
        loadMenuPreview();
    }, 100);
});
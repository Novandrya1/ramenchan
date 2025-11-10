// Menu page functionality
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu
    const navbarNav = document.querySelector('.navbar-nav');
    const hamburger = document.querySelector('#hamburger-menu');
    
    if (hamburger) {
        hamburger.onclick = () => {
            navbarNav.classList.toggle('active');
        };
    }
    
    document.addEventListener('click', function(e) {
        if (hamburger && !hamburger.contains(e.target) && !navbarNav.contains(e.target)) {
            navbarNav.classList.remove('active');
        }
    });
    
    // Load menu from database
    function loadMenuFromDB() {
        const menuItems = db.getData('menu').filter(item => item.available !== false);
        const menuGrid = document.getElementById('menu-grid');
        
        if (menuGrid) {
            menuGrid.innerHTML = menuItems.map(item => `
                <div class="menu-card-modern menu-item" data-category="${item.category}" onclick="openMenuModal(${item.id})">
                    <div class="menu-image">
                        <img src="${item.image}" alt="${item.name}">
                        <div class="menu-badge">${item.category.toUpperCase()}</div>
                        <button class="wishlist-btn ${window.wishlistManager && window.wishlistManager.isInWishlist(item.id) ? 'active' : ''}" onclick="event.stopPropagation(); toggleWishlist(${item.id})">
                            <i data-feather="heart"></i>
                        </button>
                        <div class="menu-overlay">
                            <button class="add-to-cart" data-id="${item.id}" onclick="event.stopPropagation()">Tambah ke Keranjang</button>
                        </div>
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
                            <button class="quick-add" onclick="event.stopPropagation(); quickAddToCart(${item.id})">
                                <i data-feather="plus"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `).join('');
            
            // Re-initialize feather icons
            feather.replace();
            attachCartListeners();
        }
    }
    
    // Category filtering
    const menuTabs = document.querySelectorAll('.menu-tab');
    
    menuTabs.forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.getAttribute('data-category');
            
            // Remove active class from all buttons
            menuTabs.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Filter menu cards
            const menuCards = document.querySelectorAll('.menu-card-modern');
            menuCards.forEach(card => {
                if (category === 'all' || card.getAttribute('data-category') === category) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeIn 0.5s ease';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
    
    // Search functionality
    const searchInput = document.getElementById('menu-search');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const menuCards = document.querySelectorAll('.menu-card-modern');
            
            menuCards.forEach(card => {
                const menuName = card.querySelector('h3').textContent.toLowerCase();
                const menuDesc = card.querySelector('.menu-description').textContent.toLowerCase();
                
                if (menuName.includes(searchTerm) || menuDesc.includes(searchTerm)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }
    
    // Quick add to cart
    window.quickAddToCart = function(menuId) {
        const menuItem = db.getData('menu').find(item => item.id === menuId);
        if (menuItem && menuItem.available !== false) {
            cartManager.addItem(menuItem);
            
            // Show feedback
            const btn = event.target.closest('.quick-add');
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
    
    function attachCartListeners() {
        const addToCartBtns = document.querySelectorAll('.add-to-cart');
        
        addToCartBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const menuId = parseInt(btn.getAttribute('data-id'));
                const menuItem = db.getData('menu').find(item => item.id === menuId);
                
                if (menuItem && menuItem.available !== false) {
                    cartManager.addItem(menuItem);
                    
                    // Show feedback
                    btn.textContent = 'Ditambahkan!';
                    btn.style.background = '#28a745';
                    
                    setTimeout(() => {
                        btn.textContent = 'Tambah ke Keranjang';
                        btn.style.background = '';
                    }, 1500);
                }
            });
        });
    }
    
    // Toggle wishlist function
    window.toggleWishlist = function(menuId) {
        const menuItem = db.getData('menu').find(item => item.id === menuId);
        if (menuItem && menuItem.available !== false && window.wishlistManager) {
            const isAdded = window.wishlistManager.toggleWishlist(menuItem);
            const btn = event.target.closest('.wishlist-btn');
            btn.classList.toggle('active', isAdded);
            feather.replace();
        }
    };
    
    // Modal functions
    let currentModalItem = null;
    
    window.openMenuModal = function(menuId) {
        const menuItem = db.getData('menu').find(item => item.id === menuId);
        if (!menuItem || menuItem.available === false) return;
        
        currentModalItem = menuItem;
        
        // Populate modal content
        document.getElementById('modalImage').src = menuItem.image;
        document.getElementById('modalTitle').textContent = menuItem.name;
        document.getElementById('modalCategory').textContent = menuItem.category.toUpperCase();
        document.getElementById('modalDescription').textContent = menuItem.fullDescription || menuItem.description + ' Dibuat dengan resep autentik Jepang menggunakan bahan-bahan berkualitas premium. Setiap mangkuk disajikan dengan penuh perhatian untuk memberikan pengalaman rasa yang tak terlupakan.';
        document.getElementById('modalPrice').textContent = `Rp ${menuItem.price.toLocaleString()}`;
        
        // Add ingredients
        const ingredients = menuItem.ingredients || ['Mie Ramen', 'Kuah Kaldu', 'Daging Ayam', 'Telur', 'Nori', 'Daun Bawang'];
        document.getElementById('modalIngredients').innerHTML = ingredients.map(ingredient => 
            `<span class="ingredient-tag">${ingredient}</span>`
        ).join('');
        
        // Update wishlist button
        const wishlistBtn = document.getElementById('modalWishlistBtn');
        if (window.wishlistManager && window.wishlistManager.isInWishlist(menuId)) {
            wishlistBtn.classList.add('active');
        } else {
            wishlistBtn.classList.remove('active');
        }
        
        // Show modal
        document.getElementById('menuModal').style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        feather.replace();
    };
    
    window.closeMenuModal = function() {
        document.getElementById('menuModal').style.display = 'none';
        document.body.style.overflow = 'auto';
        currentModalItem = null;
    };
    
    window.toggleModalWishlist = function() {
        if (!currentModalItem || !window.wishlistManager) return;
        
        const isAdded = window.wishlistManager.toggleWishlist(currentModalItem);
        const btn = document.getElementById('modalWishlistBtn');
        btn.classList.toggle('active', isAdded);
        
        // Update main grid wishlist button
        const mainBtn = document.querySelector(`[onclick*="toggleWishlist(${currentModalItem.id})"]`);
        if (mainBtn) {
            mainBtn.classList.toggle('active', isAdded);
        }
        
        feather.replace();
    };
    
    window.addModalToCart = function() {
        if (!currentModalItem) return;
        
        cartManager.addItem(currentModalItem);
        
        // Show feedback
        const btn = document.getElementById('modalAddToCart');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i data-feather="check"></i> Ditambahkan!';
        btn.style.background = '#28a745';
        
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.background = '';
            feather.replace();
        }, 1500);
        
        feather.replace();
    };
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('menuModal');
        if (event.target === modal) {
            closeMenuModal();
        }
    });
    
    // Enhanced sticky navigation
    window.addEventListener('scroll', function() {
        const navigation = document.querySelector('.menu-navigation');
        if (window.scrollY > 100) {
            navigation.classList.add('scrolled');
        } else {
            navigation.classList.remove('scrolled');
        }
    });
    
    // Load menu from database
    setTimeout(() => {
        loadMenuFromDB();
    }, 100);
    
    // Reload menu when page becomes visible (to reflect admin changes)
    document.addEventListener('visibilitychange', function() {
        if (!document.hidden) {
            setTimeout(() => {
                loadMenuFromDB();
            }, 100);
        }
    });
    
    // Also reload on window focus
    window.addEventListener('focus', function() {
        setTimeout(() => {
            loadMenuFromDB();
        }, 100);
    });
    
    // Menu filter functionality
    document.getElementById('menu-filter')?.addEventListener('change', function() {
        filterMenuByAvailability(this.value);
    });
    
    function filterMenuByAvailability(status) {
        const menuCards = document.querySelectorAll('.admin-menu-card');
        menuCards.forEach(card => {
            const cardStatus = card.dataset.status;
            if (status === 'all' || cardStatus === status) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }
});
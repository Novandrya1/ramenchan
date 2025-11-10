// Wishlist Management
class WishlistManager {
    constructor() {
        this.wishlist = this.getWishlist();
        this.initializeWishlist();
        this.updateWishlistCount();
    }

    initializeWishlist() {
        this.displayWishlist();
        this.updateWishlistCount();
    }

    getWishlist() {
        return JSON.parse(localStorage.getItem('wishlist') || '[]');
    }

    saveWishlist() {
        localStorage.setItem('wishlist', JSON.stringify(this.wishlist));
        this.updateWishlistCount();
    }

    addToWishlist(menuItem) {
        if (!this.isInWishlist(menuItem.id)) {
            this.wishlist.push(menuItem);
            this.saveWishlist();
            this.showMessage('Ditambahkan ke wishlist!', 'success');
            return true;
        }
        return false;
    }

    removeFromWishlist(itemId) {
        this.wishlist = this.wishlist.filter(item => item.id !== itemId);
        this.saveWishlist();
        this.displayWishlist();
        this.showMessage('Dihapus dari wishlist!', 'success');
    }

    isInWishlist(itemId) {
        return this.wishlist.some(item => item.id === itemId);
    }

    displayWishlist() {
        const wishlistContent = document.getElementById('wishlistContent');
        const emptyWishlist = document.getElementById('emptyWishlist');
        const wishlistGrid = document.getElementById('wishlistGrid');

        if (this.wishlist.length === 0) {
            emptyWishlist.style.display = 'block';
            wishlistGrid.style.display = 'none';
            return;
        }

        emptyWishlist.style.display = 'none';
        wishlistGrid.style.display = 'grid';

        wishlistGrid.innerHTML = this.wishlist.map(item => `
            <div class="wishlist-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="wishlist-content">
                    <h3>${item.name}</h3>
                    <p>${item.description}</p>
                    <div class="wishlist-price">Rp ${item.price.toLocaleString('id-ID')}</div>
                    <div class="wishlist-actions">
                        <button class="btn-add-cart" onclick="wishlistManager.addToCart('${item.id}')">
                            <i data-feather="shopping-cart"></i> Tambah ke Keranjang
                        </button>
                        <button class="btn-remove" onclick="wishlistManager.removeFromWishlist('${item.id}')">
                            <i data-feather="trash-2"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        feather.replace();
    }

    addToCart(itemId) {
        const item = this.wishlist.find(item => item.id === itemId);
        if (item && window.cartManager) {
            window.cartManager.addItem(item);
            this.showMessage('Ditambahkan ke keranjang!', 'success');
        }
    }

    updateWishlistCount() {
        const countElement = document.getElementById('wishlist-count');
        if (countElement) {
            countElement.textContent = this.wishlist.length;
            countElement.style.display = this.wishlist.length > 0 ? 'flex' : 'none';
        }
    }

    toggleWishlist(menuItem) {
        if (this.isInWishlist(menuItem.id)) {
            this.removeFromWishlist(menuItem.id);
            return false;
        } else {
            this.addToWishlist(menuItem);
            return true;
        }
    }

    showMessage(message, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.textContent = message;
        
        Object.assign(messageDiv.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '15px 20px',
            borderRadius: '8px',
            color: 'white',
            background: type === 'success' ? '#28a745' : '#dc3545',
            zIndex: '9999'
        });
        
        document.body.appendChild(messageDiv);
        setTimeout(() => messageDiv.remove(), 3000);
    }
}

// Initialize wishlist manager
const wishlistManager = new WishlistManager();

// Global function to add wishlist button to menu items
function addWishlistButton(menuItem, container) {
    const wishlistBtn = document.createElement('button');
    wishlistBtn.className = 'wishlist-btn';
    wishlistBtn.innerHTML = `<i data-feather="heart"></i>`;
    
    if (wishlistManager.isInWishlist(menuItem.id)) {
        wishlistBtn.classList.add('active');
    }
    
    wishlistBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isAdded = wishlistManager.toggleWishlist(menuItem);
        wishlistBtn.classList.toggle('active', isAdded);
        feather.replace();
    });
    
    container.appendChild(wishlistBtn);
    return wishlistBtn;
}

// Add wishlist button styles
const wishlistBtnStyles = `
.menu-item {
    position: relative;
}

.wishlist-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    width: 40px;
    height: 40px;
    border: none;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    z-index: 2;
}

.wishlist-btn:hover {
    background: white;
    transform: scale(1.1);
}

.wishlist-btn.active {
    background: #dc3545;
    color: white;
}

.wishlist-btn i {
    width: 20px;
    height: 20px;
}
`;

const style = document.createElement('style');
style.textContent = wishlistBtnStyles;
document.head.appendChild(style);
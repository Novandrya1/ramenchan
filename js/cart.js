// Cart management
class CartManager {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('cart')) || [];
        this.updateCartCount();
    }
    
    addItem(menuItem, quantity = 1) {
        const existingItem = this.cart.find(item => item.id === menuItem.id);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.cart.push({
                id: menuItem.id,
                name: menuItem.name,
                price: menuItem.price,
                image: menuItem.image,
                quantity: quantity
            });
        }
        
        this.saveCart();
        this.updateCartCount();
        return true;
    }
    
    removeItem(itemId) {
        this.cart = this.cart.filter(item => item.id !== itemId);
        this.saveCart();
        this.updateCartCount();
    }
    
    updateQuantity(itemId, newQuantity) {
        const item = this.cart.find(item => item.id === itemId);
        if (item) {
            if (newQuantity <= 0) {
                this.removeItem(itemId);
            } else {
                item.quantity = newQuantity;
                this.saveCart();
                this.updateCartCount();
            }
        }
    }
    
    getCart() {
        return this.cart;
    }
    
    getTotal() {
        return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }
    
    getItemCount() {
        return this.cart.reduce((count, item) => count + item.quantity, 0);
    }
    
    clearCart() {
        this.cart = [];
        this.saveCart();
        this.updateCartCount();
    }
    
    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
    }
    
    updateCartCount() {
        const countElements = document.querySelectorAll('#cart-count');
        const count = this.getItemCount();
        
        countElements.forEach(element => {
            element.textContent = count;
            if (count === 0) {
                element.classList.add('hidden');
            } else {
                element.classList.remove('hidden');
            }
        });
    }
}

// Global cart instance
window.cartManager = new CartManager();
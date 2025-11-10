// Order functionality
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
    
    // Load quick menu
    function loadQuickMenu() {
        const menuItems = db.getData('menu');
        const quickMenuGrid = document.getElementById('quick-menu-grid');
        
        if (quickMenuGrid) {
            quickMenuGrid.innerHTML = menuItems.map(item => `
                <div class="quick-menu-item" onclick="addToCartQuick(${item.id})">
                    <img src="${item.image}" alt="${item.name}">
                    <h4>${item.name}</h4>
                    <p>Rp ${item.price.toLocaleString()}</p>
                </div>
            `).join('');
        }
    }
    
    // Quick add to cart function
    window.addToCartQuick = function(menuId) {
        const menuItem = db.getData('menu').find(item => item.id === menuId);
        if (menuItem) {
            cartManager.addItem(menuItem);
            updateCartDisplay();
            
            // Show feedback
            const quickItem = event.target.closest('.quick-menu-item');
            const originalBg = quickItem.style.background;
            quickItem.style.background = 'rgba(40, 167, 69, 0.3)';
            
            setTimeout(() => {
                quickItem.style.background = originalBg;
            }, 500);
        }
    };
    
    function updateCartDisplay() {
        const cart = cartManager.getCart();
        const cartItems = document.getElementById('cart-items');
        const cartTotal = document.getElementById('cart-total');
        const subtotalEl = document.getElementById('subtotal');
        const finalTotalEl = document.getElementById('final-total');
        
        if (cart.length === 0) {
            cartItems.innerHTML = '<p class="empty-cart">Keranjang masih kosong. <a href="menu.html">Pilih menu</a></p>';
            cartTotal.style.display = 'none';
            return;
        }
        
        let subtotal = 0;
        let cartHTML = '';
        
        cart.forEach((item) => {
            const price = item.price;
            const itemTotal = price * item.quantity;
            subtotal += itemTotal;
            
            cartHTML += `
                <div class="cart-item">
                    <div class="item-info">
                        <h4>${item.name}</h4>
                        <p class="item-price">Rp ${price.toLocaleString()}</p>
                        <div class="item-quantity">
                            <button class="qty-btn" onclick="updateQuantityCart(${item.id}, ${item.quantity - 1})">-</button>
                            <span class="qty-display">${item.quantity}</span>
                            <button class="qty-btn" onclick="updateQuantityCart(${item.id}, ${item.quantity + 1})">+</button>
                            <button class="remove-item" onclick="removeItemCart(${item.id})">Hapus</button>
                        </div>
                    </div>
                </div>
            `;
        });
        
        cartItems.innerHTML = cartHTML;
        cartTotal.style.display = 'block';
        
        const deliveryFee = 5000;
        const total = subtotal + deliveryFee;
        
        subtotalEl.textContent = `Rp ${subtotal.toLocaleString()}`;
        finalTotalEl.textContent = `Rp ${total.toLocaleString()}`;
    }
    
    // Make functions global
    window.updateQuantityCart = function(itemId, newQuantity) {
        cartManager.updateQuantity(itemId, newQuantity);
        updateCartDisplay();
    };
    
    window.removeItemCart = function(itemId) {
        cartManager.removeItem(itemId);
        updateCartDisplay();
    };
    
    // Order form handling
    const orderForm = document.getElementById('order-form');
    const orderMessage = document.getElementById('order-message');
    
    if (orderForm) {
        orderForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const cart = cartManager.getCart();
            if (cart.length === 0) {
                orderMessage.innerHTML = '<div class="error-message">Keranjang kosong! Silakan pilih menu terlebih dahulu.</div>';
                return;
            }
            
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Save to database
            const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const deliveryFee = 5000;
            const total = subtotal + deliveryFee;
            
            const order = {
                name: data.name,
                phone: data.phone,
                address: data.address,
                deliveryTime: data.delivery_time,
                items: cart.map(item => ({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity
                })),
                subtotal: subtotal,
                deliveryFee: deliveryFee,
                total: total,
                status: data.payment === 'cash' ? 'processing' : 'pending',
                paymentMethod: data.payment,
                notes: data.notes || '',
                createdAt: new Date().toISOString()
            };
            
            const savedOrder = db.addItem('orders', order);
            
            // Create payment record if not cash
            if (data.payment !== 'cash') {
                const payment = {
                    orderId: savedOrder.id,
                    amount: order.total,
                    method: data.payment,
                    status: 'pending',
                    createdAt: new Date().toISOString()
                };
                db.addPayment(payment);
                
                // Show payment waiting status
                document.getElementById('payment-status').style.display = 'block';
                orderMessage.innerHTML = '<div class="success-message">Pesanan berhasil dibuat! Silakan lakukan pembayaran.</div>';
                
                // Simulate payment confirmation after 5 seconds
                setTimeout(() => {
                    db.updateItem('orders', savedOrder.id, { status: 'confirmed' });
                    db.updateItem('payments', payment.id, { status: 'completed' });
                    document.getElementById('payment-status').innerHTML = '<div class="success-message">Pembayaran berhasil! Pesanan sedang diproses.</div>';
                }, 5000);
            } else {
                orderMessage.innerHTML = '<div class="success-message">Pesanan berhasil dibuat! Kami akan menghubungi Anda segera.</div>';
            }
            
            // Clear cart and form
            cartManager.clearCart();
            updateCartDisplay();
            this.reset();
        });
    }
    
    // Payment details function
    window.showPaymentDetails = function(paymentMethod) {
        const paymentDetails = document.getElementById('payment-details');
        const codDetails = document.getElementById('cod-details');
        const bankDetails = document.getElementById('bank-details');
        const qrisDetails = document.getElementById('qris-details');
        
        // Hide all details first
        paymentDetails.style.display = 'none';
        codDetails.style.display = 'none';
        bankDetails.style.display = 'none';
        qrisDetails.style.display = 'none';
        
        if (paymentMethod) {
            paymentDetails.style.display = 'block';
            
            if (paymentMethod === 'cash') {
                codDetails.style.display = 'block';
            } else if (paymentMethod === 'bank') {
                bankDetails.style.display = 'block';
                updatePaymentTotal();
            } else if (paymentMethod === 'qris') {
                qrisDetails.style.display = 'block';
                updatePaymentTotal();
            }
            
            // Re-initialize feather icons
            if (typeof feather !== 'undefined') {
                feather.replace();
            }
        }
    };
    
    // Update payment total display
    function updatePaymentTotal() {
        const cart = cartManager.getCart();
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const deliveryFee = 5000;
        const total = subtotal + deliveryFee;
        
        const paymentTotalAmount = document.getElementById('payment-total-amount');
        const qrisTotalAmount = document.getElementById('qris-total-amount');
        
        if (paymentTotalAmount) {
            paymentTotalAmount.textContent = `Rp ${total.toLocaleString('id-ID')}`;
        }
        if (qrisTotalAmount) {
            qrisTotalAmount.textContent = `Rp ${total.toLocaleString('id-ID')}`;
        }
    }
    
    // Load data on page load
    setTimeout(() => {
        loadQuickMenu();
        updateCartDisplay();
    }, 100);
});
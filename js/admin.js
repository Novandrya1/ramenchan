// Modern Admin Dashboard
document.addEventListener('DOMContentLoaded', function() {
    
    // Update current time
    function updateTime() {
        const now = new Date();
        const timeString = now.toLocaleString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        const timeElement = document.getElementById('current-time');
        if (timeElement) {
            timeElement.textContent = timeString;
        }
    }
    
    // Tab functionality
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');
            
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            btn.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });
    
    // Load and display real-time data
    function loadStats() {
        const stats = db.getStats();
        document.getElementById('revenue-stat').textContent = `Rp ${stats.todayRevenue.toLocaleString()}`;
        document.getElementById('orders-stat').textContent = stats.todayOrders;
        document.getElementById('reservations-stat').textContent = stats.todayReservations;
        document.getElementById('customers-stat').textContent = stats.totalUsers;
    }
    
    function loadOrders() {
        const orders = db.getData('orders');
        const tbody = document.getElementById('orders-table');
        
        if (orders.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; color: rgba(255,255,255,0.7); padding: 2rem;">Belum ada pesanan hari ini</td></tr>';
            return;
        }
        
        tbody.innerHTML = orders.slice(0, 10).map(order => {
            const orderTime = new Date(order.createdAt || Date.now()).toLocaleTimeString('id-ID', {
                hour: '2-digit',
                minute: '2-digit'
            });
            
            return `
                <tr>
                    <td>#${order.id.toString().padStart(3, '0')}</td>
                    <td>${order.name}</td>
                    <td>${order.items.map(i => `${i.name} (${i.quantity})`).join(', ')}</td>
                    <td>Rp ${order.total.toLocaleString()}</td>
                    <td><span class="status ${order.status}">${getStatusText(order.status)}</span></td>
                    <td>${orderTime}</td>
                    <td>
                        <button class="btn-sm btn-edit" onclick="updateOrderStatus(${order.id})">Update</button>
                        <button class="btn-sm btn-delete" onclick="deleteOrder(${order.id})">Hapus</button>
                    </td>
                </tr>
            `;
        }).join('');
    }
    
    function loadReservations() {
        const reservations = db.getData('reservations');
        const tbody = document.getElementById('reservations-table');
        
        if (reservations.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; color: rgba(255,255,255,0.7); padding: 2rem;">Belum ada reservasi hari ini</td></tr>';
            return;
        }
        
        tbody.innerHTML = reservations.map(r => `
            <tr>
                <td>#${r.id.toString().padStart(3, '0')}</td>
                <td>${r.name}</td>
                <td>${r.phone}</td>
                <td>${r.date}</td>
                <td>${r.time}</td>
                <td>${r.guests}</td>
                <td><span class="status ${r.status}">${r.status === 'confirmed' ? 'Dikonfirmasi' : 'Menunggu'}</span></td>
                <td>
                    <button class="btn-sm btn-edit" onclick="confirmReservation(${r.id})">Konfirmasi</button>
                    <button class="btn-sm btn-delete" onclick="deleteReservation(${r.id})">Hapus</button>
                </td>
            </tr>
        `).join('');
    }
    
    function loadMenuAdmin() {
        const menu = db.getData('menu');
        const menuGrid = document.getElementById('menu-grid-admin');
        
        if (menuGrid) {
            menuGrid.innerHTML = menu.map(item => `
                <div class="admin-menu-card ${item.status}" data-status="${item.status}" onclick="openAdminMenuModal(${item.id})">
                    <div class="admin-menu-image">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="admin-menu-info">
                        <h3>${item.name}</h3>
                        <span class="admin-menu-category">${item.category}</span>
                        <p class="admin-menu-description">${item.description}</p>
                        <div class="admin-menu-footer">
                            <span class="admin-menu-price">Rp ${item.price.toLocaleString()}</span>
                            <span class="admin-menu-status ${item.status}">
                                ${item.status === 'available' ? 'Tersedia' : 'Habis'}
                            </span>
                        </div>
                    </div>
                </div>
            `).join('');
        }
    }
    
    function getStatusText(status) {
        const statusMap = {
            'pending_payment': 'Menunggu Bayar',
            'confirmed': 'Dikonfirmasi',
            'processing': 'Diproses',
            'completed': 'Selesai',
            'cancelled': 'Dibatalkan'
        };
        return statusMap[status] || status;
    }
    
    // Admin Menu Modal Functions
    let currentAdminMenuItem = null;
    
    window.openAdminMenuModal = function(menuId) {
        const menuItem = db.getData('menu').find(item => item.id === menuId);
        if (!menuItem) return;
        
        currentAdminMenuItem = menuItem;
        
        // Populate modal content
        document.getElementById('adminModalImage').src = menuItem.image;
        document.getElementById('adminModalTitle').textContent = menuItem.name;
        document.getElementById('adminModalCategory').textContent = menuItem.category.toUpperCase();
        document.getElementById('adminModalDescription').textContent = menuItem.description;
        document.getElementById('adminModalPrice').textContent = `Rp ${menuItem.price.toLocaleString()}`;
        
        // Add ingredients
        const ingredients = menuItem.ingredients || ['Mie Ramen', 'Kuah Kaldu', 'Daging Ayam', 'Telur', 'Nori', 'Daun Bawang'];
        document.getElementById('adminModalIngredients').innerHTML = ingredients.map(ingredient => 
            `<span class="ingredient-tag">${ingredient}</span>`
        ).join('');
        
        // Update availability toggle
        const toggle = document.getElementById('availabilityToggle');
        const text = document.getElementById('availabilityText');
        toggle.checked = menuItem.status === 'available';
        text.textContent = menuItem.status === 'available' ? 'Tersedia' : 'Habis';
        text.className = `availability-text ${menuItem.status}`;
        
        // Show modal
        document.getElementById('adminMenuModal').style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        feather.replace();
    };
    
    window.closeAdminMenuModal = function() {
        document.getElementById('adminMenuModal').style.display = 'none';
        document.body.style.overflow = 'auto';
        currentAdminMenuItem = null;
    };
    
    window.toggleAvailability = function() {
        if (!currentAdminMenuItem) return;
        
        const toggle = document.getElementById('availabilityToggle');
        const text = document.getElementById('availabilityText');
        const newStatus = toggle.checked ? 'available' : 'unavailable';
        
        // Update database
        db.updateItem('menu', currentAdminMenuItem.id, { status: newStatus });
        currentAdminMenuItem.status = newStatus;
        
        // Update UI
        text.textContent = newStatus === 'available' ? 'Tersedia' : 'Habis';
        text.className = `availability-text ${newStatus}`;
        
        // Refresh menu grid
        loadMenuAdmin();
    };
    
    window.editMenuItem = function() {
        if (!currentAdminMenuItem) return;
        closeAdminMenuModal();
        openEditMenuModal(currentAdminMenuItem.id);
    };
    
    window.deleteMenuItem = function() {
        if (!currentAdminMenuItem) return;
        
        if (confirm(`Hapus menu "${currentAdminMenuItem.name}"?`)) {
            db.deleteItem('menu', currentAdminMenuItem.id);
            closeAdminMenuModal();
            loadMenuAdmin();
        }
    };
    
    // Form Modal Functions
    window.openAddMenuModal = function() {
        document.getElementById('formModalTitle').textContent = 'Tambah Menu Baru';
        document.getElementById('menuForm').reset();
        document.getElementById('editMenuId').value = '';
        document.getElementById('menuFormModal').style.display = 'block';
        document.body.style.overflow = 'hidden';
    };
    
    window.openEditMenuModal = function(menuId) {
        const menu = db.getData('menu').find(m => m.id === menuId);
        if (!menu) return;
        
        document.getElementById('formModalTitle').textContent = 'Edit Menu';
        document.getElementById('editMenuId').value = menu.id;
        document.getElementById('menuName').value = menu.name;
        document.getElementById('menuCategory').value = menu.category;
        document.getElementById('menuPrice').value = menu.price;
        document.getElementById('menuDescription').value = menu.description;
        document.getElementById('menuStatus').value = menu.status;
        document.getElementById('menuIngredients').value = (menu.ingredients || []).join(', ');
        
        document.getElementById('menuFormModal').style.display = 'block';
        document.body.style.overflow = 'hidden';
    };
    
    window.closeMenuFormModal = function() {
        document.getElementById('menuFormModal').style.display = 'none';
        document.body.style.overflow = 'auto';
    };
    
    // Menu Form Submit
    document.getElementById('menuForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const menuId = document.getElementById('editMenuId').value;
        const ingredients = document.getElementById('menuIngredients').value
            .split(',')
            .map(item => item.trim())
            .filter(item => item.length > 0);
            
        const menuData = {
            name: document.getElementById('menuName').value,
            category: document.getElementById('menuCategory').value,
            price: parseInt(document.getElementById('menuPrice').value),
            description: document.getElementById('menuDescription').value,
            status: document.getElementById('menuStatus').value,
            ingredients: ingredients,
            image: `img/menu/${Math.floor(Math.random() * 6) + 1}.jpeg`
        };
        
        if (menuId) {
            db.updateItem('menu', parseInt(menuId), menuData);
        } else {
            db.addItem('menu', menuData);
        }
        
        closeMenuFormModal();
        loadMenuAdmin();
        loadStats();
    });
    
    // Quick Action Functions
    window.viewOrders = function() {
        document.querySelector('[data-tab="orders"]').click();
    };
    
    window.viewReservations = function() {
        document.querySelector('[data-tab="reservations"]').click();
    };
    
    window.generateReport = function() {
        document.querySelector('[data-tab="analytics"]').click();
    };
    
    // CRUD Functions
    window.updateOrderStatus = function(id) {
        const order = db.getData('orders').find(o => o.id === id);
        if (order) {
            const newStatus = order.status === 'processing' ? 'completed' : 'processing';
            db.updateItem('orders', id, { status: newStatus });
            loadOrders();
            loadStats();
        }
    };
    
    window.confirmReservation = function(id) {
        db.updateItem('reservations', id, { status: 'confirmed' });
        loadReservations();
        loadStats();
    };
    
    window.deleteOrder = function(id) {
        if (confirm('Hapus pesanan ini?')) {
            db.deleteItem('orders', id);
            loadOrders();
            loadStats();
        }
    };
    
    window.deleteReservation = function(id) {
        if (confirm('Hapus reservasi ini?')) {
            db.deleteItem('reservations', id);
            loadReservations();
            loadStats();
        }
    };
    
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
    
    // Close modals when clicking outside
    window.addEventListener('click', function(event) {
        const adminModal = document.getElementById('adminMenuModal');
        const formModal = document.getElementById('menuFormModal');
        
        if (event.target === adminModal) {
            closeAdminMenuModal();
        }
        if (event.target === formModal) {
            closeMenuFormModal();
        }
    });
    
    window.refreshData = function() {
        loadStats();
        loadOrders();
        loadReservations();
        loadMenuAdmin();
        
        // Show refresh feedback
        const btn = document.querySelector('.btn-refresh');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i data-feather="check"></i> Updated';
        btn.style.background = 'rgba(40, 167, 69, 0.3)';
        
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.background = '';
            feather.replace();
        }, 2000);
    };
    
    // Auto refresh every 30 seconds
    setInterval(() => {
        loadStats();
        loadOrders();
        loadReservations();
    }, 30000);
    
    // Initialize
    updateTime();
    setInterval(updateTime, 60000); // Update time every minute
    
    setTimeout(() => {
        loadStats();
        loadOrders();
        loadReservations();
        loadMenuAdmin();
    }, 100);
});
// Order Tracking Management
class OrderTracker {
    constructor() {
        this.loadRecentOrders();
    }

    trackOrder() {
        const orderId = document.getElementById('orderIdInput').value.trim();
        if (!orderId) {
            this.showMessage('Masukkan ID pesanan!', 'error');
            return;
        }

        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        const order = orders.find(o => o.id === orderId);

        if (!order) {
            this.showMessage('Pesanan tidak ditemukan!', 'error');
            document.getElementById('trackingResult').style.display = 'none';
            return;
        }

        this.displayOrderTracking(order);
    }

    displayOrderTracking(order) {
        const trackingResult = document.getElementById('trackingResult');
        const orderDetails = document.getElementById('orderDetails');
        const timeline = document.getElementById('timeline');

        // Order details
        orderDetails.innerHTML = `
            <div class="detail-item">
                <span>ID Pesanan:</span>
                <strong>${order.id}</strong>
            </div>
            <div class="detail-item">
                <span>Tanggal:</span>
                <strong>${new Date(order.createdAt).toLocaleDateString('id-ID')}</strong>
            </div>
            <div class="detail-item">
                <span>Total:</span>
                <strong>Rp ${order.total.toLocaleString('id-ID')}</strong>
            </div>
            <div class="detail-item">
                <span>Metode Pembayaran:</span>
                <strong>${this.getPaymentMethodName(order.paymentMethod)}</strong>
            </div>
            <div class="detail-item">
                <span>Status:</span>
                <strong class="status-${order.status}">${this.getStatusName(order.status)}</strong>
            </div>
        `;

        // Timeline
        const timelineSteps = this.getTimelineSteps(order);
        timeline.innerHTML = timelineSteps.map(step => `
            <div class="timeline-item ${step.completed ? 'completed' : ''}">
                <div class="timeline-icon">
                    <i data-feather="${step.icon}"></i>
                </div>
                <div class="timeline-content">
                    <h4>${step.title}</h4>
                    <p>${step.description}</p>
                    ${step.time ? `<small>${step.time}</small>` : ''}
                </div>
            </div>
        `).join('');

        trackingResult.style.display = 'block';
        feather.replace();
    }

    getTimelineSteps(order) {
        const steps = [
            {
                icon: 'check-circle',
                title: 'Pesanan Diterima',
                description: 'Pesanan Anda telah diterima dan sedang diproses',
                completed: true,
                time: new Date(order.createdAt).toLocaleString('id-ID')
            },
            {
                icon: 'clock',
                title: 'Sedang Dimasak',
                description: 'Chef sedang menyiapkan pesanan Anda',
                completed: ['processing', 'ready', 'delivered', 'completed'].includes(order.status),
                time: order.status !== 'pending' ? this.getEstimatedTime(order.createdAt, 15) : null
            },
            {
                icon: 'package',
                title: 'Siap Diambil/Dikirim',
                description: 'Pesanan siap untuk diambil atau dikirim',
                completed: ['ready', 'delivered', 'completed'].includes(order.status),
                time: ['ready', 'delivered', 'completed'].includes(order.status) ? this.getEstimatedTime(order.createdAt, 30) : null
            },
            {
                icon: 'truck',
                title: 'Dalam Pengiriman',
                description: 'Pesanan sedang dalam perjalanan',
                completed: ['delivered', 'completed'].includes(order.status),
                time: ['delivered', 'completed'].includes(order.status) ? this.getEstimatedTime(order.createdAt, 45) : null
            },
            {
                icon: 'check-circle-2',
                title: 'Selesai',
                description: 'Pesanan telah sampai/diambil',
                completed: order.status === 'completed',
                time: order.status === 'completed' ? this.getEstimatedTime(order.createdAt, 60) : null
            }
        ];

        return steps;
    }

    getEstimatedTime(createdAt, minutesAdd) {
        const time = new Date(createdAt);
        time.setMinutes(time.getMinutes() + minutesAdd);
        return time.toLocaleString('id-ID');
    }

    loadRecentOrders() {
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        const recentOrders = orders.slice(-5).reverse();
        
        const ordersList = document.getElementById('ordersList');
        
        if (recentOrders.length === 0) {
            ordersList.innerHTML = `
                <div class="empty-orders">
                    <p>Belum ada pesanan terbaru</p>
                    <a href="order.html" class="btn-order">Pesan Sekarang</a>
                </div>
            `;
            return;
        }

        ordersList.innerHTML = recentOrders.map(order => `
            <div class="order-card">
                <div class="order-info-card">
                    <h4>${order.id}</h4>
                    <p>${new Date(order.createdAt).toLocaleDateString('id-ID')} - Rp ${order.total.toLocaleString('id-ID')}</p>
                </div>
                <div class="order-status status-${order.status}">
                    ${this.getStatusName(order.status)}
                </div>
            </div>
        `).join('');
    }

    getStatusName(status) {
        const statusNames = {
            'pending': 'Menunggu',
            'processing': 'Diproses',
            'ready': 'Siap',
            'delivered': 'Dikirim',
            'completed': 'Selesai',
            'cancelled': 'Dibatalkan'
        };
        return statusNames[status] || status;
    }

    getPaymentMethodName(method) {
        const methodNames = {
            'cod': 'Cash on Delivery',
            'bank': 'Transfer Bank',
            'qris': 'QRIS'
        };
        return methodNames[method] || method;
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

// Global function for tracking
function trackOrder() {
    orderTracker.trackOrder();
}

// Initialize tracker
const orderTracker = new OrderTracker();

// Add empty orders styles
const emptyOrdersStyles = `
.empty-orders {
    text-align: center;
    padding: 2rem;
    background: white;
    border-radius: 15px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.empty-orders p {
    margin-bottom: 1rem;
    color: #666;
}

.btn-order {
    display: inline-block;
    padding: 10px 20px;
    background: var(--primary);
    color: white;
    text-decoration: none;
    border-radius: 8px;
    font-weight: 600;
}
`;

const style = document.createElement('style');
style.textContent = emptyOrdersStyles;
document.head.appendChild(style);
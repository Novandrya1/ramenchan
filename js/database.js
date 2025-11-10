// Simple localStorage database
class Database {
    constructor() {
        this.initializeData();
    }
    
    initializeData() {
        if (!localStorage.getItem('ramenchan_db')) {
            const initialData = {
                menu: [
                    { id: 1, name: 'Niku Udon', category: 'udon', price: 40000, status: 'available', image: 'img/menu/1.jpeg', description: 'Udon dengan daging sapi dan kuah kaldu yang kaya' },
                    { id: 2, name: 'Chicken Katsu Ramen', category: 'ramen', price: 45000, status: 'available', image: 'img/menu/2.jpeg', description: 'Ramen dengan chicken katsu crispy dan telur' },
                    { id: 3, name: 'Spicy Miso Ramen', category: 'ramen', price: 50000, status: 'available', image: 'img/menu/3.jpeg', description: 'Ramen pedas dengan miso dan sayuran segar' },
                    { id: 4, name: 'Caramelized Chicken', category: 'appetizer', price: 28000, status: 'available', image: 'img/menu/4.jpeg', description: 'Ayam karamel manis pedas sebagai appetizer' },
                    { id: 5, name: 'Tonkotsu Ramen', category: 'ramen', price: 35000, status: 'available', image: 'img/menu/5.jpeg', description: 'Ramen klasik dengan kuah tulang babi yang creamy' },
                    { id: 6, name: 'Shoyu Ramen', category: 'ramen', price: 38000, status: 'available', image: 'img/menu/6.jpeg', description: 'Ramen dengan kuah shoyu yang light dan segar' }
                ],
                reservations: [],
                orders: [],
                users: [
                    { id: 1, name: 'Admin User', email: 'admin@ramenchan.com', role: 'admin', status: 'active' }
                ],
                payments: []
            };
            localStorage.setItem('ramenchan_db', JSON.stringify(initialData));
        }
    }
    
    getData(table) {
        const data = JSON.parse(localStorage.getItem('ramenchan_db'));
        return data[table] || [];
    }
    
    setData(table, newData) {
        const data = JSON.parse(localStorage.getItem('ramenchan_db'));
        data[table] = newData;
        localStorage.setItem('ramenchan_db', JSON.stringify(data));
    }
    
    addItem(table, item) {
        const data = this.getData(table);
        const newId = Math.max(...data.map(i => i.id), 0) + 1;
        item.id = newId;
        data.push(item);
        this.setData(table, data);
        return item;
    }
    
    updateItem(table, id, updates) {
        const data = this.getData(table);
        const index = data.findIndex(item => item.id === id);
        if (index !== -1) {
            data[index] = { ...data[index], ...updates };
            this.setData(table, data);
            return data[index];
        }
        return null;
    }
    
    deleteItem(table, id) {
        const data = this.getData(table);
        const filtered = data.filter(item => item.id !== id);
        this.setData(table, filtered);
        return true;
    }
    
    getStats() {
        const reservations = this.getData('reservations');
        const orders = this.getData('orders');
        const users = this.getData('users');
        const payments = this.getData('payments');
        
        const today = new Date().toISOString().split('T')[0];
        const todayReservations = reservations.filter(r => r.date === today);
        const todayOrders = orders.filter(o => {
            const orderDate = new Date(o.createdAt || Date.now()).toISOString().split('T')[0];
            return orderDate === today;
        });
        
        const todayRevenue = payments.filter(p => {
            const paymentDate = new Date(p.createdAt).toISOString().split('T')[0];
            return paymentDate === today && p.status === 'completed';
        }).reduce((sum, payment) => sum + payment.amount, 0);
        
        return {
            totalUsers: users.length,
            todayReservations: todayReservations.length,
            todayOrders: todayOrders.length,
            todayRevenue: todayRevenue
        };
    }
    
    addPayment(payment) {
        payment.createdAt = new Date().toISOString();
        return this.addItem('payments', payment);
    }
}

// Global database instance
window.db = new Database();
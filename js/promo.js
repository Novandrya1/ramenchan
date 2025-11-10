// Promo page functionality
document.addEventListener('DOMContentLoaded', function() {
    
    // Promo filter functionality
    const filterBtns = document.querySelectorAll('.filter-btn');
    const promoCards = document.querySelectorAll('.promo-card-full');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter');
            
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Filter promo cards
            promoCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeIn 0.5s ease';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
    
    // Promo button click handlers
    const promoBtns = document.querySelectorAll('.promo-btn');
    promoBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Redirect to order page or show modal
            window.location.href = 'order.html';
        });
    });
    
    // Add fade in animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;
    document.head.appendChild(style);
});
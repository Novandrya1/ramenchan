// Reservation functionality
document.addEventListener('DOMContentLoaded', function() {
    
    // Reservation form handling
    const reservationForm = document.getElementById('reservation-form');
    const reservationMessage = document.getElementById('reservation-message');
    
    if (reservationForm) {
        reservationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Save to database
            const reservation = {
                name: data.name,
                phone: data.phone,
                date: data.date,
                time: data.time,
                guests: data.guests,
                notes: data.notes || '',
                status: 'pending'
            };
            
            db.addItem('reservations', reservation);
            
            // Show success message
            reservationMessage.innerHTML = '<div class="success-message">Reservasi berhasil dibuat! Kami akan menghubungi Anda untuk konfirmasi.</div>';
            
            // Reset form
            this.reset();
        });
    }
});
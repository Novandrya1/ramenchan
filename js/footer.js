// Footer Component - Mengatasi duplikasi footer di semua halaman
function loadFooter() {
    const footerHTML = `
    <footer>
      <div class="footer-content">
        <div class="footer-section footer-brand">
          <div class="footer-logo">RamenChan</div>
          <p class="footer-description">
            Menghadirkan cita rasa autentik Jepang dengan resep tradisional dan bahan berkualitas premium sejak 2020.
          </p>
          <div class="footer-contact-info">
            <div class="contact-item">
              <i data-feather="map-pin"></i>
              <span>Jl. Raya Jakarta No. 123, Jakarta</span>
            </div>
            <div class="contact-item">
              <i data-feather="phone"></i>
              <span>+62 21 1234 5678</span>
            </div>
            <div class="contact-item">
              <i data-feather="mail"></i>
              <span>info@ramenchan.com</span>
            </div>
          </div>
        </div>
        
        <div class="footer-section">
          <h3>Menu</h3>
          <div class="footer-links">
            <a href="menu.html">Semua Menu</a>
            <a href="menu.html?category=ramen">Ramen</a>
            <a href="menu.html?category=udon">Udon</a>
            <a href="menu.html?category=appetizer">Appetizer</a>
            <a href="index.html#promo">Promo Spesial</a>
          </div>
        </div>
        
        <div class="footer-section">
          <h3>Layanan</h3>
          <div class="footer-links">
            <a href="order.html">Pemesanan Online</a>
            <a href="reservation.html">Reservasi Meja</a>
            <a href="tracking.html">Lacak Pesanan</a>
            <a href="wishlist.html">Wishlist</a>
            <a href="index.html#contact">Hubungi Kami</a>
          </div>
        </div>
        
        <div class="footer-section">
          <h3>Jam Operasional</h3>
          <div class="footer-hours">
            <div class="hour-item">
              <span>Senin - Jumat</span>
              <span>10:00 - 22:00</span>
            </div>
            <div class="hour-item">
              <span>Sabtu - Minggu</span>
              <span>09:00 - 23:00</span>
            </div>
            <div class="hour-item">
              <span>Hari Libur</span>
              <span>09:00 - 21:00</span>
            </div>
          </div>
          
          <div class="footer-social">
            <div class="social-links">
              <a href="#" class="social-link"><i data-feather="instagram"></i></a>
              <a href="#" class="social-link"><i data-feather="facebook"></i></a>
              <a href="#" class="social-link"><i data-feather="twitter"></i></a>
              <a href="#" class="social-link"><i data-feather="youtube"></i></a>
            </div>
          </div>
        </div>
      </div>
      
      <div class="footer-bottom">
        <div class="footer-bottom-content">
          <div class="copyright">
            <p>&copy; 2024 RamenChan. Created by Novandrya Ramadhan. All rights reserved.</p>
          </div>
          <div class="footer-legal">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>`;
    
    // Cari elemen footer yang ada dan ganti dengan footer baru
    const existingFooter = document.querySelector('footer');
    if (existingFooter) {
        existingFooter.outerHTML = footerHTML;
        // Re-initialize feather icons untuk footer
        if (typeof feather !== 'undefined') {
            feather.replace();
        }
    }
}

// Load footer saat DOM ready
document.addEventListener('DOMContentLoaded', function() {
    // Delay sedikit untuk memastikan footer HTML sudah ada
    setTimeout(loadFooter, 100);
});
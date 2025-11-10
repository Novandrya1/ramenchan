// Security enhancements untuk form dan aplikasi
document.addEventListener('DOMContentLoaded', function() {
    
    // Generate CSRF token
    function generateCSRFToken() {
        return Math.random().toString(36).substring(2, 15) + 
               Math.random().toString(36).substring(2, 15);
    }
    
    // Set CSRF token untuk semua form
    const csrfTokens = document.querySelectorAll('#csrf_token');
    const token = generateCSRFToken();
    csrfTokens.forEach(input => {
        if (input) input.value = token;
    });
    
    // Form validation dan sanitization
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validasi CSRF token
            const submittedToken = this.querySelector('#csrf_token').value;
            if (!submittedToken || submittedToken !== token) {
                alert('Token keamanan tidak valid. Silakan refresh halaman.');
                return;
            }
            
            // Sanitasi input
            const formData = new FormData(this);
            const sanitizedData = {};
            
            for (let [key, value] of formData.entries()) {
                if (key !== 'csrf_token') {
                    // Basic sanitization
                    sanitizedData[key] = value.toString()
                        .replace(/[<>]/g, '') // Remove potential HTML tags
                        .trim()
                        .substring(0, key === 'message' ? 500 : 100);
                }
            }
            
            // Validasi email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(sanitizedData.email)) {
                alert('Format email tidak valid.');
                return;
            }
            
            // Validasi phone format (Indonesia)
            const phoneRegex = /^(\+62|62|0)[0-9]{9,13}$/;
            if (!phoneRegex.test(sanitizedData.phone.replace(/[\s-]/g, ''))) {
                alert('Format nomor telepon tidak valid.');
                return;
            }
            
            // Simulasi pengiriman (replace dengan actual API call)
            console.log('Form submitted with sanitized data:', sanitizedData);
            alert('Pesan berhasil dikirim! Terima kasih.');
            
            // Reset form dan generate token baru
            this.reset();
            const newToken = generateCSRFToken();
            this.querySelector('#csrf_token').value = newToken;
            token = newToken;
        });
    }
    
    // Rate limiting untuk button clicks
    const buttons = document.querySelectorAll('button, .btn');
    buttons.forEach(button => {
        let lastClick = 0;
        button.addEventListener('click', function(e) {
            const now = Date.now();
            if (now - lastClick < 1000) { // 1 second cooldown
                e.preventDefault();
                return false;
            }
            lastClick = now;
        });
    });
    
    // XSS Protection - sanitize dynamic content
    window.sanitizeHTML = function(str) {
        const temp = document.createElement('div');
        temp.textContent = str;
        return temp.innerHTML;
    };
    
    // Content Security Policy helper
    window.isSecureContext = function() {
        return window.location.protocol === 'https:' || 
               window.location.hostname === 'localhost' ||
               window.location.hostname === '127.0.0.1';
    };
    
    // Prevent clickjacking
    if (window.top !== window.self) {
        window.top.location = window.self.location;
    }
});
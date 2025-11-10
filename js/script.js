// Mobile Menu Functionality with Security
document.addEventListener('DOMContentLoaded', function() {
    const navbarNav = document.querySelector(".navbar-nav");
    const hamburger = document.querySelector("#hamburger-menu");
    const body = document.body;
    
    // Rate limiting untuk prevent spam clicks
    let lastClickTime = 0;
    const CLICK_DELAY = 300;
    
    // Ketika hamburger menu di klik
    if (hamburger && navbarNav) {
        hamburger.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Rate limiting check
            const currentTime = Date.now();
            if (currentTime - lastClickTime < CLICK_DELAY) {
                return;
            }
            lastClickTime = currentTime;
            
            const isActive = navbarNav.classList.contains('active');
            
            if (isActive) {
                navbarNav.classList.remove('active');
                body.classList.remove('menu-open');
            } else {
                navbarNav.classList.add('active');
                body.classList.add('menu-open');
            }
            
            // Update hamburger icon
            const icon = hamburger.querySelector('i');
            if (icon) {
                if (navbarNav.classList.contains('active')) {
                    icon.setAttribute('data-feather', 'x');
                } else {
                    icon.setAttribute('data-feather', 'menu');
                }
                if (typeof feather !== 'undefined') {
                    feather.replace();
                }
            }
        });
        
        // Klik di luar sidebar untuk menghilangkan nav dengan validasi
        document.addEventListener("click", function (e) {
            // Validasi target element untuk security
            if (e.target && !hamburger.contains(e.target) && !navbarNav.contains(e.target)) {
                navbarNav.classList.remove("active");
                body.classList.remove('menu-open');
                
                // Reset hamburger icon
                const icon = hamburger.querySelector('i');
                if (icon) {
                    icon.setAttribute('data-feather', 'menu');
                    if (typeof feather !== 'undefined') {
                        feather.replace();
                    }
                }
            }
        });
        
        // Close menu when clicking nav links
        navbarNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                navbarNav.classList.remove('active');
                body.classList.remove('menu-open');
                
                // Reset hamburger icon
                const icon = hamburger.querySelector('i');
                if (icon) {
                    icon.setAttribute('data-feather', 'menu');
                    if (typeof feather !== 'undefined') {
                        feather.replace();
                    }
                }
            });
        });
        
        // Handle window resize
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                navbarNav.classList.remove('active');
                body.classList.remove('menu-open');
                
                // Reset hamburger icon
                const icon = hamburger.querySelector('i');
                if (icon) {
                    icon.setAttribute('data-feather', 'menu');
                    if (typeof feather !== 'undefined') {
                        feather.replace();
                    }
                }
            }
        });
    }
});

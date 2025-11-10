# 🍜 RamenChan - Modern Japanese Restaurant Website

Sebuah website restoran ramen modern dengan fitur lengkap untuk pemesanan online, reservasi, dan manajemen admin.

## ✨ Fitur Utama

- 🏠 **Homepage Modern** - Hero section dengan animasi dan statistik
- 🍜 **Menu Interaktif** - Modal detail menu dengan wishlist
- 📅 **Sistem Reservasi** - Form reservasi dengan validasi
- 🛒 **Pemesanan Online** - Cart, payment methods (COD, Bank, QRIS)
- 👨‍💼 **Admin Dashboard** - Manajemen menu, pesanan, dan analytics
- 📱 **Mobile Responsive** - Optimized untuk semua device
- 🔒 **Keamanan** - CSRF protection, input validation, XSS prevention

## 🚀 Quick Start

### 1. Clone Repository
\`\`\`bash
git clone <repository-url>
cd restorant-ramen
\`\`\`

### 2. Jalankan Server
\`\`\`bash
# Python
python -m http.server 8000

# PHP
php -S localhost:8000

# Node.js (jika ada package.json)
npm run serve
\`\`\`

### 3. Buka Browser
Akses: `http://localhost:8000`

## 📁 Struktur Project

\`\`\`
restorant-ramen/
├── css/                    # Stylesheets
│   ├── style.css          # Base styles
│   ├── mobile-responsive.css
│   ├── conflict-fixes.css
│   └── ...
├── js/                     # JavaScript files
│   ├── script.js          # Main functionality
│   ├── security.js        # Security features
│   ├── database.js        # Data management
│   └── ...
├── img/                    # Images
├── *.html                  # HTML pages
└── auto-commit.*          # Auto commit scripts
\`\`\`

## 🔧 Auto Commit

Project ini dilengkapi dengan script auto commit untuk memudahkan version control:

### Windows
\`\`\`cmd
auto-commit.bat
\`\`\`

### Linux/Mac
\`\`\`bash
bash auto-commit.sh
\`\`\`

### Node.js (Cross-platform)
\`\`\`bash
npm run commit
\`\`\`

## 📱 Responsive Design

- **Desktop**: 1200px+
- **Tablet**: 768px - 1199px  
- **Mobile**: 320px - 767px

## 🛡️ Security Features

- CSRF Token Protection
- Input Sanitization
- XSS Prevention
- Rate Limiting
- Form Validation

## 🎨 Design System

- **Primary Color**: #ff6b35 (Orange)
- **Secondary Color**: #f7931e (Light Orange)
- **Background**: #1a1a1a (Dark)
- **Font**: Poppins

## 📄 Pages

1. **index.html** - Homepage
2. **menu.html** - Menu catalog
3. **reservation.html** - Table reservation
4. **order.html** - Online ordering
5. **admin.html** - Admin dashboard
6. **promo.html** - Promotions
7. **wishlist.html** - Favorite items
8. **tracking.html** - Order tracking

## 🔄 Recent Updates

- ✅ Fixed hamburger menu across all pages
- ✅ Resolved CSS conflicts and optimizations
- ✅ Enhanced security with CSRF protection
- ✅ Improved mobile responsiveness
- ✅ Added auto-commit functionality

## 📞 Support

Untuk pertanyaan atau dukungan, silakan hubungi tim development.

---

**© 2024 RamenChan Restaurant. All rights reserved.**
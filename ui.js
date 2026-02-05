// UI & Navigation Logic


// Update Navigation Visibility based on Auth
function updateNavVisibility() {
    const nav = document.getElementById('main-nav');
    const user = localStorage.getItem('user'); // Basic check, ideally check expiry/validity
    if (nav) {
        if (user) {
            nav.classList.remove('hidden');
        } else {
            nav.classList.add('hidden');
        }
    }
}

// Expose globally
window.updateNavVisibility = updateNavVisibility;

window.app = window.app || {};
window.app.ui = {

    showError: function (element, message) {
        const parent = element.parentElement;
        let errorMsg = parent.querySelector('.error-msg');
        if (!errorMsg) {
            errorMsg = document.createElement('small');
            errorMsg.className = 'error-msg';
            parent.appendChild(errorMsg);
        }
        errorMsg.textContent = message;
        errorMsg.style.display = 'block';
        errorMsg.style.color = 'red';
        element.style.borderColor = 'red';
    },

    clearAllErrors: function (form) {
        const errors = form.querySelectorAll('.error-msg');
        errors.forEach(e => e.textContent = '');
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(i => i.style.borderColor = '#ddd'); // Reset to default
        const globalError = document.getElementById('booking-global-error');
        if (globalError) globalError.textContent = '';
    }
};

// Router Function
app.router = function (pageId) {
    // 1. Check Access (Security)
    const user = localStorage.getItem('user');
    const protectedPages = ['home', 'doctors', 'booking', 'tips', 'contact', 'about'];

    if (!user && protectedPages.includes(pageId)) {
        alert('Access Denied. Please Login.');
        window.toggleForm('login');
        return;
    }

    // 2. Hide all pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(p => {
        p.classList.add('hidden');
        p.classList.remove('active');
    });

    // 3. Show target page
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.remove('hidden');
        targetPage.classList.add('active');
    }

    // 4. Update Nav Active State
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        if (link.dataset.page === pageId) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // 5. Update URL Hash
    window.location.hash = pageId;

    // 6. Special Page logic (if any)
    if (pageId === 'booking') {
        if (app.booking && app.booking.renderMyBookings) {
            app.booking.renderMyBookings();
        }
    }

    // Ensure Nav is visible if logged in
    if (window.updateNavVisibility) window.updateNavVisibility();
};

document.addEventListener('DOMContentLoaded', () => {
    // Check visibility on load
    updateNavVisibility();

    // Check for saved route (hash)
    const user = localStorage.getItem('user');

    // Initial Route Handler
    const handleInitialRoute = () => {
        if (user) {
            let pageId = 'home'; // Default
            if (window.location.hash) {
                pageId = window.location.hash.substring(1);
            }
            // Validate page existence
            if (document.getElementById(pageId)) {
                app.router(pageId);
            } else {
                app.router('home');
            }
        } else {
            // Not logged in: Show Login/Register
            // Ensure main pages are hidden
            const pages = document.querySelectorAll('.page');
            pages.forEach(p => {
                if (p.id !== 'login' && p.id !== 'register') {
                    p.classList.add('hidden');
                    p.classList.remove('active');
                }
            });

            // Check if we are incorrectly on a protected hash
            if (window.location.hash && window.location.hash !== '#login') {
                // redirect to login
                window.location.hash = '';
                if (window.toggleForm) window.toggleForm('login');
            } else {
                // Default show login if nothing active? 
                // The HTML has 'register' active by default usually, checks log.js
                // We let log.js handle the initial Auth page state, 
                // but we enforce hiding the app pages.
                if (window.toggleForm) window.toggleForm('login');
            }
        }
    };

    handleInitialRoute();


    // initialize navigation
    const navLinks = document.querySelectorAll('.nav-links a');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const pageId = link.getAttribute('data-page');

            // If it's the logout button (which might not have data-page), ignore or handle separate
            if (!pageId) return;

            // Check if user is logged in before navigating (Access Control)
            const user = localStorage.getItem('user');
            if (!user) {
                alert('Please login first.');
                if (window.toggleForm) window.toggleForm('login');
                return;
            }

            if (window.app && window.app.router) {
                window.app.router(pageId);

                // Active class for nav link
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            }
        });
    });

    // Mobile Menu Toggle
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const navContainer = document.querySelector('.nav-links');

    if (menuBtn && navContainer) {
        menuBtn.addEventListener('click', () => {
            navContainer.classList.toggle('active');
        });
    }
});

// Expose app.auth.logout if not already defined (basic version)
window.app = window.app || {};
window.app.auth = window.app.auth || {};
window.app.auth.logout = function () {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('user');
        window.location.reload();
    }
};

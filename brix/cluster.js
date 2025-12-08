// DOM Elements
const navItems = document.querySelectorAll('.nav-item');
const pages = document.querySelectorAll('.page');
const buttons = document.querySelectorAll('button');

// Navigation functionality
navItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Remove active class from all nav items
        navItems.forEach(nav => nav.classList.remove('active'));
        
        // Add active class to clicked item
        item.classList.add('active');
        
        // Get target page
        const targetPage = item.getAttribute('data-page');
        
        // Hide all pages
        pages.forEach(page => page.classList.remove('active'));
        
        // Show target page
        const targetElement = document.getElementById(`${targetPage}-page`);
        if (targetElement) {
            targetElement.classList.add('active');
        }
    });
});

// Button click handlers
buttons.forEach(button => {
    button.addEventListener('click', (e) => {
        const buttonText = button.textContent.trim();
        
        // Handle different button actions
        if (buttonText === 'Update Status') {
            showNotification('Status update functionality would be implemented here.');
        } else if (buttonText === 'Review Request') {
            showNotification('Purchase request review would open here.');
        } else if (buttonText === 'Endorse') {
            showNotification('Request endorsed successfully!');
        } else if (buttonText === 'Log Report') {
            showNotification('Report logging functionality would be implemented here.');
        } else if (buttonText === 'View Details') {
            showNotification('Details view would be implemented here.');
        }
    });
});

// Search functionality
const searchInput = document.querySelector('.search-input');
searchInput.addEventListener('input', (e) => {
    // Visual search feedback
    if (e.target.value.length > 0) {
        e.target.style.borderColor = '#3182ce';
    } else {
        e.target.style.borderColor = '#e2e8f0';
    }
});

// Notification bell functionality
const notificationBtn = document.querySelector('.notification-btn');
notificationBtn.addEventListener('click', () => {
    showNotification('You have 3 new notifications');
});

// Logout functionality
const logoutItem = document.querySelector('.logout');
logoutItem.addEventListener('click', (e) => {
    e.preventDefault();
    if (confirm('Are you sure you want to logout?')) {
        showNotification('Logging out...');
        // In a real app, this would redirect to login page
    }
});

// Settings functionality
const settingsItem = document.querySelector('.nav-item:last-child:not(.logout)');
settingsItem.addEventListener('click', (e) => {
    e.preventDefault();
    showNotification('Settings panel would open here');
});

// Helper function to show notifications
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #2d3748;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        z-index: 10000;
        animation: slideIn 0.3s ease;
        max-width: 300px;
        font-size: 0.875rem;
    `;
    
    // Add animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    
    // Add to document
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Add smooth scrolling for better UX
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add hover effects for cards
const cards = document.querySelectorAll('.card, .section-card');
cards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px)';
        this.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
    });
});

// Progress bar animation on page load
window.addEventListener('load', () => {
    const progressBars = document.querySelectorAll('.progress-fill');
    progressBars.forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0%';
        setTimeout(() => {
            bar.style.width = width;
        }, 100);
    });
});
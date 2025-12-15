// Current page state
let currentPage = 'dashboard';

// Load components
function loadComponents() {
    // Load sidebar
    fetch('../components/faculty-researcher-dashboard/researcher-sidebar.html')
        .then(res => res.text())
        .then(data => {
            document.getElementById('sidebar-placeholder').innerHTML = data;
            // Attach navigation handlers after sidebar loads
            attachNavigationHandlers();
        })
        .catch(err => console.error('Error loading sidebar:', err));

    // Load header
    fetch('../components/faculty-researcher-dashboard/researcher-header.html')
        .then(res => res.text())
        .then(data => {
            document.getElementById('header-placeholder').innerHTML = data;
            // Initialize search after header loads
            initializeSearch();
        })
        .catch(err => console.error('Error loading header:', err));

    // Load initial page (proposals)
    showPage('dashboard');
}

// Attach navigation handlers to sidebar items
function attachNavigationHandlers() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const page = this.getAttribute('data-page');
            if (page) {
                showPage(page);
            }
        });
    });

    // Attach logout handler
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', PagesLogout);
    }
}

// Initialize search functionality
function initializeSearch() {
    const headerSearch = document.getElementById('header-search');
    if (headerSearch) {
        headerSearch.addEventListener('input', function(e) {
            // Add search functionality here
            console.log('Searching:', e.target.value);
        });
    }
}

// Initialize proposals page
function initializeProposals() {
    const proposalsSearch = document.getElementById('proposals-search');
    if (proposalsSearch) {
        proposalsSearch.addEventListener('input', function(e) {
            // Add proposals search functionality here
            filterProposals(e.target.value);
        });
    }

    const submitBtn = document.getElementById('btn-submit-proposal');
    if (submitBtn) {
        submitBtn.addEventListener('click', function() {
            // Navigate to submit proposal page
            console.log('Navigate to submit proposal');
        });
    }
}

// Filter proposals based on search
function filterProposals(searchTerm) {
    const table = document.querySelector('.proposals-table');
    if (!table) return;

    const rows = table.querySelectorAll('tbody tr');
    const term = searchTerm.toLowerCase();

    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        if (text.includes(term)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// Show page function (for navigation)
function showPage(page) {
    currentPage = page;
    
    // Update active nav item
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.classList.remove('active');
        const dataPage = item.getAttribute('data-page');
        if (dataPage === page) {
            item.classList.add('active');
        }
    });

    // Map page names to component files
    const pageComponents = {
        'dashboard': '../components/faculty-researcher-dashboard/dashboard-content.html',
        'proposals': '../components/faculty-researcher-dashboard/research-proposals-content.html',
        'calls': '../components/faculty-researcher-dashboard/call-for-proposals-content.html',
        'purchase': '../components/faculty-researcher-dashboard/purchase-request-content.html'
    };

    const componentPath = pageComponents[page];
    if (!componentPath) {
        console.error('Unknown page:', page);
        return;
    }

    // Load the appropriate component
    fetch(componentPath)
        .then(res => res.text())
        .then(data => {
            document.getElementById('content-placeholder').innerHTML = data;
            
            // Initialize page-specific functionality
            switch(page) {
                case 'dashboard':
                    initializeDashboard();
                    break;
                case 'proposals':
                    initializeProposals();
                    break;
                case 'calls':
                    initializeCalls();
                    break;
                case 'purchase':
                    initializePurchase();
                    break;
            }
        })
        .catch(err => console.error(`Error loading ${page} content:`, err));
}

// Logout function
function PagesLogout() {
    if (confirm('Are you sure you want to logout?')) {
        // Add logout logic here
        console.log('Logging out...');
        // window.location.href = '../index.php';
    }
}

// Initialize dashboard page
function initializeDashboard() {
    const newProposalBtn = document.querySelector('.dashboard-content .btn-primary');
    if (newProposalBtn) {
        newProposalBtn.addEventListener('click', function() {
            showPage('purchase');
        });
    }
}

// Initialize calls page
function initializeCalls() {
    const submitButtons = document.querySelectorAll('.calls-page .btn-primary');
    submitButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Navigate to submit proposal form
            console.log('Navigate to submit proposal form');
            // You can add modal or navigation logic here
        });
    });
}

// Initialize purchase page
function initializePurchase() {
    const purchaseForm = document.getElementById('purchase-form');
    if (purchaseForm) {
        purchaseForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Handle form submission
            alert('Purchase request submitted successfully!');
            // Reset form or show success message
        });
    }
}

// Load components when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadComponents);
} else {
    loadComponents();
}


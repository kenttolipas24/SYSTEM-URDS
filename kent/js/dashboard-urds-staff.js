// Load components
function loadComponents() {
    // Load sidebar
    fetch('../components/staff-dashboard/sidebar.html')
        .then(res => res.text())
        .then(data => {
            document.getElementById('sidebar-placeholder').innerHTML = data;
        })
        .catch(err => console.error('Error loading sidebar:', err));

    // Load header
    fetch('../components/staff-dashboard/header.html')
        .then(res => res.text())
        .then(data => {
            document.getElementById('header-placeholder').innerHTML = data;
            // Initialize search after header loads
            initializeSearch();
        })
        .catch(err => console.error('Error loading header:', err));

    // Load dashboard content
    fetch('../components/staff-dashboard/sidebar-content/dashboard-content.html')
        .then(res => res.text())
        .then(data => {
            document.getElementById('dashboard-content-placeholder').innerHTML = data;
            // Initialize dashboard after content loads
            initializeDashboard();
        })
        .catch(err => console.error('Error loading dashboard content:', err));
}

// Initialize dashboard
function initializeDashboard() {
    // Update metric counts (can be replaced with actual data)
    updateMetrics();
}

// Update metrics
function updateMetrics() {
    // These values can be replaced with actual data from API or localStorage
    document.getElementById('unsorted-count').textContent = '14';
    document.getElementById('ready-count').textContent = '5';
    document.getElementById('sessions-count').textContent = '3';
    document.getElementById('archived-count').textContent = '42';
}

// Show page (navigation)
function showPage(page) {
    // Remove active class from all nav items
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => item.classList.remove('active'));

    // Add active class to clicked item
    event.currentTarget.classList.add('active');

    // Handle page switching
    switch(page) {
        case 'dashboard':
            loadDashboard();
            break;
        case 'proposal-intake':
            loadProposalIntake();
            break;
        case 'in-house-schedule':
            loadInHouseSchedule();
            break;
        case 'evaluator-pool':
            loadEvaluatorPool();
            break;
        case 'settings':
            loadSettings();
            break;
        default:
            loadDashboard();
    }
}

// Load settings page
function loadSettings() {
    // Placeholder for settings page
    document.getElementById('dashboard-content-placeholder').innerHTML = 
        '<div class="dashboard-content"><h2>Settings</h2><p>Settings functionality coming soon...</p></div>';
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    loadComponents();
});

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.querySelector('.main-content');
    const navbar = document.querySelector('.navbar');  // Correctly targets navbar
    
    sidebar.classList.toggle('collapsed');
    mainContent.classList.toggle('expanded');
    
    // Directly control navbar left position for 100% reliability
    if (sidebar.classList.contains('collapsed')) {
        navbar.style.left = '80px';
    } else {
        navbar.style.left = '240px';
    }
}
fetch('../components/dean-dashboard/sidebar-content/dash-content.html')
  .then(res => res.text())
  .then(data => {
    document.getElementById('dash_con-placeholder').innerHTML = data;
  });

// Load components when page loads
document.addEventListener('DOMContentLoaded', () => {
    // These loaders will run automatically
    console.log('Dashboard initialized');
});

// Function to switch between pages - MUST BE GLOBAL
function showPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Show selected page
    const selectedPage = document.getElementById(pageId);
    if (selectedPage) {
        selectedPage.classList.add('active');
    }
    
    // Update active nav item
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    if (event && event.currentTarget) {
        event.currentTarget.classList.add('active');
    }
}
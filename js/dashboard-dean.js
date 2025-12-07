// Main loader - runs once everything is ready
document.addEventListener('DOMContentLoaded', () => {
  loadComponents();
});

function loadComponents() {
  // Load Sidebar
  fetch('../components/dean-dashboard/sidebar.html')
    .then(res => res.text())
    .then(html => {
      document.getElementById('sidebar-placeholder').innerHTML = html;
      initSidebar();        // from sidebar.js
      initNavigation();     // from deanNav.js
    });

  // Load Header
  fetch('../components/dean-dashboard/header.html')
    .then(res => res.text())
    .then(html => document.getElementById('header-placeholder').innerHTML = html);

  // Load All Pages
  const pages = ['dashboard', 'proposals', 'faculty', 'reports'];
  pages.forEach(page => {
    fetch(`../components/dean-dashboard/${page}-page.html`)
      .then(res => res.text())
      .then(html => {
        document.getElementById(`${page}-placeholder`).innerHTML = html;
        if (page === 'dashboard') {
          document.getElementById('dashboard')?.classList.add('active');
          initDashboardContent(); // from dash-con.js
        }
      });
  });
}
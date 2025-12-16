function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.querySelector('.main-content');
    
    sidebar.classList.toggle('collapsed');
    mainContent.classList.toggle('expanded');
}

// Sidebar
  fetch('../components/dean-dashboard/sidebar.html')
    .then(res => res.text())
    .then(html => {
      document.getElementById('sidebar-placeholder').innerHTML = html;
      initSidebar();
      initNavigation();
    });
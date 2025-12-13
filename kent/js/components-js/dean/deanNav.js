fetch('../components/dean-dashboard/dean-nav.html')
  .then(res => res.text())
  .then(data => {
    document.getElementById('deanNav-placeholder').innerHTML = data;
    
  });


function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.querySelector('.main-content');
    const navbar = document.querySelector('.navbar');
    
    sidebar.classList.toggle('collapsed');
    mainContent.classList.toggle('expanded');
    
    // Control navbar shift
    if (sidebar.classList.contains('collapsed')) {
        navbar.style.left = '80px';
    } else {
        navbar.style.left = '240px';
    }
}

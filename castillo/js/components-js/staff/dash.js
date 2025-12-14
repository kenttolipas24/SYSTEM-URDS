// Load dashboard page
function loadDashboard() {
    fetch('../components/staff-dashboard/sidebar-content/dashboard-content.html')
        .then(res => res.text())
        .then(data => {
            document.getElementById('dashboard-content-placeholder').innerHTML = data;
            initializeDashboard();
        })
        .catch(err => console.error('Error loading dashboard:', err));
}

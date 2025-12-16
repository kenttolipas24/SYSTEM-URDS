// Main loader - runs once everything is ready (dashboard-dean.js)
document.addEventListener('DOMContentLoaded', loadComponents);

function loadComponents() {

  // Pages
  const pages = [
    { name: 'dashboard', init: initDashboardContent },
    { name: 'announce', init: initAnnouncements },
    { name: 'proposals', init: initProposalsPage },
    { name: 'faculty', init: initFacultyPage },
    { name: 'reports', init: initReportsPage }
  ];

  pages.forEach(page => {
    fetch(`../components/dean-dashboard/${page.name}-page.html`)
      .then(res => res.text())
      .then(html => {
        const container = document.getElementById(`${page.name}-placeholder`);
        if (!container) return;

        container.innerHTML = html;
        page.init?.();
      });
  });
}

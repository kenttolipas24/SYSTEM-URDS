fetch('../components/dean-dashboard/sidebar-content/endo-content.html')
  .then(res => res.text())
  .then(data => {
    document.getElementById('endo_con-placeholder').innerHTML = data;
    attachFormListeners();
  });
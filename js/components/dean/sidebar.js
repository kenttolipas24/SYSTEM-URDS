fetch('../components/dean-dashboard/sidebar-content/dash-content.html')
  .then(res => res.text())
  .then(data => {
    document.getElementById('dash_con-placeholder').innerHTML = data;
  });
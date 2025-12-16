fetch('../components/dean-dashboard/sidebar-content/rep-content.html')
  .then(res => res.text())
  .then(data => {
    document.getElementById('rep_con-placeholder').innerHTML = data;
  });
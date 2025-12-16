fetch('../components/dean-dashboard/sidebar-content/announce-content.html')
  .then(res => res.text())
  .then(data => {
    document.getElementById('announcement-placeholder').innerHTML = data;
  });

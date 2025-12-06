fetch('../components/dean-dashboard/sidebar-content/fclty-content.html')
  .then(res => res.text())
  .then(data => {
    document.getElementById('fclty_con-placeholder').innerHTML = data;
    
  });
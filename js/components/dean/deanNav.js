fetch('../components/dean-dashboard/dean-nav.html')
  .then(res => res.text())
  .then(data => {
    document.getElementById('deanNav-placeholder').innerHTML = data;
  });
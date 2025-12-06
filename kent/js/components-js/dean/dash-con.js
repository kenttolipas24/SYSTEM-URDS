function initDashboardContent() {
  console.log("Dashboard content JS loaded");
  // Future: animate numbers, load real charts (Chart.js), etc.
  animateStatNumbers();
}

function animateStatNumbers() {
  document.querySelectorAll('.stat-value').forEach(el => {
    const target = parseInt(el.textContent.replace(/[^0-9]/g, ''));
    let count = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
      count += increment;
      if (count >= target) {
        el.textContent = target.toLocaleString();
        clearInterval(timer);
      } else {
        el.textContent = Math.floor(count).toLocaleString();
      }
    }, 30);
  });
}
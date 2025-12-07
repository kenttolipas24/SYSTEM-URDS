// js/admin.js

document.addEventListener('DOMContentLoaded', () => {
  initAdminUserInfo();
  initAdminNavigation();
  initAdminLogout();

  // After initial animations, allow content to scroll
  const main = document.querySelector('.main-content');
  if (main) main.style.overflowY = 'auto';
  document.body.style.overflow = 'auto';
});

function initAdminUserInfo() {
  const user = JSON.parse(localStorage.getItem('currentUser') || 'null');

  const displayName = user?.name || 'URDS Admin';
  const displayRole = user?.displayRole || 'Coordinator';

  const nameElem = document.getElementById('admin-display-name');
  const roleElem = document.getElementById('admin-display-role');
  const avatarElem = document.getElementById('admin-avatar');

  if (nameElem) nameElem.textContent = displayName;
  if (roleElem) roleElem.textContent = displayRole;

  if (avatarElem) {
    const initials = displayName
      .split(' ')
      .filter(Boolean)
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'AD';
    avatarElem.textContent = initials;
  }
}

function initAdminNavigation() {
  const navItems = document.querySelectorAll('.nav-item[data-target]');
  const pages = document.querySelectorAll('.page');

  if (!navItems.length || !pages.length) {
    return;
  }

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      navItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');

      const targetId = item.getAttribute('data-target');

      pages.forEach(page => {
        if (page.id === targetId) {
          page.classList.add('active');
        } else {
          page.classList.remove('active');
        }
      });
    });
  });
}

function initAdminLogout() {
  const btn = document.getElementById('admin-logout-btn');
  if (!btn) return;

  btn.addEventListener('click', () => {
  {
        localStorage.removeItem('currentUser');
        window.location.href = '../homepage.html';
    }
  });
}

// homepage.js — Clean, Modern Login & Registration System
// Works with your new injected login.html + role-based redirect

(() => {
  'use strict';

  // ==================================================================
  // Role Mapping: "Exact text from <option>" → target dashboard page
  // ==================================================================
  const roleRedirectMap = {
    'Faculty Researcher': 'faculty.html',
    'Research Coordinator': 'coordinator.html',
    'College Dean': 'dean.html',
    'URDS Director': 'director.html',
    'URDS Staff': 'staff.html',
    'Cluster Coordinator': 'cluster.html',
    'Senior Faculty': 'senior.html',
    'TWG Evaluator': 'evaluator.html'
  };

  // ==================================================================
  // Utility Helpers
  // ==================================================================
  const qs = (sel) => document.querySelector(sel);
  const qsa = (sel) => document.querySelectorAll(sel);

  // Safe localStorage get + parse
  const getUser = () => {
    try {
      const data = localStorage.getItem('currentUser');
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error('Failed to parse currentUser:', e);
      return null;
    }
  };

  // ==================================================================
  // Check if user is already logged in → redirect immediately
  // ==================================================================
  function checkAuth() {
    const user = getUser();
    if (user?.displayRole && roleRedirectMap[user.displayRole]) {
      console.log('[AUTH] Already logged in as:', user.displayRole);
      window.location.href = roleRedirectMap[user.displayRole];
    }
  }

  // ==================================================================
  // Toggle between Sign In and Sign Up forms
  // ==================================================================
  window.showSignUp = () => {
    qs('#signInForm')?.classList.add('hidden');
    qs('#signUpForm')?.classList.remove('hidden');
  };

  window.showSignIn = () => {
    qs('#signUpForm')?.classList.add('hidden');
    qs('#signInForm')?.classList.remove('hidden');
  };

  // ==================================================================
  // Handle Login
  // ==================================================================
  window.handleSignIn = (e) => {
    e.preventDefault();

    const email = qs('#signInForm input[type="email"]').value.trim();
    const password = qs('#signInForm input[type="password"]').value;
    const roleSelect = qs('#signInForm select');
    const displayRole = roleSelect?.options[roleSelect.selectedIndex]?.text || '';
    const roleValue = roleSelect?.value || '';

    if (!email || !password || !roleValue) {
      alert('Please fill in all fields and select a role.');
      return false;
    }

    // Save session (demo only)
    const userSession = {
      email,
      role: roleValue,
      displayRole, // human-readable role (used for redirect)
      loggedInAt: new Date().toISOString()
    };

    localStorage.setItem('currentUser', JSON.stringify(userSession));

    const targetPage = roleRedirectMap[displayRole];
    if (targetPage) {
      setTimeout(() => window.location.href = targetPage, 600);
    } else {
      alert(`No dashboard configured for role: "${displayRole}"`);
    }

    return false;
  };

  // ==================================================================
  // Handle Registration
  // ==================================================================
  window.handleSignUp = (e) => {
    e.preventDefault();

    const form = e.target;
    const firstName = form.querySelector('input[placeholder="Enter your first name"]').value.trim();
    const lastName = form.querySelector('input[placeholder="Enter your last name"]').value.trim();
    const email = form.querySelector('input[type="email"]').value.trim();
    const department = form.querySelector('input[placeholder="Enter your institution"]').value.trim();
    const roleSelect = form.querySelector('select');
    const displayRole = roleSelect?.options[roleSelect.selectedIndex]?.text || '';
    const roleValue = roleSelect?.value || '';
    const password = form.querySelector('input[type="password"]').value;
    const confirmPassword = form.querySelectorAll('input[type="password"]')[1].value;
    const terms = form.querySelector('#terms').checked;

    if (!firstName || !lastName || !email || !roleValue || !terms) {
      alert('Please fill all required fields and accept terms.');
      return false;
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return false;
    }

    if (password.length < 8) {
      alert('Password must be at least 8 characters.');
      return false;
    }

    // Save registered user (for demo)
    const newUser = {
      firstName, lastName, email, department,
      role: roleValue,
      displayRole,
      createdAt: new Date().toISOString()
    };

    localStorage.setItem('registered_' + email, JSON.stringify(newUser));
    alert('Account created successfully! You can now sign in.');

    // Auto-switch to login
    showSignIn();
    // Pre-fill email
    qs('#signInForm input[type="email"]').value = email;

    return false;
  };

  // ==================================================================
  // Logout (you can call this from any dashboard)
  // ==================================================================
  window.logout = () => {
    localStorage.removeItem('currentUser');
    window.location.href = 'homepage.html';
  };

  // ==================================================================
  // Initialize when DOM + injected content is ready
  // ==================================================================
  function initAuthSystem() {
    checkAuth(); // Redirect if already logged in

    // Re-attach event listeners to injected forms
    const signInForm = qs('#signInForm form');
    const signUpForm = qs('#signUpForm form');

    if (signInForm) {
      signInForm.removeEventListener('submit', handleSignIn); // prevent duplicate
      signInForm.addEventListener('submit', handleSignIn);
    }

    if (signUpForm) {
      signUpForm.removeEventListener('submit', handleSignUp);
      signUpForm.addEventListener('submit', handleSignUp);
    }

    console.log('[URDS] Auth system initialized.');
  }

  // ==================================================================
  // Load login component and initialize
  // ==================================================================
  fetch('components/login.html')
    .then(res => {
      if (!res.ok) throw new Error('login.html not found');
      return res.text();
    })
    .then(html => {
      const placeholder = document.getElementById('access_portal-placeholder');
      if (placeholder) {
        placeholder.innerHTML = html;
        initAuthSystem();
      }
    })
    .catch(err => {
      console.error('Failed to load login component:', err);
      document.getElementById('access_portal-placeholder').innerHTML =
        '<p style="color:red; text-align:center;">Error loading login form.</p>';
    });

  // ==================================================================
  // Expose for debugging
  // ==================================================================
  window._URDS = {
    checkAuth,
    logout,
    roleRedirectMap,
    getUser
  };

})();
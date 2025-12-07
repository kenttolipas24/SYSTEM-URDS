// Load the patient table HTML content into the placeholder
fetch('components/login.html')
  .then(res => res.text())
  .then(data => {
    document.getElementById('access_portal-placeholder').innerHTML = data;
    attachFormListeners(); // re-attach JS after inject
  });

// Event Listeners for Form Toggle
function showSignUp() {
    const signInForm = document.getElementById('signInForm');
    const signUpForm = document.getElementById('signUpForm');
    
    signInForm.classList.add('hidden');
    signUpForm.classList.remove('hidden');
    signUpForm.classList.add('form-transition');
}

function showSignIn() {
    const signInForm = document.getElementById('signInForm');
    const signUpForm = document.getElementById('signUpForm');
    
    signUpForm.classList.add('hidden');
    signInForm.classList.remove('hidden');
    signInForm.classList.add('form-transition');
}

function handleSignIn(event) {
    event.preventDefault();
    const form = event.target;
    const email = form.querySelector('input[type="email"]').value;
    const password = form.querySelector('input[type="password"]').value;
            
    // Simulate authentication
    console.log('Sign In:', { email, password });
    
            
    return false;
}

function handleSignUp(event) {
    event.preventDefault();
    const form = event.target;
    const inputs = form.querySelectorAll('input');
    const select = form.querySelector('select');
            
    const passwords = form.querySelectorAll('input[type="password"]');
    if (passwords[0].value !== passwords[1].value) {
        alert('Passwords do not match!');
        return false;
    }
            
    // Simulate registration
    console.log('Sign Up successful');
    
    showSignIn();
            
    return false;
}

// Login & Registration 

(() => {
  'use strict';

  // ==================================================================
  // Role Mapping: "Exact text from <option>" → target dashboard page
  // ==================================================================
  const roleRedirectMap = {
    'faculty':      'pages/faculty.html',
    'coordinator':  'pages/coordinator.html',
    'dean':         'pages/dean.html',
    'director':     'pages/director.html',
    'staff':        '../glen/URDS staff/index.html',
    'cluster':      'pages/cluster.html',
    'researcher':   'pages/evaluator.html'
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

  const email = qs('#signInForm input[type="email"]')?.value.trim();
  const password = qs('#signInForm input[type="password"]')?.value;
  const select = qs('#signInForm select');
  const roleValue = select?.value;  // ← This is "faculty", "dean", etc.

  if (!email || !password || !roleValue) {
    alert('Please fill all fields and select a role.');
    return;
  }

  // Save session using the short value
  const session = {
    email,
    role: roleValue,           // short code
    displayRole: select.selectedOptions[0].textContent.trim(), // optional: for display
    loggedInAt: Date.now()
  };

  localStorage.setItem('currentUser', JSON.stringify(session));

  // Redirect using the short value
  const target = roleRedirectMap[roleValue];
  if (target) {
    setTimeout(() => window.location.href = target, 500);
  } else {
    alert('Role not supported: ' + roleValue);
  }
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
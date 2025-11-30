

// homepage.js — full, robust login/register/tab handling

(function () {
  'use strict';

  // Map exact role option text -> page to redirect to
  const roleRedirectMap = {
    'Faculty Researcher': 'faculty.html',
    'Research Coordinator': 'coordinator.html',
    'College Dean': 'dean.html',
    'URDS Director': 'director.html',       // placeholder examples
    'URDS Staff': 'staff.html',
    'Cluster Coordinator': 'cluster.html',
    'Senior Faculty': 'senior.html',
    'TWG Evaluator': 'evaluator.html'
  };

  // Utilities
  function qs(selector) { return document.querySelector(selector); }
  function qsa(selector) { return Array.from(document.querySelectorAll(selector)); }

  // Switch tab (safe: receives event and tab string)
  function switchTab(event, tabName) 
  {
    event && event.preventDefault();

    qsa('.tab-pane').forEach(p => p.classList.remove('active'));
    qsa('.tab-button').forEach(b => b.classList.remove('tab-active'));

    const pane = document.getElementById(`${tabName}-tab`);
    if (pane) pane.classList.add('active');

    // If event exists (from click), mark clicked button active.
    if (event && event.currentTarget) {
      event.currentTarget.classList.add('tab-active');
    } else {
      // fallback: find by data-tab
      const btn = document.querySelector(`.tab-button[data-tab="${tabName}"]`);
      if (btn) btn.classList.add('tab-active');

                // Redirect to appropriate dashboard
                if (role === 'faculty') 
                    window.location.href = 'faculty.html';
                } else if (role === 'coordinator') {
                    window.location.href = 'coordinator.html';
                } else if (role === 'dean') {
                    window.location.href = 'dean.html';
                } else if (role === 'urds-staff') {
                    window.location.href = 'urds-staff.html';
                } else if (role === 'evaluator') {
                    window.location.href = 'evaluator.html';
                }
            }, 1000);
        }
      }
    }
// Check if user is already logged in
const currentUser = localStorage.getItem('currentUser');
if (currentUser) {
    const user = JSON.parse(currentUser);
    if (user.role === 'faculty') {
        window.location.href = 'faculty.html';
    } else if (user.role === 'coordinator') {
        window.location.href = 'coordinator.html';
    } else if (user.role === 'dean') {
        window.location.href = 'dean.html';
    } else if (user.role === 'urds-staff') {
        window.location.href = 'urds-staff.html';
    } else if (user.role === 'evaluator') {
        window.location.href = 'evaluator.html';
<<<<<<< HEAD
    }
=======
    }   
}
>>>>>>> 070212126e427d4ccadf3046c4dcb3267e0b4afb


    const welcomeText = qs('#welcomeText');
    if (welcomeText) {
      welcomeText.textContent = tabName === 'login'
        ? 'Sign in to access your account'
        : 'Create a new account to get started';

function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'homepage.html';
}

// Check if user is already logged in
function checkAuth() {
    const user = getFromLocalStorage('currentUser');
    if (user) {
        // Redirect if already logged in
        if (user.role === 'faculty') {
            window.location.href = 'faculty.html';
        } else if (user.role === 'coordinator') {
            window.location.href = 'coordinator.html';
        } else if (user.role === 'dean') {
            window.location.href = 'dean.html';
        } else if (user.role === 'urds-staff') {
            window.location.href = 'urds-staff.html';
        } else if (user.role === 'evaluator') {
            window.location.href = 'evaluator.html';
        }
    }
  }

  // Login handler — used by form submit event
  function handleLogin(evt) {
    try {
      evt && evt.preventDefault();

      const email = (qs('#login-email') || {}).value || '';
      const password = (qs('#login-password') || {}).value || '';
      const role = (qs('#login-role') || {}).value || '';

      console.log('[DEBUG] handleLogin payload:', { email, role });

      if (!email || !password || !role) {
        alert('Please fill in all fields and select a role.');
        return;
      }

      // Button UI (use event.submitter if available)
      let submitBtn = null;
      if (evt && 'submitter' in evt && evt.submitter) submitBtn = evt.submitter;
      if (!submitBtn) submitBtn = qs('#loginForm button[type="submit"]');

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.dataset.orig = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing in...';
      }

      // Simulate API / authentication delay
      setTimeout(() => {
        // Save minimal session info locally (demo only)
        localStorage.setItem('currentUser', JSON.stringify({ email, role }));

        const target = roleRedirectMap[role];
        if (target) {
          console.log('[DEBUG] Redirecting to:', target);
          window.location.href = target;
        } else {
          // If no mapping: informative message (prevents silent failure)
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = submitBtn.dataset.orig || 'Sign In';
          }
          alert(`Signed in as "${role}" but no dashboard is configured for that role.\nCheck role string or add mapping in homepage.js`);
          console.warn('[WARN] No redirect mapping for role:', role);
        }
      }, 800); // short delay for UX
    } catch (err) {
      console.error('[ERROR] handleLogin:', err);
      alert('An unexpected error occurred. Check console for details.');
    }
  }

  // Register handler (keeps simple local storage demo behavior)
  function handleRegister(evt) {
    try {
      evt && evt.preventDefault();

      const password = (qs('#password') || {}).value || '';
      const confirm = (qs('#confirmPassword') || {}).value || '';
      if (password !== confirm) {
        alert('Passwords do not match!');
        return;
      }

      const payload = {
        firstName: (qs('#firstName') || {}).value || '',
        lastName: (qs('#lastName') || {}).value || '',
        contactNumber: (qs('#contactNumber') || {}).value || '',
        email: (qs('#email') || {}).value || '',
        department: (qs('#department') || {}).value || '',
        role: (qs('#register-role') || {}).value || ''
      };

      console.log('[DEBUG] handleRegister payload:', payload);

      // Save user locally (demo)
      if (!payload.email) {
        alert('Please provide an email.');
        return;
      }
      localStorage.setItem('user_' + payload.email, JSON.stringify(payload));
      alert('Account created (local demo). You can now sign in.');

      // switch to login tab
      const loginBtn = document.querySelector('.tab-button[data-tab="login"]');
      if (loginBtn) loginBtn.click();

    } catch (err) {
      console.error('[ERROR] handleRegister:', err);
      alert('An unexpected error occurred. Check console for details.');
    }
  }

  // Attach event listeners safely on DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    // Wire tab buttons (overrides inline onclick to pass event safely)
    qsa('.tab-button').forEach(btn => {
      // If already has click handler inline, we still attach to be sure it uses event.
      btn.addEventListener('click', (e) => {
        const tab = btn.dataset.tab;
        if (tab) switchTab(e, tab);
      });
    });

    // Attach form handlers (prefer JS-bound handlers over inline attributes)
    const loginForm = qs('#loginForm');
    if (loginForm) {
      // remove any inline onsubmit to avoid conflicts (defensive)
      loginForm.onsubmit = null;
      loginForm.addEventListener('submit', handleLogin);
    } else {
      console.warn('[WARN] #loginForm not found.');
    }

    const registerForm = qs('#registerForm');
    if (registerForm) {
      registerForm.onsubmit = null;
      registerForm.addEventListener('submit', handleRegister);
    } else {
      console.warn('[WARN] #registerForm not found.');
    }

    // Quick sanity logs
    console.log('[INFO] homepage.js initialized. Ready.');
  });

  // Expose functions for debugging in console (optional)
  window._URDS = {
    switchTab,
    handleLogin,
    handleRegister,
    roleRedirectMap
  };

}

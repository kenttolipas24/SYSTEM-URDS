// If the access portal placeholder is empty, load the component; otherwise bind handlers to the existing content.
const portalPlaceholder = document.getElementById('access_portal-placeholder');
if (portalPlaceholder && portalPlaceholder.innerHTML.trim().length === 0) {
  fetch('components/login-signup.html')
    .then(res => res.text())
    .then(data => {
      portalPlaceholder.innerHTML = data;
      attachFormListeners(); // re-attach JS after inject
      bindSignInHandler();
    })
    .catch(err => {
      console.error('Failed to load login component:', err);
    });
} else {
  // Already present (server-side include), just bind handlers
  bindSignInHandler();
}

function attachFormListeners() {
  // placeholder for compatibility with other scripts
}

function bindSignInHandler() {
  const signInForm = document.querySelector('#access_portal-placeholder #signInForm');
  if (!signInForm) return;

  signInForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = signInForm.querySelector('input[name="email"]').value.trim();
    const password = signInForm.querySelector('input[name="password"]').value;

    if (!email || !password) {
      alert('Please enter email and password.');
      return;
    }

    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);

    try {
      const res = await fetch('backend/auth/login.php', {
        method: 'POST',
        body: formData
      });

      const text = await res.text();
      if (text.trim() === 'success') {
        // On success, redirect to main.html
        window.location.href = 'main.html';
      } else {
        alert('Invalid credentials.');
      }
    } catch (err) {
      console.error('Login error', err);
      alert('An error occurred while logging in.');
    }
  });
}
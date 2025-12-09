fetch('components/navbar.html')
  .then(res => res.text())
  .then(data => {
    document.getElementById('navbar-placeholder').innerHTML = data;
    attachFormListeners(); // re-attach JS after inject
  });

  function loadRoles() {
    fetch('backend/auth/get_roles.php')
        .then(res => res.json())
        .then(roles => {
            const select = document.getElementById('roleSelect');
            select.innerHTML = `<option value="">-- Choose a Role --</option>`;

            roles.forEach(role => {
                const label = role.charAt(0).toUpperCase() + role.slice(1).replace('_', ' ');
                select.innerHTML += `<option value="${role}">${label}</option>`;
            });
        })
        .catch(err => console.error("Error loading roles:", err));
}

// Call when signup form is shown
function showSignUp() {
    document.getElementById("signInForm").classList.add("hidden");
    document.getElementById("signUpForm").classList.remove("hidden");
    loadRoles(); // Load roles dynamically
}

function showSignIn() {
    document.getElementById("signUpForm").classList.add("hidden");
    document.getElementById("signInForm").classList.remove("hidden");
}

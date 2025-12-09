async function loadRoles() {
    const select = document.getElementById("roleSelect");
    // Call the centralized backend roles endpoint
    const response = await fetch("backend/auth/get_roles.php");
    const roles = await response.json();

    select.innerHTML = `<option value="">Select Role</option>`;
    
    roles.forEach(role => {
        const opt = document.createElement("option");
        opt.value = role;
        opt.textContent = role.charAt(0).toUpperCase() + role.slice(1);
        select.appendChild(opt);
    });
}

// Load roles on module load
loadRoles();

document.getElementById("signupForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    let response = await fetch("backend/auth/register.php", {
        method: "POST",
        body: formData
    });

    let result = await response.text();

    if (result === "success") {
        alert("Account created successfully!");
        // Clear signup inputs
        try {
            const signupFormEl = document.querySelector('#access_portal-placeholder #signupForm');
            if (signupFormEl && typeof signupFormEl.reset === 'function') {
                signupFormEl.reset();
            }
        } catch (e) {
            console.warn('Could not reset signup form:', e);
        }

        // Switch back to sign-in form and pre-fill the email field
        if (typeof showSignIn === 'function') {
            showSignIn();
        }

        // Pre-fill the sign-in email input if present
        try {
            const signInEmail = document.querySelector('#access_portal-placeholder input[name="email"]');
            if (signInEmail) signInEmail.value = formData.get('email') || '';
        } catch (e) {
            console.warn('Could not prefill sign-in email:', e);
        }
    } else if (result === "email_exists") {
        alert("This email is already registered.");
    } else {
        alert("Signup failed. Please try again.");
    }
});

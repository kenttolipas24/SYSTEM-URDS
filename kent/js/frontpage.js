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
    alert('Sign in successful! Welcome back.');
            
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
    alert('Account created successfully! You can now sign in.');
    showSignIn();
            
    return false;
}
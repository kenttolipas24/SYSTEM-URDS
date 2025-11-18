// Toggle between login and signup forms
        function toggleToSignup() {
            const loginForm = document.getElementById('loginForm');
            const signupForm = document.getElementById('signupForm');
            const authTitle = document.getElementById('authTitle');

            // Animate out login
            loginForm.classList.remove('active');
            loginForm.classList.add('slide-left');

            // Animate in signup
            setTimeout(() => {
                signupForm.classList.remove('slide-right');
                signupForm.classList.add('active');
                authTitle.textContent = 'Create Account';
            }, 100);
        }

        function toggleToLogin() {
            const loginForm = document.getElementById('loginForm');
            const signupForm = document.getElementById('signupForm');
            const authTitle = document.getElementById('authTitle');

            // Animate out signup
            signupForm.classList.remove('active');
            signupForm.classList.add('slide-right');

            // Animate in login
            setTimeout(() => {
                loginForm.classList.remove('slide-left');
                loginForm.classList.add('active');
                authTitle.textContent = 'Access Portal';
            }, 100);
        }

        // Login function
        function login() {
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            const role = document.getElementById('loginRoleSelect').value;

            if (!email || !password || !role) {
                alert('Please fill in all fields and select a role');
                return;
            }

            // Show loading animation
            const btn = event.target;
            btn.classList.add('loading');
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';

            // Simulate API call
            setTimeout(() => {
                const currentUser = { email, role };
                localStorage.setItem('currentUser', JSON.stringify(currentUser));

                // Redirect to appropriate dashboard
                if (role === 'faculty') {
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

        // Signup function
        function signup() {
            const fullName = document.getElementById('signupFullName').value;
            const email = document.getElementById('signupEmail').value;
            const password = document.getElementById('signupPassword').value;
            const confirmPassword = document.getElementById('signupConfirmPassword').value;
            const role = document.getElementById('signupRoleSelect').value;

            if (!fullName || !email || !password || !confirmPassword || !role) {
                alert('Please fill in all fields and select a role');
                return;
            }

            if (password !== confirmPassword) {
                alert('Passwords do not match');
                return;
            }

            if (password.length < 6) {
                alert('Password must be at least 6 characters');
                return;
            }

            // Show loading animation
            const btn = event.target;
            btn.classList.add('loading');
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating account...';

            // Simulate API call
            setTimeout(() => {
                const userData = { fullName, email, role };
                localStorage.setItem('userData_' + email, JSON.stringify(userData));
                localStorage.setItem('currentUser', JSON.stringify({ email, role }));       
                
                alert('Account created successfully!');

                // Redirect to appropriate dashboard
                if (role === 'faculty') {
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
    } else if (role === 'urds-staff') {
        window.location.href = 'urds-staff.html';
    } else if (role === 'evaluator') {
        window.location.href = 'evaluator.html';
    }
}


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
        } else if (role === 'urds-staff') {
            window.location.href = 'urds-staff.html';
        } else if (role === 'evaluator') {
            window.location.href = 'evaluator.html';
        }
    }
}

// Run on page load
document.addEventListener('DOMContentLoaded', checkAuth);
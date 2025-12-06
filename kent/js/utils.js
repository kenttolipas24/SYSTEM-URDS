// Logout function - basta tanan na dashboard
function PagesLogout() {
    localStorage.removeItem('userSession');
    sessionStorage.clear();
    
    // Redirect to frontend/login page
    window.location.href = '../frontpage.html';
}
// Logout function - basta tanan na dashboard
function PagesLogout() {
    localStorage.removeItem('userSession');
    sessionStorage.clear();
    
    window.location.href = '../homepage.html';
}
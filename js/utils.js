// Logout function - basta tanan na dashboard
function PageLogout() {
    localStorage.removeItem('userSession');
    sessionStorage.clear();
    
    window.location.href = '../frontpage.html';
}
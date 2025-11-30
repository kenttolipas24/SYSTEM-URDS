// Mock Data Storage
const proposals = [
    {
        id: 1,
        title: 'AI-Powered Water Quality Monitoring',
        author: 'Dr. Alice Johnson',
        email: 'faculty1@university.edu',
        date: '2025-10-15',
        status: 'approved',
        copies: 5,
        submittedToURDS: true,
        feedback: 'Excellent research proposal',
        college: 'Engineering',
        commodity: 'Water Resources & Environmental Technology',
        reviewReady: true
    },
    {
        id: 2,
        title: 'Smart City Infrastructure',
        author: 'Dr. Alice Johnson',
        email: 'faculty1@university.edu',
        date: '2025-10-10',
        status: 'pending',
        copies: 0,
        submittedToURDS: false,
        college: 'Engineering',
        commodity: 'Information Technology & Communications',
        reviewReady: false
    },
    {
        id: 3,
        title: 'IoT Sensor Networks',
        author: 'Dr. Alice Johnson',
        email: 'faculty1@university.edu',
        date: '2025-09-20',
        status: 'revision',
        copies: 0,
        submittedToURDS: false,
        feedback: 'TWG Feedback & Suggestions',
        college: 'Engineering',
        commodity: 'Information Technology & Communications',
        reviewReady: false
    },
    {
        id: 4,
        title: 'Sustainable Energy Solutions',
        author: 'Prof. Bob Smith',
        email: 'faculty2@university.edu',
        date: '2025-09-20',
        status: 'pending',
        copies: 5,
        submittedToURDS: true,
        college: 'Science',
        commodity: 'Energy & Environment',
        reviewReady: true
    },
    {
        id: 5,
        title: 'Advanced Materials Research',
        author: 'Dr. Carol White',
        email: 'faculty3@university.edu',
        date: '2025-08-10',
        status: 'endorsed',
        copies: 5,
        endorsedDate: '2025-08-10',
        college: 'Science',
        commodity: 'Materials Science & Nanotechnology',
        reviewReady: true
    }
];

const faculty = [
    { id: 1, name: 'Faculty Member 1', email: 'faculty1@university.edu', submissions: 3 },
    { id: 2, name: 'Faculty Member 2', email: 'faculty2@university.edu', submissions: 1 },
    { id: 3, name: 'Faculty Member 3', email: 'faculty3@university.edu', submissions: 5 },
    { id: 4, name: 'Faculty Member 4', email: 'faculty4@university.edu', submissions: 2 },
    { id: 5, name: 'Faculty Member 5', email: 'faculty5@university.edu', submissions: 2 }
];

// Utility Functions
function getStatusBadge(status) {
    const badges = {
        pending: '<span class="badge pending">Pending</span>',
        approved: '<span class="badge approved">Approved</span>',
        revision: '<span class="badge revision">Revision Needed</span>',
        endorsed: '<span class="badge endorsed">Endorsed</span>',
        submitted: '<span class="badge submitted">Submitted to URDS</span>',
        rejected: '<span class="badge rejected">Rejected</span>'
    };
    return badges[status] || badges.pending;
}

function switchTab(dashboard, tabName) {
    const tabs = document.querySelectorAll('.tab');
    const panels = document.querySelectorAll('.tab-panel');
    
    tabs.forEach(tab => tab.classList.remove('active'));
    panels.forEach(panel => panel.classList.remove('active'));
    
    event.target.closest('.tab').classList.add('active');
    document.getElementById(`${dashboard}-${tabName}`).classList.add('active');
}

function saveToLocalStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function getFromLocalStorage(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
}

// Logout Functions

 // Dean Logout Function
function logout() {
    // Remove user session
    localStorage.removeItem('currentUser');
    
    // Redirect to login page (works from any dashboard inside /pages/)
    window.location.href = 'homepage.html';
    
    // Optional: Show a quick message (disappears after redirect)
    alert('You have been logged out successfully.');
}
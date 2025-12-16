// =========================
// Coordinator Dashboard JS
// Fully Integrated Version
// =========================

let currentUser = null;
let currentEvalProposal = null;
let selectedRating = 0;

// -------------------------
// Initialization
// -------------------------
document.addEventListener('DOMContentLoaded', function () {
    loadComponents();
});

// Load sidebar, header, and default page
function loadComponents() {
    // Load sidebar
    fetch('../components/coordinator-dashboard/sidebar.html')
        .then(res => res.text())
        .then(data => {
            document.getElementById('sidebar-placeholder').innerHTML = data;
        })
        .catch(err => console.error('Error loading sidebar:', err));

    // Load header
    fetch('../components/coordinator-dashboard/header.html')
        .then(res => res.text())
        .then(data => {
            document.getElementById('header-placeholder').innerHTML = data;
            initializeSearch();
        })
        .catch(err => console.error('Error loading header:', err));

    // Load dashboard (default page)
    loadDashboard();
}

// -------------------------
// PAGE ROUTING
// -------------------------
function showPage(page) {
    // Remove active class
    const navItems = document.querySelectorAll('.sidebar .menu-item');
    navItems.forEach(item => item.classList.remove('active'));

    // Add active class to clicked item
    const clickedItem = event.currentTarget || document.querySelector(`.sidebar .menu-item[onclick*="'${page}'"]`);
    if (clickedItem) clickedItem.classList.add('active');

    // Handle routing
    switch (page) {
        case 'dashboard':
            loadDashboard();
            break;
        case 'incoming-proposals':
            loadIncomingProposalsPage(); // NEW
            break;
        case 'researchers':
            loadResearchersPage();
            break;
        case 'settings':
            loadSettingsPage();
            break;
        default:
            loadDashboard();
    }
}

// -------------------------
// DASHBOARD
// -------------------------
function loadDashboard() {
    fetch('../components/coordinator-dashboard/sidebar-content/dashboard-content.html')
        .then(res => res.text())
        .then(data => {
            document.getElementById('dashboard-content-placeholder').innerHTML = data;
            initializeDashboard();
        })
        .catch(err => console.error('Error loading dashboard:', err));
}

function initializeDashboard() {
    loadIncomingProposals(); // dashboard mini list
}

// Dashboard-specific incoming proposal badge
function getProposalStatusBadge(status) {
    if (status === 'For Endorsement') return '<span class="status-badge endorsement">For Endorsement</span>';
    if (status === 'Pending TWG') return '<span class="status-badge pending-twg">Pending TWG</span>';
    return '<span class="status-badge endorsement">New Submission</span>';
}

function loadIncomingProposals() {
    const listContainer = document.getElementById('coordinator-proposal-list');
    if (!listContainer) return;

    const incomingProposals = [
        { id: 1, title: 'AI-Driven Traffic Management System', author: 'Engr. Damon Salvatore', dept: 'Engineering', date: 'Nov 28, 2025', status: 'For Endorsement' },
        { id: 2, title: 'Biodiversity Assessment of Mt. Apo', author: 'Prof. Elena Gilbert', dept: 'Biology', date: 'Dec 02, 2025', status: 'Pending TWG' },
    ];

    listContainer.innerHTML = incomingProposals.map(p => `
        <div class="proposal-card">
            <div class="proposal-meta">
                <span class="meta-badge">${p.dept}</span>
                <span class="meta-date">${p.date}</span>
                <div style="margin-left: auto;">${getProposalStatusBadge(p.status)}</div>
            </div>
            <div class="proposal-title-info">${p.title}</div>
            <p class="proposal-author">by ${p.author}</p>

            <div class="proposal-actions">
                <button class="btn-return" onclick="handleProposalAction(${p.id}, 'return')">Return</button>
                <button class="btn-endorse" onclick="handleProposalAction(${p.id}, 'endorse')">Endorse →</button>
            </div>
        </div>
    `).join('');
}

// -------------------------
// NEW: Incoming Proposals Page (FULL PAGE)
// -------------------------
function loadIncomingProposalsPage() {
    fetch('../components/coordinator-dashboard/sidebar-content/incoming-proposals.html')
        .then(res => res.text())
        .then(data => {
            document.getElementById('dashboard-content-placeholder').innerHTML = data;
            initializeIncomingProposals(); // VERY IMPORTANT
        })
        .catch(err => console.error('Error loading incoming proposals:', err));
}

// Initialize full-page table
function initializeIncomingProposals() {
    renderProposalsTable();
}

// Status badge class helper
function getStatusBadgeClass(status) {
    switch (status) {
        case 'Pending TWG': return 'badge-pending-twg';
        case 'For Revision': return 'badge-for-revision';
        case 'Endorsed': return 'badge-endorsed';
        case 'In-House Review': return 'badge-in-house';
        default: return '';
    }
}

// Render full table
function renderProposalsTable() {
    const tableBody = document.getElementById('incoming-proposals-list');
    if (!tableBody) return;

    const proposalsData = [
        { id: 1, title: 'Biodiversity Assessment of Mt. Apo Natural Park', ref: 'RP-2025-001', researcher: 'Prof. Elena Gilbert', dept: 'Biology Dept', date: 'Dec 02, 2025', budget: '150,000.00', status: 'Pending TWG' },
        { id: 2, title: 'AI-Driven Traffic Management System', ref: 'RP-2025-002', researcher: 'Engr. Damon Salvatore', dept: 'Engineering', date: 'Nov 28, 2025', budget: '250,000.00', status: 'For Revision' },
        { id: 3, title: 'Sustainable Agriculture Practices in Rice Production', ref: 'RP-2025-003', researcher: 'Dr. Caroline Forbes', dept: 'Agriculture', date: 'Nov 25, 2025', budget: '100,000.00', status: 'Endorsed' },
        { id: 4, title: 'Mental Health Impact of Hybrid Learning', ref: 'RP-2025-004', researcher: 'Prof. Alaric Saltzman', dept: 'Psychology Dept', date: 'Nov 20, 2025', budget: '50,000.00', status: 'In-House Review' },
    ];

    const rows = proposalsData.map(p => `
        <div class="proposal-row">
            <div class="proposal-details-main">
                ${p.title}
                <span class="proposal-ref">${p.ref}</span>
            </div>
            <div class="researcher-info">
                ${p.researcher}
                <span class="researcher-dept">${p.dept}</span>
            </div>
            <div class="submission-date">${p.date}</div>
            <div class="proposal-budget">
                <i class="fas fa-peso-sign"></i> ${p.budget}
            </div>
            <div>
                <span class="proposal-status-badge ${getStatusBadgeClass(p.status)}">${p.status}</span>
            </div>
            <div>
                <button class="actions-button" onclick="showProposalDetails(${p.id})">View Details</button>
            </div>
        </div>
    `).join('');

    tableBody.innerHTML += rows;
}

// Search filter (input keyup)
function filterProposals() {
    const term = document.getElementById('proposals-search-input').value.toLowerCase();
    console.log("Filtering proposals:", term);
}

function showProposalDetails(id) {
    alert(`Viewing proposal #${id}`);
}

// -------------------------
// Other Pages
// -------------------------
// ... (Keep all existing code up to the placeholder functions) ...

// --- 3. Placeholder Page Loaders (UPDATED) ---

function loadResearchersPage() {
    fetch('../components/coordinator-dashboard/sidebar-content/researchers.html')
        .then(res => res.text())
        .then(data => {
            document.getElementById('dashboard-content-placeholder').innerHTML = data;
            initializeResearchersPage();
        })
        .catch(err => console.error('Error loading researchers page:', err));
}

function getFacultyResearchersData() {
    // Mock data based on the screenshot
    return [
        { name: 'Prof. Elena Gilbert', title: 'Associate Professor III', department: 'Biology Department', expertise: ['Botany', 'Ecology', 'Biodiversity'], active: 2, completed: 5, initials: 'PG', initialsClass: 'initials-pg' },
        { name: 'Engr. Damon Salvatore', title: 'Instructor I', department: 'Engineering Department', expertise: ['Civil Engineering', 'Urban Planning', 'Smart Cities'], active: 1, completed: 1, initials: 'ES', initialsClass: 'initials-es' },
        { name: 'Dr. Caroline Forbes', title: 'Professor VI', department: 'Agriculture Department', expertise: ['Sustainable Agriculture', 'Crop Science'], active: 3, completed: 12, initials: 'DF', initialsClass: 'initials-df' },
    ];
}

function initializeResearchersPage() {
    renderResearchersGrid();
    // Bind search functionality if needed (not shown in this example)
    const searchInput = document.getElementById('researchers-search-input');
    if (searchInput) {
        searchInput.addEventListener('keyup', filterResearchers);
    }
}

function renderResearchersGrid(filteredData = getFacultyResearchersData()) {
    const gridContainer = document.getElementById('faculty-researchers-grid');
    if (!gridContainer) return;

    const cardsHtml = filteredData.map(f => `
        <div class="researcher-card">
            <div class="researcher-header">
                <div class="profile-initials ${f.initialsClass}">${f.initials}</div>
                <div class="researcher-info">
                    <h3>${f.name}</h3>
                    <p>${f.title}</p>
                    <p>${f.department}</p>
                </div>
            </div>
            
            <div class="expertise-list">
                ${f.expertise.map(e => `<span class="expertise-badge">${e}</span>`).join('')}
            </div>

            <div class="researcher-metrics">
                <div class="metric-item">
                    <div class="metric-value">${f.active}</div>
                    <div class="metric-label">Active</div>
                </div>
                <div class="metric-item">
                    <div class="metric-value">${f.completed}</div>
                    <div class="metric-label">Completed</div>
                </div>
            </div>

            <div class="card-actions">
                <button class="btn-contact" onclick="contactResearcher('${f.name}')">
                    <i class="fas fa-envelope"></i> Contact
                </button>
                <button class="btn-profile" onclick="viewResearcherProfile('${f.name}')">
                    <i class="fas fa-file-alt"></i> Profile
                </button>
            </div>
        </div>
    `).join('');

    gridContainer.innerHTML = cardsHtml;
}

// Placeholder functions for card actions
function contactResearcher(name) {
    alert(`Initiating contact with ${name}...`);
}

function viewResearcherProfile(name) {
    alert(`Viewing profile for ${name}...`);
}

function openAddFacultyModal() {
    alert('Opening modal to add new faculty...');
}

function filterResearchers() {
    const searchTerm = document.getElementById('researchers-search-input').value.toLowerCase();
    const allData = getFacultyResearchersData();

    if (!searchTerm) {
        renderResearchersGrid(allData);
        return;
    }

    const filtered = allData.filter(f =>
        f.name.toLowerCase().includes(searchTerm) ||
        f.department.toLowerCase().includes(searchTerm) ||
        f.expertise.some(e => e.toLowerCase().includes(searchTerm))
    );

    renderResearchersGrid(filtered);
}


// -------------------------
function handleProposalAction(id, action) {
    alert(`${action.toUpperCase()} requested for proposal ${id}`);
}

function handleQuickAction(actionType) {
    alert(`Quick Action: ${actionType}`);
}

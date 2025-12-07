let currentUser = null;
let currentEvalProposal = null;
let selectedRating = 0;

function initCoordinatorDashboard() {
    currentUser = getFromLocalStorage('currentUser');
    
    if (!currentUser || currentUser.role !== 'Research Coordinator') {
        window.location.href = 'homepage.html';
        return;
    }
    
    loadCoordinatorStats();
    loadSubmissions();
    loadEvaluationList();
    loadUrdsList();
    loadFacultyTable();
}

function loadCoordinatorStats() {
    const pendingReview = proposals.filter(p => p.status === 'pending' && !p.endorsedDate).length;
    const endorsed = proposals.filter(p => p.status === 'endorsed').length;
    const revision = proposals.filter(p => p.status === 'revision').length;
    
    document.getElementById('pendingReview').textContent = pendingReview;
    document.getElementById('endorsedCount').textContent = endorsed;
    document.getElementById('revisionNeeded').textContent = revision;
}

function loadSubmissions() {
    const submissionsList = document.getElementById('coordinatorSubmissionsList');
    
    submissionsList.innerHTML = proposals.map(p => `
        <div class="proposal-card" data-title="${p.title.toLowerCase()}">
            <div class="proposal-header">
                <div class="proposal-info">
                    <h3>${p.title}</h3>
                    <p>${p.author}</p>
                    <p>${p.date}</p>
                </div>
                ${getStatusBadge(p.submittedToURDS ? 'submitted' : p.status)}
            </div>
        </div>
    `).join('');
}

function filterSubmissions() {
    const searchTerm = document.getElementById('searchSubmissions').value.toLowerCase();
    const cards = document.querySelectorAll('#coordinatorSubmissionsList .proposal-card');
    
    cards.forEach(card => {
        const title = card.getAttribute('data-title');
        card.style.display = title.includes(searchTerm) ? 'block' : 'none';
    });
}

function loadEvaluationList() {
    const evaluationList = document.getElementById('coordinatorEvaluationList');
    const pendingProposals = proposals.filter(p => !p.endorsedDate && p.status !== 'endorsed');
    
    if (pendingProposals.length === 0) {
        evaluationList.innerHTML = '<p style="text-align: center; color: #6b7280; padding: 2rem;">No proposals pending evaluation.</p>';
        return;
    }
    
    evaluationList.innerHTML = pendingProposals.map(p => `
        <div class="proposal-card">
            <div class="proposal-header">
                <div class="proposal-info">
                    <h3>${p.title}</h3>
                    <p>${p.author}</p>
                    <p>${p.date}</p>
                </div>
                ${getStatusBadge('pending')}
            </div>
            <button class="btn btn-primary btn-full" onclick="openEvaluationModal(${p.id})">
                Evaluate Proposal
            </button>
        </div>
    `).join('');
}

function loadUrdsList() {
    const urdsList = document.getElementById('coordinatorUrdsList');
    const endorsedProposals = proposals.filter(p => p.status === 'endorsed');
    
    if (endorsedProposals.length === 0) {
        urdsList.innerHTML = '<p style="text-align: center; color: #6b7280; padding: 2rem;">No proposals ready for URDS submission.</p>';
        return;
    }
    
    urdsList.innerHTML = endorsedProposals.map(p => `
        <div class="proposal-card">
            <h3>${p.title}</h3>
            <p>${p.author}</p>
            <p>Endorsed: ${p.endorsedDate}</p>
            <button class="btn btn-success btn-full" style="margin-top: 1rem" onclick="submitToURDS(${p.id})">
                Submit to URDS
            </button>
        </div>
    `).join('');
}

function loadFacultyTable() {
    const tableBody = document.getElementById('facultyTableBody');
    
    tableBody.innerHTML = faculty.map(f => `
        <tr>
            <td>${f.name}</td>
            <td>${f.email}</td>
            <td>${f.submissions}</td>
        </tr>
    `).join('');
}

function openEvaluationModal(proposalId) {
    currentEvalProposal = proposals.find(p => p.id === proposalId);
    selectedRating = 0;
    
    document.getElementById('evalProposalTitle').textContent = currentEvalProposal.title;
    document.getElementById('evalProposalAuthor').textContent = `by ${currentEvalProposal.author}`;
    document.getElementById('evalFeedback').value = '';
    
    // Reset stars
    document.querySelectorAll('.rating-star').forEach(star => {
        star.style.color = '#d1d5db';
    });
    
    document.getElementById('evaluationModal').classList.add('active');
}

function closeEvaluationModal() {
    document.getElementById('evaluationModal').classList.remove('active');
    currentEvalProposal = null;
    selectedRating = 0;
}

function setRating(rating) {
    selectedRating = rating;
    const stars = document.querySelectorAll('.rating-star');
    
    stars.forEach((star, index) => {
        if (index < rating) {
            star.style.color = '#fbbf24';
        } else {
            star.style.color = '#d1d5db';
        }
    });
}

function submitEvaluation() {
    if (selectedRating === 0) {
        alert('Please select a rating');
        return;
    }
    
    const feedback = document.getElementById('evalFeedback').value;
    
    if (currentEvalProposal) {
        if (selectedRating >= 4) {
            currentEvalProposal.status = 'approved';
            currentEvalProposal.feedback = feedback || 'Excellent research proposal';
        } else if (selectedRating >= 2) {
            currentEvalProposal.status = 'revision';
            currentEvalProposal.feedback = feedback || 'TWG Feedback & Suggestions';
        } else {
            currentEvalProposal.status = 'rejected';
            currentEvalProposal.feedback = feedback || 'Does not meet requirements';
        }
        
        alert('Evaluation submitted successfully!');
        closeEvaluationModal();
        initCoordinatorDashboard();
    }
}

function submitToURDS(proposalId) {
    const proposal = proposals.find(p => p.id === proposalId);
    if (proposal) {
        proposal.submittedToURDS = true;
        alert('Proposal submitted to URDS successfully!');
        initCoordinatorDashboard();
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initCoordinatorDashboard);

// Component Loader for Coordinator
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

    // Load dashboard content (default page)
    loadDashboard(); 
}

// Load dashboard page
function loadDashboard() {
    fetch('../components/coordinator-dashboard/sidebar-content/dashboard-content.html')
        .then(res => res.text())
        .then(data => {
            document.getElementById('dashboard-content-placeholder').innerHTML = data;
            initializeDashboard(); 
        })
        .catch(err => console.error('Error loading dashboard:', err));
}

// Initialize dashboard - UPDATED to match new content structure
function initializeDashboard() {
    // No need for separate metric updates in this view, as the screenshot doesn't show them.
    loadIncomingProposals();
}

function getProposalStatusBadge(status) {
    if (status === 'For Endorsement') return '<span class="status-badge endorsement">For Endorsement</span>';
    if (status === 'Pending TWG') return '<span class="status-badge pending-twg">Pending TWG</span>';
    return '<span class="status-badge endorsement">New Submission</span>';
}

function loadIncomingProposals() {
    const listContainer = document.getElementById('coordinator-proposal-list');
    if (!listContainer) return;

    // Mock data based on the screenshot (replace with your actual data source)
    const incomingProposals = [
        { id: 1, title: 'AI-Driven Traffic Management System', author: 'Engr. Damon Salvatore', dept: 'Engineering', date: 'Nov 28, 2025', status: 'For Endorsement' },
        { id: 2, title: 'Biodiversity Assessment of Mt. Apo', author: 'by Prof. Elena Gilbert', dept: 'Biology', date: 'Dec 02, 2025', status: 'Pending TWG' },
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
                <button class="btn-return" onclick="handleProposalAction(${p.id}, 'return')">
                    Return
                </button>
                <button class="btn-endorse" onclick="handleProposalAction(${p.id}, 'endorse')">
                    Endorse →
                </button>
            </div>
        </div>
    `).join('');
}

// Placeholder for handling proposal actions (Return/Endorse)
function handleProposalAction(id, action) {
    alert(`${action.toUpperCase()} action requested for proposal ID: ${id}`);
    // Implement your database/state logic here
}

// Placeholder for handling quick actions
function handleQuickAction(actionType) {
    alert(`Quick Action: ${actionType.replace('-', ' ').toUpperCase()} initiated.`);
}

// --- Navigation Switcher (Adaptation of Staff's showPage) ---
function showPage(page) {
    // Remove active class from all nav items
    const navItems = document.querySelectorAll('.sidebar .menu-item');
    navItems.forEach(item => item.classList.remove('active'));

    const clickedItem = event.currentTarget || document.querySelector(`.sidebar .menu-item[onclick*="'${page}'"]`);
    if (clickedItem) {
        clickedItem.classList.add('active');
    }

    // Handle page switching
    switch(page) {
        case 'dashboard':
            loadDashboard();
            break;
        case 'incoming-proposals':
            // If Incoming Proposals is a separate detailed view, load that component here
            loadDashboard(); // Using dashboard as a placeholder for the main list view
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

// Placeholder functions for other sidebar pages
function loadResearchersPage() {
    document.getElementById('dashboard-content-placeholder').innerHTML = 
        '<div class="dashboard-layout-split"><div class="main-list-panel"><h2>Researchers</h2><p>This page will show the list of researchers in the department.</p></div></div>';
}

function loadSettingsPage() {
    document.getElementById('dashboard-content-placeholder').innerHTML = 
        '<div class="dashboard-layout-split"><div class="main-list-panel"><h2>Settings</h2><p>Settings functionality coming soon...</p></div></div>';
}


// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    loadComponents();
});
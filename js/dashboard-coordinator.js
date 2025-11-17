let currentUser = null;
let currentEvalProposal = null;
let selectedRating = 0;

function initCoordinatorDashboard() {
    currentUser = getFromLocalStorage('currentUser');
    
    if (!currentUser || currentUser.role !== 'coordinator') {
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
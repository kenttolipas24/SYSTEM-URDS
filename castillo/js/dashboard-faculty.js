let currentUser = null;

function initFacultyDashboard() {
    currentUser = getFromLocalStorage('currentUser');
    
    if (!currentUser || currentUser.role !== 'Faculty Researcher') {
        window.location.href = 'homepage.html';
        return;
    }
    
    loadFacultyStats();
    loadFacultyProposals();
    loadFacultyRevisions();
}

function loadFacultyStats() {
    const userProposals = proposals.filter(p => p.email === currentUser.email);
    const approvedCount = userProposals.filter(p => p.status === 'approved').length;
    const pendingCount = userProposals.filter(p => p.status === 'pending').length;
    const revisionCount = userProposals.filter(p => p.status === 'revision').length;
    
    document.getElementById('totalSubmissions').textContent = userProposals.length;
    document.getElementById('approvedCount').textContent = approvedCount;
    document.getElementById('pendingCount').textContent = pendingCount;
    document.getElementById('revisionCount').textContent = revisionCount;
}

function loadFacultyProposals() {
    const userProposals = proposals.filter(p => p.email === currentUser.email);
    const proposalsList = document.getElementById('facultyProposalsList');
    
    if (userProposals.length === 0) {
        proposalsList.innerHTML = '<p style="text-align: center; color: #6b7280; padding: 2rem;">No proposals submitted yet.</p>';
        return;
    }
    
    proposalsList.innerHTML = userProposals.map(p => `
        <div class="proposal-card">
            <div class="proposal-header">
                <div class="proposal-info">
                    <h3>${p.title}</h3>
                    <p>${p.date}</p>
                </div>
                ${getStatusBadge(p.status)}
            </div>
            ${p.feedback ? `
                <div class="feedback-box ${p.status === 'revision' ? 'orange' : ''}">
                    <p>${p.status === 'approved' ? 'Feedback: ' + p.feedback : 'TWG Feedback & Suggestions'}</p>
                    ${p.status === 'revision' ? `
                        <ul>
                            <li>Strengthen the methodology section with more rigorous approach</li>
                            <li>Add recent literature from 2024-2025</li>
                            <li>Include more detailed timeline for implementation</li>
                            <li>Clarify the budget allocation</li>
                        </ul>
                    ` : ''}
                </div>
            ` : ''}
        </div>
    `).join('');
}

function loadFacultyRevisions() {
    const userProposals = proposals.filter(p => p.email === currentUser.email && p.status === 'revision');
    const revisionsList = document.getElementById('facultyRevisionsList');
    
    if (userProposals.length === 0) {
        revisionsList.innerHTML = '<p style="text-align: center; color: #6b7280; padding: 2rem;">No revisions needed.</p>';
        return;
    }
    
    revisionsList.innerHTML = userProposals.map(p => `
        <div class="proposal-card">
            <div class="proposal-header">
                <div class="proposal-info">
                    <h3>${p.title}</h3>
                    <p>Submitted: ${p.date}</p>
                </div>
                ${getStatusBadge(p.status)}
            </div>
            <div class="feedback-box orange">
                <p>TWG Feedback & Suggestions</p>
                <ul>
                    <li>Strengthen the methodology section with more rigorous approach</li>
                    <li>Add recent literature from 2024-2025</li>
                    <li>Include more detailed timeline for implementation</li>
                    <li>Clarify the budget allocation</li>
                </ul>
            </div>
        </div>
    `).join('');
}

function showSubmitForm() {
    document.getElementById('submitFormModal').classList.add('active');
}

function hideSubmitForm() {
    document.getElementById('submitFormModal').classList.remove('active');
    document.getElementById('proposalTitle').value = '';
    document.getElementById('proposalAbstract').value = '';
}

function submitProposal() {
    const title = document.getElementById('proposalTitle').value;
    const abstract = document.getElementById('proposalAbstract').value;
    
    if (!title || !abstract) {
        alert('Please fill in all required fields');
        return;
    }
    
    const newProposal = {
        id: proposals.length + 1,
        title: title,
        author: 'Dr. Alice Johnson',
        email: currentUser.email,
        date: new Date().toISOString().split('T')[0],
        status: 'pending',
        copies: 0,
        submittedToURDS: false
    };
    
    proposals.push(newProposal);
    alert('Proposal submitted successfully!');
    hideSubmitForm();
    initFacultyDashboard();
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initFacultyDashboard);
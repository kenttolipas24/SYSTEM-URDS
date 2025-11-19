let currentUser = null;
let currentEndorseProposal = null;
let currentRejectProposal = null;

function initDeanDashboard() {
    currentUser = getFromLocalStorage('currentUser');
    
    if (!currentUser || currentUser.role !== 'College Dean') {
        window.location.href = 'homepage.html';
        return;
    }
    
    loadDeanStats();
    loadEndorsements();
    loadHistory();
}

function loadDeanStats() {
    const pendingEndorsement = proposals.filter(p => p.status === 'approved' && !p.endorsedDate).length;
    const endorsed = proposals.filter(p => p.status === 'endorsed').length;
    const rejected = proposals.filter(p => p.status === 'rejected').length;
    const total = proposals.length;
    
    document.getElementById('pendingEndorsement').textContent = pendingEndorsement;
    document.getElementById('endorsedTotal').textContent = endorsed;
    document.getElementById('rejectedTotal').textContent = rejected;
    document.getElementById('totalProposals').textContent = total;
}

function loadEndorsements() {
    const endorsementsList = document.getElementById('deanEndorsementsList');
    const pendingProposals = proposals.filter(p => p.status === 'approved' && !p.endorsedDate);
    
    if (pendingProposals.length === 0) {
        endorsementsList.innerHTML = '<p style="text-align: center; color: #6b7280; padding: 2rem;">No proposals pending endorsement.</p>';
        return;
    }
    
    endorsementsList.innerHTML = pendingProposals.map(p => `
        <div class="proposal-card" data-title="${p.title.toLowerCase()}">
            <div class="proposal-header">
                <div class="proposal-info">
                    <h3>${p.title}</h3>
                    <p>${p.author}</p>
                    <p>${p.date} • Copies: ${p.copies}</p>
                </div>
                ${getStatusBadge('submitted')}
            </div>
            <div style="display: flex; gap: 1rem; margin-top: 1rem;">
                <button class="btn btn-success" style="flex: 1;" onclick="openEndorseModal(${p.id})">
                    <i class="fas fa-check"></i>
                    Endorse
                </button>
                <button class="btn" style="flex: 1; background-color: #ef4444; color: white;" onclick="openRejectModal(${p.id})">
                    <i class="fas fa-times"></i>
                    Reject
                </button>
            </div>
        </div>
    `).join('');
}

function loadHistory() {
    const historyList = document.getElementById('deanHistoryList');
    const processedProposals = proposals.filter(p => p.endorsedDate || p.status === 'rejected');
    
    if (processedProposals.length === 0) {
        historyList.innerHTML = '<p style="text-align: center; color: #6b7280; padding: 2rem;">No history available.</p>';
        return;
    }
    
    historyList.innerHTML = processedProposals.map(p => `
        <div class="proposal-card">
            <div class="proposal-header">
                <div class="proposal-info">
                    <h3>${p.title}</h3>
                    <p>${p.author}</p>
                    <p>${p.status === 'endorsed' ? 'Endorsed: ' + p.endorsedDate : 'Rejected: ' + p.date} • Copies: ${p.copies}</p>
                </div>
                ${getStatusBadge(p.status)}
            </div>
            ${p.status === 'rejected' && p.feedback ? `
                <div class="feedback-box orange">
                    <p>Rejection Reason</p>
                    <p>${p.feedback}</p>
                </div>
            ` : ''}
        </div>
    `).join('');
}

function filterEndorsements() {
    const searchTerm = document.getElementById('searchEndorsements').value.toLowerCase();
    const cards = document.querySelectorAll('#deanEndorsementsList .proposal-card');
    
    cards.forEach(card => {
        const title = card.getAttribute('data-title');
        card.style.display = title.includes(searchTerm) ? 'block' : 'none';
    });
}

function openEndorseModal(proposalId) {
    currentEndorseProposal = proposals.find(p => p.id === proposalId);
    
    document.getElementById('endorseProposalTitle').textContent = currentEndorseProposal.title;
    document.getElementById('endorseProposalAuthor').textContent = `by ${currentEndorseProposal.author}`;
    document.getElementById('endorseNotes').value = '';
    
    document.getElementById('endorseModal').classList.add('active');
}

function closeEndorseModal() {
    document.getElementById('endorseModal').classList.remove('active');
    currentEndorseProposal = null;
}

function confirmEndorsement() {
    const notes = document.getElementById('endorseNotes').value;
    
    if (currentEndorseProposal) {
        currentEndorseProposal.status = 'endorsed';
        currentEndorseProposal.endorsedDate = new Date().toISOString().split('T')[0];
        if (notes) {
            currentEndorseProposal.endorseNotes = notes;
        }
        
        alert('Proposal endorsed successfully!');
        closeEndorseModal();
        initDeanDashboard();
    }
}

function openRejectModal(proposalId) {
    currentRejectProposal = proposals.find(p => p.id === proposalId);
    
    document.getElementById('rejectProposalTitle').textContent = currentRejectProposal.title;
    document.getElementById('rejectReason').value = '';
    
    document.getElementById('rejectModal').classList.add('active');
}

function closeRejectModal() {
    document.getElementById('rejectModal').classList.remove('active');
    currentRejectProposal = null;
}

function confirmRejection() {
    const reason = document.getElementById('rejectReason').value;
    
    if (!reason) {
        alert('Please provide a reason for rejection');
        return;
    }
    
    if (currentRejectProposal) {
        currentRejectProposal.status = 'rejected';
        currentRejectProposal.feedback = reason;
        
        alert('Proposal rejected.');
        closeRejectModal();
        initDeanDashboard();
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initDeanDashboard);
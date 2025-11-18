let currentUser = null;
let currentProposal = null;
let organizationNotes = {};

function initURDSStaffDashboard() {
    currentUser = getFromLocalStorage('currentUser');
    
    if (!currentUser || currentUser.role !== 'urds-staff') {
        window.location.href = 'homepage.html';
        return;
    }
    
    loadURDSStaffStats();
    loadAllProposals();
    loadProposalsByCollege();
    loadProposalsByCommodity();
    loadInHouseReviewProposals();
    loadOrganizationNotes();
}

function loadURDSStaffStats() {
    const totalSubmissions = proposals.filter(p => p.submittedToURDS).length;
    const colleges = [...new Set(proposals.map(p => p.college))];
    const commodities = [...new Set(proposals.map(p => p.commodity))];
    const reviewReady = proposals.filter(p => p.reviewReady).length;
    
    document.getElementById('totalSubmissions').textContent = totalSubmissions;
    document.getElementById('commodityCount').textContent = commodities.length;
    document.getElementById('collegeCount').textContent = colleges.length;
    document.getElementById('reviewReadyCount').textContent = reviewReady;
}

function loadAllProposals() {
    const allProposalsList = document.getElementById('allProposalsList');
    const submittedProposals = proposals.filter(p => p.submittedToURDS);
    
    if (submittedProposals.length === 0) {
        allProposalsList.innerHTML = '<p style="text-align: center; color: #6b7280; padding: 2rem;">No proposals submitted to URDS yet.</p>';
        return;
    }
    
    allProposalsList.innerHTML = submittedProposals.map(p => `
        <div class="proposal-card" data-title="${p.title.toLowerCase()}" onclick="openProposalDetailsModal(${p.id})">
            <div class="proposal-header">
                <div class="proposal-info">
                    <h3>${p.title}</h3>
                    <p><strong>Author:</strong> ${p.author}</p>
                    <p><strong>College/Unit:</strong> ${p.college}</p>
                    <p><strong>Commodity:</strong> ${p.commodity}</p>
                    <p><strong>Submitted:</strong> ${p.date}</p>
                </div>
                ${p.reviewReady ? '<span class="badge review-ready">Review Ready</span>' : '<span class="badge organized">Organized</span>'}
            </div>
        </div>
    `).join('');
}

function filterAllProposals() {
    const searchTerm = document.getElementById('searchAllProposals').value.toLowerCase();
    const cards = document.querySelectorAll('#allProposalsList .proposal-card');
    
    cards.forEach(card => {
        const title = card.getAttribute('data-title');
        card.style.display = title.includes(searchTerm) ? 'block' : 'none';
    });
}

function loadProposalsByCollege() {
    const collegeContainer = document.getElementById('collegeContainer');
    const colleges = [...new Set(proposals.filter(p => p.submittedToURDS).map(p => p.college))];
    
    if (colleges.length === 0) {
        collegeContainer.innerHTML = '<p style="text-align: center; color: #6b7280; padding: 2rem;">No proposals organized by college yet.</p>';
        return;
    }
    
    collegeContainer.innerHTML = colleges.map(college => {
        const collegeProposals = proposals.filter(p => p.college === college && p.submittedToURDS);
        return `
            <div class="organization-group">
                <div class="organization-group-header">
                    <h3>
                        <i class="fas fa-building"></i>
                        ${college}
                    </h3>
                    <span>${collegeProposals.length} proposal${collegeProposals.length !== 1 ? 's' : ''}</span>
                </div>
                <div class="organization-group-content">
                    ${collegeProposals.map(p => `
                        <div class="group-proposal-item" onclick="openProposalDetailsModal(${p.id})">
                            <div class="group-proposal-info">
                                <h4>${p.title}</h4>
                                <p>${p.author}</p>
                                <p><strong>Commodity:</strong> ${p.commodity}</p>
                            </div>
                            ${p.reviewReady ? '<span class="badge review-ready" style="white-space: nowrap;">Review Ready</span>' : '<span class="badge organized" style="white-space: nowrap;">Organized</span>'}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }).join('');
}

function loadProposalsByCommodity() {
    const commodityContainer = document.getElementById('commodityContainer');
    const commodities = [...new Set(proposals.filter(p => p.submittedToURDS).map(p => p.commodity))];
    
    if (commodities.length === 0) {
        commodityContainer.innerHTML = '<p style="text-align: center; color: #6b7280; padding: 2rem;">No proposals organized by commodity yet.</p>';
        return;
    }
    
    commodityContainer.innerHTML = commodities.map(commodity => {
        const commodityProposals = proposals.filter(p => p.commodity === commodity && p.submittedToURDS);
        return `
            <div class="organization-group">
                <div class="organization-group-header">
                    <h3>
                        <i class="fas fa-tag"></i>
                        ${commodity}
                    </h3>
                    <span>${commodityProposals.length} proposal${commodityProposals.length !== 1 ? 's' : ''}</span>
                </div>
                <div class="organization-group-content">
                    ${commodityProposals.map(p => `
                        <div class="group-proposal-item" onclick="openProposalDetailsModal(${p.id})">
                            <div class="group-proposal-info">
                                <h4>${p.title}</h4>
                                <p>${p.author}</p>
                                <p><strong>College/Unit:</strong> ${p.college}</p>
                            </div>
                            ${p.reviewReady ? '<span class="badge review-ready" style="white-space: nowrap;">Review Ready</span>' : '<span class="badge organized" style="white-space: nowrap;">Organized</span>'}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }).join('');
}

function loadInHouseReviewProposals() {
    const reviewProposalsList = document.getElementById('reviewProposalsList');
    const reviewProposals = proposals.filter(p => p.reviewReady && p.submittedToURDS);
    
    if (reviewProposals.length === 0) {
        reviewProposalsList.innerHTML = '<p style="text-align: center; color: #6b7280; padding: 2rem;">No proposals ready for in-house review yet.</p>';
        return;
    }
    
    reviewProposalsList.innerHTML = reviewProposals.map(p => `
        <div class="proposal-card" data-title="${p.title.toLowerCase()}" onclick="openProposalDetailsModal(${p.id})">
            <div class="proposal-header">
                <div class="proposal-info">
                    <h3>${p.title}</h3>
                    <p><strong>Author:</strong> ${p.author}</p>
                    <p><strong>College/Unit:</strong> ${p.college}</p>
                    <p><strong>Commodity:</strong> ${p.commodity}</p>
                    <p><strong>Submitted:</strong> ${p.date}</p>
                </div>
                <span class="badge review-ready">Review Ready</span>
            </div>
        </div>
    `).join('');
}

function filterReviewProposals() {
    const searchTerm = document.getElementById('searchReview').value.toLowerCase();
    const cards = document.querySelectorAll('#reviewProposalsList .proposal-card');
    
    cards.forEach(card => {
        const title = card.getAttribute('data-title');
        card.style.display = title.includes(searchTerm) ? 'block' : 'none';
    });
}

function openProposalDetailsModal(proposalId) {
    currentProposal = proposals.find(p => p.id === proposalId);
    
    if (!currentProposal) return;
    
    document.getElementById('detailTitle').textContent = currentProposal.title;
    document.getElementById('detailAuthor').textContent = currentProposal.author;
    document.getElementById('detailCollege').textContent = currentProposal.college;
    document.getElementById('detailCommodity').textContent = currentProposal.commodity;
    document.getElementById('detailDate').textContent = currentProposal.date;
    document.getElementById('detailStatus').textContent = currentProposal.reviewReady ? 'Ready for In-House Review' : 'Organized';
    
    const notes = organizationNotes[proposalId] || '';
    document.getElementById('organizationNotes').value = notes;
    
    const markReviewBtn = document.getElementById('markReviewBtn');
    markReviewBtn.textContent = currentProposal.reviewReady ? 'Already Review Ready' : 'Mark for In-House Review';
    markReviewBtn.disabled = currentProposal.reviewReady;
    
    document.getElementById('proposalDetailsModal').classList.add('active');
}

function closeProposalDetailsModal() {
    document.getElementById('proposalDetailsModal').classList.remove('active');
    currentProposal = null;
}

function saveOrganizationNotes() {
    if (!currentProposal) return;
    
    const notes = document.getElementById('organizationNotes').value;
    organizationNotes[currentProposal.id] = notes;
    saveToLocalStorage('organizationNotes', organizationNotes);
    
    alert('Organization notes saved successfully!');
}

function loadOrganizationNotes() {
    const saved = getFromLocalStorage('organizationNotes');
    if (saved) {
        organizationNotes = saved;
    }
}

function markForInHouseReview() {
    if (!currentProposal) return;
    
    const proposal = proposals.find(p => p.id === currentProposal.id);
    if (proposal) {
        proposal.reviewReady = true;
        
        const notes = document.getElementById('organizationNotes').value;
        if (notes) {
            organizationNotes[proposal.id] = notes;
            saveToLocalStorage('organizationNotes', organizationNotes);
        }
        
        alert(`Proposal "${proposal.title}" has been marked as ready for IN-HOUSE REVIEW!`);
        closeProposalDetailsModal();
        
        // Reload all views
        loadURDSStaffStats();
        loadAllProposals();
        loadProposalsByCollege();
        loadProposalsByCommodity();
        loadInHouseReviewProposals();
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initURDSStaffDashboard);

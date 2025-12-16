// Current page state
let currentPage = 'proposals';

// Load components
function loadComponents() {
    // Load sidebar
    fetch('../components/researcher-sidebar.html')
        .then(res => res.text())
        .then(data => {
            document.getElementById('sidebar-placeholder').innerHTML = data;
            // Attach navigation handlers after sidebar loads
            attachNavigationHandlers();
        })
        .catch(err => console.error('Error loading sidebar:', err));

    // Load header
    fetch('../components/researcher-header.html')
        .then(res => res.text())
        .then(data => {
            document.getElementById('header-placeholder').innerHTML = data;
            // Initialize search after header loads
            initializeSearch();
        })
        .catch(err => console.error('Error loading header:', err));

    // Load initial page (proposals)
    showPage('proposals');
}

// Attach navigation handlers to sidebar items
function attachNavigationHandlers() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const page = this.getAttribute('data-page');
            if (page) {
                showPage(page);
            }
        });
    });

    // Attach logout handler
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', PagesLogout);
    }
}

// Initialize search functionality
function initializeSearch() {
    const headerSearch = document.getElementById('header-search');
    if (headerSearch) {
        headerSearch.addEventListener('input', function(e) {
            // Add search functionality here
            console.log('Searching:', e.target.value);
        });
    }
}

// Initialize proposals page
function initializeProposals() {
    // Load proposals from data
    loadProposalsTable();
    
    const proposalsSearch = document.getElementById('proposals-search');
    if (proposalsSearch) {
        proposalsSearch.addEventListener('input', function(e) {
            filterProposals(e.target.value);
        });
    }

    const submitBtn = document.getElementById('btn-submit-proposal');
    if (submitBtn) {
        submitBtn.addEventListener('click', function() {
            showPage('create-proposal');
        });
    }

    // Status filter
    const statusFilter = document.getElementById('status-filter');
    if (statusFilter) {
        statusFilter.addEventListener('change', function(e) {
            filterByStatus(e.target.value);
        });
    }

    // Filter button
    const filterBtn = document.getElementById('btn-filter');
    if (filterBtn) {
        filterBtn.addEventListener('click', function() {
            // Toggle advanced filters if needed
            console.log('Advanced filters');
        });
    }

    // Export button
    const exportBtn = document.getElementById('btn-export');
    if (exportBtn) {
        exportBtn.addEventListener('click', function() {
            exportProposals();
        });
    }

    // Attach action button handlers
    attachActionHandlers();

    // Initialize modals
    initializeModals();
}

// Load proposals table from data
function loadProposalsTable() {
    const tbody = document.getElementById('proposals-tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    researcherData.proposals.forEach(proposal => {
        const row = document.createElement('tr');
        row.setAttribute('data-status', proposal.status);
        row.setAttribute('data-phase', proposal.phase);
        row.setAttribute('data-proposal-id', proposal.id);
        
        const phaseLabels = {
            1: { badge: 'Phase 1', label: 'Initial Proposal' },
            2: { badge: 'Phase 2', label: 'Review & Approval' },
            3: { badge: 'Phase 3', label: 'Implementation' }
        };
        
        const phaseInfo = phaseLabels[proposal.phase] || { badge: '', label: '' };
        
        row.innerHTML = `
            <td>
                <div class="proposal-info">
                    <div class="proposal-title">${proposal.title}</div>
                    <div class="proposal-id">${proposal.id}</div>
                </div>
            </td>
            <td>
                <div class="phase-indicator">
                    <span class="phase-badge phase-${proposal.phase}">${phaseInfo.badge}</span>
                    <span class="phase-label">${phaseInfo.label}</span>
                </div>
            </td>
            <td>${formatDate(proposal.submissionDate)}</td>
            <td class="budget-cell">P ${proposal.budget.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
            <td>
                <span class="status-badge status-${proposal.status}">${getStatusLabel(proposal.status)}</span>
            </td>
            <td>
                <div class="action-buttons">
                    ${getActionButtons(proposal)}
                </div>
            </td>
        `;
        
        tbody.appendChild(row);
    });
    
    // Re-attach handlers after loading
    setTimeout(() => attachActionHandlers(), 100);
}

function getActionButtons(proposal) {
    let buttons = '';
    
    // View button (always available)
    buttons += `<button class="action-btn view-btn" data-proposal-id="${proposal.id}">
        <i class="fas fa-eye"></i> View
    </button>`;
    
    // Revision button
    if (proposal.status === 'revision') {
        buttons += `<button class="action-btn revision-btn" data-proposal-id="${proposal.id}">
            <i class="fas fa-edit"></i> Revise
        </button>`;
    }
    
    // Proceed button
    if (proposal.status === 'notice-proceed') {
        buttons += `<button class="action-btn proceed-btn" data-proposal-id="${proposal.id}">
            <i class="fas fa-play"></i> Start Research
        </button>`;
    }
    
    // Monitor/Progress button
    if (proposal.status === 'implementing' || proposal.status === 'monitoring') {
        buttons += `<button class="action-btn monitor-btn" data-proposal-id="${proposal.id}">
            <i class="fas fa-chart-line"></i> Progress
        </button>`;
        buttons += `<button class="action-btn purchase-btn" data-proposal-id="${proposal.id}">
            <i class="fas fa-shopping-cart"></i> Purchase
        </button>`;
    }
    
    // Complete button
    if (proposal.status === 'monitoring') {
        buttons += `<button class="action-btn complete-btn" data-proposal-id="${proposal.id}">
            <i class="fas fa-check-circle"></i> Submit Completion
        </button>`;
        buttons += `<button class="action-btn extension-btn" data-proposal-id="${proposal.id}">
            <i class="fas fa-clock"></i> Request Extension
        </button>`;
    }
    
    // Download button
    if (proposal.status === 'completed') {
        buttons += `<button class="action-btn download-btn" data-proposal-id="${proposal.id}">
            <i class="fas fa-download"></i> Download
        </button>`;
    }
    
    return buttons;
}

// Attach handlers to action buttons
function attachActionHandlers() {
    // View buttons
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const proposalId = this.getAttribute('data-proposal-id');
            showProposalDetails(proposalId);
        });
    });

    // Revision buttons
    document.querySelectorAll('.revision-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const proposalId = this.getAttribute('data-proposal-id');
            showRevisionModal(proposalId);
        });
    });

    // Proceed buttons
    document.querySelectorAll('.proceed-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const proposalId = this.getAttribute('data-proposal-id');
            startResearch(proposalId);
        });
    });

    // Monitor buttons
    document.querySelectorAll('.monitor-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const proposalId = this.getAttribute('data-proposal-id');
            showProgressTracking(proposalId);
        });
    });

    // Purchase buttons
    document.querySelectorAll('.purchase-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const proposalId = this.getAttribute('data-proposal-id');
            showPage('purchase');
            // Pre-select the proposal in purchase form
            setTimeout(() => {
                const projectSelect = document.getElementById('project-select');
                if (projectSelect) {
                    // Find and select the proposal
                    const options = Array.from(projectSelect.options);
                    const option = options.find(opt => opt.text.includes(proposalId));
                    if (option) {
                        projectSelect.value = option.value;
                    }
                }
            }, 100);
        });
    });

    // Complete buttons
    document.querySelectorAll('.complete-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const proposalId = this.getAttribute('data-proposal-id');
            showCompletionModal(proposalId);
        });
    });

    // Extension buttons
    document.querySelectorAll('.extension-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const proposalId = this.getAttribute('data-proposal-id');
            showExtensionModal(proposalId);
        });
    });

    // Download buttons
    document.querySelectorAll('.download-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const proposalId = this.getAttribute('data-proposal-id');
            downloadProposal(proposalId);
        });
    });
}

// Filter proposals based on search
function filterProposals(searchTerm) {
    const rows = document.querySelectorAll('#proposals-tbody tr');
    const term = searchTerm.toLowerCase();

    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        if (text.includes(term)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// Filter by status
function filterByStatus(status) {
    const rows = document.querySelectorAll('#proposals-tbody tr');
    
    rows.forEach(row => {
        if (!status || row.getAttribute('data-status') === status) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// Show proposal details modal
function showProposalDetails(proposalId) {
    const modal = document.getElementById('proposal-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');

    const proposal = getProposalById(proposalId);
    if (!proposal) return;

    modalTitle.textContent = proposal.title;
    
    // Generate workflow progress based on phase and status
    const workflowHTML = generateWorkflowProgress(proposal.phase, proposal.status);
    
    const objectivesHTML = proposal.objectives.map(obj => `<li>${obj}</li>`).join('');

    modalBody.innerHTML = `
        <div class="proposal-details">
            <div class="form-group">
                <label class="form-label">Proposal ID</label>
                <div class="form-control" style="background: #f8f9fa;">${proposal.id}</div>
            </div>
            <div class="form-group">
                <label class="form-label">Status</label>
                <div><span class="status-badge status-${proposal.status}">${getStatusLabel(proposal.status)}</span></div>
            </div>
            <div class="form-group">
                <label class="form-label">Phase</label>
                <div class="phase-indicator">
                    <span class="phase-badge phase-${proposal.phase}">Phase ${proposal.phase}</span>
                </div>
            </div>
            <div class="form-group">
                <label class="form-label">Submission Date</label>
                <div class="form-control" style="background: #f8f9fa;">${formatDate(proposal.submissionDate)}</div>
            </div>
            <div class="form-group">
                <label class="form-label">Budget</label>
                <div class="form-control" style="background: #f8f9fa;">P ${proposal.budget.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            </div>
            <div class="form-group">
                <label class="form-label">Timeline</label>
                <div class="form-control" style="background: #f8f9fa;">
                    ${formatDate(proposal.timeline.start)} - ${formatDate(proposal.timeline.end)} (${proposal.timeline.duration})
                </div>
            </div>
            ${workflowHTML}
            <div class="form-group">
                <label class="form-label">Abstract</label>
                <div class="form-control textarea-control" style="background: #f8f9fa; min-height: 80px;">
                    ${proposal.abstract}
                </div>
            </div>
            <div class="form-group">
                <label class="form-label">Objectives</label>
                <ul style="margin: 0; padding-left: 20px;">
                    ${objectivesHTML}
                </ul>
            </div>
            <div class="form-group">
                <label class="form-label">Methodology</label>
                <div class="form-control textarea-control" style="background: #f8f9fa; min-height: 80px;">
                    ${proposal.methodology}
                </div>
            </div>
        </div>
    `;

    modal.classList.add('show');
}

// Generate workflow progress indicator
function generateWorkflowProgress(phase, status) {
    const phases = [
        { num: 1, label: 'Initial Proposal', steps: ['Call for Proposal', 'Submission', 'TWG Evaluation', 'Revision', 'Endorsement'] },
        { num: 2, label: 'Review & Approval', steps: ['In-House Review', 'UREC Review', 'BOR Approval', 'Special Order', 'Notice to Proceed'] },
        { num: 3, label: 'Implementation', steps: ['Implementation', 'Monitoring', 'Completion', 'In-House Review', 'Final Evaluation'] }
    ];

    const currentPhase = phases[parseInt(phase) - 1];
    if (!currentPhase) return '';

    // Determine current step based on status
    let currentStep = 0;
    const statusMap = {
        'pending-twg': 2,
        'revision': 3,
        'endorsed': 4,
        'inhouse': 0,
        'urec': 1,
        'bor': 2,
        'notice-proceed': 4,
        'implementing': 0,
        'monitoring': 1,
        'completed': 2
    };

    currentStep = statusMap[status] || 0;

    let stepsHTML = '<div class="workflow-progress"><div class="workflow-steps">';
    
    currentPhase.steps.forEach((step, index) => {
        const isCompleted = index < currentStep;
        const isActive = index === currentStep;
        const stepClass = isCompleted ? 'completed' : (isActive ? 'active' : '');
        
        stepsHTML += `
            <div class="workflow-step">
                <div class="step-circle ${stepClass}">${index + 1}</div>
                <div class="step-label">${step}</div>
            </div>
        `;
    });

    stepsHTML += '</div></div>';
    return stepsHTML;
}

// Initialize modals
function initializeModals() {
    // Close modals when clicking X
    document.querySelectorAll('.modal-close, .modal-cancel').forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                modal.classList.remove('show');
            }
        });
    });

    // Close modals when clicking outside
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('show');
            }
        });
    });

    // Revision form submission
    const revisionForm = document.getElementById('revision-form');
    if (revisionForm) {
        revisionForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleRevisionSubmission(this);
        });
    }

    // Extension form submission
    const extensionForm = document.getElementById('extension-form');
    if (extensionForm) {
        extensionForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleExtensionRequest(this);
        });
    }

    // Completion form submission
    const completionForm = document.getElementById('completion-form');
    if (completionForm) {
        completionForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleCompletionSubmission(this);
        });
    }
}

// Show revision modal
function showRevisionModal(proposalId) {
    const modal = document.getElementById('revision-modal');
    const form = document.getElementById('revision-form');
    
    if (form) {
        form.setAttribute('data-proposal-id', proposalId);
    }
    
    modal.classList.add('show');
}

// Handle revision submission
function handleRevisionSubmission(form) {
    const proposalId = form.getAttribute('data-proposal-id');
    const formData = new FormData(form);
    
    // Simulate submission
    console.log('Submitting revision for:', proposalId);
    
    // Show success message
    alert('Revised proposal submitted successfully! It will be reviewed by the TWG.');
    
    // Close modal
    document.getElementById('revision-modal').classList.remove('show');
    
    // Reset form
    form.reset();
    
    // In a real application, update the proposal status here
    // updateProposalStatus(proposalId, 'pending-twg');
}

// Show extension modal
function showExtensionModal(proposalId) {
    const modal = document.getElementById('extension-modal');
    const form = document.getElementById('extension-form');
    
    if (form) {
        form.setAttribute('data-proposal-id', proposalId);
    }
    
    modal.classList.add('show');
}

// Handle extension request
function handleExtensionRequest(form) {
    const proposalId = form.getAttribute('data-proposal-id');
    const newDeadline = document.getElementById('new-deadline').value;
    const justification = form.querySelector('textarea').value;
    
    if (!newDeadline || !justification) {
        alert('Please fill in all required fields.');
        return;
    }
    
    // Simulate submission
    console.log('Extension request for:', proposalId, 'New deadline:', newDeadline);
    
    // Show success message
    alert('Extension request submitted! It will be reviewed by the URDS Director through proper channels.');
    
    // Close modal
    document.getElementById('extension-modal').classList.remove('show');
    
    // Reset form
    form.reset();
}

// Show completion modal
function showCompletionModal(proposalId) {
    const modal = document.getElementById('completion-modal');
    const form = document.getElementById('completion-form');
    
    if (form) {
        form.setAttribute('data-proposal-id', proposalId);
    }
    
    modal.classList.add('show');
}

// Handle completion submission
function handleCompletionSubmission(form) {
    const proposalId = form.getAttribute('data-proposal-id');
    const formData = new FormData(form);
    
    // Simulate submission
    console.log('Submitting completion for:', proposalId);
    
    // Show success message
    alert('Completed research submitted successfully! It will be scheduled for In-House Review.');
    
    // Close modal
    document.getElementById('completion-modal').classList.remove('show');
    
    // Reset form
    form.reset();
    
    // In a real application, update the proposal status here
    // updateProposalStatus(proposalId, 'completed');
}

// Start research (Notice to Proceed)
function startResearch(proposalId) {
    if (confirm('Are you ready to start implementing this research? This will mark it as "Implementing".')) {
        console.log('Starting research:', proposalId);
        // In a real application, update status to 'implementing'
        alert('Research implementation started! You can now request purchases and track progress.');
    }
}

// Show progress tracking
function showProgressTracking(proposalId) {
    alert(`Progress tracking for ${proposalId}\n\nThis feature will show:\n- Research timeline\n- Milestones achieved\n- Monitoring reports\n- Purchase requests status`);
    // In a full implementation, this would open a detailed progress dashboard
}

// Download proposal
function downloadProposal(proposalId) {
    console.log('Downloading proposal:', proposalId);
    // In a real application, this would trigger a file download
    alert(`Downloading proposal documents for ${proposalId}...`);
}

// Export proposals
function exportProposals() {
    console.log('Exporting proposals...');
    // In a real application, this would generate and download a CSV/Excel file
    alert('Exporting proposals to CSV...');
}

// Show page function (for navigation)
function showPage(page) {
    currentPage = page;
    
    // Update active nav item
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.classList.remove('active');
        const dataPage = item.getAttribute('data-page');
        if (dataPage === page) {
            item.classList.add('active');
        }
    });

    // Map page names to component files
    const pageComponents = {
        'dashboard': '../components/dashboard-content.html',
        'proposals': '../components/research-proposals-content.html',
        'create-proposal': '../components/create-proposal-content.html',
        'comments': '../components/comments-content.html',
        'revision-history': '../components/revision-history-content.html',
        'notifications': '../components/notifications-content.html',
        'monitoring': '../components/monitoring-content.html',
        'purchase': '../components/purchase-request-content.html',
        'extension': '../components/extension-content.html',
        'final-upload': '../components/final-upload-content.html',
        'documentation': '../components/documentation-content.html',
        'dissemination': '../components/dissemination-content.html',
        'calls': '../components/call-for-proposals-content.html'
    };

    const componentPath = pageComponents[page];
    if (!componentPath) {
        console.error('Unknown page:', page);
        return;
    }

    // Load the appropriate component
    fetch(componentPath)
        .then(res => res.text())
        .then(data => {
            document.getElementById('content-placeholder').innerHTML = data;
            
            // Small delay to ensure DOM is ready
            setTimeout(() => {
                // Initialize page-specific functionality
                switch(page) {
                    case 'dashboard':
                        initializeDashboard();
                        break;
                    case 'proposals':
                        initializeProposals();
                        break;
                    case 'create-proposal':
                        initializeCreateProposal();
                        break;
                    case 'comments':
                        initializeComments();
                        break;
                    case 'revision-history':
                        initializeRevisionHistory();
                        break;
                    case 'notifications':
                        initializeNotifications();
                        break;
                    case 'monitoring':
                        initializeMonitoring();
                        break;
                    case 'purchase':
                        initializePurchase();
                        break;
                    case 'extension':
                        initializeExtension();
                        break;
                    case 'final-upload':
                        initializeFinalUpload();
                        break;
                    case 'documentation':
                        initializeDocumentation();
                        break;
                    case 'dissemination':
                        initializeDissemination();
                        break;
                    case 'calls':
                        initializeCalls();
                        break;
                }
            }, 100);
        })
        .catch(err => console.error(`Error loading ${page} content:`, err));
}

// Logout function
function PagesLogout() {
    if (confirm('Are you sure you want to logout?')) {
        // Add logout logic here
        console.log('Logging out...');
        // window.location.href = '../index.php';
    }
}

// Initialize dashboard page
function initializeDashboard() {
    loadDashboardMetrics();
    loadDashboardSubmissions();
    loadDashboardCalls();
    
    const newProposalBtn = document.querySelector('.dashboard-content .btn-primary');
    if (newProposalBtn && newProposalBtn.textContent.includes('New Proposal')) {
        newProposalBtn.addEventListener('click', function() {
            showPage('create-proposal');
        });
    }

    // Handle dashboard action buttons
    document.querySelectorAll('[data-action]').forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.getAttribute('data-action');
            const proposalId = this.getAttribute('data-proposal-id');
            
            if (action === 'revision') {
                showPage('proposals');
                setTimeout(() => {
                    const revisionBtn = document.querySelector(`.revision-btn[data-proposal-id="${proposalId}"]`);
                    if (revisionBtn) revisionBtn.click();
                }, 200);
            } else if (action === 'monitor') {
                showPage('proposals');
                setTimeout(() => {
                    const monitorBtn = document.querySelector(`.monitor-btn[data-proposal-id="${proposalId}"]`);
                    if (monitorBtn) monitorBtn.click();
                }, 200);
            }
        });
    });
}

function loadDashboardMetrics() {
    const phase1Count = getProposalsByPhase(1).length;
    const phase2Count = getProposalsByPhase(2).length;
    const phase3Count = getProposalsByPhase(3).length;
    const completedCount = getProposalsByStatus('completed').length;
    
    const metrics = document.querySelectorAll('.metric-value');
    if (metrics.length >= 4) {
        metrics[0].textContent = phase1Count;
        metrics[1].textContent = phase2Count;
        metrics[2].textContent = phase3Count;
        metrics[3].textContent = completedCount;
    }
}

function loadDashboardSubmissions() {
    const container = document.querySelector('.submissions-list');
    if (!container) return;
    
    // Get recent proposals (last 3)
    const recentProposals = researcherData.proposals
        .sort((a, b) => new Date(b.submissionDate) - new Date(a.submissionDate))
        .slice(0, 3);
    
    container.innerHTML = '';
    
    recentProposals.forEach(proposal => {
        const item = document.createElement('div');
        item.className = 'submission-item';
        
        const phaseLabels = {
            1: 'Phase 1',
            2: 'Phase 2',
            3: 'Phase 3'
        };
        
        let actionButton = '';
        if (proposal.status === 'revision') {
            actionButton = `<button class="btn-secondary btn-icon" data-action="revision" data-proposal-id="${proposal.id}">
                <i class="fas fa-edit"></i>
                <span>Submit Revision</span>
            </button>`;
        } else if (proposal.status === 'implementing' || proposal.status === 'monitoring') {
            actionButton = `<button class="btn-primary btn-icon" data-action="monitor" data-proposal-id="${proposal.id}">
                <i class="fas fa-chart-line"></i>
                <span>Track Progress</span>
            </button>`;
        } else {
            actionButton = `<button class="btn-secondary" onclick="showPage('proposals')">View Status</button>`;
        }
        
        item.innerHTML = `
            <div class="submission-info">
                <h3>${proposal.title}</h3>
                <p>${proposal.id} • ${formatDate(proposal.submissionDate)} • ${phaseLabels[proposal.phase]}</p>
                <span class="status-badge status-${proposal.status}">${getStatusLabel(proposal.status)}</span>
            </div>
            ${actionButton}
        `;
        
        container.appendChild(item);
    });
}

function loadDashboardCalls() {
    // In real app, load from API
    // For now, keep existing static content
}

// Initialize calls page
function initializeCalls() {
    const submitButtons = document.querySelectorAll('.calls-page .btn-primary');
    submitButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Navigate to submit proposal form
            console.log('Navigate to submit proposal form');
            // You can add modal or navigation logic here
        });
    });
}

// Initialize purchase page
function initializePurchase() {
    const purchaseForm = document.getElementById('purchase-form');
    if (purchaseForm) {
        purchaseForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const proposalId = document.getElementById('project-select').value;
            const itemName = document.getElementById('item-name').value;
            const quantity = document.getElementById('quantity').value;
            const cost = document.getElementById('estimated-cost').value;
            const justification = document.getElementById('justification').value;
            
            // In real app, save to data
            alert('Purchase request submitted successfully!');
            purchaseForm.reset();
        });
    }
    
    // Load proposals into dropdown
    loadProposalsForSelect('project-select', { status: ['implementing', 'monitoring', 'notice-proceed'] });
}

// Initialize Create Proposal page
function initializeCreateProposal() {
    const form = document.getElementById('create-proposal-form');
    const addObjectiveBtn = document.getElementById('add-objective');
    const objectivesContainer = document.getElementById('objectives-container');
    
    if (addObjectiveBtn) {
        addObjectiveBtn.addEventListener('click', function() {
            const newObjective = document.createElement('div');
            newObjective.className = 'objective-item';
            newObjective.innerHTML = `
                <div class="form-group">
                    <div class="input-group">
                        <input type="text" class="form-control objective-input" placeholder="Enter objective" required>
                        <button type="button" class="btn-icon remove-objective">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>
            `;
            objectivesContainer.appendChild(newObjective);
            
            // Show remove buttons if more than one
            updateObjectiveButtons();
        });
    }
    
    // Remove objective
    document.addEventListener('click', function(e) {
        if (e.target.closest('.remove-objective')) {
            e.target.closest('.objective-item').remove();
            updateObjectiveButtons();
        }
    });
    
    function updateObjectiveButtons() {
        const items = objectivesContainer.querySelectorAll('.objective-item');
        items.forEach(item => {
            const removeBtn = item.querySelector('.remove-objective');
            if (removeBtn) {
                removeBtn.style.display = items.length > 1 ? 'block' : 'none';
            }
        });
    }
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(form);
            // In real app, save proposal
            alert('Proposal submitted successfully! It will be reviewed by the TWG.');
            form.reset();
            showPage('proposals');
        });
    }
    
    // Save draft
    const saveDraftBtn = document.getElementById('save-draft');
    if (saveDraftBtn) {
        saveDraftBtn.addEventListener('click', function() {
            alert('Draft saved successfully!');
        });
    }
}

// Initialize Comments page
function initializeComments() {
    loadComments();
    
    const proposalFilter = document.getElementById('comments-proposal-filter');
    const typeFilter = document.getElementById('comments-type-filter');
    
    if (proposalFilter) {
        loadProposalsForSelect('comments-proposal-filter');
        proposalFilter.addEventListener('change', loadComments);
    }
    
    if (typeFilter) {
        typeFilter.addEventListener('change', loadComments);
    }
}

function loadComments() {
    const container = document.getElementById('comments-container');
    if (!container) return;
    
    const proposalFilter = document.getElementById('comments-proposal-filter')?.value;
    const typeFilter = document.getElementById('comments-type-filter')?.value;
    
    container.innerHTML = '';
    
    let allComments = [];
    
    // Collect all comments
    Object.keys(researcherData.comments).forEach(proposalId => {
        if (proposalFilter && proposalId !== proposalFilter) return;
        
        const comments = getCommentsForProposal(proposalId);
        comments.forEach(comment => {
            if (typeFilter && comment.type !== typeFilter) return;
            
            const proposal = getProposalById(proposalId);
            allComments.push({ ...comment, proposalId, proposalTitle: proposal?.title || proposalId });
        });
    });
    
    // Sort by date
    allComments.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    const template = document.getElementById('comment-card-template');
    
    allComments.forEach(comment => {
        const card = template.content.cloneNode(true);
        card.querySelector('.author-name').textContent = comment.from;
        card.querySelector('.author-role').textContent = comment.fromRole;
        card.querySelector('.comment-date').textContent = formatDate(comment.date);
        card.querySelector('.comment-message').textContent = comment.message;
        card.querySelector('.proposal-link').textContent = comment.proposalTitle;
        
        const typeBadge = card.querySelector('.comment-type-badge');
        typeBadge.className = `comment-type-badge status-${comment.type}`;
        typeBadge.textContent = comment.type.charAt(0).toUpperCase() + comment.type.slice(1);
        
        if (comment.attachments && comment.attachments.length > 0) {
            const attachmentsDiv = card.querySelector('.comment-attachments');
            attachmentsDiv.style.display = 'flex';
            attachmentsDiv.querySelector('.attachment-link').textContent = comment.attachments[0];
        }
        
        container.appendChild(card);
    });
    
    if (allComments.length === 0) {
        container.innerHTML = '<p class="empty-state">No comments found.</p>';
    }
}

// Initialize Revision History page
function initializeRevisionHistory() {
    loadRevisionHistory();
    
    const proposalFilter = document.getElementById('revision-proposal-filter');
    if (proposalFilter) {
        loadProposalsForSelect('revision-proposal-filter');
        proposalFilter.addEventListener('change', loadRevisionHistory);
    }
}

function loadRevisionHistory() {
    const container = document.getElementById('revision-container');
    if (!container) return;
    
    const proposalFilter = document.getElementById('revision-proposal-filter')?.value;
    
    container.innerHTML = '';
    
    let proposals = researcherData.proposals;
    if (proposalFilter) {
        proposals = proposals.filter(p => p.id === proposalFilter);
    }
    
    const template = document.getElementById('revision-item-template');
    
    proposals.forEach(proposal => {
        const item = template.content.cloneNode(true);
        item.querySelector('.revision-proposal-title').textContent = proposal.title;
        item.querySelector('.revision-version').textContent = `Version ${proposal.version}`;
        item.querySelector('.revision-date').textContent = formatDate(proposal.submissionDate);
        item.querySelector('.revision-researcher').textContent = proposal.researcher;
        
        const statusBadge = item.querySelector('.revision-status-badge');
        statusBadge.className = `revision-status-badge status-badge status-${proposal.status}`;
        statusBadge.textContent = getStatusLabel(proposal.status);
        
        container.appendChild(item);
    });
    
    if (proposals.length === 0) {
        container.innerHTML = '<p class="empty-state">No revision history found.</p>';
    }
}

// Initialize Notifications page
function initializeNotifications() {
    loadNotifications();
    
    const typeFilter = document.getElementById('notifications-type-filter');
    const showReadOnly = document.getElementById('show-read-only');
    
    if (typeFilter) {
        typeFilter.addEventListener('change', loadNotifications);
    }
    
    if (showReadOnly) {
        showReadOnly.addEventListener('change', loadNotifications);
    }
    
    const markAllReadBtn = document.getElementById('mark-all-read');
    if (markAllReadBtn) {
        markAllReadBtn.addEventListener('click', function() {
            researcherData.notifications.forEach(n => n.read = true);
            updateNotificationBadge();
            loadNotifications();
        });
    }
}

function loadNotifications() {
    const container = document.getElementById('notifications-container');
    if (!container) return;
    
    const typeFilter = document.getElementById('notifications-type-filter')?.value;
    const showReadOnly = document.getElementById('show-read-only')?.checked;
    
    let notifications = getNotifications(showReadOnly);
    
    if (typeFilter) {
        notifications = notifications.filter(n => n.type === typeFilter);
    }
    
    // Sort by date (newest first)
    notifications.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    container.innerHTML = '';
    
    const template = document.getElementById('notification-item-template');
    
    notifications.forEach(notification => {
        const item = template.content.cloneNode(true);
        item.querySelector('.notification-title').textContent = notification.title;
        item.querySelector('.notification-message').textContent = notification.message;
        item.querySelector('.notification-date').textContent = formatDate(notification.date);
        
        const proposal = getProposalById(notification.proposalId);
        item.querySelector('.notification-proposal-link').textContent = proposal?.title || notification.proposalId;
        
        const icon = item.querySelector('.notification-icon');
        icon.className = `notification-icon ${getNotificationIcon(notification.type)}`;
        
        if (!notification.read) {
            item.querySelector('.unread-indicator').style.display = 'block';
            item.querySelector('.notification-item').classList.add('unread');
        }
        
        const viewBtn = item.querySelector('.view-notification-btn');
        viewBtn.addEventListener('click', function() {
            notification.read = true;
            updateNotificationBadge();
            showPage('proposals');
        });
        
        container.appendChild(item);
    });
    
    if (notifications.length === 0) {
        container.innerHTML = '<p class="empty-state">No notifications found.</p>';
    }
}

function getNotificationIcon(type) {
    const icons = {
        'status-change': 'fa-info-circle',
        'revision': 'fa-edit',
        'approval': 'fa-check-circle',
        'comment': 'fa-comment',
        'monitoring': 'fa-chart-line'
    };
    return icons[type] || 'fa-bell';
}

// Initialize Monitoring page
function initializeMonitoring() {
    loadMonitoringReports();
    
    const proposalFilter = document.getElementById('monitoring-proposal-filter');
    if (proposalFilter) {
        loadProposalsForSelect('monitoring-proposal-filter', { status: ['implementing', 'monitoring'] });
        proposalFilter.addEventListener('change', loadMonitoringReports);
    }
    
    const newReportBtn = document.getElementById('btn-new-monitoring-report');
    if (newReportBtn) {
        newReportBtn.addEventListener('click', function() {
            showMonitoringModal();
        });
    }
    
    initializeMonitoringModal();
}

function loadMonitoringReports() {
    const container = document.getElementById('monitoring-container');
    if (!container) return;
    
    const proposalFilter = document.getElementById('monitoring-proposal-filter')?.value;
    
    container.innerHTML = '';
    
    let allReports = [];
    
    Object.keys(researcherData.monitoringReports).forEach(proposalId => {
        if (proposalFilter && proposalId !== proposalFilter) return;
        
        const reports = getMonitoringReports(proposalId);
        const proposal = getProposalById(proposalId);
        
        reports.forEach(report => {
            allReports.push({ ...report, proposalId, proposalTitle: proposal?.title || proposalId });
        });
    });
    
    // Sort by date
    allReports.sort((a, b) => new Date(b.reportDate) - new Date(a.reportDate));
    
    const template = document.getElementById('monitoring-report-card-template');
    
    allReports.forEach(report => {
        const card = template.content.cloneNode(true);
        card.querySelector('.report-proposal-title').textContent = report.proposalTitle;
        card.querySelector('.report-period').textContent = report.period;
        card.querySelector('.report-date').textContent = `Submitted: ${formatDate(report.reportDate)}`;
        card.querySelector('.progress-percentage').textContent = `${report.progress}%`;
        card.querySelector('.activities-text').textContent = report.activities;
        card.querySelector('.challenges-text').textContent = report.challenges || 'None';
        
        const progressFill = card.querySelector('.progress-fill');
        progressFill.style.width = `${report.progress}%`;
        
        const statusBadge = card.querySelector('.report-status-badge');
        statusBadge.className = `report-status-badge status-badge status-${report.status}`;
        statusBadge.textContent = report.status.charAt(0).toUpperCase() + report.status.slice(1);
        
        container.appendChild(card);
    });
    
    if (allReports.length === 0) {
        container.innerHTML = '<p class="empty-state">No monitoring reports found.</p>';
    }
}

function showMonitoringModal() {
    const modal = document.getElementById('new-monitoring-modal');
    const form = document.getElementById('monitoring-report-form');
    
    loadProposalsForSelect('monitoring-proposal-select', { status: ['implementing', 'monitoring'] });
    
    if (modal) {
        modal.classList.add('show');
    }
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            // In real app, save monitoring report
            alert('Monitoring report submitted successfully!');
            modal.classList.remove('show');
            form.reset();
            loadMonitoringReports();
        });
    }
}

function initializeMonitoringModal() {
    const modal = document.getElementById('new-monitoring-modal');
    if (!modal) return;
    
    const closeBtn = modal.querySelector('.modal-close');
    const cancelBtn = modal.querySelector('.modal-cancel');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', () => modal.classList.remove('show'));
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => modal.classList.remove('show'));
    }
}

// Initialize Extension page
function initializeExtension() {
    loadExtensionRequests();
    
    const newExtensionBtn = document.getElementById('btn-new-extension');
    if (newExtensionBtn) {
        newExtensionBtn.addEventListener('click', function() {
            showExtensionRequestModal();
        });
    }
    
    initializeExtensionRequestModal();
}

function loadExtensionRequests() {
    const container = document.getElementById('extension-container');
    if (!container) return;
    
    // In real app, load from data
    container.innerHTML = '<p class="empty-state">No extension requests found.</p>';
}

function showExtensionRequestModal() {
    const modal = document.getElementById('new-extension-modal');
    const form = document.getElementById('extension-request-form');
    
    loadProposalsForSelect('extension-proposal-select', { status: ['implementing', 'monitoring'] });
    
    // Update current deadline when proposal is selected
    const proposalSelect = document.getElementById('extension-proposal-select');
    if (proposalSelect) {
        proposalSelect.addEventListener('change', function() {
            const proposalId = this.value;
            const proposal = getProposalById(proposalId);
            if (proposal) {
                document.getElementById('current-deadline').value = proposal.timeline.end;
            }
        });
    }
    
    if (modal) {
        modal.classList.add('show');
    }
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            // In real app, save extension request
            alert('Extension request submitted successfully! It will be reviewed through proper channels.');
            modal.classList.remove('show');
            form.reset();
            loadExtensionRequests();
        });
    }
}

function initializeExtensionRequestModal() {
    const modal = document.getElementById('new-extension-modal');
    if (!modal) return;
    
    const closeBtn = modal.querySelector('.modal-close');
    const cancelBtn = modal.querySelector('.modal-cancel');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', () => modal.classList.remove('show'));
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => modal.classList.remove('show'));
    }
}

// Initialize Final Upload page
function initializeFinalUpload() {
    loadReadyProjects();
    
    const uploadForm = document.getElementById('final-upload-form');
    if (uploadForm) {
        uploadForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // In real app, save final upload
            alert('Final research submitted successfully! It will be scheduled for In-House Review.');
            uploadForm.reset();
            document.getElementById('upload-form-section').style.display = 'none';
            loadReadyProjects();
        });
    }
    
    const cancelBtn = document.getElementById('cancel-upload');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            document.getElementById('upload-form-section').style.display = 'none';
        });
    }
}

function loadReadyProjects() {
    const container = document.getElementById('ready-projects-container');
    if (!container) return;
    
    const readyProjects = researcherData.proposals.filter(p => 
        p.status === 'monitoring' || p.status === 'implementing'
    );
    
    container.innerHTML = '';
    
    const template = document.getElementById('project-card-template');
    
    readyProjects.forEach(proposal => {
        const card = template.content.cloneNode(true);
        card.querySelector('.project-title').textContent = proposal.title;
        card.querySelector('.project-id').textContent = proposal.id;
        card.querySelector('.project-deadline strong').textContent = formatDate(proposal.timeline.end);
        
        const progress = proposal.progress?.percentage || 0;
        card.querySelector('.progress-fill').style.width = `${progress}%`;
        card.querySelector('.progress-text').textContent = `${progress}% Complete`;
        
        const uploadBtn = card.querySelector('.upload-project-btn');
        uploadBtn.addEventListener('click', function() {
            showUploadForm(proposal.id);
        });
        
        container.appendChild(card);
    });
    
    if (readyProjects.length === 0) {
        container.innerHTML = '<p class="empty-state">No projects ready for final upload.</p>';
    }
}

function showUploadForm(proposalId) {
    const formSection = document.getElementById('upload-form-section');
    const proposalSelect = document.getElementById('upload-proposal-select');
    
    if (formSection) {
        formSection.style.display = 'block';
        formSection.scrollIntoView({ behavior: 'smooth' });
    }
    
    if (proposalSelect) {
        loadProposalsForSelect('upload-proposal-select', { status: ['monitoring', 'implementing'] });
        proposalSelect.value = proposalId;
    }
}

// Initialize Documentation page
function initializeDocumentation() {
    loadDocumentation();
    
    const proposalFilter = document.getElementById('doc-proposal-filter');
    if (proposalFilter) {
        loadProposalsForSelect('doc-proposal-filter');
        proposalFilter.addEventListener('change', loadDocumentation);
    }
    
    initializeDocumentationModal();
}

function loadDocumentation() {
    const container = document.getElementById('documentation-container');
    if (!container) return;
    
    const proposalFilter = document.getElementById('doc-proposal-filter')?.value;
    
    let proposals = researcherData.proposals;
    if (proposalFilter) {
        proposals = proposals.filter(p => p.id === proposalFilter);
    }
    
    container.innerHTML = '';
    
    const template = document.getElementById('documentation-section-template');
    
    proposals.forEach(proposal => {
        const section = template.content.cloneNode(true);
        section.querySelector('.project-title').textContent = proposal.title;
        section.querySelector('.project-id').textContent = proposal.id;
        
        // Add document upload handlers
        section.querySelectorAll('.add-doc-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const category = this.getAttribute('data-category');
                showAddDocumentModal(proposal.id, category);
            });
        });
        
        container.appendChild(section);
    });
    
    if (proposals.length === 0) {
        container.innerHTML = '<p class="empty-state">No documentation found.</p>';
    }
}

function showAddDocumentModal(proposalId, category) {
    const modal = document.getElementById('add-document-modal');
    const form = document.getElementById('add-document-form');
    
    if (modal) {
        loadProposalsForSelect('doc-proposal-select');
        document.getElementById('doc-proposal-select').value = proposalId;
        document.getElementById('doc-type-select').value = category;
        modal.classList.add('show');
    }
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            // In real app, save document
            alert('Document uploaded successfully!');
            modal.classList.remove('show');
            form.reset();
            loadDocumentation();
        });
    }
}

function initializeDocumentationModal() {
    const modal = document.getElementById('add-document-modal');
    if (!modal) return;
    
    const closeBtn = modal.querySelector('.modal-close');
    const cancelBtn = modal.querySelector('.modal-cancel');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', () => modal.classList.remove('show'));
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => modal.classList.remove('show'));
    }
}

// Initialize Dissemination page
function initializeDissemination() {
    loadDisseminations();
    
    const proposalFilter = document.getElementById('dissemination-proposal-filter');
    const typeFilter = document.getElementById('dissemination-type-filter');
    
    if (proposalFilter) {
        loadProposalsForSelect('dissemination-proposal-filter');
        proposalFilter.addEventListener('change', loadDisseminations);
    }
    
    if (typeFilter) {
        typeFilter.addEventListener('change', loadDisseminations);
    }
    
    const newDisseminationBtn = document.getElementById('btn-new-dissemination');
    if (newDisseminationBtn) {
        newDisseminationBtn.addEventListener('click', function() {
            showDisseminationModal();
        });
    }
    
    initializeDisseminationModal();
}

function loadDisseminations() {
    const container = document.getElementById('dissemination-container');
    if (!container) return;
    
    const proposalFilter = document.getElementById('dissemination-proposal-filter')?.value;
    const typeFilter = document.getElementById('dissemination-type-filter')?.value;
    
    container.innerHTML = '';
    
    let allDisseminations = [];
    
    Object.keys(researcherData.disseminations).forEach(proposalId => {
        if (proposalFilter && proposalId !== proposalFilter) return;
        
        const disseminations = getDisseminations(proposalId);
        const proposal = getProposalById(proposalId);
        
        disseminations.forEach(diss => {
            if (typeFilter && diss.type !== typeFilter) return;
            allDisseminations.push({ ...diss, proposalId, proposalTitle: proposal?.title || proposalId });
        });
    });
    
    // Sort by date
    allDisseminations.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    const template = document.getElementById('dissemination-card-template');
    
    allDisseminations.forEach(diss => {
        const card = template.content.cloneNode(true);
        card.querySelector('.dissemination-title').textContent = diss.title;
        card.querySelector('.proposal-link').textContent = diss.proposalTitle;
        card.querySelector('.venue').textContent = diss.venue;
        card.querySelector('.date').textContent = formatDate(diss.date);
        
        const typeBadge = card.querySelector('.dissemination-type-badge');
        typeBadge.className = `dissemination-type-badge status-badge status-${diss.type}`;
        typeBadge.textContent = diss.type.charAt(0).toUpperCase() + diss.type.slice(1);
        
        const statusBadge = card.querySelector('.status-badge');
        statusBadge.className = `status-badge status-${diss.status}`;
        statusBadge.textContent = diss.status.charAt(0).toUpperCase() + diss.status.slice(1);
        
        if (diss.link) {
            const viewLink = card.querySelector('.view-link');
            viewLink.href = diss.link;
            viewLink.style.display = 'inline-flex';
        }
        
        if (diss.location) {
            const venueItem = card.querySelector('.venue');
            venueItem.textContent = `${diss.venue}, ${diss.location}`;
        }
        
        container.appendChild(card);
    });
    
    if (allDisseminations.length === 0) {
        container.innerHTML = '<p class="empty-state">No dissemination records found.</p>';
    }
}

function showDisseminationModal() {
    const modal = document.getElementById('new-dissemination-modal');
    const form = document.getElementById('dissemination-form');
    
    if (modal) {
        loadProposalsForSelect('dissemination-proposal-select');
        modal.classList.add('show');
    }
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            // In real app, save dissemination record
            alert('Dissemination record saved successfully!');
            modal.classList.remove('show');
            form.reset();
            loadDisseminations();
        });
    }
}

function initializeDisseminationModal() {
    const modal = document.getElementById('new-dissemination-modal');
    if (!modal) return;
    
    const closeBtn = modal.querySelector('.modal-close');
    const cancelBtn = modal.querySelector('.modal-cancel');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', () => modal.classList.remove('show'));
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => modal.classList.remove('show'));
    }
}

// Helper Functions
function loadProposalsForSelect(selectId, filters = {}) {
    const select = document.getElementById(selectId);
    if (!select) return;
    
    // Clear existing options except first
    while (select.options.length > 1) {
        select.remove(1);
    }
    
    let proposals = researcherData.proposals;
    
    if (filters.status) {
        proposals = proposals.filter(p => filters.status.includes(p.status));
    }
    
    proposals.forEach(proposal => {
        const option = document.createElement('option');
        option.value = proposal.id;
        option.textContent = `${proposal.id} - ${proposal.title}`;
        select.appendChild(option);
    });
}

function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function getStatusLabel(status) {
    const labels = {
        'pending-twg': 'Pending TWG',
        'revision': 'For Revision',
        'endorsed': 'Endorsed',
        'inhouse': 'In-House Review',
        'notice-proceed': 'Notice to Proceed',
        'implementing': 'Implementing',
        'monitoring': 'Under Monitoring',
        'completed': 'Completed'
    };
    return labels[status] || status;
}

function updateNotificationBadge() {
    const unreadCount = getNotifications(true).length;
    const badge = document.getElementById('notifications-badge');
    if (badge) {
        badge.textContent = unreadCount;
        badge.style.display = unreadCount > 0 ? 'inline-block' : 'none';
    }
}

// Update notification badge on load
function updateSidebarBadges() {
    updateNotificationBadge();
    
    // Update comments badge
    const commentsBadge = document.getElementById('comments-badge');
    if (commentsBadge) {
        const unreadComments = Object.values(researcherData.comments).flat().length;
        if (unreadComments > 0) {
            commentsBadge.textContent = unreadComments;
            commentsBadge.style.display = 'inline-block';
        }
    }
}

// Load components when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        loadComponents();
        updateSidebarBadges();
    });
} else {
    loadComponents();
    updateSidebarBadges();
}


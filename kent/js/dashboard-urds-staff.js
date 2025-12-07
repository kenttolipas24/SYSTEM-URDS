// Load components
function loadComponents() {
    // Load sidebar
    fetch('../components/staff-dashboard/sidebar.html')
        .then(res => res.text())
        .then(data => {
            document.getElementById('sidebar-placeholder').innerHTML = data;
        })
        .catch(err => console.error('Error loading sidebar:', err));

    // Load header
    fetch('../components/staff-dashboard/header.html')
        .then(res => res.text())
        .then(data => {
            document.getElementById('header-placeholder').innerHTML = data;
            // Initialize search after header loads
            initializeSearch();
        })
        .catch(err => console.error('Error loading header:', err));

    // Load dashboard content
    fetch('../components/staff-dashboard/sidebar-content/dashboard-content.html')
        .then(res => res.text())
        .then(data => {
            document.getElementById('dashboard-content-placeholder').innerHTML = data;
            // Initialize dashboard after content loads
            initializeDashboard();
        })
        .catch(err => console.error('Error loading dashboard content:', err));
}

// Initialize dashboard
function initializeDashboard() {
    // Update metric counts (can be replaced with actual data)
    updateMetrics();
}

// Update metrics
function updateMetrics() {
    // These values can be replaced with actual data from API or localStorage
    document.getElementById('unsorted-count').textContent = '14';
    document.getElementById('ready-count').textContent = '5';
    document.getElementById('sessions-count').textContent = '3';
    document.getElementById('archived-count').textContent = '42';
}

// Initialize search functionality
function initializeSearch() {
    const searchInput = document.getElementById('header-search');
    if (searchInput) {
        searchInput.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') {
                performSearch(this.value);
            }
        });
    }
}

// Perform search
function performSearch(query) {
    console.log('Searching for:', query);
    // Implement search functionality here
    // This can filter proposals, submissions, etc.
}

// Show page (navigation)
function showPage(page) {
    // Remove active class from all nav items
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => item.classList.remove('active'));

    // Add active class to clicked item
    event.currentTarget.classList.add('active');

    // Handle page switching
    switch(page) {
        case 'dashboard':
            loadDashboard();
            break;
        case 'proposal-intake':
            loadProposalIntake();
            break;
        case 'in-house-schedule':
            loadInHouseSchedule();
            break;
        case 'evaluator-pool':
            loadEvaluatorPool();
            break;
        case 'settings':
            loadSettings();
            break;
        default:
            loadDashboard();
    }
}

// Load dashboard page
function loadDashboard() {
    fetch('../components/staff-dashboard/sidebar-content/dashboard-content.html')
        .then(res => res.text())
        .then(data => {
            document.getElementById('dashboard-content-placeholder').innerHTML = data;
            initializeDashboard();
        })
        .catch(err => console.error('Error loading dashboard:', err));
}

// Load proposal intake page
function loadProposalIntake() {
    fetch('../components/staff-dashboard/sidebar-content/proposal-intake.html')
        .then(res => res.text())
        .then(html => {
            document.getElementById('dashboard-content-placeholder').innerHTML = html;
            initializeProposalIntake();
        })
        .catch(err => console.error('Error loading proposal intake:', err));
}

// Load in-house schedule page
function loadInHouseSchedule() {
    fetch('../components/staff-dashboard/sidebar-content/in-house-schedule.html')
        .then(res => res.text())
        .then(html => {
            document.getElementById('dashboard-content-placeholder').innerHTML = html;
            initializeInHouseSchedule();
        })
        .catch(err => console.error('Error loading in-house schedule:', err));
}

function initializeInHouseSchedule() {
    const sessions = [
        {
            id: 'session-1',
            month: 'DEC',
            day: '10',
            title: 'Natural Sciences Cluster Review',
            status: 'Scheduled',
            time: '9:00 AM - 4:00 PM',
            venue: 'AVR 1',
            proposalsCount: 5,
            evaluators: ['D','D']
        },
        {
            id: 'session-2',
            month: 'DEC',
            day: '12',
            title: 'Social Sciences Cluster Review',
            status: 'Pending Panel',
            time: '1:00 PM - 5:00 PM',
            venue: 'Conference Room',
            proposalsCount: 3,
            evaluators: []
        }
    ];

    renderScheduleList(sessions);

    // Tabs (placeholder interactions)
    document.getElementById('tab-schedule').addEventListener('click', () => setActiveTab('schedule'));
    document.getElementById('tab-ongoing').addEventListener('click', () => setActiveTab('ongoing'));
    document.getElementById('tab-results').addEventListener('click', () => setActiveTab('results'));

    const btnNew = document.getElementById('btn-schedule-new');
    if (btnNew) btnNew.addEventListener('click', () => alert('Schedule New Review (to be implemented)'));
}

function setActiveTab(tab) {
    const tabs = document.querySelectorAll('.tabs .tab');
    tabs.forEach(t => t.classList.remove('active'));
    const target = document.getElementById(`tab-${tab}`);
    if (target) target.classList.add('active');
    // For now, keep same list rendered; future: switch datasets
}

function renderScheduleList(list) {
    const container = document.getElementById('schedule-list');
    if (!container) return;
    container.innerHTML = list.map(item => `
        <div class="session-card">
            <div class="date-badge">
                <div class="month">${item.month}</div>
                <div class="day">${item.day}</div>
            </div>
            <div class="session-main">
                <h3>${item.title} <span class="tag">${item.status}</span></h3>
                <div class="session-meta">
                    <span><i class="far fa-clock"></i> ${item.time}</span>
                    <span><i class="fas fa-map-marker-alt"></i> ${item.venue}</span>
                </div>
                <div class="session-info">
                    ${item.proposalsCount} Proposals queued for presentation
                </div>
            </div>
            <div class="session-side">
                <div class="session-actions">
                    <button class="btn-details" onclick="showDetails('${item.id}')">View Details</button>
                    <button class="btn-primary" onclick="manageSession('${item.id}')">Manage Session</button>
                </div>
                <div class="evaluator-group">
                    <div class="label">Panel of Evaluators</div>
                    <div class="evaluator-list">
                        ${item.evaluators.map(e => `<div class='evaluator-pill'>${e}</div>`).join('')}
                        <div class="evaluator-add">+</div>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

function manageSession(id) {
    alert('Manage Session functionality will be implemented soon for ' + id);
}
// Load evaluator pool page
function loadEvaluatorPool() {
    fetch('../components/staff-dashboard/sidebar-content/evaluator-pool.html')
        .then(res => res.text())
        .then(html => {
            document.getElementById('dashboard-content-placeholder').innerHTML = html;
            initializeEvaluatorPool();
        })
        .catch(err => console.error('Error loading evaluator pool:', err));
}

// Load settings page
function loadSettings() {
    // Placeholder for settings page
    document.getElementById('dashboard-content-placeholder').innerHTML = 
        '<div class="dashboard-content"><h2>Settings</h2><p>Settings functionality coming soon...</p></div>';
}

// Assign code to submission
function assignCode(submissionId) {
    console.log('Assigning code to:', submissionId);
    // Implement code assignment functionality
    // This can open a modal, generate a code, etc.
    alert('Code assignment functionality will be implemented here');
}

// Show details for review item
function showDetails(reviewId) {
    console.log('Showing details for:', reviewId);
    // Implement details view functionality
    // This can open a modal, navigate to details page, etc.
    alert('Details view functionality will be implemented here');
}

// Logout function
function PagesLogout() {
    localStorage.removeItem('userSession');
    sessionStorage.clear();
    
    // Redirect to homepage or login page
    window.location.href = '../../kent/frontpage.html';
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    loadComponents();
});


// Proposal Intake initialization and logic
function initializeProposalIntake() {
    // Populate college options
    const colleges = [
        'College of Education',
        'College of Law',
        'College of Nursing and Allied Health Sciences',
        'College of Science',
        'College of Veterinary Medicine',
        'College of Engineering',
        'College of Agriculture, Fisheries, and Natural Resources',
        'College of Arts and Communication',
        'College of Business Administration',
    ];
    const select = document.getElementById('intake-college-select');
    if (select) {
        select.innerHTML = '<option value="" selected>Select College</option>' +
            colleges.map(c => `<option value="${c}">${c}</option>`).join('');
    }

    // Also prepare edit modal college options
    const editSelect = document.getElementById('edit-college-select');
    if (editSelect) {
        editSelect.innerHTML = colleges.map(c => `<option value="${c}">${c}</option>`).join('');
    }

    // Seed logs if empty
    seedDefaultLogsIfEmpty();

    // Render recent logs
    renderRecentLogs();

    // Bind generate button
    const btn = document.getElementById('btn-generate-log');
    if (btn) btn.addEventListener('click', handleGenerateLog);

    // Bind modal events
    bindEditModalEvents();
}

// Modal helpers
function bindEditModalEvents() {
    const overlay = document.getElementById('edit-modal-overlay');
    const closeBtn = document.getElementById('edit-modal-close');
    const cancelBtn = document.getElementById('btn-cancel-edit');
    const saveBtn = document.getElementById('btn-save-edit');

    if (closeBtn) closeBtn.addEventListener('click', closeEditModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeEditModal);
    if (overlay) {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeEditModal();
        });
    }
    if (saveBtn) saveBtn.addEventListener('click', saveEditLog);
}

function openEditModal(item) {
    const overlay = document.getElementById('edit-modal-overlay');
    if (!overlay) return;
    // Fill fields
    document.getElementById('edit-code').value = item.code || '';
    document.getElementById('edit-title-input').value = item.title || '';
    document.getElementById('edit-lead-input').value = item.lead || '';
    document.getElementById('edit-date-input').value = item.dateReceived || '';
    const sel = document.getElementById('edit-college-select');
    if (sel) sel.value = item.college || '';

    overlay.classList.remove('hidden');
}

function closeEditModal() {
    const overlay = document.getElementById('edit-modal-overlay');
    if (!overlay) return;
    overlay.classList.add('hidden');
}

function saveEditLog() {
    const code = document.getElementById('edit-code').value;
    const title = document.getElementById('edit-title-input').value.trim();
    const college = document.getElementById('edit-college-select').value;
    const lead = document.getElementById('edit-lead-input').value.trim();
    const dateReceived = document.getElementById('edit-date-input').value;

    const errors = [];
    if (!title) errors.push('Please enter Research Title.');
    if (!college) errors.push('Please select College Origin.');
    if (!lead) errors.push('Please enter Lead Researcher.');
    if (!dateReceived) errors.push('Please select Date Received.');

    if (errors.length) {
        alert(errors.join('\n'));
        return;
    }

    const logs = getProposalLogs();
    const idx = logs.findIndex(l => l.code === code);
    if (idx === -1) {
        alert('Log not found.');
        return;
    }

    logs[idx] = { code, title, college, lead, dateReceived };
    saveProposalLogs(logs);

    renderRecentLogs();
    closeEditModal();
    alert('Changes saved.');
}

function editLog(code) {
    const logs = getProposalLogs();
    const item = logs.find(l => l.code === code);
    if (!item) {
        alert('Log not found.');
        return;
    }
    openEditModal(item);
}

function getProposalLogs() {
    try {
        const raw = localStorage.getItem('urdsProposalLogs');
        return raw ? JSON.parse(raw) : [];
    } catch (e) {
        console.error('Error reading logs:', e);
        return [];
    }
}

function saveProposalLogs(logs) {
    try {
        localStorage.setItem('urdsProposalLogs', JSON.stringify(logs));
    } catch (e) {
        console.error('Error saving logs:', e);
    }
}

function renderRecentLogs(filter = '') {
    const container = document.getElementById('recent-logs');
    if (!container) return;
    const logs = getProposalLogs();
    const normalized = filter.trim().toLowerCase();
    const visible = normalized
        ? logs.filter(l => (
            (l.code || '').toLowerCase().includes(normalized) ||
            (l.title || '').toLowerCase().includes(normalized) ||
            (l.college || '').toLowerCase().includes(normalized) ||
            (l.lead || '').toLowerCase().includes(normalized)
        ))
        : logs;

    if (!visible.length) {
        container.innerHTML = '<p style="color:#7f8c8d">No logs found.</p>';
        return;
    }

    container.innerHTML = visible.slice(0, 10).map(item => `
        <div class="log-item">
            <div class="log-info">
                <h3>${item.code} — ${item.title}</h3>
                <p>${item.college} • ${item.dateReceived}</p>
            </div>
            <button class="btn-edit" onclick="editLog('${item.code}')">Edit</button>
        </div>
    `).join('');
}

function seedDefaultLogsIfEmpty() {
    const existing = getProposalLogs();
    if (existing && existing.length) return;
    const defaults = [
        { code: 'RP-2025-012', title: 'Effectiveness of Blended Learning', college: 'Education', lead: '—', dateReceived: '2025-02-12' },
        { code: 'RP-2025-011', title: 'IoT Based Security System', college: 'Engineering', lead: '—', dateReceived: '2025-02-10' },
        { code: 'RP-2025-010', title: 'Yield Analysis of Corn Varieties', college: 'Agriculture', lead: '—', dateReceived: '2025-02-05' },
    ];
    saveProposalLogs(defaults);
}

function generateControlCode() {
    const year = new Date().getFullYear();
    const key = `urdsSequence_${year}`;
    let seq = parseInt(localStorage.getItem(key) || '0', 10);
    seq += 1;
    localStorage.setItem(key, String(seq));
    return `RP-${year}-${String(seq).padStart(3, '0')}`;
}

function handleGenerateLog() {
    const college = document.getElementById('intake-college-select')?.value || '';
    const title = document.getElementById('intake-title-input')?.value || '';
    const lead = document.getElementById('intake-lead-input')?.value || '';
    const dateReceived = document.getElementById('intake-date-input')?.value || '';

    // Basic validation
    const errors = [];
    if (!college) errors.push('Please select College Origin.');
    if (!title.trim()) errors.push('Please enter Research Title.');
    if (!lead.trim()) errors.push('Please enter Lead Researcher.');
    if (!dateReceived) errors.push('Please select Date Received.');

    if (errors.length) {
        alert(errors.join('\n'));
        return;
    }

    const code = generateControlCode();
    const logs = getProposalLogs();
    const entry = { code, title: title.trim(), college, lead: lead.trim(), dateReceived };
    logs.unshift(entry);
    saveProposalLogs(logs);

    // Clear form
    document.getElementById('intake-form').reset();

    // Update UI
    renderRecentLogs();
    alert(`Generated Code: ${code}\nSubmission logged successfully.`);
}

// Enhance search to filter recent logs when proposal intake is active
const originalPerformSearch = performSearch;
performSearch = function(query) {
    // Call original for possible future global search behaviors
    try { originalPerformSearch(query); } catch (e) {}
    // If proposal intake page is visible, filter logs
    const recent = document.getElementById('recent-logs');
    if (recent) {
        renderRecentLogs(query || '');
    }
};


function initializeEvaluatorPool() {
    const evaluators = [
        {
            id: 'eva-1',
            initials: 'DG',
            name: 'Dr. Meredith Grey',
            type: 'External',
            affiliation: 'National Health Institute',
            tags: ['Public Health', 'Medicine'],
            load: 2,
            avatarClass: 'red'
        },
        {
            id: 'eva-2',
            initials: 'DS',
            name: 'Dr. Derek Shepherd',
            type: 'Internal',
            affiliation: 'College of Science',
            tags: ['Neuroscience', 'Biology'],
            load: 5,
            avatarClass: 'orange'
        },
        {
            id: 'eva-3',
            initials: 'ES',
            name: 'Engr. Tony Stark',
            type: 'External',
            affiliation: 'Stark Industries',
            tags: ['Robotics', 'AI', 'Engineering'],
            load: 1,
            avatarClass: 'pink'
        }
    ];

    // Store in memory for filtering
    window.__evaluatorPool = evaluators.slice();

    renderEvaluatorGrid(evaluators);

    const searchInput = document.getElementById('evaluator-search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const q = e.target.value.trim().toLowerCase();
            const filtered = window.__evaluatorPool.filter(ev => {
                const inName = ev.name.toLowerCase().includes(q) || ev.initials.toLowerCase().includes(q);
                const inTags = ev.tags.some(t => t.toLowerCase().includes(q));
                const inAffil = ev.affiliation.toLowerCase().includes(q);
                const inType = ev.type.toLowerCase().includes(q);
                return !q || inName || inTags || inAffil || inType;
            });
            renderEvaluatorGrid(filtered);
        });
    }

    const btnAdd = document.getElementById('btn-add-evaluator');
    if (btnAdd) btnAdd.addEventListener('click', () => alert('Add Evaluator (to be implemented)'));
}

function renderEvaluatorGrid(items) {
    const grid = document.getElementById('evaluator-grid');
    if (!grid) return;

    grid.innerHTML = items.map(ev => `
        <div class="evaluator-card" data-id="${ev.id}">
            <div class="evaluator-header">
                <div class="avatar ${ev.avatarClass}">${ev.initials}</div>
                <div>
                    <p class="evaluator-title">${ev.name}</p>
                    <span class="badge ${ev.type.toLowerCase()}">${ev.type}</span>
                </div>
            </div>
            <p class="affiliation">${ev.affiliation}</p>
            <div class="tag-list">
                ${ev.tags.map(tag => `<span class="tag-pill">${tag}</span>`).join('')}
            </div>
            <div class="card-footer">
                <span class="load-label">Current Load: ${ev.load}</span>
                <div class="footer-actions">
                    <i class="far fa-user"></i>
                    <span class="assign-link" data-id="${ev.id}">Assign</span>
                </div>
            </div>
        </div>
    `).join('');

    grid.querySelectorAll('.assign-link').forEach(el => {
        el.addEventListener('click', (e) => {
            const id = e.currentTarget.getAttribute('data-id');
            alert('Assign evaluator ' + id + ' (to be implemented)');
        });
    });
}

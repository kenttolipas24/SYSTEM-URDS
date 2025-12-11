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


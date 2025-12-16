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

// Initialize the evaluator page
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

// Evaluator dashboard client behavior (stubbed data)
document.addEventListener('DOMContentLoaded', function() {
    loadLists();
    loadPanelMembers();
});

let evaluatorCurrent = null;

function loadLists() {
    const newItems = [
        {id:1, title:'Climate-Resilient Crops', author:'Dr. Anna Reyes', category:'Natural Sciences', abstract:'Developing drought-resistant varieties...'},
        {id:2, title:'Community Health IoT', author:'Dr. Ben Torres', category:'Health Sciences', abstract:'Remote patient monitoring...'}
    ];

    const ongoing = [
        {id:11, title:'Coastal Erosion Study', author:'Prof. L. Gomez', category:'Natural Sciences', abstract:'Monitoring shoreline changes...'},
        {id:12, title:'Renewable Microgrids', author:'Engr. Raul Mendoza', category:'Engineering', abstract:'Off-grid community microgrids...'}
    ];

    const completed = [
        {id:21, title:'Soil Remediation Methods', author:'Dr. Clara Lim', category:'Natural Sciences', abstract:'Bioremediation trials...', rating:88},
        {id:22, title:'Urban Mobility Analysis', author:'Dr. Simon Park', category:'Social Sciences', abstract:'Traffic pattern optimization...', rating:81}
    ];

    populateList('researchListNew', newItems, 'new');
    populateList('researchListOngoing', ongoing, 'ongoing');
    populateList('researchListCompleted', completed, 'completed');
}

function populateList(containerId, items, status) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    items.forEach(it => {
        const el = document.createElement('div');
        el.className = 'proposal-item';
        el.setAttribute('data-title', it.title.toLowerCase());
        el.innerHTML = `
            <div>
                <div class="proposal-title">${it.title}</div>
                <div class="proposal-author">${it.author} · ${it.category}</div>
            </div>
            <div class="proposal-actions">
                <button class="btn btn-outline" onclick="viewResearch(${it.id}, '${status}')"><i class='fas fa-eye'></i> View</button>
                <button class="btn btn-primary" onclick="openEvaluatorModal(${it.id}, '${status}', '${it.category.replace("'","\'" )}')"><i class='fas fa-gavel'></i> Evaluate</button>
            </div>
        `;
        container.appendChild(el);
    });
}

function loadPanelMembers() {
    const members = [
        {name:'Dr. Alice Johnson', role:'Chair'},
        {name:'Dr. Maria Cortez', role:'Member'},
        {name:'Prof. Lee Chan', role:'Member'}
    ];
    const container = document.getElementById('panelMembersList');
    container.innerHTML = '';
    members.forEach(m => {
        const el = document.createElement('div');
        el.className = 'proposal-item';
        el.innerHTML = `<div><div class="proposal-title">${m.name}</div><div class="proposal-author">${m.role}</div></div>`;
        container.appendChild(el);
    });
}

function viewResearch(id, status) {
    alert('Open research details (stub). ID: ' + id + '\nStatus: ' + status);
}

function openEvaluatorModal(id, status, category) {
    evaluatorCurrent = {id, status, category};
    // Stubs for demo; in real app fetch details by id
    const title = (status === 'new') ? 'Sample Proposal ' + id : (status === 'ongoing' ? 'Ongoing Project ' + id : 'Completed Project ' + id);
    document.getElementById('modalTitle').innerText = (status === 'new') ? 'Evaluate Proposal' : (status === 'ongoing' ? 'Evaluate Ongoing Research' : 'Evaluate Completed Research');
    document.getElementById('modalResearchTitle').innerText = title;
    document.getElementById('modalResearchAuthor').innerText = 'Author ' + id + ' · ' + category;
    document.getElementById('modalResearchAbstract').innerText = 'Abstract for item ' + id + '. (stubbed)';

    // Show/Hide sections based on status
    document.getElementById('sectionFunding').style.display = (status === 'new') ? 'block' : 'none';
    document.getElementById('sectionContinuation').style.display = (status === 'ongoing') ? 'block' : 'none';
    document.getElementById('sectionRating').style.display = (status === 'completed') ? 'block' : 'none';

    // Prize section only for Natural Sciences
    if (status === 'completed' && category && category.toLowerCase().includes('natural')) {
        document.getElementById('prizeSection').style.display = 'block';
    } else {
        document.getElementById('prizeSection').style.display = 'none';
    }

    document.getElementById('evaluatorModal').classList.add('active');
}

function closeEvaluatorModal() {
    document.getElementById('evaluatorModal').classList.remove('active');
}

function submitEvaluatorDecision() {
    if (!evaluatorCurrent) { alert('No active evaluation.'); return; }
    const s = evaluatorCurrent.status;
    let payload = {id: evaluatorCurrent.id, status: s};
    if (s === 'new') {
        payload.decision = document.getElementById('fundingDecision').value;
        payload.notes = document.getElementById('fundingNotes').value.trim();
    } else if (s === 'ongoing') {
        payload.decision = document.getElementById('continuationDecision').value;
        payload.notes = document.getElementById('continuationNotes').value.trim();
    } else if (s === 'completed') {
        const rating = parseInt(document.getElementById('numericRating').value, 10);
        if (!rating || rating < 1 || rating > 100) { alert('Please enter a valid rating between 1 and 100.'); return; }
        payload.rating = rating;
        payload.prize = document.getElementById('prizeSelect').value;
        payload.notes = document.getElementById('ratingNotes').value.trim();
    }

    // Stub: show payload. Replace with POST to backend in real integration.
    alert('Submitted evaluation (stub):\n' + JSON.stringify(payload, null, 2));
    closeEvaluatorModal();
}

function filterList(containerId, q) {
    const query = (q || '').toLowerCase();
    const items = document.querySelectorAll(`#${containerId} .proposal-item`);
    items.forEach(it => {
        const title = it.getAttribute('data-title') || '';
        it.style.display = title.includes(query) ? 'flex' : 'none';
    });
}

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
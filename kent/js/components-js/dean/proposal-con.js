// ===============================
// PROPOSALS PAGE – FIXED VERSION
// ===============================

function initializeProposalsPage() {

    const searchInput = document.getElementById('searchInput');
    const tableBody = document.getElementById('proposalsTableBody');
    const emptyState = document.getElementById('emptyState');
    const proposalsTable = document.querySelector('.proposals-table');
    const filterDropdown = document.getElementById('filterDropdown');
    const filterBtn = document.getElementById('filterBtn');
    const exportBtn = document.getElementById('exportBtn');

    if (!searchInput || !tableBody || !emptyState) {
        console.error('Proposals page elements not found.');
        return;
    }

    /* ===============================
       SEARCH FUNCTIONALITY
    =============================== */
    searchInput.addEventListener('input', function () {
        const searchTerm = this.value.toLowerCase().trim();
        const rows = tableBody.querySelectorAll('tr');
        let visibleCount = 0;

        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            if (text.includes(searchTerm)) {
                row.style.display = '';
                visibleCount++;
            } else {
                row.style.display = 'none';
            }
        });

        emptyState.style.display = visibleCount === 0 && searchTerm ? 'block' : 'none';
        proposalsTable.style.display = visibleCount === 0 && searchTerm ? 'none' : 'table';
    });

    /* ===============================
       EVENT DELEGATION (DROPDOWNS)
    =============================== */
    document.addEventListener('click', function (e) {

        /* ---------- 3 DOT MENU ---------- */
        const menuBtn = e.target.closest('.menu-btn');
        if (menuBtn) {
            e.stopPropagation();
            const dropdown = menuBtn.nextElementSibling;

            document.querySelectorAll('.dropdown-menu').forEach(menu => {
                if (menu !== dropdown) menu.classList.remove('active');
            });

            dropdown.classList.toggle('active');
            return;
        }

        /* ---------- FILTER BUTTON ---------- */
        if (filterBtn && filterBtn.contains(e.target)) {
            e.stopPropagation();
            filterDropdown.classList.toggle('active');
            return;
        }

        /* ---------- FILTER OPTION ---------- */
        const filterItem = e.target.closest('.filter-dropdown-item');
        if (filterItem) {
            e.stopPropagation();

            const status = filterItem.dataset.status.toLowerCase();
            const rows = tableBody.querySelectorAll('tr');
            let visibleCount = 0;

            document.querySelectorAll('.filter-dropdown-item')
                .forEach(item => item.classList.remove('active'));
            filterItem.classList.add('active');

            rows.forEach(row => {
                const rowStatus = row.querySelector('.status-badge')
                    .textContent.toLowerCase();

                if (!status || rowStatus.includes(status)) {
                    row.style.display = '';
                    visibleCount++;
                } else {
                    row.style.display = 'none';
                }
            });

            emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
            proposalsTable.style.display = visibleCount === 0 ? 'none' : 'table';

            filterDropdown.classList.remove('active');
            return;
        }

        /* ---------- VIEW DETAILS ---------- */
        const viewBtn = e.target.closest('.view-details');
        if (viewBtn) {
            const row = viewBtn.closest('tr');
            alert(`View Details:\n${row.querySelector('.proposal-id').textContent}`);
            return;
        }

        /* ---------- EDIT PROPOSAL ---------- */
        const editBtn = e.target.closest('.edit-proposal');
        if (editBtn) {
            const row = editBtn.closest('tr');
            alert(`Edit Proposal:\n${row.querySelector('.proposal-id').textContent}`);
            return;
        }

        /* ---------- DOWNLOAD PDF ---------- */
        const downloadBtn = e.target.closest('.download-proposal');
        if (downloadBtn) {
            const row = downloadBtn.closest('tr');
            alert(`Downloading PDF for ${row.querySelector('.proposal-id').textContent}`);
            return;
        }

        /* ---------- DELETE PROPOSAL ---------- */
        const deleteBtn = e.target.closest('.delete-proposal');
        if (deleteBtn) {
            const row = deleteBtn.closest('tr');
            const id = row.querySelector('.proposal-id').textContent;

            if (confirm(`Are you sure you want to delete ${id}?`)) {
                alert(`${id} would be deleted.`);
            }
            return;
        }

        /* ---------- CLOSE ALL DROPDOWNS ---------- */
        document.querySelectorAll('.dropdown-menu')
            .forEach(menu => menu.classList.remove('active'));

        filterDropdown.classList.remove('active');
    });

    /* ===============================
       EXPORT FUNCTIONALITY
    =============================== */
    exportBtn.addEventListener('click', function () {

        const rows = tableBody.querySelectorAll('tr');
        const data = [];

        rows.forEach(row => {
            if (row.style.display !== 'none') {
                data.push({
                    Title: row.querySelector('.proposal-title').textContent,
                    ID: row.querySelector('.proposal-id').textContent,
                    Researcher: row.querySelector('.researcher-name').textContent,
                    Department: row.querySelector('.researcher-dept').textContent,
                    Date: row.children[2].textContent.trim(),
                    Budget: row.children[3].textContent.trim(),
                    Status: row.querySelector('.status-badge').textContent.trim()
                });
            }
        });

        if (!data.length) {
            alert('No proposals to export!');
            return;
        }

        const headers = Object.keys(data[0]);
        const csv = [
            headers.join(','),
            ...data.map(row => headers.map(h => `"${row[h]}"`).join(','))
        ].join('\n');

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `research_proposals_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        const original = exportBtn.innerHTML;
        exportBtn.innerHTML = '✔ Exported';
        exportBtn.style.background = '#e8f5e9';
        exportBtn.style.color = '#388e3c';

        setTimeout(() => {
            exportBtn.innerHTML = original;
            exportBtn.style.background = '';
            exportBtn.style.color = '';
        }, 2000);
    });

    console.log('✅ Proposals page initialized (fixed)');
}

/* ===============================
   INITIALIZE AFTER FETCH LOAD
=============================== */
fetch('../components/dean-dashboard/sidebar-content/proposal-content.html')
    .then(res => res.text())
    .then(html => {
        document.getElementById('proposal-placeholder').innerHTML = html;
        initializeProposalsPage();
    });

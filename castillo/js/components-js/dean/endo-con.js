// Initialize proposals page functionality
function initializeProposalsPage() {
    const searchInput = document.getElementById('searchInput');
    const tableBody = document.getElementById('proposalsTableBody');
    const emptyState = document.getElementById('emptyState');
    const filterDropdown = document.getElementById('filterDropdown');
    const filterBtn = document.getElementById('filterBtn');

    if (!searchInput || !tableBody || !emptyState) {
        console.error('Required elements not found');
        return;
    }

    // Dropdown menu handling
    document.querySelectorAll('.menu-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const dropdown = this.nextElementSibling;
            
            // Close all other dropdowns
            document.querySelectorAll('.dropdown-menu').forEach(menu => {
                if (menu !== dropdown) menu.classList.remove('active');
            });
            
            dropdown.classList.toggle('active');
        });
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', function() {
        document.querySelectorAll('.dropdown-menu').forEach(menu => {
            menu.classList.remove('active');
        });
    });

    // Dropdown actions
    document.querySelectorAll('.view-details').forEach(btn => {
        btn.addEventListener('click', function() {
            const row = this.closest('tr');
            const proposalId = row.querySelector('.proposal-id').textContent;
            const title = row.querySelector('.proposal-title').textContent;
            alert(`View Details:\n${proposalId} - ${title}\n\nThis would open a detailed view page.`);
        });
    });

    document.querySelectorAll('.edit-proposal').forEach(btn => {
        btn.addEventListener('click', function() {
            const row = this.closest('tr');
            const proposalId = row.querySelector('.proposal-id').textContent;
            alert(`Edit Proposal: ${proposalId}\n\nThis would open an edit form.`);
        });
    });

    document.querySelectorAll('.download-proposal').forEach(btn => {
        btn.addEventListener('click', function() {
            const row = this.closest('tr');
            const proposalId = row.querySelector('.proposal-id').textContent;
            alert(`Downloading PDF for ${proposalId}...`);
        });
    });

    document.querySelectorAll('.delete-proposal').forEach(btn => {
        btn.addEventListener('click', function() {
            const row = this.closest('tr');
            const proposalId = row.querySelector('.proposal-id').textContent;
            if (confirm(`Are you sure you want to delete ${proposalId}?`)) {
                alert(`${proposalId} would be deleted from the database.`);
            }
        });
    });

    // Search functionality
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase().trim();
        const rows = tableBody.getElementsByTagName('tr');
        let visibleCount = 0;

        Array.from(rows).forEach(row => {
            const text = row.textContent.toLowerCase();
            if (text.includes(searchTerm)) {
                row.style.display = '';
                visibleCount++;
            } else {
                row.style.display = 'none';
            }
        });

        if (visibleCount === 0 && searchTerm !== '') {
            emptyState.style.display = 'block';
            document.querySelector('.proposals-table').style.display = 'none';
        } else {
            emptyState.style.display = 'none';
            document.querySelector('.proposals-table').style.display = 'table';
        }
    });

    // Filter dropdown
    filterBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        filterDropdown.classList.toggle('active');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!filterDropdown.contains(e.target) && e.target !== filterBtn) {
            filterDropdown.classList.remove('active');
        }
    });

    // Filter options
    document.querySelectorAll('.filter-dropdown-item').forEach(item => {
        item.addEventListener('click', function() {
            const status = this.getAttribute('data-status').toLowerCase();
            
            // Update active state
            document.querySelectorAll('.filter-dropdown-item').forEach(opt => {
                opt.classList.remove('active');
            });
            this.classList.add('active');
            
            // Filter rows
            const rows = tableBody.getElementsByTagName('tr');
            let visibleCount = 0;

            Array.from(rows).forEach(row => {
                if (status === '') {
                    row.style.display = '';
                    visibleCount++;
                } else {
                    const rowStatus = row.querySelector('.status-badge').textContent.toLowerCase();
                    if (rowStatus.includes(status)) {
                        row.style.display = '';
                        visibleCount++;
                    } else {
                        row.style.display = 'none';
                    }
                }
            });

            if (visibleCount === 0) {
                emptyState.style.display = 'block';
                document.querySelector('.proposals-table').style.display = 'none';
            } else {
                emptyState.style.display = 'none';
                document.querySelector('.proposals-table').style.display = 'table';
            }

            // Close dropdown
            filterDropdown.classList.remove('active');
        });
    });

    // Export functionality
    document.getElementById('exportBtn').addEventListener('click', function() {
        const rows = tableBody.getElementsByTagName('tr');
        const proposals = [];
        
        Array.from(rows).forEach(row => {
            if (row.style.display !== 'none') {
                const cells = row.getElementsByTagName('td');
                if (cells.length >= 6) {
                    proposals.push({
                        'Proposal Title': cells[0].querySelector('.proposal-title')?.textContent || '',
                        'Proposal ID': cells[0].querySelector('.proposal-id')?.textContent || '',
                        'Researcher': cells[1].querySelector('.researcher-name')?.textContent || '',
                        'Department': cells[1].querySelector('.researcher-dept')?.textContent || '',
                        'Submission Date': cells[2].textContent.trim(),
                        'Budget': cells[3].textContent.trim(),
                        'Status': cells[4].textContent.trim()
                    });
                }
            }
        });

        if (proposals.length === 0) {
            alert('No proposals to export!');
            return;
        }

        const headers = Object.keys(proposals[0]);
        const csv = [
            headers.join(','),
            ...proposals.map(row => 
                headers.map(header => `"${row[header]}"`).join(',')
            )
        ].join('\n');

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `research_proposals_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        const originalText = this.innerHTML;
        this.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 18px; height: 18px;">
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            Exported!
        `;
        this.style.background = '#e8f5e9';
        this.style.color = '#388e3c';
        this.style.borderColor = '#388e3c';

        setTimeout(() => {
            this.innerHTML = originalText;
            this.style.background = '';
            this.style.color = '';
            this.style.borderColor = '';
        }, 2000);
    });

    console.log('Proposals page initialized successfully');
}

// For fetch-loaded content:
fetch('../components/dean-dashboard/sidebar-content/endo-content.html')
    .then(res => res.text())
    .then(data => {
        document.getElementById('endo_con-placeholder').innerHTML = data;
        initializeProposalsPage();
    });

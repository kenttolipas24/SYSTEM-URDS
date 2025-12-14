// Initialize faculty page after content is loaded
function initializeFacultyPage() {
    const searchInput = document.getElementById('searchInput');
    const tableBody = document.getElementById('facultyTableBody');
    const emptyState = document.getElementById('emptyState');
    const filterDropdown = document.getElementById('filterDropdown');
    const filterBtn = document.getElementById('filterBtn');
    const facultyModal = document.getElementById('facultyModal');
    const addFacultyBtn = document.getElementById('addFacultyBtn');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const facultyForm = document.getElementById('facultyForm');
    
    if (!searchInput || !tableBody) {
        console.error('Faculty elements not found. Retrying...');
        return;
    }
    
    let editMode = false;
    let editRow = null;

    // Dropdown menu handling
    document.querySelectorAll('.menu-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const dropdown = this.nextElementSibling;
            
            document.querySelectorAll('.dropdown-menu').forEach(menu => {
                if (menu !== dropdown) menu.classList.remove('active');
            });
            
            dropdown.classList.toggle('active');
        });
    });

    document.addEventListener('click', function() {
        document.querySelectorAll('.dropdown-menu').forEach(menu => {
            menu.classList.remove('active');
        });
    });

    // View Faculty Details
    document.querySelectorAll('.view-faculty').forEach(btn => {
        btn.addEventListener('click', function() {
            const row = this.closest('tr');
            const name = row.cells[0].textContent;
            const rank = row.cells[1].textContent;
            const dept = row.cells[2].textContent;
            const status = row.cells[3].textContent.trim();
            
            alert(`Faculty Details:\n\nName: ${name}\nRank: ${rank}\nDepartment: ${dept}\nStatus: ${status}\n\nThis would open a detailed view page.`);
        });
    });

    // Edit Faculty
    document.querySelectorAll('.edit-faculty').forEach(btn => {
        btn.addEventListener('click', function() {
            const row = this.closest('tr');
            editMode = true;
            editRow = row;
            
            document.getElementById('modalTitle').textContent = 'Edit Faculty Member';
            document.getElementById('facultyName').value = row.cells[0].textContent;
            document.getElementById('facultyRank').value = row.cells[1].textContent;
            document.getElementById('facultyDept').value = row.cells[2].textContent;
            
            const statusText = row.cells[3].textContent.trim().toLowerCase();
            if (statusText.includes('active')) {
                document.getElementById('facultyStatus').value = 'active';
            } else if (statusText.includes('leave')) {
                document.getElementById('facultyStatus').value = 'leave';
            } else {
                document.getElementById('facultyStatus').value = 'inactive';
            }
            
            facultyModal.classList.add('active');
        });
    });

    // Change Status
    document.querySelectorAll('.change-status').forEach(btn => {
        btn.addEventListener('click', function() {
            const row = this.closest('tr');
            const name = row.cells[0].textContent;
            const currentStatus = row.cells[3].querySelector('.status-badge');
            
            const newStatus = prompt(`Change status for ${name}:\n\n1 = Active\n2 = On Leave\n3 = Inactive\n\nEnter number (1-3):`);
            
            if (newStatus === '1') {
                currentStatus.className = 'status-badge active';
                currentStatus.textContent = 'Active';
            } else if (newStatus === '2') {
                currentStatus.className = 'status-badge leave';
                currentStatus.textContent = 'On Leave';
            } else if (newStatus === '3') {
                currentStatus.className = 'status-badge inactive';
                currentStatus.textContent = 'Inactive';
            }
        });
    });

    // Delete Faculty
    document.querySelectorAll('.delete-faculty').forEach(btn => {
        btn.addEventListener('click', function() {
            const row = this.closest('tr');
            const name = row.cells[0].textContent;
            
            if (confirm(`Are you sure you want to delete ${name} from the faculty list?`)) {
                row.remove();
                alert(`${name} has been removed from the faculty list.`);
            }
        });
    });

    // Search functionality
    if (searchInput) {
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
                document.querySelector('.faculty-table').style.display = 'none';
            } else {
                emptyState.style.display = 'none';
                document.querySelector('.faculty-table').style.display = 'table';
            }
        });
    }

    // Filter dropdown
    if (filterBtn) {
        filterBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            filterDropdown.classList.toggle('active');
        });

        document.addEventListener('click', function(e) {
            if (!filterDropdown.contains(e.target) && e.target !== filterBtn) {
                filterDropdown.classList.remove('active');
            }
        });
    }

    // Filter options
    document.querySelectorAll('.filter-dropdown-item').forEach(item => {
        item.addEventListener('click', function() {
            const status = this.getAttribute('data-status').toLowerCase();
            
            document.querySelectorAll('.filter-dropdown-item').forEach(opt => {
                opt.classList.remove('active');
            });
            this.classList.add('active');
            
            const rows = tableBody.getElementsByTagName('tr');
            let visibleCount = 0;

            Array.from(rows).forEach(row => {
                if (status === '') {
                    row.style.display = '';
                    visibleCount++;
                } else {
                    const rowStatus = row.cells[3].textContent.toLowerCase();
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
                document.querySelector('.faculty-table').style.display = 'none';
            } else {
                emptyState.style.display = 'none';
                document.querySelector('.faculty-table').style.display = 'table';
            }

            filterDropdown.classList.remove('active');
        });
    });

    // Modal handling
    if (addFacultyBtn) {
        addFacultyBtn.addEventListener('click', function() {
            editMode = false;
            editRow = null;
            document.getElementById('modalTitle').textContent = 'Add Faculty Member';
            facultyForm.reset();
            facultyModal.classList.add('active');
        });
    }

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', function() {
            facultyModal.classList.remove('active');
        });
    }

    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            facultyModal.classList.remove('active');
        });
    }

    if (facultyModal) {
        facultyModal.addEventListener('click', function(e) {
            if (e.target === facultyModal) {
                facultyModal.classList.remove('active');
            }
        });
    }

    // Form submission
    if (facultyForm) {
        facultyForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('facultyName').value;
            const rank = document.getElementById('facultyRank').value;
            const dept = document.getElementById('facultyDept').value;
            const status = document.getElementById('facultyStatus').value;
            
            let statusBadge = '';
            let statusText = '';
            
            if (status === 'active') {
                statusBadge = 'status-badge active';
                statusText = 'Active';
            } else if (status === 'leave') {
                statusBadge = 'status-badge leave';
                statusText = 'On Leave';
            } else {
                statusBadge = 'status-badge inactive';
                statusText = 'Inactive';
            }
            
            if (editMode && editRow) {
                // Update existing row
                editRow.cells[0].textContent = name;
                editRow.cells[1].textContent = rank;
                editRow.cells[2].textContent = dept;
                editRow.cells[3].innerHTML = `<span class="${statusBadge}">${statusText}</span>`;
                
                alert('Faculty member updated successfully!');
            } else {
                // Add new row
                const newRow = tableBody.insertRow();
                newRow.innerHTML = `
                    <td>${name}</td>
                    <td>${rank}</td>
                    <td>${dept}</td>
                    <td><span class="${statusBadge}">${statusText}</span></td>
                    <td class="actions-cell">
                        <button class="menu-btn">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <circle cx="12" cy="5" r="2"></circle>
                                <circle cx="12" cy="12" r="2"></circle>
                                <circle cx="12" cy="19" r="2"></circle>
                            </svg>
                        </button>
                        <div class="dropdown-menu">
                            <button class="dropdown-item view-faculty">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                    <circle cx="12" cy="12" r="3"></circle>
                                </svg>
                                View Details
                            </button>
                            <button class="dropdown-item edit-faculty">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                </svg>
                                Edit Faculty
                            </button>
                            <button class="dropdown-item change-status">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <polyline points="1 4 1 10 7 10"></polyline>
                                    <polyline points="23 20 23 14 17 14"></polyline>
                                    <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path>
                                </svg>
                                Change Status
                            </button>
                            <button class="dropdown-item danger delete-faculty">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <polyline points="3 6 5 6 21 6"></polyline>
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                </svg>
                                Delete
                            </button>
                        </div>
                    </td>
                `;
                
                // Re-attach event listeners to new row
                attachRowEventListeners(newRow);
                
                alert('Faculty member added successfully!');
            }
            
            facultyModal.classList.remove('active');
            facultyForm.reset();
        });
    }

    function attachRowEventListeners(row) {
        // Menu button
        const menuBtn = row.querySelector('.menu-btn');
        menuBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            const dropdown = this.nextElementSibling;
            
            document.querySelectorAll('.dropdown-menu').forEach(menu => {
                if (menu !== dropdown) menu.classList.remove('active');
            });
            
            dropdown.classList.toggle('active');
        });

        // View
        row.querySelector('.view-faculty').addEventListener('click', function() {
            const name = row.cells[0].textContent;
            const rank = row.cells[1].textContent;
            const dept = row.cells[2].textContent;
            const status = row.cells[3].textContent.trim();
            
            alert(`Faculty Details:\n\nName: ${name}\nRank: ${rank}\nDepartment: ${dept}\nStatus: ${status}`);
        });

        // Edit
        row.querySelector('.edit-faculty').addEventListener('click', function() {
            editMode = true;
            editRow = row;
            
            document.getElementById('modalTitle').textContent = 'Edit Faculty Member';
            document.getElementById('facultyName').value = row.cells[0].textContent;
            document.getElementById('facultyRank').value = row.cells[1].textContent;
            document.getElementById('facultyDept').value = row.cells[2].textContent;
            
            const statusText = row.cells[3].textContent.trim().toLowerCase();
            if (statusText.includes('active')) {
                document.getElementById('facultyStatus').value = 'active';
            } else if (statusText.includes('leave')) {
                document.getElementById('facultyStatus').value = 'leave';
            } else {
                document.getElementById('facultyStatus').value = 'inactive';
            }
            
            facultyModal.classList.add('active');
        });

        // Change status
        row.querySelector('.change-status').addEventListener('click', function() {
            const name = row.cells[0].textContent;
            const currentStatus = row.cells[3].querySelector('.status-badge');
            
            const newStatus = prompt(`Change status for ${name}:\n\n1 = Active\n2 = On Leave\n3 = Inactive\n\nEnter number (1-3):`);
            
            if (newStatus === '1') {
                currentStatus.className = 'status-badge active';
                currentStatus.textContent = 'Active';
            } else if (newStatus === '2') {
                currentStatus.className = 'status-badge leave';
                currentStatus.textContent = 'On Leave';
            } else if (newStatus === '3') {
                currentStatus.className = 'status-badge inactive';
                currentStatus.textContent = 'Inactive';
            }
        });

        // Delete
        row.querySelector('.delete-faculty').addEventListener('click', function() {
            const name = row.cells[0].textContent;
            
            if (confirm(`Are you sure you want to delete ${name}?`)) {
                row.remove();
                alert(`${name} has been removed.`);
            }
        });
    }

    console.log('Faculty page initialized successfully');
}

// Call this after your content is loaded
fetch('../components/dean-dashboard/sidebar-content/fclty-content.html')
    .then(res => res.text())
    .then(data => {
        document.getElementById('fclty_con-placeholder').innerHTML = data;
        // Wait a bit for DOM to fully render
        setTimeout(() => {
            initializeFacultyPage();
        }, 100);
    })
    .catch(error => {
        console.error('Error loading faculty content:', error);
    });
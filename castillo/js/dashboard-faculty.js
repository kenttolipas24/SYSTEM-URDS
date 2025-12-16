// Current page state
let currentPage = 'dashboard';

// Load components
function loadComponents() {
    // Load sidebar
    fetch('../components/faculty-researcher-dashboard/researcher-sidebar.html')
        .then(res => res.text())
        .then(data => {
            document.getElementById('sidebar-placeholder').innerHTML = data;
            // Attach navigation handlers after sidebar loads
            attachNavigationHandlers();
        })
        .catch(err => console.error('Error loading sidebar:', err));

    // Load header
    fetch('../components/faculty-researcher-dashboard/researcher-header.html')
        .then(res => res.text())
        .then(data => {
            document.getElementById('header-placeholder').innerHTML = data;
            // Initialize search after header loads
            initializeSearch();
        })
        .catch(err => console.error('Error loading header:', err));

    // Load initial page (proposals)
    showPage('dashboard');
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
    const proposalsSearch = document.getElementById('proposals-search');
    if (proposalsSearch) {
        proposalsSearch.addEventListener('input', function(e) {
            // Add proposals search functionality here
            filterProposals(e.target.value);
        });
    }

    const submitBtn = document.getElementById('btn-submit-proposal');
    if (submitBtn) {
        submitBtn.addEventListener('click', function() {
            // Navigate to submit proposal page
            console.log('Navigate to submit proposal');
        });
    }
}

// Filter proposals based on search
function filterProposals(searchTerm) {
    const table = document.querySelector('.proposals-table');
    if (!table) return;

    const rows = table.querySelectorAll('tbody tr');
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
        'dashboard': '../components/faculty-researcher-dashboard/dashboard-content.html',
        'proposals': '../components/faculty-researcher-dashboard/research-proposals-content.html',
        'calls': '../components/faculty-researcher-dashboard/call-for-proposals-content.html',
        'purchase': '../components/faculty-researcher-dashboard/create-proposal.html',
        'workplan': '../components/faculty-researcher-dashboard/workplan-content.html',
        'budget': '../components/faculty-researcher-dashboard/budget-content.html'
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
            
            // Initialize page-specific functionality
            switch(page) {
                case 'dashboard':
                    initializeDashboard();
                    break;
                case 'proposals':
                    initializeProposals();
                    break;
                case 'calls':
                    initializeCalls();
                    break;
                case 'purchase':
                    initializePurchase();
                    break;
                case 'workplan':
                    initializeWorkplan(); // Now defined below
                    break;
                case 'budget':
                    initializeBudget();
                    break;
            }
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
    const newProposalBtn = document.querySelector('.dashboard-content .btn-primary');
    if (newProposalBtn) {
        newProposalBtn.addEventListener('click', function() {
            showPage('purchase');
        });
    }
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

// Initialize purchase page (Create Proposal)
function initializePurchase() {
    const purchaseForm = document.getElementById('purchase-form');
    
    // Handle Form Submit
    if (purchaseForm) {
        purchaseForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Handle form submission
            alert('Proposal details saved successfully!');
            // You might want to clear local storage here if submission is final
            // localStorage.removeItem('currentProposalDraft');
        });
    }

    // Handle "Create Work Plan" Button
    const workPlanBtn = document.getElementById('btn-create-workplan');
    if (workPlanBtn) {
        workPlanBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Save draft data before switching
            saveFormDataToLocal();

            // Navigate to workplan
            showPage('workplan'); 
        });
    }

    // Handle "Create Budget" Button
    const budgetBtn = document.getElementById('btn-create-budget');
    if (budgetBtn) {
        budgetBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Save draft data before switching
            saveFormDataToLocal();

            showPage('budget'); 
        });
    }

    // Restore any previously saved data when this page loads
    loadFormDataFromLocal();
}

// Initialize Workplan Page
// function initializeWorkplan() {
//     const workplanForm = document.getElementById('workplan-form');
//     const container = document.getElementById('activities-container');
//     const addRowBtn = document.querySelector('.btn-add-row');

//     // Handle Form Submission
//     if (workplanForm) {
//         workplanForm.addEventListener('submit', function(e) {
//             e.preventDefault();
//             alert('Work Plan Saved!');
//             // Optional: Return to proposal page
//             // showPage('purchase');
//         });
//     }

//     // Handle "Add New Activity" Button
//     if (addRowBtn && container) {
//         addRowBtn.addEventListener('click', function() {
//             // Create a new row
//             const newRow = document.createElement('div');
//             newRow.className = 'activity-row';
            
//             // Generate a random ID suffix for checkboxes to ensure they are unique
//             const idSuffix = Math.floor(Math.random() * 10000);

//             newRow.innerHTML = `
//                 <div class="input-wrapper">
//                     <input type="text" class="form-control activity-input" placeholder="Enter activity description...">
//                 </div>
//                 <div class="quarter-check">
//                     <input type="checkbox" id="q1_${idSuffix}" class="custom-checkbox">
//                     <label for="q1_${idSuffix}"></label>
//                 </div>
//                 <div class="quarter-check">
//                     <input type="checkbox" id="q2_${idSuffix}" class="custom-checkbox">
//                     <label for="q2_${idSuffix}"></label>
//                 </div>
//                 <div class="quarter-check">
//                     <input type="checkbox" id="q3_${idSuffix}" class="custom-checkbox">
//                     <label for="q3_${idSuffix}"></label>
//                 </div>
//                 <div class="quarter-check">
//                     <input type="checkbox" id="q4_${idSuffix}" class="custom-checkbox">
//                     <label for="q4_${idSuffix}"></label>
//                 </div>
//                 <div class="row-action">
//                     <button type="button" class="btn-remove" title="Remove Row"><i class="fas fa-trash-alt"></i></button>
//                 </div>
//             `;
            
//             container.appendChild(newRow);
//         });
//     }

//     // Handle "Remove Row" Buttons (Event Delegation)
//     if (container) {
//         container.addEventListener('click', function(e) {
//             // Check if the clicked element is a remove button or its icon
//             if (e.target.closest('.btn-remove')) {
//                 const row = e.target.closest('.activity-row');
//                 if (row) {
//                     row.remove();
//                 }
//             }
//         });
//     }
// }

// --- Helper: Save Draft Data to LocalStorage ---
function saveFormDataToLocal() {
    const title = document.getElementById('proposal-title');
    const nature = document.getElementById('nature-research');
    const leader = document.getElementById('leader');
    const personnel = document.getElementById('personnel');
    const location = document.getElementById('location');
    const duration = document.getElementById('duration');
    const budget = document.getElementById('budget');

    // Only save if elements exist
    if (title) {
        const formData = {
            title: title.value,
            nature: nature ? nature.value : '',
            leader: leader ? leader.value : '',
            personnel: personnel ? personnel.value : '',
            location: location ? location.value : '',
            duration: duration ? duration.value : '',
            budget: budget ? budget.value : ''
        };
        
        localStorage.setItem('currentProposalDraft', JSON.stringify(formData));
        console.log('Draft saved to storage:', formData);
    }
}

// --- Helper: Load Draft Data from LocalStorage ---
function loadFormDataFromLocal() {
    const savedData = localStorage.getItem('currentProposalDraft');
    
    if (savedData) {
        try {
            const data = JSON.parse(savedData);
            
            // Helper to safely set value
            const setVal = (id, val) => {
                const el = document.getElementById(id);
                if (el && val) el.value = val;
            };

            setVal('proposal-title', data.title);
            setVal('nature-research', data.nature);
            setVal('leader', data.leader);
            setVal('personnel', data.personnel);
            setVal('location', data.location);
            setVal('duration', data.duration);
            setVal('budget', data.budget);

            console.log('Draft restored from storage.');
        } catch (e) {
            console.error("Error parsing saved draft", e);
        }
    }
}

// Load components when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadComponents);
} else {
    loadComponents();
}
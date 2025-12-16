// budget.js

function initializeBudget() {
    console.log("Initializing Budget Module...");

    // --- 1. CONFIGURATION & SELECTORS ---
    const budgetForm = document.getElementById('budget-summary-form'); // Use the ID from your budget HTML
    const cancelBtn = document.querySelector('.budget-page .btn-secondary');
    
    // Selectors for specific add buttons
    // Note: You might need to add specific IDs to your "Add" buttons in HTML if they don't have them
    // For now, we will target them by context or you can add IDs like id="btn-add-ps", id="btn-add-travel"
    
    // --- 2. EVENT LISTENERS FOR ADDING ROWS ---
    // We attach these to the specific tables if buttons exist
    
    // Helper to add row
    function addRow(tableId, rowTemplate) {
        const tableBody = document.querySelector(`#${tableId} tbody`);
        if (tableBody) {
            const newRow = document.createElement('tr');
            newRow.className = 'budget-row';
            newRow.innerHTML = rowTemplate;
            tableBody.appendChild(newRow);
        }
    }

    // You will need to add these IDs to your buttons in the HTML:
    // id="btn-add-ps", id="btn-add-travel", id="btn-add-supplies", id="btn-add-equipment"
    
    const btnAddPS = document.getElementById('btn-add-ps');
    if (btnAddPS) {
        btnAddPS.addEventListener('click', () => {
            addRow('table-personal-services', `
                <td><input type="text" class="form-control" placeholder="Item / Position"></td>
                <td><input type="number" class="form-control calc-qty" placeholder="0"></td>
                <td><input type="number" class="form-control calc-rate" placeholder="0.00"></td>
                <td><input type="text" class="form-control calc-total" readonly placeholder="0.00"></td>
                <td><button type="button" class="btn-icon-danger btn-remove"><i class="fas fa-trash-alt"></i></button></td>
            `);
        });
    }

    // --- 3. EVENT DELEGATION FOR CALCULATIONS & REMOVE ---
    const formCardContainer = document.querySelector('.budget-page');
    if (formCardContainer) {
        formCardContainer.addEventListener('input', function(e) {
            if (e.target.classList.contains('calc-qty') || e.target.classList.contains('calc-rate')) {
                calculateRowTotal(e.target.closest('tr'));
                calculateGrandTotal();
            }
        });

        formCardContainer.addEventListener('click', function(e) {
            // Remove Row
            if (e.target.closest('.btn-remove')) {
                const row = e.target.closest('tr');
                if (row) {
                    row.remove();
                    calculateGrandTotal();
                }
            }
        });
    }

    // --- 4. CALCULATION LOGIC ---
    function calculateRowTotal(row) {
        const qty = parseFloat(row.querySelector('.calc-qty').value) || 0;
        const rate = parseFloat(row.querySelector('.calc-rate').value) || 0;
        const totalField = row.querySelector('.calc-total');
        const total = qty * rate;
        totalField.value = total.toFixed(2);
    }

    function calculateGrandTotal() {
        let grandTotal = 0;
        const allTotals = document.querySelectorAll('.calc-total');
        allTotals.forEach(input => {
            grandTotal += parseFloat(input.value) || 0;
        });
        
        // Update the badge at the top
        const totalBadge = document.querySelector('.total-amount');
        if (totalBadge) {
            totalBadge.textContent = '₱ ' + grandTotal.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
        }
        
        // Update footer summary
        const footerTotal = document.querySelector('.footer-summary strong');
        if(footerTotal) {
             footerTotal.textContent = '₱ ' + grandTotal.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
        }
    }

    // --- 5. HANDLE SAVE & CANCEL ---
    // Handle Save (Form Submit)
    if (budgetForm) {
        budgetForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            showNotification('Budget Finalized Successfully!', 'success');
            
            setTimeout(() => {
                if (typeof showPage === 'function') {
                    showPage('purchase'); 
                }
            }, 1500);
        });
    }

    // Handle Cancel
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to cancel? Unsaved changes will be lost.')) {
                if (typeof showPage === 'function') {
                    showPage('purchase');
                }
            }
        });
    }

    // --- 6. NOTIFICATION HELPER (Reused) ---
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        // ... (Copy styles from workplan.js or make this a shared utility function)
        // Simple version for now:
        const isSuccess = type === 'success';
        Object.assign(notification.style, {
            position: 'fixed', top: '20px', right: '20px',
            backgroundColor: 'white', borderLeft: '5px solid #22c55e',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)', padding: '16px 24px',
            zIndex: '10000', fontFamily: "'Inter', sans-serif"
        });
        notification.innerHTML = `<i class="fas fa-check-circle" style="color:#22c55e"></i> <b>${message}</b>`;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }
}
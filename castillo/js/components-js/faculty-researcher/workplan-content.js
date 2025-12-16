// workplan.js

function initializeWorkplan() {
    console.log("Initializing Work Plan Module...");

    const workplanForm = document.getElementById('workplan-form');
    const container = document.getElementById('activities-container');
    const addRowBtn = document.querySelector('.btn-add-row');
    const cancelBtn = document.querySelector('.workplan-page .btn-secondary');

    // 1. Handle "Save Work Plan"
    if (workplanForm) {
        workplanForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Show the success notification with animation
            showNotification('Work Plan Saved Successfully!', 'success');
            
            // Wait for 1.5 seconds so the user sees the animation, then redirect
            setTimeout(() => {
                if (typeof showPage === 'function') {
                    showPage('purchase'); 
                }
            }, 1500); 
        });
    }

    // 2. Handle "Cancel" Button
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to cancel? Unsaved changes will be lost.')) {
                if (typeof showPage === 'function') {
                    showPage('purchase');
                }
            }
        });
    }

    // 3. Handle "Add New Activity"
    if (addRowBtn && container) {
        addRowBtn.addEventListener('click', function() {
            const newRow = document.createElement('div');
            newRow.className = 'activity-row';
            
            // Set initial state for animation (hidden and slightly lower)
            newRow.style.opacity = '0';
            newRow.style.transform = 'translateY(10px)';
            newRow.style.transition = 'all 0.3s ease';

            const idSuffix = Math.floor(Math.random() * 10000);

            newRow.innerHTML = `
                <div class="input-wrapper">
                    <input type="text" class="form-control activity-input" placeholder="Enter activity description...">
                </div>
                <div class="quarter-check">
                    <input type="checkbox" id="q1_${idSuffix}" class="custom-checkbox">
                    <label for="q1_${idSuffix}"></label>
                </div>
                <div class="quarter-check">
                    <input type="checkbox" id="q2_${idSuffix}" class="custom-checkbox">
                    <label for="q2_${idSuffix}"></label>
                </div>
                <div class="quarter-check">
                    <input type="checkbox" id="q3_${idSuffix}" class="custom-checkbox">
                    <label for="q3_${idSuffix}"></label>
                </div>
                <div class="quarter-check">
                    <input type="checkbox" id="q4_${idSuffix}" class="custom-checkbox">
                    <label for="q4_${idSuffix}"></label>
                </div>
                <div class="row-action">
                    <button type="button" class="btn-remove" title="Remove Row"><i class="fas fa-trash-alt"></i></button>
                </div>
            `;
            container.appendChild(newRow);

            // Trigger animation after adding to DOM
            requestAnimationFrame(() => {
                newRow.style.opacity = '1';
                newRow.style.transform = 'translateY(0)';
            });
        });
    }

    // 4. Handle "Remove Row"
    if (container) {
        container.addEventListener('click', function(e) {
            if (e.target.closest('.btn-remove')) {
                const row = e.target.closest('.activity-row');
                if (row) {
                    // Animation for removing row (slide out to right)
                    row.style.transform = 'translateX(20px)';
                    row.style.opacity = '0';
                    setTimeout(() => row.remove(), 300);
                }
            }
        });
    }

    // --- Helper Function: Show Animated Notification ---
    function showNotification(message, type = 'success') {
        // Create notification element
        const notification = document.createElement('div');
        notification.id = 'workplan-notification';
        
        // Define colors/icons based on type
        const isSuccess = type === 'success';
        const borderColor = isSuccess ? '#22c55e' : '#3b82f6';
        const iconClass = isSuccess ? 'fa-check-circle' : 'fa-info-circle';
        const iconColor = isSuccess ? '#22c55e' : '#3b82f6';

        // Apply Styles via JS (so you don't need to add to CSS file)
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            backgroundColor: 'white',
            borderLeft: `5px solid ${borderColor}`,
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
            padding: '16px 24px',
            borderRadius: '4px',
            zIndex: '10000',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            transform: 'translateX(120%)', // Start off-screen
            transition: 'transform 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55)', // Bouncy slide-in
            fontFamily: "'Inter', sans-serif",
            minWidth: '300px'
        });

        notification.innerHTML = `
            <i class="fas ${iconClass}" style="color: ${iconColor}; font-size: 20px;"></i>
            <span style="color: #334155; font-weight: 600; font-size: 14px;">${message}</span>
        `;

        document.body.appendChild(notification);

        // Trigger animation in
        requestAnimationFrame(() => {
            notification.style.transform = 'translateX(0)';
        });

        // Logic to remove it happens via page redirect, 
        // but we add a cleanup timeout just in case the redirect fails
        setTimeout(() => {
            notification.style.transform = 'translateX(120%)';
            setTimeout(() => notification.remove(), 500);
        }, 3000);
    }
}
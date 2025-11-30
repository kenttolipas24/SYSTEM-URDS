// Admin Dashboard JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize menu navigation
    initializeMenuNavigation();
    
    // Initialize form handlers
    initializeFormHandlers();
    
    // Initialize character counter
    initializeCharacterCounter();
    
    // Initialize preview functionality
    initializePreview();
    
    // Initialize select all functionality
    initializeSelectAll();
    
    // Initialize logout
    initializeLogout();
});

// Menu Navigation
function initializeMenuNavigation() {
    const menuItems = document.querySelectorAll('.menu-item');
    
    menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all items
            menuItems.forEach(i => i.classList.remove('active'));
            
            // Add active class to clicked item
            this.classList.add('active');
            
            // Get the section to show
            const section = this.getAttribute('data-section');
            showSection(section);
        });
    });
}

// Show Content Section
function showSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => section.classList.remove('active'));
    
    // Show selected section
    const selectedSection = document.getElementById(sectionId);
    if (selectedSection) {
        selectedSection.classList.add('active');
    }
}

// Character Counter
function initializeCharacterCounter() {
    const textarea = document.getElementById('letterBody');
    const charCount = document.getElementById('charCount');
    const maxChars = 5000;
    
    if (textarea) {
        textarea.addEventListener('input', function() {
            const length = this.value.length;
            charCount.textContent = length;
            
            if (length >= maxChars) {
                this.value = this.value.substring(0, maxChars);
                charCount.textContent = maxChars;
            }
        });
    }
}

// Preview Functionality
function initializePreview() {
    const previewBtn = document.getElementById('previewLetterBtn');
    const previewBtnCard = document.getElementById('previewBtn');
    const closePreviewBtn = document.getElementById('closePreviewBtn');
    const closePreview = document.getElementById('closePreview');
    const modal = document.getElementById('previewModal');
    const confirmSendBtn = document.getElementById('confirmSendBtn');
    
    if (previewBtn) {
        previewBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showPreview();
        });
    }
    
    if (previewBtnCard) {
        previewBtnCard.addEventListener('click', function(e) {
            e.preventDefault();
            showPreview();
        });
    }
    
    if (closePreviewBtn) {
        closePreviewBtn.addEventListener('click', function() {
            modal.classList.remove('show');
        });
    }
    
    if (closePreview) {
        closePreview.addEventListener('click', function() {
            modal.classList.remove('show');
        });
    }
    
    if (confirmSendBtn) {
        confirmSendBtn.addEventListener('click', function() {
            sendLetter();
        });
    }
    
    // Close modal when clicking outside
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.classList.remove('show');
            }
        });
    }
}

// Show Preview
function showPreview() {
    const form = document.querySelector('.proposal-letter-form');
    const formData = new FormData(form);
    
    // Get selected recipients
    const selectedRecipients = [];
    document.querySelectorAll('input[name="recipients"]:checked').forEach(checkbox => {
        if (checkbox.value !== 'all') {
            selectedRecipients.push(checkbox.value);
        }
    });
    
    // Build preview content
    const previewHTML = `
        <div class="letter-preview">
            <div class="letter-date">
                <strong>Date:</strong> ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
            
            <div class="letter-recipient">
                <strong>To:</strong> College Deans<br>
                <strong>Colleges:</strong> ${selectedRecipients.length > 0 ? selectedRecipients.join(', ') : 'None selected'}<br>
            </div>
            
            <div style="margin-bottom: 25px;">
                <strong>Subject:</strong> ${formData.get('callTitle') || 'Call for Research Proposal'}
            </div>
            
            <div class="letter-body">
${formData.get('letterBody') || 'Letter body not provided'}
            </div>
            
            <div style="margin-top: 30px;">
                <strong>Call Details:</strong><br>
                Academic Year: ${formData.get('academicYear') || 'Not specified'}<br>
                Submission Deadline: ${formData.get('deadlineDate') || 'Not specified'}<br>
                Total Budget Allocation: PHP ${parseFloat(formData.get('budget') || 0).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
            </div>
        </div>
    `;
    
    document.getElementById('previewContent').innerHTML = previewHTML;
    document.getElementById('previewModal').classList.add('show');
}

// Send Letter
function sendLetter() {
    const form = document.querySelector('.proposal-letter-form');
    const formData = new FormData(form);
    
    const selectedRecipients = [];
    document.querySelectorAll('input[name="recipients"]:checked').forEach(checkbox => {
        if (checkbox.value !== 'all') {
            selectedRecipients.push(checkbox.value);
        }
    });
    
    if (selectedRecipients.length === 0) {
        alert('Please select at least one recipient college.');
        return;
    }
    
    // Simulate sending (in real app, this would send to server)
    console.log('Sending letter to:', selectedRecipients);
    console.log('Form data:', {
        title: formData.get('callTitle'),
        academicYear: formData.get('academicYear'),
        deadline: formData.get('deadlineDate'),
        budget: formData.get('budget'),
        body: formData.get('letterBody'),
        guidelines: formData.get('guidelines'),
        recipients: selectedRecipients
    });
    
    alert('Letter has been sent successfully to ' + selectedRecipients.length + ' college dean(s)!');
    document.getElementById('previewModal').classList.remove('show');
    
    // Reset form
    form.reset();
    document.getElementById('charCount').textContent = '0';
}

// Form Handlers
function initializeFormHandlers() {
    const form = document.querySelector('.proposal-letter-form');
    
    if (form) {
        // Save as Draft
        const saveDraftBtn = document.getElementById('saveDraftBtn');
        if (saveDraftBtn) {
            saveDraftBtn.addEventListener('click', function(e) {
                e.preventDefault();
                saveDraft();
            });
        }
        
        // Submit form
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            showPreview();
        });
    }
}

// Save Draft
function saveDraft() {
    const form = document.querySelector('.proposal-letter-form');
    const formData = new FormData(form);
    
    // Save to localStorage (in real app, would save to server)
    const draftData = {
        title: formData.get('callTitle'),
        academicYear: formData.get('academicYear'),
        deadline: formData.get('deadlineDate'),
        budget: formData.get('budget'),
        body: formData.get('letterBody'),
        guidelines: formData.get('guidelines'),
        savedAt: new Date().toISOString()
    };
    
    localStorage.setItem('callForProposalDraft', JSON.stringify(draftData));
    alert('Draft saved successfully!');
}

// Initialize Select All for Recipients
function initializeSelectAll() {
    const selectAllCheckbox = document.querySelector('input[name="recipients"][value="all"]');
    const otherCheckboxes = document.querySelectorAll('input[name="recipients"]:not([value="all"])');
    
    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', function() {
            otherCheckboxes.forEach(checkbox => {
                checkbox.checked = this.checked;
            });
        });
        
        // Update select all status when individual checkboxes change
        otherCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                const allChecked = Array.from(otherCheckboxes).every(cb => cb.checked);
                const someChecked = Array.from(otherCheckboxes).some(cb => cb.checked);
                
                if (allChecked) {
                    selectAllCheckbox.checked = true;
                    selectAllCheckbox.indeterminate = false;
                } else if (someChecked) {
                    selectAllCheckbox.indeterminate = true;
                } else {
                    selectAllCheckbox.checked = false;
                    selectAllCheckbox.indeterminate = false;
                }
            });
        });
    }
}

// Logout Functionality
function logout() {
    // Attempt server logout if an API exists, but always clear client session and redirect.
    const doClientLogout = () => {
        try {
            sessionStorage.clear();
            localStorage.removeItem('authToken');
        } catch (e) {
            console.warn('Error clearing storage during logout', e);
        }
        // admin-dashboard.html lives in the `pages/` folder; landing page is `landing-page.html` in same folder
        window.location.href = 'landing-page.html';
    };

    if (window.fetch) {
        fetch('/api/logout', { method: 'POST' })
            .then(response => {
                // ignore server response outcome for client-side flow
                doClientLogout();
            })
            .catch(err => {
                // Network or server error - still perform client logout
                console.warn('Server logout failed, performing client-side logout.', err);
                doClientLogout();
            });
    } else {
        doClientLogout();
    }
}

// Attach logout button in header
function initializeLogout() {
    const logoutBtn = document.querySelector('.btn-login');
    if (!logoutBtn) return;
    logoutBtn.addEventListener('click', function(e) {
        e.preventDefault();
        logout();
    });
}
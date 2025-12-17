// research-projects.js

document.addEventListener('DOMContentLoaded', () => {
    // Initialize buttons
    initViewButtons();
});

function initViewButtons() {
    // Attach click event to all "View" (eye) buttons
    const viewButtons = document.querySelectorAll('.icon-btn[title="View"]');
    
    viewButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 1. Capture Data from the specific row
            const row = this.closest('tr');
            const projectData = {
                title: row.querySelector('strong').innerText,
                proponent: row.cells[1].innerText,
                campus: row.cells[2].innerText,
                college: row.cells[3].innerText,
                // You can add more data points here if your table has hidden columns
            };

            // 2. Load the Template
            loadAndShowTemplate(projectData);
        });
    });
}

function loadAndShowTemplate(data) {
    // Check if modal already exists in DOM, remove it to ensure fresh data/state
    const existingModal = document.getElementById('proposalModal');
    if (existingModal) {
        existingModal.remove();
    }

    // Fetch the external HTML file
    fetch('research-template.html') // Make sure this path is correct relative to your JS file
        .then(response => {
            if (!response.ok) throw new Error('Failed to load template');
            return response.text();
        })
        .then(html => {
            // Inject HTML into body
            document.body.insertAdjacentHTML('beforeend', html);
            
            // Populate Data
            populateModalData(data);
            
            // Show Modal (CSS handles the display, usually via a class or ID)
            const modal = document.getElementById('proposalModal');
            modal.style.display = 'flex'; // Or add a class like .active
        })
        .catch(err => console.error('Error loading research template:', err));
}

function populateModalData(data) {
    // Safe check helper
    const setText = (id, text) => {
        const el = document.getElementById(id);
        if (el) el.textContent = text;
    };

    // Inject data into the IDs defined in research-template.html
    setText('prop-title', data.title);
    setText('prop-proponent', data.proponent);
    setText('sig-proponent', data.proponent.toUpperCase()); // Signature usually uppercase
    setText('prop-campus', data.campus);
    
    // Add logic here if you want to change other fields based on College/Status
}

// Global function to close modal (called by the onclick in HTML)
window.closeProposalModal = function() {
    const modal = document.getElementById('proposalModal');
    if (modal) {
        modal.remove(); // Remove completely so next click fetches fresh
    }
};
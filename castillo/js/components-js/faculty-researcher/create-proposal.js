document.addEventListener('DOMContentLoaded', function() {
    
    // 1. Target the buttons using the IDs we added
    const workPlanBtn = document.getElementById('btn-create-workplan');
    const budgetBtn = document.getElementById('btn-create-budget');
    const proposalForm = document.getElementById('proposal-form');

    // 2. Navigation Logic for Work Plan
    if (workPlanBtn) {
        workPlanBtn.addEventListener('click', function(e) {
            e.preventDefault(); // Prevent default button behavior
            
            // Optional: Save the current form inputs so data isn't lost when navigating away
            saveFormDataToLocal();

            // Navigate to the workplan page
            window.location.href = '../components/faculty-researcher-dashboard/workplan-content.html';
        });
    }

    // 3. Navigation Logic for Budget (Placeholder for now)
    if (budgetBtn) {
        budgetBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            saveFormDataToLocal();
            
            // Change this to your actual budget file name when created
            window.location.href = 'budget.html'; 
        });
    }

    // 4. Form Submission Logic (Just a placeholder alert for now)
    if (proposalForm) {
        proposalForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Proposal Submitted Successfully!');
            // Add your backend submission logic here
        });
    }

    // --- Helper Function: Save Draft Data ---
    function saveFormDataToLocal() {
        const formData = {
            title: document.getElementById('proposal-title').value,
            nature: document.getElementById('nature-research').value,
            leader: document.getElementById('leader').value,
            // Add other fields you want to save
        };
        
        // Save to browser storage
        localStorage.setItem('currentProposalDraft', JSON.stringify(formData));
        console.log('Draft saved:', formData);
    }

    // --- Helper Function: Load Draft Data (Optional) ---
    // Uncomment this if you want the form to refill automatically when they return
    /*
    loadFormDataFromLocal();
    function loadFormDataFromLocal() {
        const savedData = localStorage.getItem('currentProposalDraft');
        if (savedData) {
            const data = JSON.parse(savedData);
            if(data.title) document.getElementById('proposal-title').value = data.title;
            if(data.nature) document.getElementById('nature-research').value = data.nature;
            if(data.leader) document.getElementById('leader').value = data.leader;
        }
    }
    */
});
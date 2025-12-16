function initAnnouncementLogic() {
    renderAnnouncements();

    const form = document.getElementById("announceForm");
    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();

            // 1. Get Values
            const title = document.getElementById("annTitle").value;
            const target = document.getElementById("annTarget").value;
            const priority = document.getElementById("annPriority").value;
            const message = document.getElementById("annMessage").value;
            const date = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

            // 2. Create Object
            const newAnn = { id: Date.now(), title, target, priority, message, date };

            // 3. Save to LocalStorage
            const saved = JSON.parse(localStorage.getItem("urds_announcements") || "[]");
            saved.unshift(newAnn); 
            localStorage.setItem("urds_announcements", JSON.stringify(saved));

            // 4. Refresh List & Reset Form
            renderAnnouncements();
            form.reset();

            // 5. Show the new "Workplan-style" Notification
            showNotification('Announcement Posted Successfully!', 'success');
        });
    }
}

function renderAnnouncements() {
    const listEl = document.getElementById("announcementListDisplay");
    if (!listEl) return; 

    const saved = JSON.parse(localStorage.getItem("urds_announcements") || "[]");

    if (saved.length === 0) {
        listEl.innerHTML = '<li style="padding:20px; text-align:center; color:#999;">No announcements posted yet.</li>';
        return;
    }

    listEl.innerHTML = "";
    saved.forEach(ann => {
        const li = document.createElement("li");
        li.className = "ann-item";
        li.innerHTML = `
            <div class="ann-info">
                <h4>${ann.title}</h4>
                <div class="ann-meta">
                    <span class="ann-tag ${ann.priority}">${ann.priority}</span>
                    <span>To: ${ann.target}</span> • <span>${ann.date}</span>
                </div>
                <p style="margin-top:5px; font-size:0.9rem; color:#555;">${ann.message}</p>
            </div>
            <button class="delete-btn" onclick="deleteAnnouncement(${ann.id})">
                <i class="fas fa-trash"></i>
            </button>
        `;
        listEl.appendChild(li);
    });
}

function deleteAnnouncement(id) {
    if(confirm("Are you sure you want to delete this announcement?")) {
        let saved = JSON.parse(localStorage.getItem("urds_announcements") || "[]");
        saved = saved.filter(a => a.id !== id);
        localStorage.setItem("urds_announcements", JSON.stringify(saved));
        renderAnnouncements();

        // Show notification on delete as well
        showNotification('Announcement deleted successfully.', 'success');
    }
}

// --- Helper Function: Show Animated Notification (Style copied from Workplan) ---
function showNotification(message, type = 'success') {
    // 1. Create notification element
    const notification = document.createElement('div');
    
    // 2. Define colors/icons based on type
    const isSuccess = type === 'success';
    const borderColor = isSuccess ? '#22c55e' : '#ef4444'; // Green for success, Red for error
    const iconClass = isSuccess ? 'fa-check-circle' : 'fa-exclamation-circle';
    const iconColor = isSuccess ? '#22c55e' : '#ef4444';

    // 3. Apply Styles via JS (Matches your workplan.js exactly)
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

    // 4. Trigger animation in
    requestAnimationFrame(() => {
        notification.style.transform = 'translateX(0)';
    });

    // 5. Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(120%)';
        setTimeout(() => notification.remove(), 500); // Wait for slide-out animation to finish
    }, 3000);
}
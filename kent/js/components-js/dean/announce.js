// ================================
// Announcements Loader + Logic
// ================================

document.addEventListener('DOMContentLoaded', () => {
    loadAnnouncements();
});

/**
 * Load announcement HTML into placeholder
 */
function loadAnnouncements() {
    fetch('../components/dean-dashboard/sidebar-content/announcement.html')
        .then(res => {
            if (!res.ok) {
                throw new Error('Announcement HTML not found');
            }
            return res.text();
        })
        .then(html => {
            const container = document.getElementById('announcement-placeholder');
            if (!container) return;

            container.innerHTML = html;
            initializeAnnouncementEvents(); // IMPORTANT
        })
        .catch(err => {
            console.error(err);
            document.getElementById('announcement-placeholder').innerHTML = `
                <h2 style="color:red">Failed to load announcements</h2>
            `;
        });
}

/**
 * Attach all announcement-related events
 */
function initializeAnnouncementEvents() {

    // ---------- Forward buttons (event delegation) ----------
    document.querySelectorAll('.forward-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const title =
                btn.closest('.announcement-card')
                   ?.querySelector('.announcement-title')
                   ?.textContent || '';

            openModal(title);
        });
    });

    // ---------- Close modal when clicking outside ----------
    const modal = document.getElementById('forwardModal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    }
}

/**
 * Open Forward Modal
 */
function openModal(title) {
    const modal = document.getElementById('forwardModal');
    if (!modal) return;

    modal.style.display = 'flex';

    const modalTitle = modal.querySelector('.modal-header h2');
    if (modalTitle && title) {
        modalTitle.textContent = `Forward: ${title}`;
    }
}

/**
 * Close Forward Modal
 */
function closeModal() {
    const modal = document.getElementById('forwardModal');
    if (!modal) return;

    modal.style.display = 'none';

    // Reset form
    modal.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
    const textarea = modal.querySelector('textarea');
    if (textarea) textarea.value = '';
}

/**
 * Forward Announcement (Mock Action)
 */
function forwardAnnouncement() {
    const recipients = [];

    if (document.getElementById('coordinators')?.checked) {
        recipients.push('Research Coordinators');
    }
    if (document.getElementById('faculty')?.checked) {
        recipients.push('Faculty Researchers');
    }
    if (document.getElementById('heads')?.checked) {
        recipients.push('Department Heads');
    }

    if (recipients.length === 0) {
        alert('Please select at least one recipient.');
        return;
    }

    alert(
        `Announcement forwarded to:\n\n${recipients.join(', ')}`
    );

    closeModal();
}

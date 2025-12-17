// app.js

document.addEventListener("DOMContentLoaded", () => {
    console.log("🚀 App initialized");
    initUser();
    loadPage("dashboard"); 
    initDarkMode();        
    
    // START GLOBAL EVENT LISTENER (Event Delegation)
    // This watches for clicks on ANY view button, forever.
    initGlobalEventListeners(); 
});

/* =========================================
   1. GLOBAL EVENT LISTENERS (The Fix)
   ========================================= */
function initGlobalEventListeners() {
    // Watch for LEFT CLICKS on the body
    document.body.addEventListener('click', function(e) {
        // Did we click a View button (or the icon inside it)?
        const btn = e.target.closest('.icon-btn[title="View"]');
        
        // If yes, run the logic
        if (btn) {
            console.log("👁️ View button clicked");
            e.preventDefault();
            handleViewAction(btn, false); // false = don't print immediately
        }
    });

    // Watch for RIGHT CLICKS on the body
    document.body.addEventListener('contextmenu', function(e) {
        const btn = e.target.closest('.icon-btn[title="View"]');
        
        if (btn) {
            console.log("🖨️ Right-click on View button");
            e.preventDefault(); // Stop normal right-click menu
            handleViewAction(btn, true); // true = auto-print
        }
    });
}

/* =========================================
   2. PAGE LOADING ENGINE
   ========================================= */
function loadPage(page, el) {
    console.log(`📄 Loading page: ${page}`);
    
    fetch(`pages/${page}.html`)
        .then(res => {
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            return res.text();
        })
        .then(html => {
            document.getElementById("page-content").innerHTML = html;
            
            const styleLink = document.getElementById("page-style");
            if (styleLink) styleLink.href = `css/${page}.css`;
            
            const titleEl = document.getElementById("pageTitle");
            if (titleEl) {
                titleEl.textContent = page.charAt(0).toUpperCase() + page.slice(1).replace('-', ' ');
            }

            // Special logic for Announcements if needed
            if (page === 'announcements' && typeof initAnnouncementLogic === 'function') {
                initAnnouncementLogic();
            }
        })
        .catch(err => console.error("❌ Error loading page:", err));

    if (el) {
        document.querySelectorAll(".nav-item").forEach(i => i.classList.remove("active"));
        el.classList.add("active");
    }
}

/* =========================================
   3. RESEARCH MODAL LOGIC
   ========================================= */
function handleViewAction(buttonElement, autoPrint) {
    const row = buttonElement.closest('tr');
    
    // Debugging: Log what we found
    if (!row) {
        console.error("❌ Could not find the table row!");
        return;
    }

    // Extract data
    const titleEl = row.querySelector('strong');
    const proponentEl = row.cells[1];
    const campusEl = row.cells[2];
    
    if (!titleEl || !proponentEl) {
        console.error("❌ Missing data in row columns");
        return;
    }

    const projectData = {
        title: titleEl.innerText.trim(),
        proponent: proponentEl.innerText.trim(),
        campus: campusEl ? campusEl.innerText.trim() : 'UEP Main'
    };

    console.log("✅ Data extracted:", projectData);
    loadAndShowResearchTemplate(projectData, autoPrint);
}

function loadAndShowResearchTemplate(data, autoPrint) {
    // Remove old modal
    const existingModal = document.getElementById('proposalModal');
    if (existingModal) existingModal.remove();

    console.log("🔄 Fetching template...");

    // Fetch the template
    fetch('pages/research-template.html')
        .then(res => {
            if (!res.ok) throw new Error(`Template not found (Status: ${res.status})`);
            return res.text();
        })
        .then(html => {
            // Inject into DOM
            document.body.insertAdjacentHTML('beforeend', html);
            console.log("✅ Template injected");

            // Fill Data
            setText('prop-title', data.title);
            setText('prop-proponent', data.proponent);
            setText('sig-proponent', data.proponent.toUpperCase());
            setText('prop-campus', data.campus);

            // Show Modal
            const modal = document.getElementById('proposalModal');
            if (modal) {
                modal.style.display = 'flex';
                console.log("✨ Modal displayed");
            } else {
                console.error("❌ Modal ID 'proposalModal' not found in injected HTML");
            }

            // Auto Print?
            if (autoPrint) {
                setTimeout(() => window.print(), 500);
            }
        })
        .catch(err => console.error("❌ Error loading template:", err));
}

// Helper
function setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
    else console.warn(`⚠️ Element ID '${id}' not found in template`);
}

// Close Modal Global Function
window.closeProposalModal = function() {
    const modal = document.getElementById('proposalModal');
    if (modal) modal.remove();
};

/* =========================================
   4. USER & SYSTEM UTILS
   ========================================= */
function initUser() {
    const nameEl = document.getElementById("admin-display-name");
    if (nameEl) nameEl.textContent = "URDS Admin";
}

function initDarkMode() {
    const toggle = document.getElementById("darkModeToggle");
    const root = document.documentElement;
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
        root.setAttribute("data-theme", "dark");
        if (toggle) toggle.checked = true;
    }

    if (toggle) {
        toggle.addEventListener("change", () => {
            if (toggle.checked) {
                root.setAttribute("data-theme", "dark");
                localStorage.setItem("theme", "dark");
            } else {
                root.removeAttribute("data-theme");
                localStorage.setItem("theme", "light");
            }
        });
    }
}

const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
    logoutBtn.onclick = () => {
        localStorage.removeItem("adminUser");
        window.location.href = "../homepage.html";
    };
}
document.addEventListener("DOMContentLoaded", () => {
    initUser();
    loadPage("dashboard");
});

// function loadPage(page, el) {
//     fetch(`pages/${page}.html`)
//         .then(res => res.text())
//         .then(html => {
//             document.getElementById("page-content").innerHTML = html;
//             document.getElementById("page-style").href = `css/${page}.css`;
//             document.getElementById("pageTitle").textContent =
//                 page.charAt(0).toUpperCase() + page.slice(1);
//         });

//     document.querySelectorAll(".nav-item")
//         .forEach(i => i.classList.remove("active"));
//     if (el) el.classList.add("active");
// }

function loadPage(page, el) {
    fetch(`pages/${page}.html`)
        .then(res => {
            if (!res.ok) throw new Error("Page not found");
            return res.text();
        })
        .then(html => {
            document.getElementById("page-content").innerHTML = html;
            
            // Link the specific CSS
            document.getElementById("page-style").href = `css/${page}.css`;
            
            // Update Title
            document.getElementById("pageTitle").textContent =
                page.charAt(0).toUpperCase() + page.slice(1);

            // SPECIAL LOGIC: Initialize scripts if on the announcements page
            if (page === 'announcements') {
                initAnnouncementLogic();
            }
        })
        .catch(err => {
            console.error(err);
        });

    // Update Sidebar Active State
    if (el) {
        document.querySelectorAll(".nav-item")
            .forEach(i => i.classList.remove("active"));
        el.classList.add("active");
    }
}

function initUser() {
    const name = "URDS Admin";
    const role = "Coordinator";

    document.getElementById("admin-display-name").textContent = name;
    document.getElementById("admin-display-role").textContent = role;
    document.getElementById("admin-avatar").textContent = "UA";
}

document.getElementById("logoutBtn").onclick = () => {
    localStorage.removeItem("adminUser");
    window.location.href = "../kent/frontpage.html";
};
document.addEventListener("DOMContentLoaded", () => {
    const toggle = document.getElementById("darkModeToggle");
    const root = document.documentElement;

    // Load saved preference
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
        root.setAttribute("data-theme", "dark");
        if (toggle) toggle.checked = true;
    }

    // Toggle handler
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
});


fetch("../pages/settings.html")
    .then(response => response.text())
    .then(html => {

        // NOW the button exists
        const btn = document.getElementById("darkModeBtn");

        if (btn) {
            btn.addEventListener("click", () => {
                document.body.classList.toggle("dark-mode");

                const isDark = document.body.classList.contains("dark-mode");
                btn.textContent = isDark ? "On" : "Off";
                btn.classList.toggle("active", isDark);
            });
        }
    });




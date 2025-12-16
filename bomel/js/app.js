document.addEventListener("DOMContentLoaded", () => {
    initUser();
    loadPage("dashboard");
});

function loadPage(page, el) {
    fetch(`pages/${page}.html`)
        .then(res => res.text())
        .then(html => {
            document.getElementById("page-content").innerHTML = html;
            document.getElementById("page-style").href = `css/${page}.css`;
            document.getElementById("pageTitle").textContent =
                page.charAt(0).toUpperCase() + page.slice(1);
        });

    document.querySelectorAll(".nav-item")
        .forEach(i => i.classList.remove("active"));
    if (el) el.classList.add("active");
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


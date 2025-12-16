document.querySelectorAll(".clickable").forEach(item => {
    item.addEventListener("click", () => {
        const link = item.dataset.link;
        if (link) {
            window.location.href = link;
        }
    });
});

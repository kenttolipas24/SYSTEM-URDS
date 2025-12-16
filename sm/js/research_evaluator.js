// ========== State Management ==========
const state = {
  currentPage: "dashboard",
  evaluations: {
    technical: 85,
    relevance: 90,
    budget: 75,
  },
  sidebarCollapsed: false,
  notifications: [
    {
      id: 1,
      type: "info",
      title: "New Research Proposal",
      message: "AI-Driven Traffic Management System has been assigned to you",
      time: "5 min ago",
      unread: true,
    },
    {
      id: 2,
      type: "success",
      title: "Evaluation Approved",
      message: "Your evaluation for Urban Heat Island Analysis has been approved",
      time: "2 hours ago",
      unread: true,
    },
    {
      id: 3,
      type: "warning",
      title: "Deadline Reminder",
      message: "Mangrove Restoration Project evaluation due in 3 days",
      time: "1 day ago",
      unread: true,
    },
    {
      id: 4,
      type: "info",
      title: "Manuscript Submitted",
      message: "Ethnobotanical Study final manuscript is ready for review",
      time: "2 days ago",
      unread: false,
    },
  ],
}

// ========== DOM Elements ==========
const navItems = document.querySelectorAll(".nav-item[data-page]")
const pageContents = document.querySelectorAll(".page-content")
const pageTitle = document.getElementById("page-title")

const sliders = {
  technical: document.getElementById("technical-merit"),
  relevance: document.getElementById("relevance-agenda"),
  budget: document.getElementById("budget-feasibility"),
}

const valueDisplays = {
  technical: document.getElementById("technical-value"),
  relevance: document.getElementById("relevance-value"),
  budget: document.getElementById("budget-value"),
}

const sidebar = document.getElementById("sidebar")
const sidebarToggle = document.getElementById("sidebarToggle")

const searchInput = document.getElementById("searchInput")
const searchClear = document.getElementById("searchClear")

const notificationBtn = document.getElementById("notificationBtn")
const notificationDropdown = document.getElementById("notificationDropdown")
const notificationList = document.getElementById("notificationList")
const notificationCount = document.getElementById("notificationCount")
const clearAllNotifications = document.getElementById("clearAllNotifications")

const viewProposalBtn = document.getElementById("viewProposalBtn")

// ========== Page Titles ==========
const pageTitles = {
  dashboard: "Evaluator Dashboard",
  "pending-reviews": "Pending Reviews",
  completed: "Completed Research Evaluations",
}

// ========== Initialization ==========
document.addEventListener("DOMContentLoaded", () => {
  initializeNavigation()
  initializeSliders()
  initializeFormHandlers()
  initializeSidebar()
  initializeSearch()
  initializeNotifications()
  initializeRatingModal()
  setActivePage("dashboard")
})

// ========== Navigation Functions ==========
/**
 * Initialize navigation event listeners
 */
function initializeNavigation() {
  navItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault()
      const page = item.getAttribute("data-page")
      setActivePage(page)
    })
  })
}

/**
 * Set the active page and update UI
 * @param {string} pageName - The page identifier
 */
function setActivePage(pageName) {
  // Update state
  state.currentPage = pageName

  // Update page visibility
  pageContents.forEach((page) => {
    page.classList.remove("active")
  })

  const activePage = document.getElementById(`${pageName}-page`)
  if (activePage) {
    activePage.classList.add("active")
  }

  // Update navigation active state
  navItems.forEach((item) => {
    item.classList.remove("active")
  })

  const activeNav = document.querySelector(`[data-page="${pageName}"]`)
  if (activeNav) {
    activeNav.classList.add("active")
  }

  // Update page title
  pageTitle.textContent = pageTitles[pageName] || "Dashboard"

  // Scroll to top
  document.querySelector(".content-wrapper").scrollTop = 0
}

// ========== Slider Functions ==========
/**
 * Initialize slider event listeners
 */
function initializeSliders() {
  if (sliders.technical) {
    sliders.technical.addEventListener("input", (e) => {
      updateSliderValue("technical", e.target.value)
    })
  }

  if (sliders.relevance) {
    sliders.relevance.addEventListener("input", (e) => {
      updateSliderValue("relevance", e.target.value)
    })
  }

  if (sliders.budget) {
    sliders.budget.addEventListener("input", (e) => {
      updateSliderValue("budget", e.target.value)
    })
  }
}

/**
 * Update slider value and display
 * @param {string} criterion - The criterion type
 * @param {number} value - The new value
 */
function updateSliderValue(criterion, value) {
  // Store in state
  const stateKey = criterion === "technical" ? "technical" : criterion === "relevance" ? "relevance" : "budget"
  state.evaluations[stateKey] = Number.parseInt(value)

  // Update display
  if (valueDisplays[criterion]) {
    valueDisplays[criterion].textContent = value
  }

  // Update slider background gradient
  const slider = sliders[criterion]
  if (slider) {
    const percentage = (value / 100) * 100
    slider.style.setProperty("--slider-fill", `${percentage}%`)
  }

  // Calculate and display weighted score
  calculateWeightedScore()
}

/**
 * Calculate and display weighted evaluation score
 */
function calculateWeightedScore() {
  const technical = state.evaluations.technical * 0.4
  const relevance = state.evaluations.relevance * 0.3
  const budget = state.evaluations.budget * 0.3

  const totalScore = technical + relevance + budget
  console.log(`[URDS] Weighted Score: ${totalScore.toFixed(2)}`)
}

// ========== Form Handlers ==========
/**
 * Initialize form event listeners
 */
function initializeFormHandlers() {
  // Save Draft button
  const saveDraftBtn = document.querySelector(".btn-secondary:not(.btn-outline)")
  if (saveDraftBtn) {
    saveDraftBtn.addEventListener("click", handleSaveDraft)
  }

  // Submit Evaluation button
  const submitBtn = document.querySelector(".form-actions .btn-primary")
  if (submitBtn) {
    submitBtn.addEventListener("click", handleSubmitEvaluation)
  }

  // Rate Research button
  const rateBtn = document.querySelector(".research-card .btn-primary.btn-lg")
  if (rateBtn) {
    rateBtn.addEventListener("click", () => {
      setActivePage("pending-reviews")
      scrollToSection()
    })
  }

  // Start Evaluation button
  const startBtn = Array.from(document.querySelectorAll(".btn-primary")).find((btn) =>
    btn.textContent.includes("Start Evaluation"),
  )
  if (startBtn) {
    startBtn.addEventListener("click", () => {
      setActivePage("pending-reviews")
      scrollToSection()
    })
  }

  // Notification button
  const notificationBtn = document.querySelector(".notification-btn")
  if (notificationBtn) {
    notificationBtn.addEventListener("click", handleNotificationClick)
  }

  // View Proposal button
  const viewProposalBtn = document.getElementById("viewProposalBtn")
  if (viewProposalBtn) {
    viewProposalBtn.addEventListener("click", handleViewProposal)
  }
}

/**
 * Handle save draft functionality
 */
function handleSaveDraft() {
  const comments = document.getElementById("qualitative-comments").value

  const draftData = {
    timestamp: new Date().toISOString(),
    evaluations: state.evaluations,
    comments: comments,
  }

  // Save to localStorage (for demo purposes)
  localStorage.setItem("evaluation_draft", JSON.stringify(draftData))

  // Show success message
  showNotification("Draft saved successfully!", "success")
  console.log("[URDS] Draft saved:", draftData)
}

/**
 * Handle submit evaluation functionality
 */
function handleSubmitEvaluation() {
  const comments = document.getElementById("qualitative-comments").value

  if (!comments.trim()) {
    showNotification("Please add comments before submitting", "warning")
    return
  }

  const submissionData = {
    timestamp: new Date().toISOString(),
    evaluations: state.evaluations,
    comments: comments,
    status: "submitted",
  }

  // Log submission
  console.log("[URDS] Evaluation submitted:", submissionData)

  // Show success message
  showNotification("Evaluation submitted successfully!", "success")

  // Reset form
  resetEvaluationForm()

  // Navigate to completed page after 2 seconds
  setTimeout(() => {
    setActivePage("completed")
  }, 2000)
}

/**
 * Handle view proposal functionality
 */
function handleViewProposal() {
  openProposalModal()
}

/**
 * Reset evaluation form
 */
function resetEvaluationForm() {
  if (sliders.technical) sliders.technical.value = 85
  if (sliders.relevance) sliders.relevance.value = 90
  if (sliders.budget) sliders.budget.value = 75

  if (valueDisplays.technical) valueDisplays.technical.textContent = 85
  if (valueDisplays.relevance) valueDisplays.relevance.textContent = 90
  if (valueDisplays.budget) valueDisplays.budget.textContent = 75

  const comments = document.getElementById("qualitative-comments")
  if (comments) comments.value = ""

  // Reset slider backgrounds
  updateSliderValue("technical", 85)
  updateSliderValue("relevance", 90)
  updateSliderValue("budget", 75)
}

/**
 * Scroll to section
 */
function scrollToSection() {
  const contentWrapper = document.querySelector(".content-wrapper")
  if (contentWrapper) {
    contentWrapper.scrollTop = 0
  }
}

// ========== Sidebar Functions ==========
/**
 * Initialize sidebar toggle functionality
 */
function initializeSidebar() {
  // Desktop sidebar toggle
  if (sidebarToggle) {
    sidebarToggle.addEventListener("click", toggleSidebar)
  }
}

/**
 * Toggle sidebar collapsed state (desktop)
 */
function toggleSidebar() {
  state.sidebarCollapsed = !state.sidebarCollapsed
  if (sidebar) {
    sidebar.classList.toggle("collapsed")
  }
}

// ========== Search Functions ==========
/**
 * Initialize search functionality
 */
function initializeSearch() {
  if (searchInput) {
    searchInput.addEventListener("input", handleSearchInput)
    searchInput.addEventListener("keydown", handleSearchKeydown)
  }

  if (searchClear) {
    searchClear.addEventListener("click", clearSearch)
  }
}

/**
 * Handle search input changes
 */
function handleSearchInput(e) {
  const query = e.target.value.trim()

  // Show/hide clear button
  if (searchClear) {
    if (query.length > 0) {
      searchClear.classList.add("visible")
    } else {
      searchClear.classList.remove("visible")
    }
  }

  // Perform search
  if (query.length > 0) {
    performSearch(query)
  }
}

/**
 * Handle search keyboard shortcuts
 */
function handleSearchKeydown(e) {
  if (e.key === "Escape") {
    clearSearch()
  } else if (e.key === "Enter") {
    const query = e.target.value.trim()
    if (query.length > 0) {
      performSearch(query)
    }
  }
}

/**
 * Perform search across content
 */
function performSearch(query) {
  console.log(`[v0] Searching for: "${query}"`)

  // Get all searchable elements
  const searchableElements = document.querySelectorAll(".research-title, .eval-title, .research-meta")

  let matchCount = 0

  searchableElements.forEach((element) => {
    const text = element.textContent.toLowerCase()
    const searchQuery = query.toLowerCase()

    if (text.includes(searchQuery)) {
      element.style.backgroundColor = "#fff9c4"
      element.style.transition = "background-color 0.3s ease"
      matchCount++

      // Remove highlight after 2 seconds
      setTimeout(() => {
        element.style.backgroundColor = ""
      }, 2000)
    }
  })

  // Show notification with results
  if (matchCount > 0) {
    showNotification(`Found ${matchCount} result(s) for "${query}"`, "info")
  } else {
    showNotification(`No results found for "${query}"`, "warning")
  }
}

/**
 * Clear search input and highlights
 */
function clearSearch() {
  if (searchInput) {
    searchInput.value = ""
  }
  if (searchClear) {
    searchClear.classList.remove("visible")
  }

  // Remove all highlights
  const highlightedElements = document.querySelectorAll('[style*="background-color"]')
  highlightedElements.forEach((element) => {
    element.style.backgroundColor = ""
  })
}

// ========== Notification Functions ==========
/**
 * Initialize notifications system
 */
function initializeNotifications() {
  if (notificationBtn) {
    notificationBtn.addEventListener("click", toggleNotificationDropdown)
  }

  if (clearAllNotifications) {
    clearAllNotifications.addEventListener("click", handleClearAllNotifications)
  }

  // Close dropdown when clicking outside
  document.addEventListener("click", (e) => {
    if (notificationDropdown && !notificationDropdown.contains(e.target) && !notificationBtn.contains(e.target)) {
      notificationDropdown.classList.remove("show")
    }
  })

  // Render initial notifications
  renderNotifications()
  updateNotificationCount()
}

/**
 * Toggle notification dropdown visibility
 */
function toggleNotificationDropdown(e) {
  e.stopPropagation()
  if (notificationDropdown) {
    notificationDropdown.classList.toggle("show")

    // Mark all as read when opened
    if (notificationDropdown.classList.contains("show")) {
      markAllAsRead()
    }
  }
}

/**
 * Render notifications in dropdown
 */
function renderNotifications() {
  if (!notificationList) return

  if (state.notifications.length === 0) {
    notificationList.innerHTML = `
      <div class="notification-empty">
        <i class="fas fa-bell-slash"></i>
        <p>No notifications</p>
      </div>
    `
    return
  }

  notificationList.innerHTML = state.notifications
    .map(
      (notification) => `
      <div class="notification-item ${notification.unread ? "unread" : ""}" data-id="${notification.id}">
        <div class="notification-item-icon ${notification.type}">
          <i class="fas fa-${getNotificationIcon(notification.type)}"></i>
        </div>
        <div class="notification-item-header">
          <span class="notification-item-title">${notification.title}</span>
          <span class="notification-item-time">${notification.time}</span>
        </div>
        <p class="notification-item-message">${notification.message}</p>
      </div>
    `,
    )
    .join("")

  // Add click handlers to notification items
  const notificationItems = notificationList.querySelectorAll(".notification-item")
  notificationItems.forEach((item) => {
    item.addEventListener("click", () => {
      const id = Number.parseInt(item.dataset.id)
      handleNotificationClick(id)
    })
  })
}

/**
 * Get icon for notification type
 */
function getNotificationIcon(type) {
  switch (type) {
    case "success":
      return "check-circle"
    case "warning":
      return "exclamation-triangle"
    case "info":
    default:
      return "info-circle"
  }
}

/**
 * Mark all notifications as read
 */
function markAllAsRead() {
  state.notifications.forEach((notification) => {
    notification.unread = false
  })
  updateNotificationCount()
}

/**
 * Clear all notifications
 */
function handleClearAllNotifications() {
  state.notifications = []
  renderNotifications()
  updateNotificationCount()
  showNotification("All notifications cleared", "success")
}

/**
 * Update notification badge count
 */
function updateNotificationCount() {
  if (!notificationCount) return

  const unreadCount = state.notifications.filter((n) => n.unread).length

  if (unreadCount > 0) {
    notificationCount.textContent = unreadCount
    notificationCount.style.display = "flex"
  } else {
    notificationCount.style.display = "none"
  }
}

/**
 * Handle notification click functionality
 */
function handleNotificationClick(id) {
  const notification = state.notifications.find((n) => n.id === id)
  if (notification) {
    notification.unread = false
    updateNotificationCount()
  }
}

// ========== Rating Modal Functions ==========
const ratingState = {
  significance: 0,
  methodology: 0,
  dataQuality: 0,
  literature: 0,
  writing: 0,
  originality: 0,
}

/**
 * Initialize rating modal functionality
 */
function initializeRatingModal() {
  const modal = document.getElementById("ratingModal")
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        closeRatingModal()
      }
    })
  }

  // Rating stars setup
  const ratingCriteria = ["significance", "methodology", "dataQuality", "literature", "writing", "originality"]
  ratingCriteria.forEach((criterion) => {
    const starsContainer = document.getElementById(`${criterion}-stars`)
    if (starsContainer) {
      starsContainer.querySelectorAll("i").forEach((star, index) => {
        star.addEventListener("click", () => setRating(criterion, index + 1))
      })
    }
  })

  // Save Draft button
  const saveDraftRatingBtn = document.getElementById("saveDraftRating")
  if (saveDraftRatingBtn) {
    saveDraftRatingBtn.addEventListener("click", saveDraftRating)
  }

  // Submit Rating button
  const submitRatingBtn = document.getElementById("submitRating")
  if (submitRatingBtn) {
    submitRatingBtn.addEventListener("click", submitRating)
  }

  // Download Manuscript button
  const downloadManuscriptBtn = document.getElementById("downloadManuscript")
  if (downloadManuscriptBtn) {
    downloadManuscriptBtn.addEventListener("click", downloadManuscript)
  }
}

/**
 * Open rating modal
 */
function openRatingModal() {
  const modal = document.getElementById("ratingModal")
  if (modal) {
    modal.classList.add("show")
    document.body.style.overflow = "hidden"
    console.log("[v0] Rating modal opened")
  }
}

/**
 * Close rating modal
 */
function closeRatingModal() {
  const modal = document.getElementById("ratingModal")
  if (modal) {
    modal.classList.remove("show")
    document.body.style.overflow = ""
    console.log("[v0] Rating modal closed")
  }
}

/**
 * Set rating for a criterion
 * @param {string} criterion - The criterion name
 * @param {number} value - The rating value (1-5)
 */
function setRating(criterion, value) {
  ratingState[criterion] = value

  const starsContainer = document.getElementById(`${criterion}-stars`)
  if (!starsContainer) return

  const stars = starsContainer.querySelectorAll("i")
  stars.forEach((star, index) => {
    if (index < value) {
      star.classList.add("active")
    } else {
      star.classList.remove("active")
    }
  })

  console.log(`[v0] Rating set for ${criterion}: ${value}`)
}

/**
 * Save draft rating
 */
function saveDraftRating() {
  const draftData = {
    timestamp: new Date().toISOString(),
    ratings: ratingState,
    comments: {
      significance: document.getElementById("significance-comment")?.value || "",
      methodology: document.getElementById("methodology-comment")?.value || "",
      dataQuality: document.getElementById("dataQuality-comment")?.value || "",
      literature: document.getElementById("literature-comment")?.value || "",
      writing: document.getElementById("writing-comment")?.value || "",
      originality: document.getElementById("originality-comment")?.value || "",
    },
    overallFeedback: document.getElementById("overall-feedback")?.value || "",
    recommendation: document.getElementById("final-recommendation")?.value || "",
  }

  localStorage.setItem("rating_draft", JSON.stringify(draftData))
  showNotification("Draft saved successfully!", "success")
  console.log("[v0] Rating draft saved:", draftData)
}

/**
 * Submit rating evaluation
 */
function submitRating() {
  // Validate all criteria are rated
  const allRated = Object.values(ratingState).every((rating) => rating > 0)
  if (!allRated) {
    showNotification("Please rate all criteria before submitting", "warning")
    return
  }

  // Validate overall feedback
  const overallFeedback = document.getElementById("overall-feedback")?.value
  if (!overallFeedback || overallFeedback.trim().length < 50) {
    showNotification("Please provide detailed feedback (at least 50 characters)", "warning")
    return
  }

  // Validate recommendation
  const recommendation = document.getElementById("final-recommendation")?.value
  if (!recommendation) {
    showNotification("Please select a final recommendation", "warning")
    return
  }

  const submissionData = {
    timestamp: new Date().toISOString(),
    ratings: ratingState,
    comments: {
      significance: document.getElementById("significance-comment")?.value || "",
      methodology: document.getElementById("methodology-comment")?.value || "",
      dataQuality: document.getElementById("dataQuality-comment")?.value || "",
      literature: document.getElementById("literature-comment")?.value || "",
      writing: document.getElementById("writing-comment")?.value || "",
      originality: document.getElementById("originality-comment")?.value || "",
    },
    overallFeedback: overallFeedback,
    recommendation: recommendation,
    status: "submitted",
  }

  console.log("[v0] Rating evaluation submitted:", submissionData)
  showNotification("Evaluation submitted successfully!", "success")

  // Close modal and reset
  setTimeout(() => {
    closeRatingModal()
    resetRatingForm()
  }, 1500)
}

/**
 * Reset rating form
 */
function resetRatingForm() {
  // Reset ratings
  Object.keys(ratingState).forEach((key) => {
    ratingState[key] = 0
    const starsContainer = document.getElementById(`${key}-stars`)
    if (starsContainer) {
      const stars = starsContainer.querySelectorAll("i")
      stars.forEach((star) => star.classList.remove("active"))
    }
  })

  // Reset comment fields
  const commentFields = [
    "significance-comment",
    "methodology-comment",
    "dataQuality-comment",
    "literature-comment",
    "writing-comment",
    "originality-comment",
  ]

  commentFields.forEach((fieldId) => {
    const field = document.getElementById(fieldId)
    if (field) field.value = ""
  })

  // Reset overall assessment
  const overallFeedback = document.getElementById("overall-feedback")
  if (overallFeedback) overallFeedback.value = ""

  const finalRecommendation = document.getElementById("final-recommendation")
  if (finalRecommendation) finalRecommendation.value = ""

  console.log("[v0] Rating form reset")
}

/**
 * Download manuscript
 */
function downloadManuscript() {
  showNotification("Downloading manuscript...", "info")
  console.log("[v0] Manuscript download initiated")

  setTimeout(() => {
    showNotification("Manuscript downloaded!", "success")
  }, 1500)
}

// Close modal when clicking escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    const modal = document.getElementById("ratingModal")
    if (modal && modal.classList.contains("show")) {
      closeRatingModal()
    }
  }
})

// ========== Proposal Modal Functions ==========
/**
 * Open proposal modal
 */
function openProposalModal() {
  const modal = document.getElementById("proposalModal")
  if (modal) {
    modal.classList.add("show")
    document.body.style.overflow = "hidden"
    console.log("[v0] Proposal modal opened")
  }
}

/**
 * Close proposal modal
 */
function closeProposalModal() {
  const modal = document.getElementById("proposalModal")
  if (modal) {
    modal.classList.remove("show")
    document.body.style.overflow = ""
    console.log("[v0] Proposal modal closed")
  }
}

// ========== Utility Functions ==========
/**
 * Format date to readable format
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date
 */
function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

/**
 * Show notification message
 * @param {string} message - The message to display
 * @param {string} type - The notification type (success, warning, error, info)
 */
function showNotification(message, type = "info") {
  const notification = document.createElement("div")
  notification.className = `notification notification-${type}`
  notification.textContent = message

  // Add styles dynamically
  const style = document.createElement("style")
  if (!document.querySelector("#notification-styles")) {
    style.id = "notification-styles"
    style.textContent = `
            .notification {
                position: fixed;
                bottom: 2rem;
                right: 2rem;
                padding: 1rem 1.5rem;
                border-radius: 0.5rem;
                color: white;
                font-weight: 600;
                z-index: 9999;
                animation: none;
                box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
            }

            .notification-success {
                background-color: #22c55e;
            }

            .notification-warning {
                background-color: #f97316;
            }

            .notification-error {
                background-color: #ef4444;
            }

            .notification-info {
                background-color: #06b6d4;
            }

            @media (max-width: 640px) {
                .notification {
                    bottom: 1rem;
                    right: 1rem;
                    left: 1rem;
                }
            }
        `
    document.head.appendChild(style)
  }

  document.body.appendChild(notification)

  // Auto-remove after 3 seconds
  setTimeout(() => {
    notification.remove()
  }, 3000)
}

console.log("[URDS] Evaluator UI initialized successfully")
console.log("[URDS] Rating system initialized successfully")

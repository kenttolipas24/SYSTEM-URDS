document.addEventListener("DOMContentLoaded", () => {
  // Navigation handling
  const navItems = document.querySelectorAll(".nav-item")
  const pages = document.querySelectorAll(".page")

  navItems.forEach((item) => {
    item.addEventListener("click", function (e) {
      // Skip if settings or logout links
      if (this.classList.contains("settings") || this.classList.contains("logout")) {
        return
      }

      e.preventDefault()

      // Remove active class from all nav items
      navItems.forEach((nav) => nav.classList.remove("active"))

      // Add active class to clicked item
      this.classList.add("active")

      // Get page to show
      const pageName = this.getAttribute("data-page") || "dashboard"

      // Hide all pages
      pages.forEach((page) => page.classList.remove("active"))

      // Show selected page
      const selectedPage = document.getElementById(`${pageName}-page`)
      if (selectedPage) {
        selectedPage.classList.add("active")
      }
    })
  })

  // Search functionality
  const searchInput = document.querySelector(".search-input")
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const query = e.target.value.toLowerCase()
      const submissionItems = document.querySelectorAll(".submission-item")
      submissionItems.forEach((item) => {
        const title = item.querySelector(".submission-title")?.textContent.toLowerCase() || ""
        const dept = item.querySelector(".submission-department")?.textContent.toLowerCase() || ""

        if (title.includes(query) || dept.includes(query)) {
          item.style.display = ""
        } else {
          item.style.display = query ? "none" : ""
        }
      })
    })
  }

  attachButtonHandlers()

  // Notification button
  const notificationBtn = document.querySelector(".notification-btn")
  if (notificationBtn) {
    notificationBtn.addEventListener("click", () => {
      showNotification(
        "info",
        "Notifications",
        "You have 3 new notifications: New proposal submitted, Review session tomorrow, Weekly report due",
      )
    })
  }

  // User profile dropdown toggle
  const userProfile = document.querySelector(".user-profile")
  if (userProfile) {
    userProfile.addEventListener("click", () => {
      showUserProfileModal()
    })
    userProfile.style.cursor = "pointer"
  }

  // Settings click handler
  const settingsBtn = document.querySelector(".nav-item.settings")
  if (settingsBtn) {
    settingsBtn.addEventListener("click", (e) => {
      e.preventDefault()
      showSettingsModal()
    })
  }

  // Logout click handler
  const logoutBtn = document.querySelector(".nav-item.logout")
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault()
      if (confirm("Are you sure you want to logout?")) {
        showNotification("success", "Logged Out", "You have been successfully logged out.")
        setTimeout(() => {
          window.location.href = "/login"
        }, 1500)
      }
    })
  }
})

function attachButtonHandlers() {
  // Log Report buttons
  document.querySelectorAll(".btn-primary").forEach((button) => {
    if (button.textContent.trim() === "Log Report") {
      button.addEventListener("click", function () {
        const item = this.closest(".submission-item")
        const researcher = item.querySelector(".submission-title")?.textContent || ""
        const status = item.querySelector(".submission-department")?.textContent || ""
        showLogReportModal(researcher, status)
      })
    }
  })

  // Review Request buttons
  document.querySelectorAll(".btn-primary").forEach((button) => {
    if (button.textContent.trim() === "Review Request") {
      button.addEventListener("click", function () {
        const item = this.closest(".submission-item")
        const title = item.querySelector(".submission-title")?.textContent || ""
        const dept = item.querySelector(".submission-department")?.textContent || ""
        showReviewRequestModal(title, dept)
      })
    }
  })

  // Update Status buttons
  document.querySelectorAll(".btn-primary").forEach((button) => {
    if (button.textContent.trim() === "Update Status") {
      button.addEventListener("click", function () {
        const item = this.closest(".submission-item")
        const projectName = item.querySelector(".submission-title")?.textContent || ""
        const lead = item.querySelector(".submission-department")?.textContent || ""
        showUpdateStatusModal(projectName, lead)
      })
    }
  })

  // View Details buttons
  document.querySelectorAll(".btn-secondary").forEach((button) => {
    if (button.textContent.trim() === "View Details") {
      button.addEventListener("click", function () {
        const item = this.closest(".submission-item")
        const title = item.querySelector(".submission-title")?.textContent || ""
        const details = item.querySelector(".submission-department")?.textContent || ""
        showViewDetailsModal(title, details)
      })
    }
  })

  // Endorse buttons
  document.querySelectorAll(".btn-primary").forEach((button) => {
    if (button.textContent.trim() === "Endorse" || button.style.background === "rgb(16, 185, 129)") {
      button.addEventListener("click", function () {
        const item = this.closest(".submission-item")
        const title = item.querySelector(".submission-title")?.textContent || ""
        showEndorseModal(title, this)
      })
    }
  })
}

// Add modal function for Log Report
function showLogReportModal(researcher, status) {
  const modalContent = `
    <form id="logReportForm">
      <div class="form-group">
        <label class="form-label">Researcher</label>
        <input type="text" class="form-input" value="${researcher}" readonly>
      </div>
      
      <div class="form-group">
        <label class="form-label">Current Status</label>
        <input type="text" class="form-input" value="${status}" readonly>
      </div>
      
      <div class="form-group">
        <label class="form-label">Progress Update *</label>
        <select class="form-select" id="progressStatus" required>
          <option value="">Select progress status</option>
          <option value="on-track">On Track</option>
          <option value="delayed">Delayed</option>
          <option value="completed">Completed</option>
          <option value="needs-assistance">Needs Assistance</option>
        </select>
      </div>
      
      <div class="form-group">
        <label class="form-label">Completion Percentage</label>
        <input type="number" class="form-input" id="completionPercent" min="0" max="100" placeholder="0-100">
      </div>
      
      <div class="form-group">
        <label class="form-label">Notes *</label>
        <textarea class="form-textarea" id="reportNotes" placeholder="Enter detailed notes about the research progress..." required></textarea>
      </div>
      
      <div class="form-group">
        <label class="form-label">Next Follow-up Date</label>
        <input type="date" class="form-input" id="followupDate">
      </div>
      
      <div class="modal-actions">
        <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
        <button type="submit" class="btn btn-primary">Submit Report</button>
      </div>
    </form>
  `

  openModal("Log Activity Report", modalContent)

  document.getElementById("logReportForm").addEventListener("submit", (e) => {
    e.preventDefault()
    const progressStatus = document.getElementById("progressStatus").value
    const notes = document.getElementById("reportNotes").value

    if (progressStatus && notes) {
      closeModal()
      showNotification("success", "Report Logged", `Activity report for ${researcher} has been successfully logged.`)
    }
  })
}

function showReviewRequestModal(title, details) {
  const modalContent = `
    <form id="reviewRequestForm">
      <div class="info-grid">
        <div class="info-item">
          <span class="info-label">Item</span>
          <span class="info-value">${title}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Requested By</span>
          <span class="info-value">${details}</span>
        </div>
      </div>
      
      <div class="form-group">
        <label class="form-label">Priority Level *</label>
        <select class="form-select" id="priorityLevel" required>
          <option value="">Select priority</option>
          <option value="high">High - Urgent</option>
          <option value="medium">Medium - Normal</option>
          <option value="low">Low - Can Wait</option>
        </select>
      </div>
      
      <div class="form-group">
        <label class="form-label">Budget Approval Status</label>
        <select class="form-select" id="budgetStatus">
          <option value="pending">Pending Review</option>
          <option value="approved">Approved</option>
          <option value="needs-revision">Needs Revision</option>
        </select>
      </div>
      
      <div class="form-group">
        <label class="form-label">Review Notes *</label>
        <textarea class="form-textarea" id="reviewNotes" placeholder="Enter your review notes and recommendations..." required></textarea>
      </div>
      
      <div class="form-group">
        <label class="form-label">Assign To</label>
        <select class="form-select" id="assignTo">
          <option value="">Select reviewer</option>
          <option value="budget-office">Budget Office</option>
          <option value="procurement">Procurement Team</option>
          <option value="director">URDS Director</option>
        </select>
      </div>
      
      <div class="modal-actions">
        <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
        <button type="submit" class="btn btn-primary">Submit Review</button>
      </div>
    </form>
  `

  openModal("Review Purchase Request", modalContent)

  document.getElementById("reviewRequestForm").addEventListener("submit", (e) => {
    e.preventDefault()
    const priority = document.getElementById("priorityLevel").value
    const notes = document.getElementById("reviewNotes").value

    if (priority && notes) {
      closeModal()
      showNotification("success", "Review Submitted", "Purchase request review has been submitted successfully.")
    }
  })
}

function showUpdateStatusModal(projectName, lead) {
  const modalContent = `
    <form id="updateStatusForm">
      <div class="info-grid">
        <div class="info-item">
          <span class="info-label">Project</span>
          <span class="info-value">${projectName}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Lead Researcher</span>
          <span class="info-value">${lead}</span>
        </div>
      </div>
      
      <div class="form-group">
        <label class="form-label">Project Status *</label>
        <select class="form-select" id="projectStatus" required>
          <option value="">Select status</option>
          <option value="on-track">On-Track</option>
          <option value="delayed">Delayed</option>
          <option value="at-risk">At Risk</option>
          <option value="completed">Completed</option>
        </select>
      </div>
      
      <div class="form-group">
        <label class="form-label">Progress Percentage *</label>
        <input type="number" class="form-input" id="progressPercent" min="0" max="100" placeholder="0-100" required>
      </div>
      
      <div class="form-group">
        <label class="form-label">Milestones Achieved</label>
        <textarea class="form-textarea" id="milestones" placeholder="List key milestones achieved..."></textarea>
      </div>
      
      <div class="form-group">
        <label class="form-label">Challenges Encountered</label>
        <textarea class="form-textarea" id="challenges" placeholder="Describe any challenges or blockers..."></textarea>
      </div>
      
      <div class="form-group">
        <label class="form-label">Next Steps</label>
        <textarea class="form-textarea" id="nextSteps" placeholder="Outline planned next steps..."></textarea>
      </div>
      
      <div class="form-group">
        <label class="form-label">Expected Completion Date</label>
        <input type="date" class="form-input" id="completionDate">
      </div>
      
      <div class="modal-actions">
        <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
        <button type="submit" class="btn btn-primary">Update Status</button>
      </div>
    </form>
  `

  openModal("Update Project Status", modalContent)

  document.getElementById("updateStatusForm").addEventListener("submit", (e) => {
    e.preventDefault()
    const status = document.getElementById("projectStatus").value
    const progress = document.getElementById("progressPercent").value

    if (status && progress) {
      closeModal()
      showNotification(
        "success",
        "Status Updated",
        `Project status for "${projectName}" has been updated to ${progress}%.`,
      )
    }
  })
}

function showViewDetailsModal(title, details) {
  const modalContent = `
    <div class="detail-row">
      <span class="detail-label">Request ID:</span>
      <span class="detail-value">PR-${Math.floor(1000 + Math.random() * 9000)}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">Item/Equipment:</span>
      <span class="detail-value">${title}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">Details:</span>
      <span class="detail-value">${details}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">Status:</span>
      <span class="detail-value"><span class="status-badge pending-badge">Pending Review</span></span>
    </div>
    <div class="detail-row">
      <span class="detail-label">Submitted Date:</span>
      <span class="detail-value">${new Date().toLocaleDateString()}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">Justification:</span>
      <span class="detail-value">Required for ongoing research activities and data collection.</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">Vendor:</span>
      <span class="detail-value">Scientific Equipment Supplier Co.</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">Expected Delivery:</span>
      <span class="detail-value">2-3 weeks after approval</span>
    </div>
    
    <div class="modal-actions">
      <button type="button" class="btn btn-secondary" onclick="closeModal()">Close</button>
      <button type="button" class="btn btn-primary" onclick="closeModal(); showNotification('info', 'Download', 'Purchase request PDF downloaded.')">Download PDF</button>
    </div>
  `

  openModal("Purchase Request Details", modalContent)
}

function showEndorseModal(title, button) {
  const modalContent = `
    <form id="endorseForm">
      <div class="info-item" style="margin-bottom: 20px;">
        <span class="info-label">Request</span>
        <span class="info-value">${title}</span>
      </div>
      
      <div class="form-group">
        <label class="form-label">Endorsement Level *</label>
        <select class="form-select" id="endorsementLevel" required>
          <option value="">Select endorsement level</option>
          <option value="approved">Fully Approved</option>
          <option value="conditional">Conditional Approval</option>
          <option value="needs-review">Needs Further Review</option>
        </select>
      </div>
      
      <div class="form-group">
        <label class="form-label">Budget Verification</label>
        <select class="form-select" id="budgetVerification">
          <option value="verified">Budget Verified</option>
          <option value="pending">Pending Verification</option>
          <option value="exceeded">Budget Exceeded</option>
        </select>
      </div>
      
      <div class="form-group">
        <label class="form-label">Endorsement Comments *</label>
        <textarea class="form-textarea" id="endorseComments" placeholder="Enter your endorsement comments and recommendations..." required></textarea>
      </div>
      
      <div class="form-group">
        <label class="form-label">Forward To</label>
        <select class="form-select" id="forwardTo">
          <option value="urds-director">URDS Director</option>
          <option value="vp-research">VP for Research</option>
          <option value="finance">Finance Office</option>
        </select>
      </div>
      
      <div class="modal-actions">
        <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
        <button type="submit" class="btn btn-success">Submit Endorsement</button>
      </div>
    </form>
  `

  openModal("Endorse Purchase Request", modalContent)

  document.getElementById("endorseForm").addEventListener("submit", (e) => {
    e.preventDefault()
    const level = document.getElementById("endorsementLevel").value
    const comments = document.getElementById("endorseComments").value

    if (level && comments) {
      closeModal()
      showNotification("success", "Endorsed", `Purchase request has been endorsed and forwarded for approval.`)

      // Update button to show endorsed state
      button.textContent = "Endorsed ✓"
      button.style.background = "#059669"
      button.disabled = true
      button.style.cursor = "not-allowed"
    }
  })
}

function showUserProfileModal() {
  const modalContent = `
    <div class="info-grid">
      <div class="info-item">
        <span class="info-label">Name</span>
        <span class="info-value">Dr. Jo Wilson</span>
      </div>
      <div class="info-item">
        <span class="info-label">Role</span>
        <span class="info-value">Cluster Coordinator</span>
      </div>
      <div class="info-item">
        <span class="info-label">Cluster</span>
        <span class="info-value">Natural Sciences</span>
      </div>
      <div class="info-item">
        <span class="info-label">Email</span>
        <span class="info-value">jo.wilson@university.edu</span>
      </div>
      <div class="info-item">
        <span class="info-label">Phone</span>
        <span class="info-value">+63 912 345 6789</span>
      </div>
      <div class="info-item">
        <span class="info-label">Office</span>
        <span class="info-value">Research Building, Room 301</span>
      </div>
    </div>
    
    <div style="margin-top: 24px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
      <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">Quick Actions</h3>
      <div style="display: flex; flex-direction: column; gap: 8px;">
        <button class="btn btn-secondary" style="width: 100%;" onclick="closeModal(); showNotification('info', 'Profile', 'Edit profile feature coming soon.')">Edit Profile</button>
        <button class="btn btn-secondary" style="width: 100%;" onclick="closeModal(); showNotification('info', 'Password', 'Change password feature coming soon.')">Change Password</button>
        <button class="btn btn-secondary" style="width: 100%;" onclick="closeModal(); showNotification('info', 'Preferences', 'Notification preferences updated.')">Notification Preferences</button>
      </div>
    </div>
    
    <div class="modal-actions">
      <button type="button" class="btn btn-secondary" onclick="closeModal()">Close</button>
    </div>
  `

  openModal("User Profile", modalContent)
}

function showSettingsModal() {
  const modalContent = `
    <div style="display: flex; flex-direction: column; gap: 20px;">
      <div class="form-group">
        <label class="form-label">Language</label>
        <select class="form-select">
          <option value="en">English</option>
          <option value="fil">Filipino</option>
        </select>
      </div>
      
      <div class="form-group">
        <label class="form-label">Theme</label>
        <select class="form-select">
          <option value="light">Light Mode</option>
          <option value="dark">Dark Mode (Coming Soon)</option>
        </select>
      </div>
      
      <div class="form-group">
        <label class="form-label">Email Notifications</label>
        <div style="display: flex; flex-direction: column; gap: 12px; padding: 12px 0;">
          <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
            <input type="checkbox" checked style="width: 16px; height: 16px;">
            <span style="font-size: 14px;">New submissions</span>
          </label>
          <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
            <input type="checkbox" checked style="width: 16px; height: 16px;">
            <span style="font-size: 14px;">Project updates</span>
          </label>
          <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
            <input type="checkbox" style="width: 16px; height: 16px;">
            <span style="font-size: 14px;">Weekly reports</span>
          </label>
        </div>
      </div>
      
      <div class="form-group">
        <label class="form-label">Time Zone</label>
        <select class="form-select">
          <option value="asia/manila">Asia/Manila (UTC+8)</option>
          <option value="asia/singapore">Asia/Singapore (UTC+8)</option>
        </select>
      </div>
    </div>
    
    <div class="modal-actions">
      <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
      <button type="button" class="btn btn-primary" onclick="closeModal(); showNotification('success', 'Settings Saved', 'Your preferences have been updated.')">Save Changes</button>
    </div>
  `

  openModal("Settings", modalContent)
}

function openModal(title, content) {
  const modal = document.getElementById("modalContainer")
  const modalTitle = document.getElementById("modalTitle")
  const modalBody = document.getElementById("modalBody")

  modalTitle.textContent = title
  modalBody.innerHTML = content
  modal.style.display = "flex"

  // Close modal when clicking outside
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeModal()
    }
  })

  // Close modal with Escape key
  document.addEventListener("keydown", handleEscapeKey)
}

function closeModal() {
  const modal = document.getElementById("modalContainer")
  modal.style.display = "none"
  document.removeEventListener("keydown", handleEscapeKey)
}

function handleEscapeKey(e) {
  if (e.key === "Escape") {
    closeModal()
  }
}

function showNotification(type, title, message) {
  const container = document.getElementById("notificationContainer")
  const notification = document.createElement("div")
  notification.className = `notification ${type}`

  const icon = getNotificationIcon(type)

  notification.innerHTML = `
    <div class="notification-icon">
      ${icon}
    </div>
    <div class="notification-content">
      <div class="notification-title">${title}</div>
      <div class="notification-message">${message}</div>
    </div>
  `

  container.appendChild(notification)

  // Auto remove after 5 seconds
  setTimeout(() => {
    notification.style.animation = "slideInRight 0.3s ease reverse"
    setTimeout(() => {
      notification.remove()
    }, 300)
  }, 5000)
}

function getNotificationIcon(type) {
  const icons = {
    success:
      '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    error:
      '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    info: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  }
  return icons[type] || icons.info
}

// Function for inline onclick handlers (backwards compatibility)
function showPage(pageName) {
  const pages = document.querySelectorAll(".page")
  pages.forEach((page) => page.classList.remove("active"))

  const selectedPage = document.getElementById(`${pageName}-page`)
  if (selectedPage) {
    selectedPage.classList.add("active")
  }

  // Update nav active state
  const navItems = document.querySelectorAll(".nav-item")
  navItems.forEach((nav) => nav.classList.remove("active"))

  const activeNav =
    document.querySelector(`.nav-item[data-page="${pageName}"]`) ||
    document.querySelector(`.nav-item[onclick*="${pageName}"]`)
  if (activeNav) {
    activeNav.classList.add("active")
  }
}

// Global variables
let facultyData = [];
let workloadData = [];
let activities = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    updateDateTime();
    setInterval(updateDateTime, 1000);
});

// Initialize application
function initializeApp() {
    loadSampleData();
    updateDashboard();
    populateFacultyTable();
    populateWorkloadTable();
    setupEventListeners();
}

// Load sample data for demonstration
function loadSampleData() {
    facultyData = [
        {
            id: 'FAC001',
            name: 'Dr. Emmanuel D. Santos',
            department: 'Computer Science',
            rank: 'Professor',
            email: 'santos@uep.edu.ph',
            contact: '+63 917 123 4567'
        },
        {
            id: 'FAC002',
            name: 'Prof. Maria L. Reyes',
            department: 'Mathematics',
            rank: 'Associate Professor',
            email: 'reyes@uep.edu.ph',
            contact: '+63 918 234 5678'
        },
        {
            id: 'FAC003',
            name: 'Ms. Anna S. Cruz',
            department: 'Physics',
            rank: 'Assistant Professor',
            email: 'cruz@uep.edu.ph',
            contact: '+63 919 345 6789'
        }
    ];

    workloadData = [
        {
            id: 1,
            facultyId: 'FAC001',
            facultyName: 'Dr. Emmanuel D. Santos',
            semester: '1st Semester',
            courseCode: 'CS 101',
            courseName: 'Introduction to Computer Science',
            units: 3,
            classHours: 6,
            section: 'A',
            schedule: 'MWF 8:00-9:00',
            totalLoad: 18
        },
        {
            id: 2,
            facultyId: 'FAC002',
            facultyName: 'Prof. Maria L. Reyes',
            semester: '1st Semester',
            courseCode: 'MATH 101',
            courseName: 'Calculus I',
            units: 4,
            classHours: 8,
            section: 'B',
            schedule: 'TTh 10:00-11:30',
            totalLoad: 32
        },
        {
            id: 3,
            facultyId: 'FAC003',
            facultyName: 'Ms. Anna S. Cruz',
            semester: '1st Semester',
            courseCode: 'PHY 101',
            courseName: 'General Physics I',
            units: 3,
            classHours: 6,
            section: 'A',
            schedule: 'MWF 9:00-10:00',
            totalLoad: 18
        }
    ];

    activities = [
        { time: '2024-01-15 10:30', action: 'Added new faculty: Dr. Emmanuel D. Santos' },
        { time: '2024-01-14 14:20', action: 'Assigned workload for CS 101' },
        { time: '2024-01-13 09:15', action: 'Updated faculty contact information' }
    ];
}

// Update date and time
function updateDateTime() {
    const now = new Date();
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
    };
    document.getElementById('dateTime').textContent = now.toLocaleDateString('en-US', options);
}

// Navigation functions
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Remove active class from all nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected section
    document.getElementById(sectionId).classList.add('active');
    
    // Add active class to clicked nav button
    event.target.classList.add('active');
    
    // Update specific section content
    if (sectionId === 'dashboard') {
        updateDashboard();
    } else if (sectionId === 'faculty') {
        populateFacultyTable();
    } else if (sectionId === 'workload') {
        populateWorkloadTable();
        populateWorkloadFacultySelect();
    } else if (sectionId === 'reports') {
        generateReport();
    }
}

// Dashboard functions
function updateDashboard() {
    // Update statistics
    document.getElementById('totalFaculty').textContent = facultyData.length;
    document.getElementById('totalCourses').textContent = workloadData.length;
    
    // Calculate average workload
    const avgLoad = workloadData.length > 0 ? 
        Math.round(workloadData.reduce((sum, item) => sum + item.totalLoad, 0) / workloadData.length) : 0;
    document.getElementById('avgWorkload').textContent = avgLoad;
    
    // Calculate total workload
    const totalLoad = workloadData.reduce((sum, item) => sum + item.totalLoad, 0);
    document.getElementById('totalLoad').textContent = totalLoad;
    
    // Update activities
    updateActivitiesList();
}

function updateActivitiesList() {
    const activitiesList = document.getElementById('activitiesList');
    
    if (activities.length === 0) {
        activitiesList.innerHTML = '<p class="no-activities">No recent activities</p>';
        return;
    }
    
    activitiesList.innerHTML = activities.slice(0, 5).map(activity => `
        <div class="activity-item">
            <strong>${activity.time}</strong> - ${activity.action}
        </div>
    `).join('');
}

// Faculty management functions
function showAddFacultyForm() {
    document.getElementById('addFacultyForm').style.display = 'block';
}

function hideAddFacultyForm() {
    document.getElementById('addFacultyForm').style.display = 'none';
    document.getElementById('facultyForm').reset();
}

function addFaculty(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const faculty = {
        id: document.getElementById('facultyId').value,
        name: document.getElementById('facultyName').value,
        department: document.getElementById('department').value,
        rank: document.getElementById('rank').value,
        email: document.getElementById('email').value,
        contact: document.getElementById('contact').value
    };
    
    // Check if faculty ID already exists
    if (facultyData.some(f => f.id === faculty.id)) {
        alert('Faculty ID already exists!');
        return;
    }
    
    facultyData.push(faculty);
    
    // Add activity
    activities.unshift({
        time: new Date().toLocaleString(),
        action: `Added new faculty: ${faculty.name}`
    });
    
    hideAddFacultyForm();
    populateFacultyTable();
    updateDashboard();
    
    // Show success message
    showNotification('Faculty added successfully!', 'success');
}

function populateFacultyTable() {
    const tbody = document.getElementById('facultyTableBody');
    const searchTerm = document.getElementById('facultySearch').value.toLowerCase();
    const departmentFilter = document.getElementById('departmentFilter').value;
    
    let filteredFaculty = facultyData.filter(faculty => {
        const matchesSearch = faculty.name.toLowerCase().includes(searchTerm) || 
                             faculty.id.toLowerCase().includes(searchTerm);
        const matchesDepartment = !departmentFilter || faculty.department === departmentFilter;
        return matchesSearch && matchesDepartment;
    });
    
    if (filteredFaculty.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center">No faculty found</td></tr>';
        return;
    }
    
    tbody.innerHTML = filteredFaculty.map(faculty => `
        <tr>
            <td>${faculty.id}</td>
            <td>${faculty.name}</td>
            <td>${faculty.department}</td>
            <td>${faculty.rank}</td>
            <td>${faculty.email}</td>
            <td>${faculty.contact}</td>
            <td>
                <button class="btn btn-sm" onclick="editFaculty('${faculty.id}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm" onclick="deleteFaculty('${faculty.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function searchFaculty() {
    populateFacultyTable();
}

function filterFaculty() {
    populateFacultyTable();
}

function editFaculty(facultyId) {
    const faculty = facultyData.find(f => f.id === facultyId);
    if (!faculty) return;
    
    // Populate form with faculty data
    document.getElementById('facultyId').value = faculty.id;
    document.getElementById('facultyName').value = faculty.name;
    document.getElementById('department').value = faculty.department;
    document.getElementById('rank').value = faculty.rank;
    document.getElementById('email').value = faculty.email;
    document.getElementById('contact').value = faculty.contact;
    
    showAddFacultyForm();
}

function deleteFaculty(facultyId) {
    if (!confirm('Are you sure you want to delete this faculty member?')) return;
    
    const faculty = facultyData.find(f => f.id === facultyId);
    facultyData = facultyData.filter(f => f.id !== facultyId);
    
    // Remove associated workloads
    workloadData = workloadData.filter(w => w.facultyId !== facultyId);
    
    // Add activity
    activities.unshift({
        time: new Date().toLocaleString(),
        action: `Deleted faculty: ${faculty.name}`
    });
    
    populateFacultyTable();
    populateWorkloadTable();
    updateDashboard();
    
    showNotification('Faculty deleted successfully!', 'success');
}

// Workload management functions
function showAddWorkloadForm() {
    populateWorkloadFacultySelect();
    document.getElementById('addWorkloadForm').style.display = 'block';
}

function hideAddWorkloadForm() {
    document.getElementById('addWorkloadForm').style.display = 'none';
    document.getElementById('workloadForm').reset();
}

function populateWorkloadFacultySelect() {
    const select = document.getElementById('workloadFaculty');
    select.innerHTML = '<option value="">Select Faculty</option>' +
        facultyData.map(faculty => 
            `<option value="${faculty.id}">${faculty.name} (${faculty.id})</option>`
        ).join('');
}

function addWorkload(event) {
    event.preventDefault();
    
    const facultyId = document.getElementById('workloadFaculty').value;
    const faculty = facultyData.find(f => f.id === facultyId);
    if (!faculty) return;
    
    const workload = {
        id: workloadData.length + 1,
        facultyId: facultyId,
        facultyName: faculty.name,
        semester: document.getElementById('semester').value,
        courseCode: document.getElementById('courseCode').value,
        courseName: document.getElementById('courseName').value,
        units: parseInt(document.getElementById('units').value),
        classHours: parseInt(document.getElementById('classHours').value),
        section: document.getElementById('section').value,
        schedule: document.getElementById('schedule').value,
        totalLoad: parseInt(document.getElementById('units').value) * parseInt(document.getElementById('classHours').value)
    };
    
    workloadData.push(workload);
    
    // Add activity
    activities.unshift({
        time: new Date().toLocaleString(),
        action: `Assigned workload: ${workload.courseCode} to ${faculty.name}`
    });
    
    hideAddWorkloadForm();
    populateWorkloadTable();
    updateDashboard();
    
    showNotification('Workload assigned successfully!', 'success');
}

function populateWorkloadTable() {
    populateCurrentWorkloadTable();
    populateAllWorkloadTable();
    updateWorkloadStats();
}

function populateCurrentWorkloadTable() {
    const tbody = document.getElementById('currentWorkloadTableBody');
    const currentSemester = getCurrentSemester();
    
    const currentWorkload = workloadData.filter(w => w.semester === currentSemester);
    
    if (currentWorkload.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center">No current workload data</td></tr>';
        return;
    }
    
    tbody.innerHTML = currentWorkload.map(workload => `
        <tr>
            <td>${workload.facultyName}</td>
            <td>${workload.courseCode}</td>
            <td>${workload.courseName}</td>
            <td>${workload.units}</td>
            <td>${workload.classHours}</td>
            <td>${workload.totalLoad}</td>
            <td>
                <button class="btn btn-sm" onclick="editWorkload(${workload.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm" onclick="deleteWorkload(${workload.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function populateAllWorkloadTable() {
    const tbody = document.getElementById('allWorkloadTableBody');
    
    if (workloadData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="text-center">No workload data</td></tr>';
        return;
    }
    
    tbody.innerHTML = workloadData.map(workload => `
        <tr>
            <td>${workload.facultyName}</td>
            <td>${workload.semester}</td>
            <td>${workload.courseCode}</td>
            <td>${workload.courseName}</td>
            <td>${workload.units}</td>
            <td>${workload.classHours}</td>
            <td>${workload.totalLoad}</td>
            <td>
                <button class="btn btn-sm" onclick="editWorkload(${workload.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm" onclick="deleteWorkload(${workload.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function getCurrentSemester() {
    const currentMonth = new Date().getMonth();
    if (currentMonth >= 0 && currentMonth <= 4) return '2nd Semester';
    if (currentMonth >= 5 && currentMonth <= 7) return 'Summer';
    return '1st Semester';
}

function updateWorkloadStats() {
    const currentSemester = getCurrentSemester();
    const currentWorkload = workloadData.filter(w => w.semester === currentSemester);
    
    document.getElementById('currentFacultyCount').textContent = 
        new Set(currentWorkload.map(w => w.facultyId)).size;
    document.getElementById('currentCourseCount').textContent = currentWorkload.length;
    
    const avgLoad = currentWorkload.length > 0 ? 
        Math.round(currentWorkload.reduce((sum, item) => sum + item.totalLoad, 0) / currentWorkload.length) : 0;
    document.getElementById('currentAvgLoad').textContent = avgLoad;
}

function showWorkloadTab(tabName) {
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Remove active class from all tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab content
    document.getElementById(tabName + 'Workload').classList.add('active');
    
    // Add active class to clicked tab button
    event.target.classList.add('active');
}

function editWorkload(workloadId) {
    const workload = workloadData.find(w => w.id === workloadId);
    if (!workload) return;
    
    // Populate form with workload data
    document.getElementById('workloadFaculty').value = workload.facultyId;
    document.getElementById('semester').value = workload.semester;
    document.getElementById('courseCode').value = workload.courseCode;
    document.getElementById('courseName').value = workload.courseName;
    document.getElementById('units').value = workload.units;
    document.getElementById('classHours').value = workload.classHours;
    document.getElementById('section').value = workload.section;
    document.getElementById('schedule').value = workload.schedule;
    
    showAddWorkloadForm();
}

function deleteWorkload(workloadId) {
    if (!confirm('Are you sure you want to delete this workload?')) return;
    
    const workload = workloadData.find(w => w.id === workloadId);
    workloadData = workloadData.filter(w => w.id !== workloadId);
    
    // Add activity
    activities.unshift({
        time: new Date().toLocaleString(),
        action: `Deleted workload: ${workload.courseCode}`
    });
    
    populateWorkloadTable();
    updateDashboard();
    
    showNotification('Workload deleted successfully!', 'success');
}

// Report functions
function generateReport() {
    const reportType = document.getElementById('reportType').value;
    const reportSemester = document.getElementById('reportSemester').value;
    const reportDepartment = document.getElementById('reportDepartment').value;
    
    // Filter data based on report parameters
    let filteredWorkload = workloadData;
    
    if (reportSemester !== 'current') {
        filteredWorkload = filteredWorkload.filter(w => w.semester === reportSemester);
    }
    
    if (reportDepartment) {
        filteredWorkload = filteredWorkload.filter(w => 
            facultyData.find(f => f.id === w.facultyId)?.department === reportDepartment
        );
    }
    
    // Generate report data
    const reportData = generateReportData(filteredWorkload);
    populateReportTable(reportData);
    generateChart(reportData);
}

function generateReportData(workload) {
    const facultyStats = {};
    
    workload.forEach(item => {
        if (!facultyStats[item.facultyId]) {
            facultyStats[item.facultyId] = {
                name: item.facultyName,
                department: facultyData.find(f => f.id === item.facultyId)?.department || '',
                totalUnits: 0,
                totalHours: 0
            };
        }
        
        facultyStats[item.facultyId].totalUnits += item.units;
        facultyStats[item.facultyId].totalHours += item.classHours;
    });
    
    return Object.values(facultyStats).map(stat => ({
        ...stat,
        status: stat.totalHours >= 24 ? 'Normal' : stat.totalHours >= 18 ? 'Light' : 'Heavy'
    }));
}

function populateReportTable(reportData) {
    const tbody = document.getElementById('reportTableBody');
    
    if (reportData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center">No data for selected criteria</td></tr>';
        return;
    }
    
    tbody.innerHTML = reportData.map(data => `
        <tr>
            <td>${data.name}</td>
            <td>${data.department}</td>
            <td>${data.totalUnits}</td>
            <td>${data.totalHours}</td>
            <td>
                <span class="status-badge ${data.status.toLowerCase()}">${data.status}</span>
            </td>
        </tr>
    `).join('');
}

function generateChart(reportData) {
    const ctx = document.getElementById('workloadChart').getContext('2d');
    
    // Destroy existing chart if it exists
    if (window.workloadChart) {
        window.workloadChart.destroy();
    }
}
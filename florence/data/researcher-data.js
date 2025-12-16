// Researcher Dashboard Dummy Data
// This file contains all dummy data used in the researcher dashboard

const researcherData = {
    // Current user information
    currentUser: {
        id: 'RES-001',
        name: 'Prof. Elena Gilbert',
        email: 'elena.gilbert@uep.edu.ph',
        department: 'Biology Department',
        college: 'College of Science',
        role: 'Faculty Researcher'
    },

    // Proposals data
    proposals: [
        {
            id: 'RP-2025-001',
            title: 'Biodiversity Assessment of Mt. Apo Natural Park',
            abstract: 'A comprehensive study of the biodiversity in Mt. Apo Natural Park, focusing on endemic species and conservation strategies.',
            objectives: [
                'Document species diversity in Mt. Apo Natural Park',
                'Identify endemic and threatened species',
                'Assess conservation status and threats',
                'Develop conservation recommendations'
            ],
            methodology: 'Field surveys, specimen collection, DNA analysis, and habitat assessment',
            budget: 150000,
            timeline: {
                start: '2025-01-15',
                end: '2025-12-15',
                duration: '12 months'
            },
            submissionDate: '2025-12-02',
            status: 'pending-twg',
            phase: 1,
            researcher: 'Prof. Elena Gilbert',
            department: 'Biology Dept',
            documents: {
                proposal: 'proposal-RP-2025-001.pdf',
                attachments: ['attachment1.pdf', 'attachment2.pdf']
            },
            version: 1,
            revisions: []
        },
        {
            id: 'RP-2025-002',
            title: 'AI-Driven Traffic Management System',
            abstract: 'Development of an intelligent traffic management system using artificial intelligence to optimize traffic flow in urban areas.',
            objectives: [
                'Develop AI algorithms for traffic prediction',
                'Create real-time traffic monitoring system',
                'Implement adaptive traffic signal control',
                'Evaluate system effectiveness'
            ],
            methodology: 'Machine learning, computer vision, IoT sensors, and simulation modeling',
            budget: 250000,
            timeline: {
                start: '2025-02-01',
                end: '2026-01-31',
                duration: '12 months'
            },
            submissionDate: '2025-11-28',
            status: 'revision',
            phase: 1,
            researcher: 'Engr. Damon Salvatore',
            department: 'Engineering',
            documents: {
                proposal: 'proposal-RP-2025-002.pdf',
                attachments: ['technical-specs.pdf']
            },
            version: 2,
            revisions: [
                {
                    version: 1,
                    date: '2025-11-28',
                    status: 'revision',
                    comments: 'Budget justification needs more detail'
                }
            ]
        },
        {
            id: 'RP-2025-003',
            title: 'Sustainable Agriculture Practices in Rice Production',
            abstract: 'Research on sustainable farming practices to improve rice yield while maintaining environmental sustainability.',
            objectives: [
                'Evaluate sustainable farming techniques',
                'Assess impact on rice yield',
                'Analyze economic viability',
                'Develop farmer training program'
            ],
            methodology: 'Field experiments, soil analysis, yield monitoring, and farmer surveys',
            budget: 180000,
            timeline: {
                start: '2025-03-01',
                end: '2026-02-28',
                duration: '12 months'
            },
            submissionDate: '2025-11-25',
            status: 'endorsed',
            phase: 2,
            researcher: 'Dr. Caroline Forbes',
            department: 'Agriculture',
            documents: {
                proposal: 'proposal-RP-2025-003.pdf',
                attachments: []
            },
            version: 1,
            revisions: []
        },
        {
            id: 'RP-2025-004',
            title: 'Mental Health Impact of Hybrid Learning',
            abstract: 'Study examining the psychological effects of hybrid learning models on students and faculty.',
            objectives: [
                'Assess mental health impacts of hybrid learning',
                'Identify stress factors',
                'Develop coping strategies',
                'Create support recommendations'
            ],
            methodology: 'Surveys, interviews, psychological assessments, and statistical analysis',
            budget: 50000,
            timeline: {
                start: '2025-01-01',
                end: '2025-12-31',
                duration: '12 months'
            },
            submissionDate: '2025-11-20',
            status: 'inhouse',
            phase: 2,
            researcher: 'Prof. Alaric Saltzman',
            department: 'Psychology',
            documents: {
                proposal: 'proposal-RP-2025-004.pdf',
                attachments: ['ethics-clearance.pdf']
            },
            version: 1,
            revisions: []
        },
        {
            id: 'RP-2025-005',
            title: 'Renewable Energy Solutions for Rural Communities',
            abstract: 'Feasibility study and implementation of renewable energy solutions for off-grid rural communities.',
            objectives: [
                'Assess energy needs of rural communities',
                'Evaluate renewable energy options',
                'Design and implement pilot project',
                'Assess economic and environmental impact'
            ],
            methodology: 'Energy audits, feasibility studies, pilot installation, and impact assessment',
            budget: 300000,
            timeline: {
                start: '2025-01-15',
                end: '2026-01-15',
                duration: '12 months'
            },
            submissionDate: '2025-10-15',
            status: 'notice-proceed',
            phase: 2,
            researcher: 'Engr. Stefan Salvatore',
            department: 'Engineering',
            documents: {
                proposal: 'proposal-RP-2025-005.pdf',
                attachments: ['feasibility-study.pdf']
            },
            version: 1,
            revisions: []
        },
        {
            id: 'RP-2025-006',
            title: 'Water Quality Assessment of Local Rivers',
            abstract: 'Comprehensive water quality monitoring and assessment of major rivers in the region.',
            objectives: [
                'Monitor water quality parameters',
                'Identify pollution sources',
                'Assess ecological health',
                'Develop remediation strategies'
            ],
            methodology: 'Water sampling, laboratory analysis, GIS mapping, and statistical analysis',
            budget: 120000,
            timeline: {
                start: '2025-09-10',
                end: '2026-09-10',
                duration: '12 months'
            },
            submissionDate: '2025-09-10',
            status: 'implementing',
            phase: 3,
            researcher: 'Dr. Bonnie Bennett',
            department: 'Environmental Science',
            documents: {
                proposal: 'proposal-RP-2025-006.pdf',
                attachments: []
            },
            version: 1,
            revisions: [],
            progress: {
                percentage: 45,
                lastUpdate: '2025-12-01',
                milestones: [
                    { name: 'Literature Review', completed: true, date: '2025-09-30' },
                    { name: 'Sampling Design', completed: true, date: '2025-10-15' },
                    { name: 'Field Sampling', completed: true, date: '2025-11-30' },
                    { name: 'Laboratory Analysis', completed: false, date: null },
                    { name: 'Data Analysis', completed: false, date: null },
                    { name: 'Report Writing', completed: false, date: null }
                ]
            }
        },
        {
            id: 'RP-2025-007',
            title: 'Ethnobotanical Study of Medicinal Plants',
            abstract: 'Documentation and analysis of traditional medicinal plants used by indigenous communities.',
            objectives: [
                'Document medicinal plant species',
                'Record traditional uses',
                'Analyze phytochemical properties',
                'Preserve indigenous knowledge'
            ],
            methodology: 'Ethnographic interviews, plant collection, laboratory analysis, and documentation',
            budget: 95000,
            timeline: {
                start: '2025-08-05',
                end: '2026-08-05',
                duration: '12 months'
            },
            submissionDate: '2025-08-05',
            status: 'monitoring',
            phase: 3,
            researcher: 'Dr. Klaus Mikaelson',
            department: 'Biology',
            documents: {
                proposal: 'proposal-RP-2025-007.pdf',
                attachments: []
            },
            version: 1,
            revisions: [],
            progress: {
                percentage: 75,
                lastUpdate: '2025-11-15',
                milestones: [
                    { name: 'Community Engagement', completed: true, date: '2025-09-01' },
                    { name: 'Plant Collection', completed: true, date: '2025-10-15' },
                    { name: 'Interviews', completed: true, date: '2025-11-01' },
                    { name: 'Laboratory Analysis', completed: true, date: '2025-11-15' },
                    { name: 'Data Compilation', completed: false, date: null },
                    { name: 'Report Writing', completed: false, date: null }
                ]
            }
        },
        {
            id: 'RP-2024-015',
            title: 'Climate Change Adaptation Strategies',
            abstract: 'Research on effective adaptation strategies for communities facing climate change impacts.',
            objectives: [
                'Assess climate change impacts',
                'Identify adaptation strategies',
                'Evaluate effectiveness',
                'Develop implementation guide'
            ],
            methodology: 'Climate modeling, community surveys, case studies, and impact assessment',
            budget: 200000,
            timeline: {
                start: '2024-06-15',
                end: '2025-06-15',
                duration: '12 months'
            },
            submissionDate: '2024-06-15',
            status: 'completed',
            phase: 3,
            researcher: 'Dr. Rebekah Mikaelson',
            department: 'Environmental Science',
            documents: {
                proposal: 'proposal-RP-2024-015.pdf',
                finalReport: 'final-report-RP-2024-015.pdf',
                attachments: ['data-analysis.xlsx', 'photos.zip']
            },
            version: 1,
            revisions: [],
            completionDate: '2025-06-15',
            rating: 4.5
        }
    ],

    // Comments and feedback
    comments: {
        'RP-2025-001': [],
        'RP-2025-002': [
            {
                id: 'COM-001',
                from: 'TWG - College of Engineering',
                fromRole: 'Technical Working Group',
                date: '2025-11-30',
                type: 'revision',
                message: 'The budget justification section needs more detail. Please provide itemized breakdown of major expenses.',
                attachments: ['feedback-RP-2025-002.pdf']
            },
            {
                id: 'COM-002',
                from: 'Dr. John Smith',
                fromRole: 'TWG Member',
                date: '2025-11-30',
                type: 'comment',
                message: 'Consider including a pilot study phase before full implementation.'
            }
        ],
        'RP-2025-004': [
            {
                id: 'COM-003',
                from: 'URDS Evaluators',
                fromRole: 'Research Evaluators',
                date: '2025-12-01',
                type: 'comment',
                message: 'Excellent proposal. The methodology is sound and well-structured.'
            }
        ],
        'RP-2025-006': [
            {
                id: 'COM-004',
                from: 'Cluster Coordinator',
                fromRole: 'URDS Staff',
                date: '2025-11-15',
                type: 'monitoring',
                message: 'Progress is on track. Please submit monitoring report by end of month.'
            }
        ],
        'RP-2025-007': [
            {
                id: 'COM-005',
                from: 'Cluster Coordinator',
                fromRole: 'URDS Staff',
                date: '2025-11-20',
                type: 'monitoring',
                message: 'Good progress. Ensure all ethical clearances are properly documented.'
            }
        ]
    },

    // Notifications
    notifications: [
        {
            id: 'NOTIF-001',
            type: 'status-change',
            title: 'Proposal Status Updated',
            message: 'Your proposal RP-2025-001 has been evaluated by TWG and is now pending review.',
            date: '2025-12-05',
            read: false,
            proposalId: 'RP-2025-001'
        },
        {
            id: 'NOTIF-002',
            type: 'revision',
            title: 'Revision Required',
            message: 'Your proposal RP-2025-002 requires revisions. Please check comments from TWG.',
            date: '2025-11-30',
            read: false,
            proposalId: 'RP-2025-002'
        },
        {
            id: 'NOTIF-003',
            type: 'approval',
            title: 'Notice to Proceed Issued',
            message: 'Your proposal RP-2025-005 has been approved. Notice to Proceed has been issued.',
            date: '2025-12-01',
            read: false,
            proposalId: 'RP-2025-005'
        },
        {
            id: 'NOTIF-004',
            type: 'comment',
            title: 'New Comment Received',
            message: 'You have received feedback on proposal RP-2025-004 from Research Evaluators.',
            date: '2025-12-01',
            read: true,
            proposalId: 'RP-2025-004'
        },
        {
            id: 'NOTIF-005',
            type: 'monitoring',
            title: 'Monitoring Report Due',
            message: 'Please submit your monitoring report for RP-2025-006 by December 31, 2025.',
            date: '2025-12-10',
            read: false,
            proposalId: 'RP-2025-006'
        }
    ],

    // Templates
    templates: [
        {
            id: 'TEMP-001',
            name: 'Research Proposal Template',
            description: 'Official template for research proposals',
            file: 'research-proposal-template.docx',
            category: 'proposal',
            lastUpdated: '2024-01-15'
        },
        {
            id: 'TEMP-002',
            name: 'Monitoring Form',
            description: 'Form for submitting research progress reports',
            file: 'monitoring-form.docx',
            category: 'monitoring',
            lastUpdated: '2024-01-15'
        },
        {
            id: 'TEMP-003',
            name: 'Purchase Request Form',
            description: 'Form for requesting research materials and supplies',
            file: 'purchase-request-form.docx',
            category: 'purchase',
            lastUpdated: '2024-01-15'
        },
        {
            id: 'TEMP-004',
            name: 'Extension Request Form',
            description: 'Form for requesting research timeline extension',
            file: 'extension-request-form.docx',
            category: 'extension',
            lastUpdated: '2024-01-15'
        },
        {
            id: 'TEMP-005',
            name: 'Final Report Template',
            description: 'Template for final research report submission',
            file: 'final-report-template.docx',
            category: 'completion',
            lastUpdated: '2024-01-15'
        },
        {
            id: 'TEMP-006',
            name: 'Ethical Clearance Form',
            description: 'Form for ethical clearance application',
            file: 'ethical-clearance-form.docx',
            category: 'ethics',
            lastUpdated: '2024-01-15'
        }
    ],

    // Monitoring reports
    monitoringReports: {
        'RP-2025-006': [
            {
                id: 'MON-001',
                reportDate: '2025-10-15',
                period: 'September 2025',
                status: 'submitted',
                progress: 30,
                activities: 'Completed literature review and sampling design',
                challenges: 'None',
                nextSteps: 'Begin field sampling'
            },
            {
                id: 'MON-002',
                reportDate: '2025-11-15',
                period: 'October 2025',
                status: 'submitted',
                progress: 45,
                activities: 'Completed field sampling at 5 locations',
                challenges: 'Weather delays affected some sampling dates',
                nextSteps: 'Begin laboratory analysis'
            }
        ],
        'RP-2025-007': [
            {
                id: 'MON-003',
                reportDate: '2025-10-01',
                period: 'September 2025',
                status: 'submitted',
                progress: 50,
                activities: 'Completed community engagement and initial plant collection',
                challenges: 'None',
                nextSteps: 'Continue plant collection and begin interviews'
            },
            {
                id: 'MON-004',
                reportDate: '2025-11-01',
                period: 'October 2025',
                status: 'submitted',
                progress: 75,
                activities: 'Completed interviews and laboratory analysis',
                challenges: 'Some plant samples were damaged during transport',
                nextSteps: 'Begin data compilation and report writing'
            }
        ]
    },

    // Purchase requests
    purchaseRequests: [
        {
            id: 'PR-001',
            proposalId: 'RP-2025-006',
            proposalTitle: 'Water Quality Assessment of Local Rivers',
            items: [
                { name: 'Water Sampling Kits', quantity: 10, unitCost: 2500, totalCost: 25000 },
                { name: 'Laboratory Glassware Set', quantity: 5, unitCost: 3000, totalCost: 15000 }
            ],
            totalAmount: 40000,
            justification: 'Required for water sampling and laboratory analysis',
            status: 'approved',
            requestDate: '2025-09-20',
            approvalDate: '2025-09-25'
        },
        {
            id: 'PR-002',
            proposalId: 'RP-2025-007',
            proposalTitle: 'Ethnobotanical Study of Medicinal Plants',
            items: [
                { name: 'Plant Press Set', quantity: 3, unitCost: 2000, totalCost: 6000 },
                { name: 'Herbarium Supplies', quantity: 1, unitCost: 5000, totalCost: 5000 }
            ],
            totalAmount: 11000,
            justification: 'Needed for proper plant specimen preservation',
            status: 'pending',
            requestDate: '2025-12-05'
        }
    ],

    // Dissemination records
    disseminations: {
        'RP-2024-015': [
            {
                id: 'DISS-001',
                type: 'publication',
                title: 'Climate Change Adaptation Strategies: A Case Study',
                venue: 'Journal of Environmental Science',
                date: '2025-08-15',
                status: 'published',
                link: 'https://example.com/publication'
            },
            {
                id: 'DISS-002',
                type: 'presentation',
                title: 'Community-Based Climate Adaptation',
                venue: 'International Conference on Climate Change',
                date: '2025-09-20',
                status: 'presented',
                location: 'Manila, Philippines'
            }
        ]
    }
};

// Helper functions to access data
function getProposalById(id) {
    return researcherData.proposals.find(p => p.id === id);
}

function getProposalsByStatus(status) {
    return researcherData.proposals.filter(p => p.status === status);
}

function getProposalsByPhase(phase) {
    return researcherData.proposals.filter(p => p.phase === phase);
}

function getCommentsForProposal(proposalId) {
    return researcherData.comments[proposalId] || [];
}

function getNotifications(unreadOnly = false) {
    if (unreadOnly) {
        return researcherData.notifications.filter(n => !n.read);
    }
    return researcherData.notifications;
}

function getTemplatesByCategory(category) {
    if (category) {
        return researcherData.templates.filter(t => t.category === category);
    }
    return researcherData.templates;
}

function getMonitoringReports(proposalId) {
    return researcherData.monitoringReports[proposalId] || [];
}

function getPurchaseRequests(proposalId = null) {
    if (proposalId) {
        return researcherData.purchaseRequests.filter(pr => pr.proposalId === proposalId);
    }
    return researcherData.purchaseRequests;
}

function getDisseminations(proposalId) {
    return researcherData.disseminations[proposalId] || [];
}


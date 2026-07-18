// Compact notifications for the dashboard dropdown
export const DASHBOARD_NOTIFICATIONS = [
  { id: 1, type: 'success', user: 'System', detail: 'synchronized SAP account records', time: '5 min ago', read: false },
  { id: 2, type: 'assign', user: 'Jordan', detail: 'assigned inquiry #Q-9812 to you', time: '12 min ago', read: false },
  { id: 3, type: 'warning', user: 'System', detail: 'GDPR Compliance Certificate renewal in 15 days', time: '2 hr ago', read: false },
  { id: 4, type: 'grade', user: 'System', detail: 'SAP Sold-To ID Hierarchy quiz graded: 84% (Passed)', time: '1 day ago', read: true }
];

// Full notifications for the notifications page
export const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    type: 'success',
    title: 'SAP Account Data Synchronized',
    message: 'The SAP customer master records database has been successfully updated with yesterday\'s batch records.',
    time: '5 mins ago',
    read: false
  },
  {
    id: 2,
    type: 'assign',
    title: 'Inquiry Assigned to You',
    message: 'Supervisor Jordan assigned ticket #Q-9812 (Sarah Jenkins from Acme Corp) to you for resolution.',
    time: '12 mins ago',
    read: false
  },
  {
    id: 3,
    type: 'warning',
    title: 'GDPR Compliance Retake Deadline',
    message: 'Your certification for Customer Data Protection & GDPR Compliance is set to renew in 15 days.',
    time: '2 hours ago',
    read: false
  },
  {
    id: 4,
    type: 'grade',
    title: 'Quiz Scored: SAP Sold-To ID Mapping',
    message: 'Your submitted quiz for SAP Sold-To ID Hierarchy has been graded: 84% (Passed).',
    time: '1 day ago',
    read: true
  },
  {
    id: 5,
    type: 'system',
    title: 'System Maintenance Scheduled',
    message: 'LAP Contact Center portals will undergo standard database indexing on Saturday at 2:00 AM UTC.',
    time: '2 days ago',
    read: true
  }
];

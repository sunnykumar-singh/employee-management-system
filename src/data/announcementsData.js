export const announcements = [
  { id: 1, announcementId: 'ANN001', title: 'Company Annual Day Celebration', department: 'HR', date: '05 Aug 2026', status: 'Published' },
  { id: 2, announcementId: 'ANN002', title: 'New Office Timing Policy', department: 'HR', date: '03 Aug 2026', status: 'Published' },
  { id: 3, announcementId: 'ANN003', title: 'Diwali Bonus Announcement', department: 'Finance', date: '01 Aug 2026', status: 'Scheduled' },
  { id: 4, announcementId: 'ANN004', title: 'System Maintenance on Sunday', department: 'IT', date: '30 Jul 2026', status: 'Draft' },
  { id: 5, announcementId: 'ANN005', title: 'Inter-Department Cricket Tournament', department: 'HR', date: '28 Jul 2026', status: 'Published' },
  { id: 6, announcementId: 'ANN006', title: 'Updated Travel Reimbursement Guidelines', department: 'Finance', date: '25 Jul 2026', status: 'Archived' },
];

export const announcementFilters = {
  departments: ['Department', 'HR', 'Finance', 'IT', 'Marketing'],
  statuses: ['Status', 'Published', 'Scheduled', 'Draft', 'Archived'],
};

export const announcementStatistics = [
  { title: 'Total Announcements', value: 128, icon: 'megaphone', color: 'bg-blue-100 text-blue-600' },
  { title: 'Published', value: 92, icon: 'check', color: 'bg-green-100 text-green-600' },
  { title: 'Scheduled', value: 18, icon: 'clock', color: 'bg-yellow-100 text-yellow-600' },
  { title: 'Drafts', value: 18, icon: 'file', color: 'bg-purple-100 text-purple-600' },
];

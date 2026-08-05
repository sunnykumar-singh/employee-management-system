export const announcements = [
  { id: 1, announcementId: 'ANN001', title: 'Company Annual Day Celebration', category: 'Event', department: 'HR', date: '05 Aug 2026', status: 'Published', message: 'We are excited to announce our Company Annual Day celebration on 20 August 2026 at the Grand Convention Hall. The event will feature cultural performances, awards, and dinner for all employees and their families. Please join us for an evening of celebration and recognition.' },
  { id: 2, announcementId: 'ANN002', title: 'New Office Timing Policy', category: 'Policy', department: 'HR', date: '03 Aug 2026', status: 'Published', message: 'Effective from 1 September 2026, the new flexible office timing policy will be implemented. Employees may now choose between 9:00 AM - 6:00 PM or 10:00 AM - 7:00 PM working hours, subject to manager approval and team coordination.' },
  { id: 3, announcementId: 'ANN003', title: 'Diwali Bonus Announcement', category: 'Finance', department: 'Finance', date: '01 Aug 2026', status: 'Scheduled', message: 'As part of this year\'s Diwali celebrations, the company will provide a festive bonus to all eligible employees. Detailed payout information and eligibility criteria will be shared through the payroll department before the festival.' },
  { id: 4, announcementId: 'ANN004', title: 'System Maintenance on Sunday', category: 'IT', department: 'IT', date: '30 Jul 2026', status: 'Draft', message: 'The internal systems and servers will undergo scheduled maintenance this Sunday from 2:00 AM to 6:00 AM. Access to HRMS, email, and other company portals may be temporarily unavailable during this window. Please save your work before the maintenance window.' },
  { id: 5, announcementId: 'ANN005', title: 'Inter-Department Cricket Tournament', category: 'Event', department: 'HR', date: '28 Jul 2026', status: 'Published', message: 'Get ready for the annual Inter-Department Cricket Tournament starting next month! Teams from each department will compete in a knockout format over the weekends. Register your team with the HR desk by 15 August 2026.' },
  { id: 6, announcementId: 'ANN006', title: 'Updated Travel Reimbursement Guidelines', category: 'Policy', department: 'Finance', date: '25 Jul 2026', status: 'Archived', message: 'The travel reimbursement guidelines have been updated to include digital receipts and faster claim processing. All new travel claims must be submitted with itemized bills within 15 days of the trip to ensure timely processing.' },
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

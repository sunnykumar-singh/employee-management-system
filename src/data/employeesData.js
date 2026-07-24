export const employeeStatistics = [
  { title: 'Total Employees', value: '256', change: '12 this month', trend: 'up', icon: 'users', color: '#4d46f5', background: '#ecebff' },
  { title: 'Active Employees', value: '230', change: '8 this month', trend: 'up', icon: 'active', color: '#15aa61', background: '#e5f8ed' },
  { title: 'On Leave', value: '14', change: '2 this month', trend: 'down', icon: 'leave', color: '#f3a11a', background: '#fff2df' },
  { title: 'New Joiners', value: '12', change: '5 this month', trend: 'up', icon: 'new', color: '#2d76df', background: '#e9f3ff' },
  { title: 'Resigned', value: '10', change: '1 this month', trend: 'down', icon: 'resigned', color: '#ef4444', background: '#ffeded' },
];

export const filterOptions = {
  departments: ['Department', 'Engineering', 'Marketing', 'Sales', 'HR', 'Finance'],
  designations: ['Designation', 'Senior Developer', 'Marketing Manager', 'Sales Executive', 'HR Manager', 'Accountant'],
  statuses: ['Status', 'Active', 'Inactive', 'On Leave'],
};

export const employees = [
  { id: 1, employeeId: 'EMP001', name: 'John Doe', initials: 'JD', email: 'john.doe@company.com', department: 'Engineering', designation: 'Senior Developer', phone: '+91 98765 43210', status: 'Active', joinDate: '01 Jan 2024', avatar: '#d1b29c' },
  { id: 2, employeeId: 'EMP002', name: 'Sarah Smith', initials: 'SS', email: 'sarah.smith@company.com', department: 'Marketing', designation: 'Marketing Manager', phone: '+91 98765 43211', status: 'Active', joinDate: '15 Feb 2024', avatar: '#9e7463' },
  { id: 3, employeeId: 'EMP003', name: 'Michael Brown', initials: 'MB', email: 'michael.brown@company.com', department: 'Sales', designation: 'Sales Executive', phone: '+91 98765 43212', status: 'Active', joinDate: '10 Mar 2024', avatar: '#987062' },
  { id: 4, employeeId: 'EMP004', name: 'Emily Johnson', initials: 'EJ', email: 'emily.johnson@company.com', department: 'HR', designation: 'HR Manager', phone: '+91 98765 43213', status: 'Active', joinDate: '05 Apr 2024', avatar: '#c59575' },
  { id: 5, employeeId: 'EMP005', name: 'David Wilson', initials: 'DW', email: 'david.wilson@company.com', department: 'Finance', designation: 'Accountant', phone: '+91 98765 43214', status: 'Active', joinDate: '18 Apr 2024', avatar: '#836756' },
  { id: 6, employeeId: 'EMP006', name: 'Jessica Davis', initials: 'JD', email: 'jessica.davis@company.com', department: 'Engineering', designation: 'UI/UX Designer', phone: '+91 98765 43215', status: 'On Leave', joinDate: '22 May 2024', avatar: '#b98776' },
  { id: 7, employeeId: 'EMP007', name: 'Daniel Martinez', initials: 'DM', email: 'daniel.martinez@company.com', department: 'Sales', designation: 'Sales Manager', phone: '+91 98765 43216', status: 'Active', joinDate: '30 May 2024', avatar: '#a07361' },
  { id: 8, employeeId: 'EMP008', name: 'Olivia Taylor', initials: 'OT', email: 'olivia.taylor@company.com', department: 'Marketing', designation: 'Content Writer', phone: '+91 98765 43217', status: 'Inactive', joinDate: '12 Jun 2024', avatar: '#bd907a' },
];

export const pagination = { start: 1, end: 8, total: 256, currentPage: 1, pages: [1, 2, 3, 4, 5], pageSize: '10 / page' };

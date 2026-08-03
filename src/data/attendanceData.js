export const attendanceStatistics = [
  { title: 'Present Today', value: '185', change: '12 this week', trend: 'up', icon: 'calendar', color: '#2585f3', background: '#e7f1ff', border: '#d7e7ff' },
  { title: 'Absent Today', value: '28', change: '5 this week', trend: 'down', icon: 'userCheck', color: '#0ea65d', background: '#e7f8ee', border: '#d8f0e2' },
  { title: 'Late Today', value: '16', change: '2 this week', trend: 'down', icon: 'clock', color: '#f79009', background: '#fff2df', border: '#fde7cb' },
  { title: 'Total Employees', value: '256', change: 'No change', trend: 'none', icon: 'users', color: '#5448ed', background: '#efedff', border: '#e4e1ff' },
  { title: 'Attendance Rate', value: '92.4%', change: '3.2% this month', trend: 'up', icon: 'chart', color: '#1683f5', background: '#e8f3ff', border: '#dceafe' },
];

export const attendanceFilters = {
  departments: ['Department', 'Engineering', 'Marketing', 'Sales', 'HR', 'Finance'],
  designations: ['Designation', 'Senior Developer', 'Marketing Manager', 'Sales Executive', 'HR Manager', 'Accountant'],
  statuses: ['All Status', 'Present', 'Absent', 'Late'],
};

export const attendanceRecords = [
  { id: 1, employeeId: 'EMP001', name: 'John Doe', department: 'Engineering', designation: 'Senior Developer', date: '24 May 2026', checkIn: '09:05 AM', checkOut: '06:10 PM', status: 'Present', workingHours: '9h 05m', avatar: '#b77f62' },
  { id: 2, employeeId: 'EMP002', name: 'Sarah Smith', department: 'Marketing', designation: 'Marketing Manager', date: '24 May 2026', checkIn: '09:18 AM', checkOut: '06:00 PM', status: 'Present', workingHours: '8h 42m', avatar: '#a96852' },
  { id: 3, employeeId: 'EMP003', name: 'Michael Brown', department: 'Sales', designation: 'Sales Executive', date: '24 May 2026', checkIn: '09:45 AM', checkOut: '06:20 PM', status: 'Late', workingHours: '8h 35m', avatar: '#a8735e' },
  { id: 4, employeeId: 'EMP004', name: 'Emily Johnson', department: 'HR', designation: 'HR Manager', date: '24 May 2026', checkIn: '-', checkOut: '-', status: 'Absent', workingHours: '0h 00m', avatar: '#b27c68' },
  { id: 5, employeeId: 'EMP005', name: 'David Wilson', department: 'Finance', designation: 'Accountant', date: '24 May 2026', checkIn: '09:00 AM', checkOut: '05:55 PM', status: 'Present', workingHours: '8h 55m', avatar: '#8f6955' },
];

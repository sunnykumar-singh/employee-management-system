export const departmentStatistics = [
  { title: 'Total Departments', value: '12', change: '2 this month', trend: 'up', icon: 'building', color: '#4338e8', background: '#eeedff', border: '#e3e1ff' },
  { title: 'Total Employees', value: '256', change: '18 this month', trend: 'up', icon: 'employees', color: '#08a65b', background: '#e6f8ee', border: '#d7f0e2' },
  { title: 'Department Heads', value: '12', change: 'No change', trend: 'none', icon: 'heads', color: '#ed7900', background: '#fff3e3', border: '#fde7cf' },
  { title: 'Avg. Employees / Dept', value: '21.3', change: '4.5 this month', trend: 'up', icon: 'average', color: '#0877ed', background: '#e9f3ff', border: '#dceafe' },
];

export const departmentFilterOptions = {
  heads: ['Department Head', 'John Doe', 'Sarah Smith', 'Michael Brown', 'Emily Johnson', 'David Wilson'],
  statuses: ['Status', 'Active', 'Inactive'],
};

export const departments = [
  { id: 1, name: 'Engineering', head: 'John Doe', employees: 89, description: 'Handles product development and technical operations', status: 'Active', icon: 'code', color: '#5a4ff2', background: '#ecebff', avatar: '#b77f62' },
  { id: 2, name: 'Marketing', head: 'Sarah Smith', employees: 45, description: 'Handles branding, promotions and market research', status: 'Active', icon: 'megaphone', color: '#6858ee', background: '#ecebff', avatar: '#a96852' },
  { id: 3, name: 'Sales', head: 'Michael Brown', employees: 38, description: 'Responsible for sales, client relations and revenue growth', status: 'Active', icon: 'chart', color: '#2585f3', background: '#e7f2ff', avatar: '#a8735e' },
  { id: 4, name: 'Human Resources', head: 'Emily Johnson', employees: 25, description: 'Manages recruitment, employee relations and policies', status: 'Active', icon: 'users', color: '#0ab16b', background: '#e5f8ee', avatar: '#b27c68' },
  { id: 5, name: 'Finance', head: 'David Wilson', employees: 34, description: 'Handles budgeting, accounts and financial planning', status: 'Active', icon: 'wallet', color: '#ef8a09', background: '#fff3e5', avatar: '#8f6955' },
  { id: 6, name: 'Customer Support', head: 'Jessica Davis', employees: 18, description: 'Handles customer queries and post-sales support', status: 'Active', icon: 'headphones', color: '#1683f5', background: '#e8f3ff', avatar: '#9e6a58' },
  { id: 7, name: 'Design', head: 'Daniel Martinez', employees: 12, description: 'Responsible for UI/UX and visual design', status: 'Active', icon: 'pen', color: '#f04438', background: '#ffebeb', avatar: '#ad775d' },
  { id: 8, name: 'Quality Assurance', head: 'Olivia Taylor', employees: 10, description: 'Ensures product quality and process improvements', status: 'Active', icon: 'shield', color: '#0eaf72', background: '#e4f8ee', avatar: '#a66f59' },
];

export const departmentPagination = { start: 1, end: 8, total: 12, currentPage: 1, pages: [1, 2], pageSize: '10 / page' };

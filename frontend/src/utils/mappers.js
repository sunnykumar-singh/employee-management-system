const AVATARS = ['#d1b29c', '#9e7463', '#987062', '#c59575', '#836756', '#b98776', '#a07361', '#bd907a', '#6659f5'];

const DEPARTMENT_STYLES = [
  { icon: 'code', color: '#5a4ff2', background: '#ecebff', avatar: '#b77f62' },
  { icon: 'megaphone', color: '#6858ee', background: '#ecebff', avatar: '#a96852' },
  { icon: 'chart', color: '#2585f3', background: '#e7f2ff', avatar: '#a8735e' },
  { icon: 'users', color: '#0ab16b', background: '#e5f8ee', avatar: '#b27c68' },
  { icon: 'wallet', color: '#ef8a09', background: '#fff3e5', avatar: '#8f6955' },
];

export const EMPLOYEE_STATUSES = ['Active', 'Inactive', 'On Leave', 'Resigned'];
export const DEPARTMENT_STATUSES = ['Active', 'Inactive'];
export const ATTENDANCE_STATUSES = ['Present', 'Absent', 'Late'];
export const LEAVE_TYPES = ['Casual', 'Sick', 'Annual', 'Emergency'];
export const LEAVE_STATUSES = ['Pending', 'Approved', 'Rejected'];
export const ANNOUNCEMENT_STATUSES = ['Draft', 'Published', 'Scheduled', 'Archived'];
export const DESIGNATIONS = ['Senior Developer', 'Marketing Manager', 'Sales Executive', 'HR Manager', 'Accountant', 'UI/UX Designer', 'Sales Manager', 'Content Writer'];

const labelize = (value) => {
  if (!value) return '';
  return value
    .toLowerCase()
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
};

const enumize = (value) => String(value || '').trim().replace(/\s+/g, '_').toUpperCase();

export const formatDisplayDate = (value) => {
  if (!value) return '';
  if (/^\d{4}-\d{2}-\d{2}/.test(value)) {
    return new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(`${value.slice(0, 10)}T00:00:00`));
  }
  return value;
};

export const toInputDate = (value) => {
  if (!value) return '';
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  const parsed = new Date(`${value} 12:00:00`);
  return Number.isNaN(parsed.getTime()) ? '' : parsed.toISOString().slice(0, 10);
};

export const to12Hour = (value) => {
  if (!value || value === '-') return '-';
  const [hours, minutes] = value.split(':').map(Number);
  if (Number.isNaN(hours)) return value;
  const period = hours >= 12 ? 'PM' : 'AM';
  const hour = hours % 12 || 12;
  return `${String(hour).padStart(2, '0')}:${String(minutes).padStart(2, '0')} ${period}`;
};

export const to24Hour = (value) => {
  if (!value || value === '-') return null;
  if (/^\d{2}:\d{2}$/.test(value)) return value;
  const [time, period] = value.split(' ');
  if (!time || !period) return null;
  const [rawHours, minutes] = time.split(':').map(Number);
  let hours = rawHours % 12;
  if (period.toUpperCase() === 'PM') hours += 12;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
};

export const mapEmployee = (employee) => {
  const name = employee.fullName || employee.name || '';
  return {
    id: employee.id,
    employeeId: employee.employeeId,
    name,
    fullName: name,
    initials: name.split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase(),
    email: employee.email,
    phone: employee.phone,
    department: employee.department?.name || employee.department || '',
    departmentId: employee.department?.id || employee.departmentId,
    designation: employee.designation,
    status: labelize(employee.status).replace('On_leave', 'On Leave').replace('On Leave', 'On Leave'),
    gender: labelize(employee.gender),
    joinDate: formatDisplayDate(employee.joiningDate || employee.joinDate),
    joiningDate: employee.joiningDate || toInputDate(employee.joinDate),
    profilePhoto: employee.profilePhoto || null,
    avatar: AVATARS[(employee.id || 0) % AVATARS.length],
    isActive: employee.isActive,
    isNewJoiner: employee.isNewJoiner || false,
  };
};

export const getSelectedFile = (value) => {
  if (!value) return null;
  if (value instanceof File) return value;
  if (typeof FileList !== 'undefined' && value instanceof FileList) return value[0] || null;
  if (Array.isArray(value)) return value[0] || null;
  return null;
};

export const toEmployeePayload = (values, departments) => {
  const department = departments.find((item) => String(item.id) === String(values.departmentId) || item.name === values.department);
  return {
    employeeId: values.employeeId.trim(),
    fullName: values.fullName.trim(),
    email: values.email.trim(),
    phone: values.phone.trim(),
    departmentId: department?.id,
    designation: values.designation,
    joiningDate: values.joiningDate,
    status: enumize(values.status),
    gender: enumize(values.gender),
  };
};

export const mapDepartment = (department, index = 0) => ({
  ...DEPARTMENT_STYLES[index % DEPARTMENT_STYLES.length],
  id: department.id,
  departmentId: department.departmentId,
  name: department.name,
  head: department.head,
  description: department.description,
  headPhoto: department.headPhoto || null,
  status: labelize(department.status),
  employees: department.employeeCount ?? department.employees ?? 0,
});

export const toDepartmentPayload = (values) => ({
  departmentId: values.departmentId.trim(),
  name: values.departmentName.trim(),
  head: values.departmentHead.trim(),
  description: values.description.trim(),
  status: enumize(values.status),
});

export const mapAttendance = (record) => ({
  id: record.id,
  employeePk: record.employee?.id,
  employeeId: record.employee?.employeeId || record.employeeId,
  name: record.employee?.fullName || record.name,
  department: record.employee?.department?.name || record.department || '',
  departmentId: record.employee?.department?.id,
  designation: record.employee?.designation || record.designation,
  date: formatDisplayDate(record.date),
  rawDate: record.date,
  checkIn: to12Hour(record.checkIn),
  checkOut: to12Hour(record.checkOut),
  status: labelize(record.status),
  workingHours: record.workingHours,
  profilePhoto: record.employee?.profilePhoto || record.profilePhoto || null,
  avatar: AVATARS[(record.employee?.id || record.id || 0) % AVATARS.length],
});

export const toAttendancePayload = (record) => ({
  employeeId: record.employeePk,
  date: record.rawDate || toInputDate(record.date),
  checkIn: record.status === 'Absent' ? null : to24Hour(record.checkIn),
  checkOut: record.status === 'Absent' ? null : to24Hour(record.checkOut),
  status: enumize(record.status),
});

export const mapLeave = (leave) => ({
  id: leave.id,
  employeePk: leave.employee?.id,
  employeeId: leave.employee?.employeeId || leave.employeeId,
  employee: leave.employee?.fullName || leave.employee,
  department: leave.employee?.department?.name || leave.department || '',
  departmentId: leave.employee?.department?.id,
  leaveType: labelize(leave.leaveType),
  from: formatDisplayDate(leave.fromDate || leave.from),
  to: formatDisplayDate(leave.toDate || leave.to),
  fromDate: leave.fromDate || toInputDate(leave.from),
  toDate: leave.toDate || toInputDate(leave.to),
  days: leave.days,
  reason: leave.reason,
  status: labelize(leave.status),
  appliedOn: formatDisplayDate(leave.appliedOn),
  remarks: leave.remarks,
});

export const toLeavePayload = (leave, values = {}) => ({
  employeeId: leave.employeePk,
  leaveType: enumize(values.leaveType || leave.leaveType),
  fromDate: values.from || values.fromDate || leave.fromDate,
  toDate: values.to || values.toDate || leave.toDate,
  reason: (values.reason || leave.reason || '').trim(),
});

export const mapAnnouncement = (announcement) => ({
  id: announcement.id,
  announcementId: announcement.announcementId,
  title: announcement.title,
  category: labelize(announcement.category),
  department: announcement.department?.name || announcement.department || 'All Departments',
  departmentId: announcement.department?.id ?? null,
  date: formatDisplayDate((announcement.createdAt || '').slice(0, 10) || announcement.date),
  status: labelize(announcement.status),
  message: announcement.message,
  scheduledAt: announcement.scheduledAt,
  publishedAt: announcement.publishedAt,
});

export const toAnnouncementPayload = (values, departments) => {
  const isAllDepartments = !values.department
    || values.department === 'All Departments'
    || values.departmentId === null
    || values.departmentId === 'ALL';
  const department = isAllDepartments
    ? null
    : departments.find((item) => String(item.id) === String(values.departmentId) || item.name === values.department);
  return {
    title: values.title.trim(),
    category: enumize(values.category),
    departmentId: department?.id ?? null,
    message: values.message.trim(),
    status: enumize(values.status),
  };
};

export const unwrapPage = (payload) => payload?.data ?? payload;
export const unwrapItem = (payload) => payload?.data ?? payload;

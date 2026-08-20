import { Navigate, Route, Routes } from 'react-router-dom';
import { GuestRoute, ProtectedRoute } from '../components/common/ProtectedRoute.jsx';
import AdminLayout from '../layouts/AdminLayout.jsx';
import EmployeeLayout from '../layouts/EmployeeLayout.jsx';
import Login from '../pages/auth/Login.jsx';
import Register from '../pages/auth/Register.jsx';
import AdminDashboard from '../pages/admin/Dashboard.jsx';
import Employees from '../pages/admin/Employees.jsx';
import Departments from '../pages/admin/Departments.jsx';
import Attendance from '../pages/admin/Attendance.jsx';
import Leaves from '../pages/admin/LeaveManagement.jsx';
import Announcements from '../pages/admin/Announcements.jsx';
import Settings from '../pages/admin/Settings.jsx';
import AdminProfile from '../pages/admin/Profile.jsx';
import EmployeeDashboard from '../pages/employee/Dashboard.jsx';
import EmployeeAttendance from '../pages/employee/Attendance.jsx';
import EmployeeAnnouncements from '../pages/employee/Announcements.jsx';
import EmployeeProfile from '../pages/employee/Profile.jsx';
import MyLeaves from '../pages/employee/MyLeaves.jsx';
import NotFound from '../pages/NotFound.jsx';

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Navigate to="/login" replace />} />

    <Route element={<GuestRoute />}>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Route>

    <Route element={<ProtectedRoute roles={['ADMIN']} />}>
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="employees" element={<Employees />} />
        <Route path="departments" element={<Departments />} />
        <Route path="attendance" element={<Attendance />} />
        <Route path="leave-management" element={<Leaves />} />
        <Route path="announcements" element={<Announcements />} />
        <Route path="settings" element={<Settings />} />
        <Route path="profile" element={<AdminProfile />} />
      </Route>
    </Route>

    <Route element={<ProtectedRoute roles={['EMPLOYEE']} />}>
      <Route path="/employee" element={<EmployeeLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<EmployeeDashboard />} />
        <Route path="attendance" element={<EmployeeAttendance />} />
        <Route path="leaves" element={<MyLeaves />} />
        <Route path="announcements" element={<EmployeeAnnouncements />} />
        <Route path="profile" element={<EmployeeProfile />} />
      </Route>
    </Route>

    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default AppRoutes;

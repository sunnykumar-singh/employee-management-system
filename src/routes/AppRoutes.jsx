import { Navigate, Route, Routes } from 'react-router-dom';
import Login from '../pages/auth/Login.jsx';
import Register from '../pages/auth/Register.jsx';

import AdminLayout from '../layouts/AdminLayout.jsx';
import AdminDashboard from '../pages/admin/Dashboard.jsx';
import Employees from '../pages/admin/Employees.jsx';
import Departments from '../pages/admin/Departments.jsx';
import Attendance from '../pages/admin/Attendance.jsx';
import Leaves from '../pages/admin/LeaveManagement.jsx';
import Announcements from '../pages/admin/Announcements.jsx';
import Settings from '../pages/admin/Settings.jsx';
import Profile from '../pages/admin/Profile.jsx';
import EmployeeDashboard from '../pages/employee/Dashboard.jsx';
import NotFound from '../pages/NotFound.jsx';

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Navigate to="/login" replace />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/admin" element={<AdminLayout />}>
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard" element={<AdminDashboard />} />
      <Route path="employees" element={<Employees />} />
      <Route path="departments" element={<Departments />} />
      <Route path="attendance" element={<Attendance />} />
      <Route path="leave-management" element={<Leaves />} />
      <Route path="announcements" element={<Announcements />} />
      <Route path="settings" element={<Settings />} />
      <Route path="profile" element={<Profile />} />
    </Route>
    <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default AppRoutes;

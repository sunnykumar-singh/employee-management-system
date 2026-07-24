import { Navigate, Route, Routes } from 'react-router-dom';
import Login from '../pages/auth/Login.jsx';
import AdminDashboard from '../pages/admin/Dashboard.jsx';
import EmployeeDashboard from '../pages/employee/Dashboard.jsx';
import NotFound from '../pages/NotFound.jsx';

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Navigate to="/login" replace />} />
    <Route path="/login" element={<Login />} />
    <Route path="/admin/dashboard" element={<AdminDashboard />} />
    <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default AppRoutes;

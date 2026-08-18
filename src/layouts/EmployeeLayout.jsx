import { LogOut, UserRound } from 'lucide-react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const linkClass = ({ isActive }) =>
  `rounded-lg px-3 py-2 text-sm font-medium ${isActive ? 'bg-[#ecebff] text-[#4b3df2]' : 'text-[#344767] hover:bg-slate-100'}`;

const EmployeeLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-dvh bg-[#f8fafc] text-[#101828]">
      <header className="sticky top-0 z-30 border-b border-[#e8edf5] bg-white px-4 sm:px-7">
        <div className="mx-auto flex h-[78px] max-w-[1280px] items-center gap-4">
          <span className="text-lg font-bold text-[#101828]">EMS</span>
          <nav className="flex items-center gap-1">
            <NavLink className={linkClass} to="/employee/dashboard">Dashboard</NavLink>
            <NavLink className={linkClass} to="/employee/leaves">My Leaves</NavLink>
            <NavLink className={linkClass} to="/employee/profile">Profile</NavLink>
          </nav>
          <div className="ml-auto flex items-center gap-3">
            <span className="hidden sm:block text-right">
              <span className="block text-sm font-semibold">{user?.fullName}</span>
              <span className="block text-xs text-[#344767]">{user?.role}</span>
            </span>
            <span className="flex size-10 items-center justify-center rounded-full bg-[#e7d5bc] text-[#102751]">
              <UserRound size={20} />
            </span>
            <button className="rounded-lg p-2 text-[#f04438] hover:bg-red-50" type="button" onClick={handleLogout} aria-label="Logout">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-[1280px] p-4 sm:p-6 lg:p-7">
        <Outlet />
      </main>
    </div>
  );
};

export default EmployeeLayout;

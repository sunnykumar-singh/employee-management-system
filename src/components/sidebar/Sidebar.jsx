import {
  Building2,
  CalendarDays,
  ClipboardCheck,
  LayoutDashboard,
  LogOut,
  Megaphone,
  Settings,
  UserRound,
  Users,
  X,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import SidebarItem from './SidebarItem.jsx';

const navigationItems = [
  { label: 'Dashboard', to: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Employees', to: '/admin/employees', icon: Users },
  { label: 'Departments', to: '/admin/departments', icon: Building2 },
  { label: 'Attendance', to: '/admin/attendance', icon: ClipboardCheck },
  { label: 'Leave Management', to: '/admin/leave-management', icon: CalendarDays },
  { label: 'Announcements', to: '/admin/announcements', icon: Megaphone },
  { label: 'Settings', to: '/admin/settings', icon: Settings },
  { label: 'Profile', to: '/admin/profile', icon: UserRound },
];

const Sidebar = ({ isOpen, onClose }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleItemClick = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      onClose();
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <>
      {isOpen && (
        <button
          className="fixed inset-0 z-40 bg-black/55 backdrop-blur-[2px] transition-opacity lg:hidden"
          type="button"
          onClick={onClose}
          aria-label="Close navigation menu"
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-60 flex-col bg-[#03142d] px-3 py-5 shadow-2xl shadow-slate-950/30 transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="Admin navigation"
      >
        <div className="flex items-center justify-between px-2 pb-5">
          <div className="flex items-center gap-3">
            <span className="flex size-11 items-center justify-center rounded-lg bg-[linear-gradient(135deg,#655aff,#3e2ee8)] shadow-lg shadow-indigo-950/35">
              <Users size={25} fill="white" strokeWidth={2.1} />
            </span>
            <div>
              <span className="block text-2xl font-bold leading-none tracking-tight text-white">EMS</span>
              <span className="mt-1 block text-[9px] text-slate-200">Employee Management System</span>
            </div>
          </div>
          <button
            className="rounded-lg p-2 text-slate-300 transition hover:bg-white/10 hover:text-white lg:hidden"
            type="button"
            onClick={onClose}
            aria-label="Close navigation menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="min-h-0 flex-1 space-y-1 overflow-y-auto border-t border-white/15 pt-4 pr-1">
          {navigationItems.map((item) => (
            <SidebarItem key={item.to} {...item} onClick={handleItemClick} />
          ))}
        </nav>

        <div className="mt-5 border-t border-white/15 pt-4">
          <SidebarItem label="Logout" icon={LogOut} onClick={handleLogout} />
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

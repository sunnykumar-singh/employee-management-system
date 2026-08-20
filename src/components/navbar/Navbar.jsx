import { Bell, CalendarDays, ChevronDown, LogOut, Menu, Settings, UserRound } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { listLeaves } from '../../services/leaveService.js';

const Navbar = ({ onMenuToggle }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const accountMenuRef = useRef(null);
  const notificationsRef = useRef(null);
  const isAdmin = user?.role === 'ADMIN';
  const basePath = isAdmin ? '/admin' : '/employee';
  const displayName = user?.fullName || (isAdmin ? 'Admin User' : 'Employee');
  const displayRole = isAdmin ? 'Super Admin' : user?.role || 'User';

  const loadNotifications = useCallback(async () => {
    if (!isAdmin) return;
    try {
      const page = await listLeaves({ page: 0, size: 5, status: 'PENDING' });
      setNotifications(page.content || []);
      setNotificationCount(page.totalElements || 0);
    } catch {
      // Notifications are supplementary; don't interrupt normal navigation if they cannot be loaded.
    }
  }, [isAdmin]);

  useEffect(() => {
    const closeOnOutsideClick = (event) => {
      if (!accountMenuRef.current?.contains(event.target)) {
        setIsAccountMenuOpen(false);
      }
      if (!notificationsRef.current?.contains(event.target)) {
        setIsNotificationsOpen(false);
      }
    };
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') {
        setIsAccountMenuOpen(false);
        setIsNotificationsOpen(false);
      }
    };

    document.addEventListener('mousedown', closeOnOutsideClick);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('mousedown', closeOnOutsideClick);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, []);

  useEffect(() => {
    loadNotifications();
    const refreshTimer = window.setInterval(loadNotifications, 60000);
    return () => window.clearInterval(refreshTimer);
  }, [loadNotifications]);

  const openProfile = () => {
    setIsAccountMenuOpen(false);
    navigate(`${basePath}/profile`);
  };

  const openSettings = () => {
    setIsAccountMenuOpen(false);
    navigate(isAdmin ? '/admin/settings' : '/employee/profile');
  };

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const openLeaveRequests = () => {
    setIsNotificationsOpen(false);
    navigate('/admin/leave-management');
  };

  const notificationLabel = notificationCount > 9 ? '9+' : notificationCount;

  return (
  <header className="sticky top-0 z-30 h-[78px] border-b border-[#e8edf5] bg-white px-4 sm:px-7 lg:px-8">
    <div className="flex h-full items-center gap-3">
        <button
          className="rounded-lg p-2 text-[#092041] transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          type="button"
          onClick={onMenuToggle}
          aria-label="Open navigation menu"
        >
          <Menu size={21} />
        </button>

        <div className="ml-auto flex items-center gap-2 sm:gap-4">
          {isAdmin && (
            <div className="relative" ref={notificationsRef}>
              <button
                className="relative rounded-lg p-2 text-[#092041] transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                type="button"
                onClick={() => setIsNotificationsOpen((open) => !open)}
                aria-label={`Notifications${notificationCount ? `, ${notificationCount} pending leave requests` : ''}`}
                aria-expanded={isNotificationsOpen}
                aria-haspopup="menu"
              >
                <Bell size={20} />
                {notificationCount > 0 && <span className="absolute right-0 top-0 flex min-w-4 items-center justify-center rounded-full bg-[#ff4d4f] px-1 text-[9px] font-bold leading-4 text-white">{notificationLabel}</span>}
              </button>

              {isNotificationsOpen && (
                <div className="absolute right-0 top-[calc(100%+8px)] z-50 w-[340px] overflow-hidden rounded-xl border border-[#e2e8f0] bg-white shadow-lg" role="menu">
                  <div className="flex items-center justify-between border-b border-[#e8edf5] px-4 py-3">
                    <span className="text-sm font-bold text-[#101828]">Notifications</span>
                    {notificationCount > 0 && <span className="rounded-full bg-[#fff0f0] px-2 py-0.5 text-[11px] font-semibold text-[#e03131]">{notificationCount} pending</span>}
                  </div>
                  {notifications.length ? (
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.map((leave) => (
                        <button
                          className="flex w-full gap-3 border-b border-[#f0f2f5] px-4 py-3 text-left transition hover:bg-slate-50"
                          key={leave.id}
                          type="button"
                          onClick={openLeaveRequests}
                          role="menuitem"
                        >
                          <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-[#ecebff] text-[#4f46e5]"><CalendarDays size={16} /></span>
                          <span className="min-w-0">
                            <span className="block truncate text-sm font-semibold text-[#101828]">Leave request from {leave.employee?.fullName || 'an employee'}</span>
                            <span className="mt-0.5 block text-xs text-[#667085]">{leave.leaveType || 'Leave'} · {leave.days} day{leave.days === 1 ? '' : 's'} · submitted {leave.appliedOn || 'recently'}</span>
                          </span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="px-4 py-8 text-center text-sm text-[#667085]">No pending leave requests.</div>
                  )}
                  <button className="w-full px-4 py-3 text-sm font-semibold text-[#4f46e5] hover:bg-[#f8f7ff]" type="button" onClick={openLeaveRequests} role="menuitem">
                    View leave requests
                  </button>
                </div>
              )}
            </div>
          )}
          <div className="relative ml-1 sm:ml-2" ref={accountMenuRef}>
            <button
              className="flex items-center gap-2 rounded-xl p-1 text-left transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              type="button"
              onClick={() => setIsAccountMenuOpen((open) => !open)}
              aria-label="Account menu"
              aria-expanded={isAccountMenuOpen}
              aria-haspopup="menu"
            >
              <span className="flex size-11 items-center justify-center overflow-hidden rounded-full bg-[#e7d5bc] text-[#102751]">{user?.profilePhoto ? <img className="size-full object-cover" src={user.profilePhoto} alt="" /> : <UserRound size={25} />}</span>
              <span className="hidden sm:block"><span className="block text-sm font-semibold text-[#101828]">{displayName}</span><span className="block text-xs text-[#344767]">{displayRole}</span></span>
              <ChevronDown className={`hidden text-[#092041] transition-transform sm:block ${isAccountMenuOpen ? 'rotate-180' : ''}`} size={17} />
            </button>

            {isAccountMenuOpen && (
              <div className="absolute right-0 top-[calc(100%+8px)] z-50 w-52 overflow-hidden rounded-xl border border-[#e2e8f0] bg-white py-1 shadow-lg" role="menu">
                <button className="flex w-full items-center gap-2 px-4 py-2.5 text-sm font-medium text-[#344767] hover:bg-slate-50" type="button" onClick={openProfile} role="menuitem">
                  <UserRound size={16} /> My Profile
                </button>
                <button className="flex w-full items-center gap-2 px-4 py-2.5 text-sm font-medium text-[#344767] hover:bg-slate-50" type="button" onClick={openSettings} role="menuitem">
                  <Settings size={16} /> Settings
                </button>
                <div className="my-1 border-t border-[#e8edf5]" />
                <button className="flex w-full items-center gap-2 px-4 py-2.5 text-sm font-medium text-[#e03131] hover:bg-red-50" type="button" onClick={handleLogout} role="menuitem">
                  <LogOut size={16} /> Sign out
                </button>
              </div>
            )}
          </div>
        </div>
    </div>
  </header>
);
};

export default Navbar;

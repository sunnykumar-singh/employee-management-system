import { Bell, ChevronDown, Menu, UserRound } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

const Navbar = ({ onMenuToggle }) => {
  const { user } = useAuth();
  const displayName = user?.fullName || 'Admin User';
  const displayRole = user?.role === 'ADMIN' ? 'Super Admin' : user?.role || 'User';

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
          <button className="relative rounded-lg p-2 text-[#092041] transition hover:bg-slate-100" type="button" aria-label="Notifications">
            <Bell size={20} />
            <span className="absolute right-1 top-0 flex size-4 items-center justify-center rounded-full bg-[#ff4d4f] text-[9px] font-bold text-white">5</span>
          </button>
          <button className="ml-1 flex items-center gap-2 rounded-xl p-1 text-left transition hover:bg-slate-100 sm:ml-2" type="button" aria-label="Admin menu">
            <span className="flex size-11 items-center justify-center overflow-hidden rounded-full bg-[#e7d5bc] text-[#102751]">{user?.profilePhoto ? <img className="size-full object-cover" src={user.profilePhoto} alt="" /> : <UserRound size={25} />}</span>
            <span className="hidden sm:block"><span className="block text-sm font-semibold text-[#101828]">{displayName}</span><span className="block text-xs text-[#344767]">{displayRole}</span></span>
            <ChevronDown className="hidden text-[#092041] sm:block" size={17} />
          </button>
        </div>
    </div>
  </header>
);
};

export default Navbar;

import { ChevronRight, LogIn, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';

const AttendanceHeader = ({
  title = 'Attendance',
  breadcrumbLabel = 'Attendance',
  dashboardTo = '/admin/dashboard',
  onCheckIn,
  onCheckOut,
  canCheckIn = false,
  canCheckOut = false,
  actionLoading = false,
}) => (
  <header className="flex flex-wrap items-start justify-between gap-4">
    <div>
      <h1 className="text-[26px] font-bold leading-none tracking-tight text-[#101828]">{title}</h1>
      <nav className="mt-2 flex items-center gap-1 text-[12px]" aria-label="Breadcrumb">
        <Link className="font-medium text-[#3531e9] hover:underline" to={dashboardTo}>Dashboard</Link>
        <ChevronRight size={14} className="text-[#98a2b3]" />
        <span className="text-[#344767]">{breadcrumbLabel}</span>
      </nav>
    </div>
    {(onCheckIn || onCheckOut) && (
      <div className="flex items-center gap-3">
        {onCheckIn && (
          <button
            className="flex items-center gap-2 rounded-md bg-[#4b3df2] px-4 py-2.5 text-xs font-medium text-white shadow-[0_4px_9px_rgba(75,61,242,0.25)] transition hover:bg-[#4032e8] disabled:cursor-not-allowed disabled:opacity-60"
            type="button"
            onClick={onCheckIn}
            disabled={!canCheckIn || actionLoading}
          >
            <LogIn size={15} /> Check In
          </button>
        )}
        {onCheckOut && (
          <button
            className="flex items-center gap-2 rounded-lg border border-[#dfe6f0] bg-white px-4 py-2.5 text-xs font-medium text-[#344767] transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            type="button"
            onClick={onCheckOut}
            disabled={!canCheckOut || actionLoading}
          >
            <LogOut size={15} /> Check Out
          </button>
        )}
      </div>
    )}
  </header>
);

export default AttendanceHeader;

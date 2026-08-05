import { CalendarDays, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const LeaveHeader = () => {
  return (
    <header className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-[26px] font-bold leading-none tracking-tight text-[#101828]">Leave Management</h1>
        <nav className="mt-2 flex items-center gap-1 text-[12px]" aria-label="Breadcrumb"><Link className="font-medium text-[#4a45e9] hover:underline" to="/admin/dashboard">Dashboard</Link><ChevronRight size={14} className="text-[#98a2b3]" /><span className="text-[#344767]">Leave Management</span></nav>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          className="flex items-center gap-2 rounded-lg border border-[#dfe6f0] bg-white px-4 py-2.5 text-sm font-medium text-[#344767] transition hover:bg-slate-50"
        >
          <CalendarDays size={18} />
          Leave Calendar
        </button>

      </div>
    </header>
  );
};

export default LeaveHeader;

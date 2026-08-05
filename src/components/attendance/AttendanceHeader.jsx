import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const AttendanceHeader = () => <header><h1 className="text-[26px] font-bold leading-none tracking-tight text-[#101828]">Attendance</h1><nav className="mt-2 flex items-center gap-1 text-[12px]" aria-label="Breadcrumb"><Link className="font-medium text-[#3531e9] hover:underline" to="/admin/dashboard">Dashboard</Link><ChevronRight size={14} className="text-[#98a2b3]" /><span className="text-[#344767]">Attendance</span></nav></header>;

export default AttendanceHeader;

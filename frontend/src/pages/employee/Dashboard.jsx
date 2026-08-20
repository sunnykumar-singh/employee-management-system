import {
  ArrowDown,
  ArrowUp,
  Bell,
  CalendarDays,
  ChevronDown,
  ClipboardCheck,
  Megaphone,
  UserX,
  WalletCards,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AttendanceStatusBadge from '../../components/attendance/AttendanceStatusBadge.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { getEmployeeDashboard } from '../../services/employeePortalService.js';
import { mapAnnouncement, mapAttendance } from '../../utils/mappers.js';

const StatCard = ({ label, value, detail, icon: Icon, color, background, trend }) => (
  <article className="flex min-h-[88px] min-w-0 items-center gap-2.5 rounded-lg border border-[#e5eaf2] bg-white p-2.5 shadow-[0_2px_8px_rgba(16,24,40,0.02)]">
    <span className="flex size-12 shrink-0 items-center justify-center rounded-full" style={{ backgroundColor: background, color }}>
      <Icon size={24} strokeWidth={1.9} />
    </span>
    <div className="min-w-0">
      <p className="truncate text-[11px] font-medium" style={{ color }}>{label}</p>
      <p className="mt-1 text-xl font-bold leading-none text-[#070b15]">{value}</p>
      <p className="mt-2 flex items-center gap-0.5 whitespace-nowrap text-[10px] text-[#253552]">
        {trend && (trend === 'up' ? <ArrowUp size={11} className="text-[#12a654]" /> : <ArrowDown size={11} className="text-[#f04438]" />)}
        <span>{detail}</span>
      </p>
    </div>
  </article>
);

const Panel = ({ title, action, children, className = '' }) => (
  <section className={`rounded-xl border border-[#e5eaf2] bg-white p-5 shadow-[0_3px_12px_rgba(16,24,40,0.02)] ${className}`}>
    <div className="mb-4 flex items-center justify-between gap-3"><h2 className="text-[16px] font-bold text-[#101828]">{title}</h2>{action}</div>
    {children}
  </section>
);

const Dashboard = () => {
  const { user } = useAuth();
  const [summary, setSummary] = useState({
    presentDays: 0,
    absentDays: 0,
    pendingLeaves: 0,
    leaveBalance: 0,
    recentAttendance: [],
    announcements: [],
  });

  useEffect(() => {
    getEmployeeDashboard()
      .then((data) => {
        setSummary({
          presentDays: data.presentDays || 0,
          absentDays: data.absentDays || 0,
          pendingLeaves: data.pendingLeaves || 0,
          leaveBalance: data.leaveBalance || 0,
          recentAttendance: (data.recentAttendance || []).map(mapAttendance),
          announcements: (data.recentAnnouncements || []).map(mapAnnouncement),
        });
      })
      .catch(() => {});
  }, []);

  const stats = [
    { label: 'Present Days', value: String(summary.presentDays), detail: 'Marked present', icon: ClipboardCheck, color: '#14a65a', background: '#e4f8ed', trend: 'up' },
    { label: 'Absent Days', value: String(summary.absentDays), detail: 'Marked absent', icon: UserX, color: '#ff463d', background: '#ffebeb', trend: 'down' },
    { label: 'Pending Leaves', value: String(summary.pendingLeaves), detail: 'Awaiting review', icon: CalendarDays, color: '#ff9415', background: '#fff1dd' },
    { label: 'Leave Balance', value: String(summary.leaveBalance), detail: 'Days remaining', icon: WalletCards, color: '#4d46f5', background: '#ecebff', trend: 'up' },
  ];

  return (
    <div className="mx-auto max-w-[1230px]">
      <div className="mb-7 flex flex-wrap items-start justify-between gap-4">
        <div><h1 className="text-[27px] font-bold tracking-tight text-[#101828]">Dashboard</h1><p className="mt-1 text-[15px] text-[#344767]">Welcome back, {user?.fullName || 'Employee'}! 👋</p></div>
        <button className="flex items-center gap-3 rounded-lg border border-[#dfe6f0] bg-white px-4 py-3 text-sm font-medium text-[#101828] shadow-sm" type="button"><CalendarDays size={18} /> {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })} <ChevronDown size={15} /></button>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">{stats.map((stat) => <StatCard key={stat.label} {...stat} />)}</div>

      <div className="mt-5 grid gap-5 xl:grid-cols-2">
        <Panel title="Recent Attendance" action={<Link className="rounded-lg border border-[#dfe6f0] px-3 py-2 text-xs font-semibold text-[#3735ef]" to="/employee/attendance">View All</Link>}>
          <div className="space-y-3">
            {summary.recentAttendance.length ? summary.recentAttendance.map((record) => (
              <article className="flex items-center justify-between gap-4 rounded-xl border border-[#e7edf5] p-4" key={record.id}>
                <div className="min-w-0">
                  <h3 className="text-[13px] font-bold text-[#101828]">{record.date}</h3>
                  <p className="mt-1 text-xs text-[#344767]">In {record.checkIn} · Out {record.checkOut}</p>
                  <p className="mt-1 text-xs text-[#667085]">{record.workingHours || '-'}</p>
                </div>
                <AttendanceStatusBadge status={record.status} />
              </article>
            )) : <p className="text-sm text-[#667085]">No attendance records yet.</p>}
          </div>
        </Panel>
        <Panel title="Recent Announcements" action={<Link className="rounded-lg border border-[#dfe6f0] px-3 py-2 text-xs font-semibold text-[#3735ef]" to="/employee/announcements">View All</Link>}>
          <div className="space-y-3">
            {summary.announcements.length ? summary.announcements.map((announcement, index) => (
              <article className="flex gap-4 rounded-xl border border-[#e7edf5] p-4" key={announcement.id}>
                <span className={`flex size-[60px] shrink-0 items-center justify-center rounded-xl ${index % 2 === 0 ? 'bg-[#ece9ff] text-[#5b3df1]' : 'bg-[#e3f8ed] text-[#22aa62]'}`}>
                  {index % 2 === 0 ? <Megaphone size={28} /> : <Bell size={27} />}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex justify-between gap-3">
                    <h3 className="text-[13px] font-bold">{announcement.title}</h3>
                    <time className="whitespace-nowrap text-xs font-medium text-[#3639ed]">{announcement.date}</time>
                  </div>
                  <p className="mt-2 text-xs leading-5 text-[#344767]">{announcement.message}</p>
                </div>
              </article>
            )) : <p className="text-sm text-[#667085]">No published announcements yet.</p>}
          </div>
        </Panel>
      </div>
    </div>
  );
};

export default Dashboard;

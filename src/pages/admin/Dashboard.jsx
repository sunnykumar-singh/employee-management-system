import {
  ArrowDown,
  ArrowUp,
  Bell,
  Building2,
  CalendarDays,
  ChevronDown,
  Megaphone,
  PieChart as PieChartIcon,
  Users,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { useAuth } from '../../context/AuthContext.jsx';
import { listAnnouncements } from '../../services/announcementService.js';
import { listAttendance } from '../../services/attendanceService.js';
import { listDepartments } from '../../services/departmentService.js';
import { listEmployees } from '../../services/employeeService.js';
import { listLeaves } from '../../services/leaveService.js';
import { mapAnnouncement } from '../../utils/mappers.js';

const chartColors = ['#4e4bf2', '#33a8ca', '#c13acf', '#ff5753', '#ffac26', '#abb2c5'];

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

const SelectButton = () => <button className="flex items-center gap-3 rounded-lg border border-[#dfe6f0] px-3 py-2 text-xs font-medium text-[#101828]" type="button">This Month <ChevronDown size={15} /></button>;

const Dashboard = () => {
  const { user } = useAuth();
  const today = new Date().toISOString().slice(0, 10);
  const [summary, setSummary] = useState({
    totalEmployees: 0,
    activeEmployees: 0,
    departments: 0,
    pendingLeaves: 0,
    attendanceRate: '0%',
    departmentData: [],
    attendanceData: [
      { name: 'Present', value: 0, color: '#38b970' },
      { name: 'Absent', value: 0, color: '#ff5b56' },
      { name: 'Late', value: 0, color: '#ffad27' },
    ],
    leaveData: [
      { name: 'Annual', value: 0 },
      { name: 'Sick', value: 0 },
      { name: 'Casual', value: 0 },
      { name: 'Emergency', value: 0 },
    ],
    announcements: [],
  });

  useEffect(() => {
    const load = async () => {
      const [employees, active, departments, pending, present, absent, late, annual, sick, casual, emergency, announcements] = await Promise.all([
        listEmployees({ page: 0, size: 1 }),
        listEmployees({ page: 0, size: 1, status: 'ACTIVE' }),
        listDepartments({ page: 0, size: 100 }),
        listLeaves({ page: 0, size: 1, status: 'PENDING' }),
        listAttendance({ page: 0, size: 1, date: today, status: 'PRESENT' }),
        listAttendance({ page: 0, size: 1, date: today, status: 'ABSENT' }),
        listAttendance({ page: 0, size: 1, date: today, status: 'LATE' }),
        listLeaves({ page: 0, size: 1, leaveType: 'ANNUAL' }),
        listLeaves({ page: 0, size: 1, leaveType: 'SICK' }),
        listLeaves({ page: 0, size: 1, leaveType: 'CASUAL' }),
        listLeaves({ page: 0, size: 1, leaveType: 'EMERGENCY' }),
        listAnnouncements({ page: 0, size: 2, status: 'PUBLISHED' }),
      ]);

      const presentCount = present.totalElements || 0;
      const absentCount = absent.totalElements || 0;
      const lateCount = late.totalElements || 0;
      const marked = presentCount + absentCount + lateCount;
      const departmentRows = (departments.content || []).map((department, index) => ({
        name: department.name,
        value: department.employeeCount || 0,
        color: chartColors[index % chartColors.length],
      }));
      const departmentTotal = departmentRows.reduce((sum, item) => sum + item.value, 0) || 1;

      setSummary({
        totalEmployees: employees.totalElements || 0,
        activeEmployees: active.totalElements || 0,
        departments: departments.totalElements || 0,
        pendingLeaves: pending.totalElements || 0,
        attendanceRate: marked ? `${Math.round((presentCount / marked) * 100)}%` : '0%',
        departmentData: departmentRows.map((item) => ({ ...item, value: Math.round((item.value / departmentTotal) * 100) })),
        attendanceData: [
          { name: 'Present', value: marked ? Math.round((presentCount / marked) * 100) : 0, color: '#38b970' },
          { name: 'Absent', value: marked ? Math.round((absentCount / marked) * 100) : 0, color: '#ff5b56' },
          { name: 'Late', value: marked ? Math.round((lateCount / marked) * 100) : 0, color: '#ffad27' },
        ],
        leaveData: [
          { name: 'Annual', value: annual.totalElements || 0 },
          { name: 'Sick', value: sick.totalElements || 0 },
          { name: 'Casual', value: casual.totalElements || 0 },
          { name: 'Emergency', value: emergency.totalElements || 0 },
        ],
        announcements: (announcements.content || []).map(mapAnnouncement),
      });
    };

    load().catch(() => {});
  }, [today]);

  const stats = [
    { label: 'Total Employees', value: String(summary.totalEmployees), detail: 'From live records', icon: Users, color: '#4d46f5', background: '#ecebff', trend: 'up' },
    { label: 'Active Employees', value: String(summary.activeEmployees), detail: 'Currently active', icon: Users, color: '#14a65a', background: '#e4f8ed', trend: 'up' },
    { label: 'Departments', value: String(summary.departments), detail: 'All departments', icon: Building2, color: '#ff9415', background: '#fff1dd' },
    { label: 'Pending Leaves', value: String(summary.pendingLeaves), detail: 'Awaiting review', icon: CalendarDays, color: '#ff463d', background: '#ffebeb', trend: 'down' },
    { label: "Today's Attendance", value: summary.attendanceRate, detail: 'Present rate', icon: PieChartIcon, color: '#189beb', background: '#e8f5ff', trend: 'up' },
  ];

  return (
    <div className="mx-auto max-w-[1230px]">
      <div className="mb-7 flex flex-wrap items-start justify-between gap-4">
        <div><h1 className="text-[27px] font-bold tracking-tight text-[#101828]">Dashboard</h1><p className="mt-1 text-[15px] text-[#344767]">Welcome back, {user?.fullName || 'Admin'}! 👋</p></div>
        <button className="flex items-center gap-3 rounded-lg border border-[#dfe6f0] bg-white px-4 py-3 text-sm font-medium text-[#101828] shadow-sm" type="button"><CalendarDays size={18} /> {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })} <ChevronDown size={15} /></button>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">{stats.map((stat) => <StatCard key={stat.label} {...stat} />)}</div>

      <div className="mt-6 grid gap-5 xl:grid-cols-2">
        <Panel title="Department Distribution">
          <div className="flex flex-col items-center gap-5 sm:flex-row sm:justify-around">
            <div className="relative size-[230px]"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={summary.departmentData} dataKey="value" innerRadius={62} outerRadius={96} paddingAngle={0} stroke="none">{summary.departmentData.map((item) => <Cell key={item.name} fill={item.color} />)}</Pie></PieChart></ResponsiveContainer><div className="absolute inset-0 flex flex-col items-center justify-center"><span className="text-[27px] font-bold text-[#101828]">{summary.totalEmployees}</span><span className="text-xs text-[#101828]">Total</span></div></div>
            <div className="w-full max-w-[230px] space-y-4">{summary.departmentData.map((item) => <div className="flex items-center justify-between text-[13px]" key={item.name}><span className="flex items-center gap-3"><i className="size-3 rounded-full" style={{ backgroundColor: item.color }} />{item.name}</span><b>{item.value}%</b></div>)}</div>
          </div>
        </Panel>
        <Panel title="Attendance Summary" action={<SelectButton />}>
          <div className="flex flex-col items-center gap-5 sm:flex-row sm:justify-around">
            <div className="relative size-[230px]"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={summary.attendanceData} dataKey="value" innerRadius={67} outerRadius={98} startAngle={90} endAngle={-270} stroke="none">{summary.attendanceData.map((item) => <Cell key={item.name} fill={item.color} />)}</Pie></PieChart></ResponsiveContainer><div className="absolute inset-0 flex flex-col items-center justify-center"><span className="text-[27px] font-bold text-[#101828]">{summary.attendanceRate}</span><span className="text-xs text-[#101828]">Present</span></div></div>
            <div className="w-full max-w-[190px] space-y-5">{summary.attendanceData.map((item) => <div className="flex items-center justify-between text-[13px]" key={item.name}><span className="flex items-center gap-3"><i className="size-3 rounded-full" style={{ backgroundColor: item.color }} />{item.name}</span><b>{item.value}%</b></div>)}</div>
          </div>
        </Panel>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-2">
        <Panel title="Leave Summary" action={<SelectButton />}><div className="h-[230px]"><ResponsiveContainer width="100%" height="100%"><BarChart data={summary.leaveData} margin={{ top: 20, right: 5, left: -20, bottom: 0 }}><YAxis axisLine={false} tickLine={false} ticks={[0, 5, 10, 15, 20]} tick={{ fill: '#344767', fontSize: 12 }} /><XAxis axisLine={{ stroke: '#cad4e3' }} tickLine={false} tick={{ fill: '#344767', fontSize: 12 }} dataKey="name" /><Bar dataKey="value" fill="#5248eb" radius={[2, 2, 0, 0]} label={{ position: 'top', fill: '#101828', fontSize: 13, fontWeight: 700 }} /></BarChart></ResponsiveContainer></div></Panel>
        <Panel title="Announcements" action={<Link className="rounded-lg border border-[#dfe6f0] px-3 py-2 text-xs font-semibold text-[#3735ef]" to="/admin/announcements">View All</Link>}>
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

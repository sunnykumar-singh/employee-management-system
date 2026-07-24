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
import { Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';

const stats = [
  { label: 'Total Employees', value: '256', detail: '12 this month', icon: Users, color: '#4d46f5', background: '#ecebff', trend: 'up' },
  { label: 'Active Employees', value: '230', detail: '8 this month', icon: Users, color: '#14a65a', background: '#e4f8ed', trend: 'up' },
  { label: 'Departments', value: '18', detail: 'No change', icon: Building2, color: '#ff9415', background: '#fff1dd' },
  { label: 'Pending Leaves', value: '14', detail: '3 since yesterday', icon: CalendarDays, color: '#ff463d', background: '#ffebeb', trend: 'down' },
  { label: "Today's Attendance", value: '92%', detail: '4% better', icon: PieChartIcon, color: '#189beb', background: '#e8f5ff', trend: 'up' },
];

const departmentData = [
  { name: 'Engineering', value: 35, color: '#4e4bf2' },
  { name: 'Marketing', value: 20, color: '#33a8ca' },
  { name: 'Sales', value: 15, color: '#c13acf' },
  { name: 'HR', value: 10, color: '#ff5753' },
  { name: 'Finance', value: 10, color: '#ffac26' },
  { name: 'Others', value: 10, color: '#abb2c5' },
];

const attendanceData = [
  { name: 'Present', value: 92, color: '#38b970' },
  { name: 'Absent', value: 5, color: '#ff5b56' },
  { name: 'Late', value: 3, color: '#ffad27' },
];

const leaveData = [
  { name: 'Annual', value: 18 },
  { name: 'Sick', value: 12 },
  { name: 'Casual', value: 7 },
  { name: 'Maternity', value: 4 },
  { name: 'Others', value: 2 },
];

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
        <span className={trend === 'down' ? 'text-[#253552]' : ''}>{detail}</span>
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

const Dashboard = () => (
  <div className="mx-auto max-w-[1230px]">
    <div className="mb-7 flex flex-wrap items-start justify-between gap-4">
      <div><h1 className="text-[27px] font-bold tracking-tight text-[#101828]">Dashboard</h1><p className="mt-1 text-[15px] text-[#344767]">Welcome back, Admin User! 👋</p></div>
      <button className="flex items-center gap-3 rounded-lg border border-[#dfe6f0] bg-white px-4 py-3 text-sm font-medium text-[#101828] shadow-sm" type="button"><CalendarDays size={18} /> 24 July 2026 <ChevronDown size={15} /></button>
    </div>

    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">{stats.map((stat) => <StatCard key={stat.label} {...stat} />)}</div>

    <div className="mt-6 grid gap-5 xl:grid-cols-2">
      <Panel title="Department Distribution">
        <div className="flex flex-col items-center gap-5 sm:flex-row sm:justify-around">
          <div className="relative size-[230px]"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={departmentData} dataKey="value" innerRadius={62} outerRadius={96} paddingAngle={0} stroke="none">{departmentData.map((item) => <Cell key={item.name} fill={item.color} />)}</Pie></PieChart></ResponsiveContainer><div className="absolute inset-0 flex flex-col items-center justify-center"><span className="text-[27px] font-bold text-[#101828]">256</span><span className="text-xs text-[#101828]">Total</span></div></div>
          <div className="w-full max-w-[230px] space-y-4">{departmentData.map((item) => <div className="flex items-center justify-between text-[13px]" key={item.name}><span className="flex items-center gap-3"><i className="size-3 rounded-full" style={{ backgroundColor: item.color }} />{item.name}</span><b>{item.value}%</b></div>)}</div>
        </div>
      </Panel>
      <Panel title="Attendance Summary" action={<SelectButton />}>
        <div className="flex flex-col items-center gap-5 sm:flex-row sm:justify-around">
          <div className="relative size-[230px]"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={attendanceData} dataKey="value" innerRadius={67} outerRadius={98} startAngle={90} endAngle={-270} stroke="none">{attendanceData.map((item) => <Cell key={item.name} fill={item.color} />)}</Pie></PieChart></ResponsiveContainer><div className="absolute inset-0 flex flex-col items-center justify-center"><span className="text-[27px] font-bold text-[#101828]">92%</span><span className="text-xs text-[#101828]">Present</span></div></div>
          <div className="w-full max-w-[190px] space-y-5">{attendanceData.map((item) => <div className="flex items-center justify-between text-[13px]" key={item.name}><span className="flex items-center gap-3"><i className="size-3 rounded-full" style={{ backgroundColor: item.color }} />{item.name}</span><b>{item.value}%</b></div>)}</div>
        </div>
      </Panel>
    </div>

    <div className="mt-5 grid gap-5 xl:grid-cols-2">
      <Panel title="Leave Summary" action={<SelectButton />}><div className="h-[230px]"><ResponsiveContainer width="100%" height="100%"><BarChart data={leaveData} margin={{ top: 20, right: 5, left: -20, bottom: 0 }}><YAxis axisLine={false} tickLine={false} ticks={[0, 5, 10, 15, 20]} tick={{ fill: '#344767', fontSize: 12 }} /><XAxis axisLine={{ stroke: '#cad4e3' }} tickLine={false} tick={{ fill: '#344767', fontSize: 12 }} dataKey="name" /><Bar dataKey="value" fill="#5248eb" radius={[2, 2, 0, 0]} label={{ position: 'top', fill: '#101828', fontSize: 13, fontWeight: 700 }} /></BarChart></ResponsiveContainer></div></Panel>
      <Panel title="Announcements" action={<button className="rounded-lg border border-[#dfe6f0] px-3 py-2 text-xs font-semibold text-[#3735ef]" type="button">View All</button>}>
        <div className="space-y-3">
          <article className="flex gap-4 rounded-xl border border-[#e7edf5] p-4"><span className="flex size-[60px] shrink-0 items-center justify-center rounded-xl bg-[#ece9ff] text-[#5b3df1]"><Megaphone size={28} /></span><div className="min-w-0 flex-1"><div className="flex justify-between gap-3"><h3 className="text-[13px] font-bold">Holiday Notice</h3><time className="whitespace-nowrap text-xs font-medium text-[#3639ed]">24 Jul 2026</time></div><p className="mt-2 text-xs leading-5 text-[#344767]">Office will remain closed on 15th August 2026<br className="hidden sm:block" /> on account of Independence Day.</p></div></article>
          <article className="flex gap-4 rounded-xl border border-[#e7edf5] p-4"><span className="flex size-[60px] shrink-0 items-center justify-center rounded-xl bg-[#e3f8ed] text-[#22aa62]"><Bell size={27} /></span><div className="min-w-0 flex-1"><div className="flex justify-between gap-3"><h3 className="text-[13px] font-bold">Team Meeting</h3><time className="whitespace-nowrap text-xs font-medium text-[#3639ed]">23 Jul 2026</time></div><p className="mt-2 text-xs leading-5 text-[#344767]">All team leads meeting on 25th July 2026<br className="hidden sm:block" /> at 11:00 AM in Conference Hall.</p></div></article>
        </div>
      </Panel>
    </div>
  </div>
);

export default Dashboard;

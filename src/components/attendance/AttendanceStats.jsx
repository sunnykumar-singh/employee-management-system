import { ArrowDown, ArrowUp, CalendarDays, Clock3, PieChart, UserCheck, Users } from 'lucide-react';
import { attendanceStatistics } from '../../data/attendanceData.js';

const icons = { calendar: CalendarDays, userCheck: UserCheck, clock: Clock3, users: Users, chart: PieChart };

const AttendanceStats = () => <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">{attendanceStatistics.map((stat) => { const Icon = icons[stat.icon]; return <article key={stat.title} className="flex min-h-[102px] items-center gap-4 rounded-xl border bg-white px-4 py-3 shadow-[0_3px_10px_rgba(16,24,40,0.02)]" style={{ borderColor: stat.border }}><span className="flex size-16 shrink-0 items-center justify-center rounded-full" style={{ backgroundColor: stat.background, color: stat.color }}><Icon size={29} /></span><div><p className="text-[11px] font-medium" style={{ color: stat.color }}>{stat.title}</p><p className="mt-1 text-2xl font-bold leading-none text-[#101828]">{stat.value}</p><p className="mt-2 flex items-center gap-1 text-[10px] text-[#344767]">{stat.trend === 'up' && <ArrowUp size={12} className="text-[#12a654]" />}{stat.trend === 'down' && <ArrowDown size={12} className="text-[#f04438]" />}{stat.change}</p></div></article>; })}</section>;

export default AttendanceStats;

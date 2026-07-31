import { ArrowUp, Building2, CircleCheckBig, Users, UsersRound } from 'lucide-react';
import { departmentStatistics } from '../../data/departmentsData.js';

const icons = { building: Building2, employees: Users, heads: CircleCheckBig, average: UsersRound };

const DepartmentStats = () => (
  <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
    {departmentStatistics.map((stat) => {
      const Icon = icons[stat.icon];
      return <article key={stat.title} className="flex min-h-[116px] items-center gap-5 rounded-xl border bg-white px-5 py-4 shadow-[0_3px_10px_rgba(16,24,40,0.025)]" style={{ borderColor: stat.border }}>
        <span className="flex size-[70px] shrink-0 items-center justify-center rounded-full" style={{ backgroundColor: stat.background, color: stat.color }}><Icon size={31} strokeWidth={2.1} /></span>
        <div className="min-w-0"><p className="text-xs font-medium" style={{ color: stat.color }}>{stat.title}</p><p className="mt-1 text-[27px] font-bold leading-none tracking-tight text-[#101828]">{stat.value}</p><p className="mt-2 flex items-center gap-1 text-[11px] text-[#344767]">{stat.trend === 'up' && <ArrowUp size={13} className="text-[#0da55d]" />}{stat.change}</p></div>
      </article>;
    })}
  </section>
);

export default DepartmentStats;

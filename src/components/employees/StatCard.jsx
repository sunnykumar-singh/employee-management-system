import { ArrowDown, ArrowUp, CalendarDays, UserCheck, UserMinus, UserRoundPlus, Users } from 'lucide-react';

const icons = { users: Users, active: UserCheck, leave: CalendarDays, new: UserRoundPlus, resigned: UserMinus };

const StatCard = ({ stat }) => {
  const Icon = icons[stat.icon];
  const isDown = stat.trend === 'down';

  return (
    <article className="flex min-h-[74px] items-center gap-3 rounded-lg border border-[#e7edf5] bg-white px-3 py-2.5 shadow-[0_2px_7px_rgba(16,24,40,0.02)]">
      <span className="flex size-11 shrink-0 items-center justify-center rounded-full" style={{ backgroundColor: stat.background, color: stat.color }}>
        <Icon size={23} strokeWidth={2} />
      </span>
      <div className="min-w-0">
        <p className="truncate text-[10px] font-medium" style={{ color: stat.color }}>{stat.title}</p>
        <p className="mt-0.5 text-xl font-bold leading-none text-[#101828]">{stat.value}</p>
        <p className="mt-1.5 flex items-center gap-0.5 text-[9px] text-[#344767]">{isDown ? <ArrowDown size={10} className="text-[#f04438]" /> : <ArrowUp size={10} className="text-[#12a654]" />}{stat.change}</p>
      </div>
    </article>
  );
};

export default StatCard;

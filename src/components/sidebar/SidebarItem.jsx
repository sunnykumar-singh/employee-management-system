import { NavLink } from 'react-router-dom';

const itemClassName = ({ isActive }) =>
  `flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
    isActive
      ? 'bg-[linear-gradient(100deg,#4b3df2,#5548f7)] text-white shadow-lg shadow-indigo-950/35'
      : 'text-slate-100 hover:bg-white/8 hover:text-white'
  }`;

const SidebarItem = ({ to, label, icon: Icon, onClick }) => {
  const content = (
    <>
      <Icon size={18} strokeWidth={1.8} aria-hidden="true" />
      <span>{label}</span>
    </>
  );

  if (to) {
    return (
      <NavLink className={itemClassName} to={to}>
        {content}
      </NavLink>
    );
  }

  return (
    <button
      className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-[#ff5c57] transition-all duration-200 hover:bg-white/8"
      type="button"
      onClick={onClick}
    >
      {content}
    </button>
  );
};

export default SidebarItem;

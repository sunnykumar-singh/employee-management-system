import { Eye, Pencil, Trash2 } from 'lucide-react';

const actionButtons = [
  { label: 'View employee', icon: Eye, color: 'text-[#344767]' },
  { label: 'Edit employee', icon: Pencil, color: 'text-[#344767]' },
  { label: 'Delete employee', icon: Trash2, color: 'text-[#f04438]' },
];

const EmployeeActions = () => <div className="flex items-center gap-1.5">{actionButtons.map(({ label, icon: Icon, color }) => <button className={`rounded border border-[#e4eaf2] p-1.5 ${color} transition hover:bg-slate-50`} type="button" aria-label={label} key={label}><Icon size={11} /></button>)}</div>;

export default EmployeeActions;

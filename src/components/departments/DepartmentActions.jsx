import { Eye, Pencil, Trash2 } from 'lucide-react';

const actionButtons = [
  { label: 'View department', icon: Eye, color: 'text-[#344767]' },
  { label: 'Edit department', icon: Pencil, color: 'text-[#344767]' },
  { label: 'Delete department', icon: Trash2, color: 'text-[#f04438]' },
];

const DepartmentActions = () => <div className="flex items-center gap-2">{actionButtons.map(({ label, icon: Icon, color }) => <button className={`rounded-md border border-[#e4eaf2] p-2 ${color} transition hover:bg-slate-50`} type="button" aria-label={label} key={label}><Icon size={13} /></button>)}</div>;

export default DepartmentActions;

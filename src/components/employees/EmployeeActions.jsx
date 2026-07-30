import { Eye, Pencil, Trash2 } from 'lucide-react';

const actionButtons = [
  { label: 'View employee', icon: Eye, color: 'text-[#344767]', action: 'view' },
  { label: 'Edit employee', icon: Pencil, color: 'text-[#344767]', action: 'edit' },
  { label: 'Delete employee', icon: Trash2, color: 'text-[#f04438]', action: 'delete' },
];

const EmployeeActions = ({ onDelete, onEdit, onView }) => <div className="flex items-center gap-1.5">{actionButtons.map(({ label, icon: Icon, color, action }) => <button className={`cursor-pointer rounded border border-[#e4eaf2] p-1.5 ${color} transition hover:bg-slate-50`} type="button" aria-label={label} key={label} onClick={action === 'view' ? onView : action === 'edit' ? onEdit : action === 'delete' ? onDelete : undefined}><Icon size={11} /></button>)}</div>;

export default EmployeeActions;

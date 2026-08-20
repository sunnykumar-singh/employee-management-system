import { Clock3, Eye, Pencil } from 'lucide-react';

const allActions = [
  { label: 'View attendance', icon: Eye, action: 'view' },
  { label: 'Edit attendance', icon: Pencil, action: 'edit' },
  { label: 'View attendance time', icon: Clock3, action: 'time' },
];

const AttendanceActions = ({ record, onView, onEdit, onTime, readOnly = false }) => {
  const actions = readOnly ? allActions.filter((item) => item.action === 'view') : allActions;

  return (
    <div className="flex items-center gap-2">
      {actions.map(({ label, icon: Icon, action }) => (
        <button
          className="rounded-md border border-[#e4eaf2] p-2 text-[#344767] transition hover:bg-slate-50"
          type="button"
          aria-label={label}
          key={label}
          onClick={() => (action === 'view' ? onView : action === 'edit' ? onEdit : onTime)(record)}
        >
          <Icon size={13} />
        </button>
      ))}
    </div>
  );
};

export default AttendanceActions;

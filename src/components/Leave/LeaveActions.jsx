import {
  Eye,
  Pencil,
  Trash2,
  Check,
  X,
} from "lucide-react";

const LeaveActions = ({ leave, onView, onEdit, onDelete, onApprove, onReject }) => {
  return (
    <div className="flex items-center justify-center gap-2">
     <button
        onClick={() => onView(leave)}
        className="rounded-md border border-[#e4eaf2] p-2 transition hover:bg-slate-50"
        title="View" >
        <Eye size={14} />
        </button>

      <button
        onClick={() => onEdit(leave)}
        className="rounded-md border border-[#e4eaf2] p-2 transition hover:bg-slate-50"
        title="Edit">
        <Pencil size={14} />
        </button>

      {leave.status !== 'Approved' && <button onClick={() => onApprove(leave)} className="rounded-md border border-[#e4eaf2] p-2 text-green-600 transition hover:bg-green-50" title={leave.status === 'Rejected' ? 'Change to Approved' : 'Approve'} type="button"><Check size={14} /></button>}

      {leave.status !== 'Rejected' && <button onClick={() => onReject(leave)} className="rounded-md border border-[#e4eaf2] p-2 text-red-600 transition hover:bg-red-50" title={leave.status === 'Approved' ? 'Change to Rejected' : 'Reject'} type="button"><X size={14} /></button>}

      <button
        onClick={() => onDelete(leave)}
        className="rounded-md border border-[#e4eaf2] p-2 text-red-500 transition hover:bg-red-50"
        title="Delete"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
};

export default LeaveActions;

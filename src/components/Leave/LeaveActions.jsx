import {
  Eye,
  Pencil,
  Trash2,
  Check,
  X,
} from "lucide-react";

const LeaveActions = () => {
  return (
    <div className="flex items-center justify-center gap-2">
      <button
        className="rounded-md border border-[#e4eaf2] p-2 transition hover:bg-slate-50"
        title="View"
      >
        <Eye size={14} />
      </button>

      <button
        className="rounded-md border border-[#e4eaf2] p-2 transition hover:bg-slate-50"
        title="Edit"
      >
        <Pencil size={14} />
      </button>

      <button
        className="rounded-md border border-[#e4eaf2] p-2 text-green-600 transition hover:bg-green-50"
        title="Approve"
      >
        <Check size={14} />
      </button>

      <button
        className="rounded-md border border-[#e4eaf2] p-2 text-red-600 transition hover:bg-red-50"
        title="Reject"
      >
        <X size={14} />
      </button>

      <button
        className="rounded-md border border-[#e4eaf2] p-2 text-red-500 transition hover:bg-red-50"
        title="Delete"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
};

export default LeaveActions;
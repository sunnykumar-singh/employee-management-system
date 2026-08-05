import { Eye, Pencil, Trash2 } from "lucide-react";

const AnnouncementActions = () => {
  return (
    <div className="flex items-center justify-center gap-2">
      <button
        type="button"
        className="rounded-md border border-[#e4eaf2] p-2 transition hover:bg-slate-50"
        title="View"
      >
        <Eye size={14} />
      </button>

      <button
        type="button"
        className="rounded-md border border-[#e4eaf2] p-2 transition hover:bg-slate-50"
        title="Edit"
      >
        <Pencil size={14} />
      </button>

      <button
        type="button"
        className="rounded-md border border-[#e4eaf2] p-2 text-red-500 transition hover:bg-red-50"
        title="Delete"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
};

export default AnnouncementActions;

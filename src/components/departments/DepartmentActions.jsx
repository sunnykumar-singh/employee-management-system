import { Eye, Pencil, Trash2 } from "lucide-react";

const DepartmentActions = ({
    department,
    onView,
    onEdit,
    onDelete,
}) => {
    return (
        <div className="flex items-center gap-2">

            <button
                onClick={() => onView(department)}
                className="rounded-md border border-[#e4eaf2] p-2 transition hover:bg-slate-50"
            >
                <Eye size={13} />
            </button>

            <button
                onClick={() => onEdit(department)}
                className="rounded-md border border-[#e4eaf2] p-2 transition hover:bg-slate-50"
            >
                <Pencil size={13} />
            </button>

            <button
                onClick={() => onDelete(department)}
                className="rounded-md border border-[#e4eaf2] p-2 text-red-500 transition hover:bg-slate-50"
            >
                <Trash2 size={13} />
            </button>

        </div>
    );
};

export default DepartmentActions;
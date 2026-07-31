import { X } from "lucide-react";

const ViewDepartmentModal = ({
  isOpen,
  department,
  onClose,
}) => {
  if (!isOpen || !department) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-2xl rounded-xl bg-white shadow-xl">

        {/* Header */}

        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-xl font-semibold text-slate-800">
            Department Details
          </h2>

          <button
            onClick={onClose}
            className="rounded-md p-2 hover:bg-slate-100"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}

        <div className="grid grid-cols-2 gap-6 p-6">

          <Info
            label="Department ID"
            value={department.departmentId}
          />

          <Info
            label="Department Name"
            value={department.name}
          />

          <Info
            label="Department Head"
            value={department.head}
          />

          <Info
            label="Employees"
            value={department.employees}
          />

          <Info
            label="Status"
            value={department.status}
          />

          <div className="col-span-2">
            <label className="mb-2 block text-sm font-medium text-slate-500">
              Description
            </label>

            <div className="rounded-lg border bg-slate-50 p-4 text-sm text-slate-700">
              {department.description}
            </div>
          </div>

        </div>

        {/* Footer */}

        <div className="flex justify-end border-t px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-lg bg-indigo-600 px-5 py-2 text-white hover:bg-indigo-700"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};

const Info = ({ label, value }) => (
  <div>
    <label className="mb-2 block text-sm font-medium text-slate-500">
      {label}
    </label>

    <div className="rounded-lg border bg-slate-50 p-3">
      {value}
    </div>
  </div>
);

export default ViewDepartmentModal;
import { X } from "lucide-react";

const ViewLeaveModal = ({ leave, isOpen, onClose }) => {
  if (!isOpen || !leave) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-2xl rounded-xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#e7edf5] px-6 py-4">
          <h2 className="text-xl font-bold text-[#101828]">
            Leave Details
          </h2>

          <button
            onClick={onClose}
            className="rounded-md p-2 transition hover:bg-slate-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="grid grid-cols-2 gap-5 p-6">

          <div>
            <p className="text-sm text-[#667085]">Employee</p>
            <h3 className="font-semibold text-[#101828]">
              {leave.employee}
            </h3>
          </div>

          <div>
            <p className="text-sm text-[#667085]">Employee ID</p>
            <h3 className="font-semibold text-[#101828]">
              {leave.employeeId}
            </h3>
          </div>

          <div>
            <p className="text-sm text-[#667085]">Department</p>
            <h3 className="font-semibold text-[#101828]">
              {leave.department}
            </h3>
          </div>

          <div>
            <p className="text-sm text-[#667085]">Leave Type</p>
            <h3 className="font-semibold text-[#101828]">
              {leave.leaveType}
            </h3>
          </div>

          <div>
            <p className="text-sm text-[#667085]">From Date</p>
            <h3 className="font-semibold text-[#101828]">
              {leave.from}
            </h3>
          </div>

          <div>
            <p className="text-sm text-[#667085]">To Date</p>
            <h3 className="font-semibold text-[#101828]">
              {leave.to}
            </h3>
          </div>

          <div>
            <p className="text-sm text-[#667085]">Total Days</p>
            <h3 className="font-semibold text-[#101828]">
              {leave.days}
            </h3>
          </div>

          <div>
            <p className="text-sm text-[#667085]">Status</p>
            <h3 className="font-semibold text-[#101828]">
              {leave.status}
            </h3>
          </div>

          <div className="col-span-2">
            <p className="text-sm text-[#667085]">Reason</p>
            <p className="mt-1 text-[#101828]">
              {leave.reason}
            </p>
          </div>

          <div>
            <p className="text-sm text-[#667085]">Applied On</p>
            <h3 className="font-semibold text-[#101828]">
              {leave.appliedOn}
            </h3>
          </div>

        </div>

        {/* Footer */}

        <div className="flex justify-end border-t border-[#e7edf5] px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-lg bg-[#4b3df2] px-5 py-2 text-white transition hover:bg-[#3d30d8]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewLeaveModal;
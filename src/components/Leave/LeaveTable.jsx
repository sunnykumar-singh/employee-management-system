import LeaveRow from "./LeaveRow";
import Pagination from "../common/Pagination";


const LeaveTable = ({ leaves, currentPage, pageSize, totalItems, onPageChange, onPageSizeChange, onView, onEdit, onDelete, onApprove, onReject }) => {
  return (
    <div className="mt-6 overflow-hidden rounded-xl border border-[#e7edf5] bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-[#f8fafc]">
            <tr className="text-left text-sm font-semibold text-[#344767]">
              <th className="px-5 py-4">#</th>
              <th className="px-5 py-4">Employee ID</th>
              <th className="px-5 py-4">Employee Name</th>
              <th className="px-5 py-4">Department</th>
              <th className="px-5 py-4">Leave Type</th>
              <th className="px-5 py-4">From</th>
              <th className="px-5 py-4">To</th>
              <th className="px-5 py-4">Days</th>
              <th className="px-5 py-4">Reason</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4">Applied On</th>
              <th className="px-5 py-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {leaves.map((leave, index) => (
              <LeaveRow
                key={leave.id}
                index={index}
                leave={leave}
                onView={onView}
                onEdit={onEdit}
                onDelete={onDelete}
                onApprove={onApprove}
                onReject={onReject}
              />
            ))}
          </tbody>
        </table>
      </div>

      <Pagination currentPage={currentPage} totalItems={totalItems} pageSize={pageSize} onPageChange={onPageChange} onPageSizeChange={onPageSizeChange} />
    </div>
  );
};

export default LeaveTable;

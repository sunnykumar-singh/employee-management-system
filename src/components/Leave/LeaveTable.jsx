import LeaveRow from "./LeaveRow";
import Pagination from "../common/Pagination";

const leaveData = [
  {
    id: 1,
    employeeId: "EMP001",
    employee: "Rahul Sharma",
    department: "Engineering",
    leaveType: "Casual",
    from: "10 Aug 2026",
    to: "12 Aug 2026",
    days: 3,
    reason: "Family Function",
    status: "Pending",
    appliedOn: "05 Aug 2026",
  },
  {
    id: 2,
    employeeId: "EMP002",
    employee: "Priya Singh",
    department: "HR",
    leaveType: "Sick",
    from: "15 Aug 2026",
    to: "16 Aug 2026",
    days: 2,
    reason: "Medical",
    status: "Approved",
    appliedOn: "03 Aug 2026",
  },
  {
    id: 3,
    employeeId: "EMP003",
    employee: "Amit Kumar",
    department: "Finance",
    leaveType: "Annual",
    from: "20 Aug 2026",
    to: "25 Aug 2026",
    days: 6,
    reason: "Vacation",
    status: "Rejected",
    appliedOn: "01 Aug 2026",
  },
];

const LeaveTable = () => {
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
            {leaveData.map((leave, index) => (
              <LeaveRow
                key={leave.id}
                index={index}
                leave={leave}
              />
            ))}
          </tbody>
        </table>
      </div>

      <Pagination />
    </div>
  );
};

export default LeaveTable;
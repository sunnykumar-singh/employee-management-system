import { CalendarDays, Plus } from "lucide-react";

const LeaveHeader = () => {
  return (
    <div className="flex flex-col gap-4 rounded-xl bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      {/* Left Section */}
      <div>
        <h1 className="text-2xl font-bold text-[#101828]">
          Leave Management
        </h1>

        <p className="mt-1 text-sm text-[#667085]">
          Manage employee leave requests and approvals.
        </p>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="flex items-center gap-2 rounded-lg border border-[#dfe6f0] bg-white px-4 py-2.5 text-sm font-medium text-[#344767] transition hover:bg-slate-50"
        >
          <CalendarDays size={18} />
          Leave Calendar
        </button>

        {/* <button
          type="button"
          className="flex items-center gap-2 rounded-lg bg-[#4b3df2] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#4032e8]"
        >
          <Plus size={18} />
          Apply Leave
        </button> */}
      </div>
    </div>
  );
};

export default LeaveHeader;
import {
  CalendarRange,
  RotateCcw,
  Search,
} from "lucide-react";

const LeaveFilters = () => {
  return (
    <div className="mt-6 rounded-xl border border-[#e7edf5] bg-white p-5 shadow-sm">
      <div className="grid gap-4 lg:grid-cols-6">

        {/* Search */}

        <div className="relative lg:col-span-2">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#98a2b3]"
          />

          <input
            type="text"
            placeholder="Search employee..."
            className="w-full rounded-lg border border-[#d0d5dd] py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-[#4b3df2]"
          />
        </div>

        {/* Date Range */}

        <div className="relative">
          <CalendarRange
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#98a2b3]"
          />

          <input
            type="date"
            className="w-full rounded-lg border border-[#d0d5dd] py-2.5 pl-10 pr-4 text-sm outline-none focus:border-[#4b3df2]"
          />
        </div>

        {/* Department */}

        <select className="rounded-lg border border-[#d0d5dd] px-4 py-2.5 text-sm outline-none focus:border-[#4b3df2]">
          <option>All Departments</option>
          <option>Engineering</option>
          <option>HR</option>
          <option>Finance</option>
          <option>Marketing</option>
        </select>

        {/* Leave Type */}

        <select className="rounded-lg border border-[#d0d5dd] px-4 py-2.5 text-sm outline-none focus:border-[#4b3df2]">
          <option>All Leave Types</option>
          <option>Casual</option>
          <option>Sick</option>
          <option>Annual</option>
          <option>Emergency</option>
        </select>

        {/* Status */}

        <select className="rounded-lg border border-[#d0d5dd] px-4 py-2.5 text-sm outline-none focus:border-[#4b3df2]">
          <option>All Status</option>
          <option>Pending</option>
          <option>Approved</option>
          <option>Rejected</option>
        </select>

      </div>

      {/* Bottom Buttons */}

      <div className="mt-5 flex justify-end gap-3">

        <button
          className="flex items-center gap-2 rounded-lg border border-[#d0d5dd] px-4 py-2.5 text-sm font-medium text-[#344767] transition hover:bg-slate-50"
        >
          <RotateCcw size={17} />
          Reset
        </button>

      </div>
    </div>
  );
};

export default LeaveFilters;
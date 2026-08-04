import {
  CalendarRange,
  RotateCcw,
  Search,
} from "lucide-react";

const LeaveFilters = ({ filters, filterOptions, onFilterChange, onReset, searchQuery, onSearchChange }) => {
  return (
    <div className="mt-6 rounded-xl border border-[#e7edf5] bg-white p-5 shadow-sm">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-[2fr_1.2fr_1.4fr_1.4fr_1.5fr_1.4fr_1.3fr]">

        {/* Search */}

        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#98a2b3]"
          />

        <input
            type="text"
            placeholder="Search employee..."
            className="w-full rounded-lg border border-[#d0d5dd] py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-[#4b3df2]"
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
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

        <select className="rounded-lg border border-[#d0d5dd] px-4 py-2.5 text-sm outline-none focus:border-[#4b3df2]" value={filters.employeeId} onChange={(event) => onFilterChange('employeeId', event.target.value)}>{filterOptions.employeeIds.map((option) => <option key={option}>{option}</option>)}</select>

        {/* Employee Name */}

        <select className="rounded-lg border border-[#d0d5dd] px-4 py-2.5 text-sm outline-none focus:border-[#4b3df2]" value={filters.employee} onChange={(event) => onFilterChange('employee', event.target.value)}>{filterOptions.employees.map((option) => <option key={option}>{option}</option>)}</select>

        {/* Department */}

        <select className="rounded-lg border border-[#d0d5dd] px-4 py-2.5 text-sm outline-none focus:border-[#4b3df2]" value={filters.department} onChange={(event) => onFilterChange('department', event.target.value)}>{filterOptions.departments.map((option) => <option key={option}>{option}</option>)}</select>

        {/* Leave Type */}

        <select className="rounded-lg border border-[#d0d5dd] px-4 py-2.5 text-sm outline-none focus:border-[#4b3df2]" value={filters.leaveType} onChange={(event) => onFilterChange('leaveType', event.target.value)}>{filterOptions.leaveTypes.map((option) => <option key={option}>{option}</option>)}</select>

        {/* Status */}

        <select className="rounded-lg border border-[#d0d5dd] px-4 py-2.5 text-sm outline-none focus:border-[#4b3df2]" value={filters.status} onChange={(event) => onFilterChange('status', event.target.value)}>{filterOptions.statuses.map((option) => <option key={option}>{option}</option>)}</select>

      </div>

      {/* Bottom Buttons */}

      <div className="mt-5 flex justify-end gap-3">

        <button
          type="button"
          onClick={onReset}
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

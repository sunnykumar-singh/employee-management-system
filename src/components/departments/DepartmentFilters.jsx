import { RefreshCw, SlidersHorizontal } from 'lucide-react';
import { departmentFilterOptions } from '../../data/departmentsData.js';
import FilterDropdown from '../employees/FilterDropdown.jsx';
import SearchInput from '../employees/SearchInput.jsx';

const DepartmentFilters = () => (
  <section className="flex flex-wrap gap-3 rounded-t-xl border border-[#e4eaf2] bg-white px-4 py-4 shadow-[0_2px_8px_rgba(16,24,40,0.02)] sm:px-5">
    <SearchInput value="" onChange={() => {}} placeholder="Search department name..." />
    <FilterDropdown label="Department Head" options={departmentFilterOptions.heads} value="Department Head" onChange={() => {}} />
    <FilterDropdown label="Status" options={departmentFilterOptions.statuses} value="Status" onChange={() => {}} />
    <button className="flex items-center gap-2 rounded-md border border-[#e4eaf2] px-4 py-2 text-[11px] font-medium text-[#101828]" type="button"><SlidersHorizontal size={14} /> Filter</button>
    <button className="rounded-md border border-[#e4eaf2] p-2 text-[#344767]" type="button" aria-label="Refresh departments"><RefreshCw size={15} /></button>
  </section>
);

export default DepartmentFilters;

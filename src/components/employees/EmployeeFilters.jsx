import { RefreshCw, SlidersHorizontal } from 'lucide-react';
import { filterOptions } from '../../data/employeesData.js';
import FilterDropdown from './FilterDropdown.jsx';
import SearchInput from './SearchInput.jsx';

const EmployeeFilters = ({ filters, onFilterChange, searchQuery, onSearchChange }) => (
  <section className="flex flex-wrap gap-3 rounded-lg border border-[#e4eaf2] bg-white px-3 py-3 shadow-[0_2px_8px_rgba(16,24,40,0.02)] sm:px-4">
    <SearchInput value={searchQuery} onChange={onSearchChange} />
    <FilterDropdown label="Department" options={filterOptions.departments} value={filters.department} onChange={(value) => onFilterChange('department', value)} />
    <FilterDropdown label="Designation" options={filterOptions.designations} value={filters.designation} onChange={(value) => onFilterChange('designation', value)} />
    <FilterDropdown label="Status" options={filterOptions.statuses} value={filters.status} onChange={(value) => onFilterChange('status', value)} />
    <button className="flex items-center gap-1.5 rounded-md border border-[#e4eaf2] px-3 py-2 text-[10px] font-medium text-[#101828]" type="button"><SlidersHorizontal size={12} /> More Filters</button>
    <button className="ml-auto rounded-md border border-[#e4eaf2] p-2 text-[#344767]" type="button" aria-label="Refresh employees"><RefreshCw size={13} /></button>
  </section>
);

export default EmployeeFilters;

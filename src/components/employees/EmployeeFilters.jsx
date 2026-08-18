import { RefreshCw, SlidersHorizontal } from 'lucide-react';
import { DESIGNATIONS, EMPLOYEE_STATUSES } from '../../utils/mappers.js';
import FilterDropdown from './FilterDropdown.jsx';
import SearchInput from './SearchInput.jsx';

const EmployeeFilters = ({ filters, departments = [], onFilterChange, searchQuery, onSearchChange, onRefresh }) => (
  <section className="flex flex-wrap gap-3 rounded-lg border border-[#e4eaf2] bg-white px-3 py-3 shadow-[0_2px_8px_rgba(16,24,40,0.02)] sm:px-4">
    <SearchInput value={searchQuery} onChange={onSearchChange} />
    <FilterDropdown label="Department" options={['All Departments', ...departments.map((department) => department.name)]} value={filters.department} onChange={(value) => onFilterChange('department', value)} />
    <FilterDropdown label="Designation" options={['All Designations', ...DESIGNATIONS]} value={filters.designation} onChange={(value) => onFilterChange('designation', value)} />
    <FilterDropdown label="Status" options={['All Statuses', ...EMPLOYEE_STATUSES]} value={filters.status} onChange={(value) => onFilterChange('status', value)} />
    <button className="flex items-center gap-1.5 rounded-md border border-[#e4eaf2] px-3 py-2 text-[10px] font-medium text-[#101828]" type="button"><SlidersHorizontal size={12} /> More Filters</button>
    <button className="ml-auto rounded-md border border-[#e4eaf2] p-2 text-[#344767]" type="button" aria-label="Refresh employees" onClick={onRefresh}><RefreshCw size={13} /></button>
  </section>
);

export default EmployeeFilters;

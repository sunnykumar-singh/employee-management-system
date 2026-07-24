import { ChevronDown } from 'lucide-react';

const FilterDropdown = ({ options, label }) => <label className="relative block min-w-[110px] flex-1"><select className="w-full appearance-none rounded-md border border-[#e4eaf2] bg-white px-3 py-2 pr-7 text-[10px] text-[#101828] outline-none focus:border-[#6659f5]" aria-label={label}>{options.map((option) => <option key={option}>{option}</option>)}</select><ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[#344767]" size={13} /></label>;

export default FilterDropdown;

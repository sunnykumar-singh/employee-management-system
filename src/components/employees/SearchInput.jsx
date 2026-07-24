import { Search } from 'lucide-react';

const SearchInput = () => <label className="relative block min-w-[220px] flex-[2]"><Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#344767]" size={14} /><input className="w-full rounded-md border border-[#e4eaf2] bg-white py-2 pl-8 pr-3 text-[10px] text-[#101828] outline-none placeholder:text-[#667085] focus:border-[#6659f5]" placeholder="Search by name, email, phone or employee ID..." type="search" /></label>;

export default SearchInput;

import { ChevronDown } from 'lucide-react';

const PageSizeSelector = ({ value }) => <button className="flex items-center gap-2 rounded-md border border-[#e4eaf2] px-3 py-2 text-[10px] text-[#101828]" type="button">{value}<ChevronDown size={12} /></button>;

export default PageSizeSelector;

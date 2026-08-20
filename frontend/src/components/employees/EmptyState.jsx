import { Users } from 'lucide-react';

const EmptyState = () => <div className="flex flex-col items-center justify-center px-6 py-16 text-center"><span className="flex size-12 items-center justify-center rounded-full bg-[#ecebff] text-[#4d46f5]"><Users size={23} /></span><p className="mt-3 text-sm font-semibold text-[#101828]">No employees found.</p><p className="mt-1 text-xs text-[#667085]">Try searching with a different keyword.</p></div>;

export default EmptyState;

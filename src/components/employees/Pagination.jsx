import { ChevronLeft, ChevronRight } from 'lucide-react';
import { pagination } from '../../data/employeesData.js';
import PageSizeSelector from './PageSizeSelector.jsx';

const Pagination = () => (
  <footer className="flex flex-wrap items-center justify-between gap-3 px-3 py-3 sm:px-4">
    <p className="text-[9px] text-[#344767]">Showing {pagination.start} to {pagination.end} of {pagination.total} entries</p>
    <div className="ml-auto flex items-center gap-1.5"><button className="rounded-md border border-[#e4eaf2] p-1.5 text-[#98a2b3]" type="button" aria-label="Previous page"><ChevronLeft size={13} /></button>{pagination.pages.map((page) => <button className={`size-7 rounded-md text-[10px] font-medium ${page === pagination.currentPage ? 'bg-[#4b3df2] text-white shadow-sm shadow-indigo-300' : 'border border-[#e4eaf2] text-[#344767]'}`} type="button" key={page}>{page}</button>)}<button className="rounded-md border border-[#e4eaf2] p-1.5 text-[#344767]" type="button" aria-label="Next page"><ChevronRight size={13} /></button><span className="ml-3"><PageSizeSelector value={pagination.pageSize} /></span></div>
  </footer>
);

export default Pagination;

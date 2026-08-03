import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

const getVisiblePages = (currentPage, totalPages, maxVisiblePages) => {
  const visibleCount = Math.min(maxVisiblePages, totalPages);
  const start = Math.min(Math.max(currentPage - Math.floor(visibleCount / 2), 1), Math.max(totalPages - visibleCount + 1, 1));

  return Array.from({ length: visibleCount }, (_, index) => start + index);
};

const Pagination = ({
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50, 100],
  showPageSizeSelector = true,
  maxVisiblePages = 5,
}) => {
  const totalPages = Math.max(Math.ceil(totalItems / pageSize), 1);
  const safeCurrentPage = Math.min(Math.max(currentPage, 1), totalPages);
  const start = totalItems === 0 ? 0 : (safeCurrentPage - 1) * pageSize + 1;
  const end = totalItems === 0 ? 0 : Math.min(safeCurrentPage * pageSize, totalItems);
  const pages = getVisiblePages(safeCurrentPage, totalPages, maxVisiblePages);
  const canChangePage = typeof onPageChange === 'function';

  return (
    <footer className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
      <p className="text-[11px] text-[#526078]">Showing {start} to {end} of {totalItems} entries</p>
      <div className="flex flex-wrap items-center gap-2 sm:ml-auto">
        <button className="rounded-md border border-[#e4eaf2] p-2 text-[#344767] transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-[#98a2b3] disabled:hover:bg-white" type="button" aria-label="Previous page" disabled={!canChangePage || safeCurrentPage === 1} onClick={() => onPageChange(safeCurrentPage - 1)}><ChevronLeft size={14} /></button>
        {pages.map((page) => <button className={`size-8 rounded-md text-[11px] font-medium transition ${page === safeCurrentPage ? 'bg-[#4b3df2] text-white shadow-sm shadow-indigo-300' : 'border border-[#e4eaf2] text-[#344767] hover:bg-slate-50'} disabled:cursor-not-allowed`} type="button" key={page} aria-current={page === safeCurrentPage ? 'page' : undefined} disabled={!canChangePage || page === safeCurrentPage} onClick={() => onPageChange(page)}>{page}</button>)}
        <button className="rounded-md border border-[#e4eaf2] p-2 text-[#344767] transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-[#98a2b3] disabled:hover:bg-white" type="button" aria-label="Next page" disabled={!canChangePage || safeCurrentPage === totalPages} onClick={() => onPageChange(safeCurrentPage + 1)}><ChevronRight size={14} /></button>
        {showPageSizeSelector && <label className="relative ml-1"><span className="sr-only">Items per page</span><select className="appearance-none rounded-md border border-[#e4eaf2] bg-white px-3 py-2 pr-8 text-[11px] text-[#101828] outline-none focus:border-[#6659f5] disabled:cursor-not-allowed disabled:text-[#98a2b3]" value={pageSize} disabled={typeof onPageSizeChange !== 'function'} onChange={(event) => onPageSizeChange(Number(event.target.value))}>{pageSizeOptions.map((option) => <option key={option} value={option}>{option} / page</option>)}</select><ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[#344767]" size={13} /></label>}
      </div>
    </footer>
  );
};

export default Pagination;

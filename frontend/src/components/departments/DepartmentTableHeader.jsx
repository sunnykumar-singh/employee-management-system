const headers = ['#', 'Department ID', 'Department Name', 'Department Head', 'Employees', 'Description', 'Status', 'Actions'];

const DepartmentTableHeader = () => <thead className="border-y border-[#e8edf4] bg-white"><tr>{headers.map((header) => <th className="whitespace-nowrap px-5 py-4 text-left text-[10px] font-semibold text-[#526078]" scope="col" key={header}>{header}</th>)}</tr></thead>;

export default DepartmentTableHeader;

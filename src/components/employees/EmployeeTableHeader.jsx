const headers = ['#', 'Employee ID', 'Name', 'Email', 'Department', 'Designation', 'Phone', 'Status', 'Join Date', 'Actions'];

const EmployeeTableHeader = () => <thead className="border-b border-[#e8edf4] bg-[#fbfcfe]"><tr>{headers.map((header) => <th className="whitespace-nowrap px-3 py-3 text-left text-[8px] font-semibold text-[#344767]" scope="col" key={header}>{header}</th>)}</tr></thead>;

export default EmployeeTableHeader;

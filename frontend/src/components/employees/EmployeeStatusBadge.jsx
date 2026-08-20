const statusClasses = {
  Active: 'bg-[#dcfaea] text-[#12a654]',
  Inactive: 'bg-[#ffebeb] text-[#f04438]',
  'On Leave': 'bg-[#fff2df] text-[#f79009]',
  Resigned: 'bg-[#ffebeb] text-[#f04438]',
};

const EmployeeStatusBadge = ({ status }) => <span className={`inline-flex rounded px-1.5 py-1 text-[10px] font-medium ${statusClasses[status]}`}>{status}</span>;

export default EmployeeStatusBadge;

const statusClasses = { Present: 'bg-[#dff7ea] text-[#058a49]', Absent: 'bg-[#ffebeb] text-[#f04438]', Late: 'bg-[#fff2df] text-[#f79009]' };

const AttendanceStatusBadge = ({ status }) => <span className={`inline-flex rounded-md px-2 py-1 text-[10px] font-medium ${statusClasses[status]}`}>{status}</span>;

export default AttendanceStatusBadge;

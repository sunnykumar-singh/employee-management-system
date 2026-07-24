import { UserRound } from 'lucide-react';
import EmployeeActions from './EmployeeActions.jsx';
import EmployeeStatusBadge from './EmployeeStatusBadge.jsx';

const EmployeeRow = ({ employee }) => (
  <tr className="border-b border-[#edf1f6] last:border-0 hover:bg-[#fafbff]">
    <td className="px-3 py-3 text-[9px] text-[#344767]">{employee.id}</td>
    <td className="px-3 py-3 text-[9px] font-medium text-[#101828]">{employee.employeeId}</td>
    <td className="px-3 py-3"><div className="flex items-center gap-2"><span className="flex size-6 items-center justify-center rounded-full text-[8px] font-bold text-white" style={{ backgroundColor: employee.avatar }}><UserRound size={13} /></span><span className="whitespace-nowrap text-[9px] font-medium text-[#101828]">{employee.name}</span></div></td>
    <td className="px-3 py-3 text-[9px] text-[#344767]">{employee.email}</td>
    <td className="px-3 py-3 text-[9px] text-[#101828]">{employee.department}</td>
    <td className="px-3 py-3 text-[9px] text-[#101828]">{employee.designation}</td>
    <td className="px-3 py-3 text-[9px] text-[#344767]">{employee.phone}</td>
    <td className="px-3 py-3"><EmployeeStatusBadge status={employee.status} /></td>
    <td className="whitespace-nowrap px-3 py-3 text-[9px] text-[#101828]">{employee.joinDate}</td>
    <td className="px-3 py-3"><EmployeeActions /></td>
  </tr>
);

export default EmployeeRow;

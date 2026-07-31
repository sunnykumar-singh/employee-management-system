import { BarChart3, Code2, Headphones, Megaphone, PenLine, ShieldCheck, Users, WalletCards, UserRound } from 'lucide-react';
import DepartmentActions from './DepartmentActions.jsx';

const icons = { code: Code2, megaphone: Megaphone, chart: BarChart3, users: Users, wallet: WalletCards, headphones: Headphones, pen: PenLine, shield: ShieldCheck };

const DepartmentRow = ({ department, onView, onEdit, onDelete }) => {
  const Icon = icons[department.icon];
  return <tr className="border-b border-[#edf1f6] last:border-0 hover:bg-[#fafbff]">
    <td className="px-5 py-3.5 text-xs text-[#101828]">{department.id}</td>
    <td className="px-5 py-3.5 whitespace-nowrap text-xs font-medium text-[#101828]">{department.departmentId}</td>
    <td className="px-5 py-3.5"><div className="flex items-center gap-4"><span className="flex size-10 shrink-0 items-center justify-center rounded-md" style={{ color: department.color, backgroundColor: department.background }}><Icon size={19} /></span><span className="whitespace-nowrap text-xs font-medium text-[#101828]">{department.name}</span></div></td>
    <td className="px-5 py-3.5"><div className="flex items-center gap-3"><span className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full text-white" style={{ backgroundColor: department.avatar }}>{department.headPhoto ? <img className="size-full object-cover" src={department.headPhoto} alt="" /> : <UserRound size={17} />}</span><span className="whitespace-nowrap text-xs text-[#101828]">{department.head}</span></div></td>
    <td className="px-5 py-3.5 text-xs text-[#101828]">{department.employees}</td>
    <td className="max-w-[290px] px-5 py-3.5 text-xs leading-[1.35] text-[#101828]">{department.description}</td>
    <td className="px-5 py-3.5"><span className="inline-flex rounded-md bg-[#dff7ea] px-2 py-1 text-[10px] font-medium text-[#058a49]">{department.status}</span></td>
    <td className="px-5 py-3.5"><DepartmentActions department={department} onView = {onView} onEdit={onEdit} onDelete={onDelete} /></td>
  </tr>;
};

export default DepartmentRow;

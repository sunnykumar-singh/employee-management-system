import { departmentPagination } from '../../data/departmentsData.js';
import EmptyState from '../employees/EmptyState.jsx';
import Pagination from '../employees/Pagination.jsx';
import DepartmentRow from './DepartmentRow.jsx';
import DepartmentTableHeader from './DepartmentTableHeader.jsx';

const DepartmentTable = ({ departments }) => (
  <section className="overflow-hidden rounded-b-xl border-x border-b border-[#e4eaf2] bg-white shadow-[0_2px_8px_rgba(16,24,40,0.02)]">
    <div className="overflow-x-auto">
      {departments.length ? <table className="w-full min-w-[1050px] border-collapse"><DepartmentTableHeader /><tbody>{departments.map((department) => <DepartmentRow key={department.id} department={department} />)}</tbody></table> : <EmptyState />}
    </div>
    <Pagination pagination={departmentPagination} />
  </section>
);

export default DepartmentTable;

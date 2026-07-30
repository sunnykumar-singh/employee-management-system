import EmployeeRow from './EmployeeRow.jsx';
import EmployeeTableHeader from './EmployeeTableHeader.jsx';
import EmptyState from './EmptyState.jsx';
import Pagination from './Pagination.jsx';

const EmployeeTable = ({ employees, onDelete, onEdit, onView }) => (
  <section className="overflow-hidden rounded-lg border border-[#e4eaf2] bg-white shadow-[0_2px_8px_rgba(16,24,40,0.02)]">
    <div className="overflow-x-auto">
      {employees.length ? <table className="w-full min-w-[1030px] border-collapse"><EmployeeTableHeader /><tbody>{employees.map((employee) => <EmployeeRow key={employee.employeeId} employee={employee} onDelete={onDelete} onEdit={onEdit} onView={onView} />)}</tbody></table> : <EmptyState />}
    </div>
    <Pagination />
  </section>
);

export default EmployeeTable;

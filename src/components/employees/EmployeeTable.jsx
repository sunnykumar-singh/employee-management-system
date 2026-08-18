import EmployeeRow from './EmployeeRow.jsx';
import EmployeeTableHeader from './EmployeeTableHeader.jsx';
import EmptyState from './EmptyState.jsx';
import Pagination from '../common/Pagination.jsx';

const EmployeeTable = ({ employees, currentPage, pageSize, totalItems, onPageChange, onPageSizeChange, onDelete, onEdit, onView }) => (
  <section className="overflow-hidden rounded-lg border border-[#e4eaf2] bg-white shadow-[0_2px_8px_rgba(16,24,40,0.02)]">
    <div className="overflow-x-auto">
      {employees.length ? (
        <table className="w-full min-w-[1030px] border-collapse">
          <EmployeeTableHeader />
          <tbody>
            {employees.map((employee, index) => (
              <EmployeeRow
                key={employee.id || employee.employeeId}
                employee={employee}
                serialNumber={(currentPage - 1) * pageSize + index + 1}
                onDelete={onDelete}
                onEdit={onEdit}
                onView={onView}
              />
            ))}
          </tbody>
        </table>
      ) : <EmptyState />}
    </div>
    <Pagination currentPage={currentPage} totalItems={totalItems} pageSize={pageSize} onPageChange={onPageChange} onPageSizeChange={onPageSizeChange} />
  </section>
);

export default EmployeeTable;

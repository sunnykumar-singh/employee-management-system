import Pagination from '../common/Pagination.jsx';
import EmptyState from '../employees/EmptyState.jsx';
import DepartmentRow from './DepartmentRow.jsx';
import DepartmentTableHeader from './DepartmentTableHeader.jsx';

const DepartmentTable = ({ departments, currentPage, pageSize, totalItems, onPageChange, onPageSizeChange, onView, onEdit, onDelete }) => (
  <section className="overflow-hidden rounded-b-xl border-x border-b border-[#e4eaf2] bg-white shadow-[0_2px_8px_rgba(16,24,40,0.02)]">
    <div className="overflow-x-auto">
      {departments.length ? (
        <table className="w-full min-w-[1050px] border-collapse">
          <DepartmentTableHeader />
          <tbody>
            {departments.map((department, index) => (
              <DepartmentRow
                key={department.id}
                department={department}
                serialNumber={(currentPage - 1) * pageSize + index + 1}
                onView={onView}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      ) : <EmptyState />}
    </div>
    <Pagination currentPage={currentPage} totalItems={totalItems} pageSize={pageSize} onPageChange={onPageChange} onPageSizeChange={onPageSizeChange} />
  </section>
);

export default DepartmentTable;

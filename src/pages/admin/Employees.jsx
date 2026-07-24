import EmployeeFilters from '../../components/employees/EmployeeFilters.jsx';
import EmployeeHeader from '../../components/employees/EmployeeHeader.jsx';
import EmployeeStats from '../../components/employees/EmployeeStats.jsx';
import EmployeeTable from '../../components/employees/EmployeeTable.jsx';

const Employees = () => (
  <div className="mx-auto max-w-[1280px] space-y-5">
    <EmployeeHeader />
    <EmployeeStats />
    <div className="space-y-3">
      <EmployeeFilters />
      <EmployeeTable />
    </div>
  </div>
);

export default Employees;

import DepartmentFilters from '../../components/departments/DepartmentFilters.jsx';
import DepartmentHeader from '../../components/departments/DepartmentHeader.jsx';
import DepartmentStats from '../../components/departments/DepartmentStats.jsx';
import DepartmentTable from '../../components/departments/DepartmentTable.jsx';
import { departments } from '../../data/departmentsData.js';

const Departments = () => (
  <div className="mx-auto max-w-[1280px] space-y-5">
    <DepartmentHeader />
    <DepartmentStats />
    <div>
      <DepartmentFilters />
      <DepartmentTable departments={departments} />
    </div>
  </div>
);

export default Departments;

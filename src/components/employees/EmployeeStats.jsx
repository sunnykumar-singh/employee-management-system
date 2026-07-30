import { employeeStatistics } from '../../data/employeesData.js';
import StatCard from './StatCard.jsx';

const EmployeeStats = ({ employees }) => {
  const values = {
    'Total Employees': employees.length,
    'Active Employees': employees.filter((employee) => employee.status === 'Active').length,
    'On Leave': employees.filter((employee) => employee.status === 'On Leave').length,
    'New Joiners': employees.filter((employee) => employee.isNewJoiner).length,
    Resigned: employees.filter((employee) => employee.status === 'Resigned').length,
  };

  return (
    <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
      {employeeStatistics.map((stat) => <StatCard key={stat.title} stat={{ ...stat, value: values[stat.title] }} />)}
    </section>
  );
};

export default EmployeeStats;

import { employeeStatistics } from '../../data/employeesData.js';
import StatCard from './StatCard.jsx';

const EmployeeStats = () => <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">{employeeStatistics.map((stat) => <StatCard key={stat.title} stat={stat} />)}</section>;

export default EmployeeStats;

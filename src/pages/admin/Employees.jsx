import { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import EmployeeFilters from '../../components/employees/EmployeeFilters.jsx';
import EmployeeForm from '../../components/employees/EmployeeForm.jsx';
import EmployeeHeader from '../../components/employees/EmployeeHeader.jsx';
import EmployeeStats from '../../components/employees/EmployeeStats.jsx';
import EmployeeTable from '../../components/employees/EmployeeTable.jsx';
import { employees as employeesData } from '../../data/employeesData.js';

const Employees = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [employees, setEmployees] = useState(employeesData);
  const addEmployee = (newEmployee) => setEmployees((currentEmployees) => [...currentEmployees, newEmployee]);

  return (
    <div className="mx-auto max-w-[1280px] space-y-5">
      <EmployeeHeader onAddEmployee={() => setIsFormOpen(true)} />
      <EmployeeStats employees={employees} />
      <div className="space-y-3">
        <EmployeeFilters />
        <EmployeeTable employees={employees} />
      </div>
      <EmployeeForm employees={employees} isOpen={isFormOpen} onAddEmployee={addEmployee} onClose={() => setIsFormOpen(false)} />
      <ToastContainer position="top-right" theme="light" />
    </div>
  );
};

export default Employees;

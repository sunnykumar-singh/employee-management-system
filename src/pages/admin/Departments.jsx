import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import DepartmentFilters from '../../components/departments/DepartmentFilters.jsx';
import DepartmentForm from '../../components/departments/DepartmentForm.jsx';
import DepartmentHeader from '../../components/departments/DepartmentHeader.jsx';
import DepartmentStats from '../../components/departments/DepartmentStats.jsx';
import DepartmentTable from '../../components/departments/DepartmentTable.jsx';
import { departments } from '../../data/departmentsData.js';

const departmentStyles = [
  { icon: 'building', color: '#5a4ff2', background: '#ecebff', avatar: '#6659f5' },
  { icon: 'users', color: '#0ab16b', background: '#e5f8ee', avatar: '#159b61' },
  { icon: 'chart', color: '#2585f3', background: '#e7f2ff', avatar: '#2b77d8' },
];

const Departments = () => {
  const [departmentList, setDepartmentList] = useState(departments);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const nextDepartmentNumber = departmentList.reduce((largestId, department) => Math.max(largestId, department.id), 0) + 1;
  const departmentId = `DEP${String(nextDepartmentNumber).padStart(3, '0')}`;

  const addDepartment = (values) => {
    const style = departmentStyles[(nextDepartmentNumber - 1) % departmentStyles.length];
    setDepartmentList((currentDepartments) => [...currentDepartments, {
      id: nextDepartmentNumber,
      departmentId: values.departmentId.trim(),
      name: values.departmentName.trim(),
      head: values.departmentHead,
      description: values.description.trim(),
      status: values.status,
      employees: 0,
      headPhoto: values.headPhoto?.[0] ? URL.createObjectURL(values.headPhoto[0]) : null,
      ...style,
    }]);
    setIsFormOpen(false);
    toast.success('Department added successfully.');
  };

  return <div className="mx-auto max-w-[1280px] space-y-5">
    <DepartmentHeader onAddDepartment={() => setIsFormOpen(true)} />
    <DepartmentStats departments={departmentList} />
    <div>
      <DepartmentFilters />
      <DepartmentTable departments={departmentList} />
    </div>
    <DepartmentForm departmentId={departmentId} departments={departmentList} isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} onSubmit={addDepartment} />
    <ToastContainer position="top-right" theme="light" />
  </div>;
};

export default Departments;

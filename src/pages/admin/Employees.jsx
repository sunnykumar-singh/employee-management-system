import { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import EmployeeFilters from '../../components/employees/EmployeeFilters.jsx';
import EmployeeDetailsModal from '../../components/employees/EmployeeDetailsModal.jsx';
import DeleteConfirmationModal from '../../components/employees/DeleteConfirmationModal.jsx';
import EmployeeForm from '../../components/employees/EmployeeForm.jsx';
import EmployeeHeader from '../../components/employees/EmployeeHeader.jsx';
import EmployeeStats from '../../components/employees/EmployeeStats.jsx';
import EmployeeTable from '../../components/employees/EmployeeTable.jsx';
import { employees as employeesData } from '../../data/employeesData.js';

const Employees = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState('add');
  const [formEmployee, setFormEmployee] = useState(null);
  const [employees, setEmployees] = useState(employeesData);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const closeEmployeeForm = () => {
    setIsFormOpen(false);
    setFormEmployee(null);
    setFormMode('add');
  };
  const submitEmployee = (values) => {
    const formattedJoinDate = new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(`${values.joiningDate}T00:00:00`));
    const initials = values.fullName.trim().split(/\s+/).slice(0, 2).map((name) => name[0]).join('').toUpperCase();
    const profilePhoto = values.profilePhoto?.[0] ? URL.createObjectURL(values.profilePhoto[0]) : formEmployee?.profilePhoto ?? null;

    if (formMode === 'edit') {
      setEmployees((currentEmployees) => currentEmployees.map((currentEmployee) => currentEmployee.employeeId === formEmployee.employeeId ? { ...currentEmployee, name: values.fullName.trim(), initials, email: values.email.trim(), phone: values.phone, department: values.department, designation: values.designation, joiningDate: formattedJoinDate, status: values.status, gender: values.gender, profilePhoto } : currentEmployee));
      toast.success('Employee Updated Successfully');
    } else {
      const nextId = employees.reduce((largestId, currentEmployee) => Math.max(largestId, currentEmployee.id), 0) + 1;
      setEmployees((currentEmployees) => [...currentEmployees, { id: nextId, employeeId: values.employeeId.trim() || `EMP${String(nextId).padStart(3, '0')}`, name: values.fullName.trim(), initials, email: values.email.trim(), phone: values.phone, department: values.department, designation: values.designation, status: values.status, gender: values.gender, joinDate: formattedJoinDate, isNewJoiner: true, avatar: '#6659f5', profilePhoto }]);
      toast.success('Employee added successfully.');
    }

    closeEmployeeForm();
  };
  const openAddEmployeeForm = () => {
    setFormMode('add');
    setFormEmployee(null);
    setIsFormOpen(true);
  };
  const openEditEmployeeForm = (employee) => {
    setFormMode('edit');
    setFormEmployee(employee);
    setIsFormOpen(true);
  };
  const openDeleteConfirmation = (employee) => {
    setEmployeeToDelete(employee);
    setIsDeleteModalOpen(true);
  };
  const closeDeleteConfirmation = () => {
    setIsDeleteModalOpen(false);
    setEmployeeToDelete(null);
  };
  const deleteEmployee = () => {
    setEmployees((currentEmployees) => currentEmployees.filter((employee) => employee.employeeId !== employeeToDelete.employeeId));
    toast.success('Employee Deleted Successfully');
    closeDeleteConfirmation();
  };
  const viewEmployee = (employee) => {
    setSelectedEmployee(employee);
    setIsViewModalOpen(true);
  };

  return (
    <div className="mx-auto max-w-[1280px] space-y-5">
      <EmployeeHeader onAddEmployee={openAddEmployeeForm} />
      <EmployeeStats employees={employees} />
      <div className="space-y-3">
        <EmployeeFilters />
        <EmployeeTable employees={employees} onDelete={openDeleteConfirmation} onEdit={openEditEmployeeForm} onView={viewEmployee} />
      </div>
      <EmployeeForm employee={formEmployee} employees={employees} isOpen={isFormOpen} mode={formMode} onClose={closeEmployeeForm} onSubmit={submitEmployee} />
      <EmployeeDetailsModal employee={selectedEmployee} isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} />
      <DeleteConfirmationModal employee={employeeToDelete} isOpen={isDeleteModalOpen} onClose={closeDeleteConfirmation} onConfirm={deleteEmployee} />
      <ToastContainer position="top-right" theme="light" />
    </div>
  );
};

export default Employees;

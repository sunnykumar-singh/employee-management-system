import { useCallback, useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import DeleteConfirmationModal from '../../components/common/DeleteConfirmationModal.jsx';
import LoadingState from '../../components/common/LoadingState.jsx';
import EmployeeDetailsModal from '../../components/employees/EmployeeDetailsModal.jsx';
import EmployeeFilters from '../../components/employees/EmployeeFilters.jsx';
import EmployeeForm from '../../components/employees/EmployeeForm.jsx';
import EmployeeHeader from '../../components/employees/EmployeeHeader.jsx';
import EmployeeStats from '../../components/employees/EmployeeStats.jsx';
import EmployeeTable from '../../components/employees/EmployeeTable.jsx';
import useDebouncedValue from '../../hooks/useDebouncedValue.js';
import { listDepartments } from '../../services/departmentService.js';
import { createEmployee, deleteEmployee, listEmployees, updateEmployee, uploadEmployeePhoto } from '../../services/employeeService.js';
import { getApiError } from '../../utils/apiError.js';
import { getSelectedFile, mapDepartment, mapEmployee, toEmployeePayload } from '../../utils/mappers.js';

const Employees = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({ department: 'All Departments', designation: 'All Designations', status: 'All Statuses' });
  const [formMode, setFormMode] = useState('add');
  const [formEmployee, setFormEmployee] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [statsEmployees, setStatsEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const debouncedSearch = useDebouncedValue(searchQuery);

  const loadDepartments = useCallback(async () => {
    const page = await listDepartments({ page: 0, size: 100 });
    setDepartments((page.content || []).map(mapDepartment));
  }, []);

  const loadEmployees = useCallback(async () => {
    setLoading(true);
    try {
      const departmentId = departments.find((department) => department.name === filters.department)?.id;
      const status = filters.status === 'All Statuses' ? undefined : filters.status.replace(/\s+/g, '_').toUpperCase();
      const page = await listEmployees({
        page: currentPage - 1,
        size: pageSize,
        search: debouncedSearch || undefined,
        departmentId,
        status,
      });
      const mapped = (page.content || []).map(mapEmployee);
      const visible = filters.designation === 'All Designations'
        ? mapped
        : mapped.filter((employee) => employee.designation === filters.designation);
      setEmployees(visible);
      setTotalItems(page.totalElements || 0);
    } catch (error) {
      toast.error(getApiError(error));
    } finally {
      setLoading(false);
    }
  }, [currentPage, debouncedSearch, departments, filters.department, filters.designation, filters.status, pageSize]);

  const loadStats = useCallback(async () => {
    try {
      const page = await listEmployees({ page: 0, size: 200 });
      setStatsEmployees((page.content || []).map(mapEmployee));
    } catch {
      setStatsEmployees([]);
    }
  }, []);

  useEffect(() => {
    loadDepartments().catch((error) => toast.error(getApiError(error)));
    loadStats();
  }, [loadDepartments, loadStats]);

  useEffect(() => {
    loadEmployees();
  }, [loadEmployees]);

  const closeEmployeeForm = () => {
    setIsFormOpen(false);
    setFormEmployee(null);
    setFormMode('add');
  };

  const submitEmployee = async (values) => {
    try {
      const payload = toEmployeePayload(values, departments);
      if (!payload.departmentId) {
        toast.error('Please select a valid department.');
        return;
      }
      const photoFile = getSelectedFile(values.profilePhoto);
      let saved;
      if (formMode === 'edit') {
        saved = await updateEmployee(formEmployee.id, payload);
        toast.success('Employee Updated Successfully');
      } else {
        saved = await createEmployee(payload);
        toast.success('Employee added successfully.');
      }
      if (photoFile && saved?.id) {
        await uploadEmployeePhoto(saved.id, photoFile);
        toast.success('Profile photo uploaded successfully.');
      }
      closeEmployeeForm();
      await Promise.all([loadEmployees(), loadStats()]);
    } catch (error) {
      toast.error(getApiError(error));
    }
  };

  return (
    <div className="mx-auto max-w-[1280px] space-y-5">
      <EmployeeHeader onAddEmployee={() => { setFormMode('add'); setFormEmployee(null); setIsFormOpen(true); }} />
      <EmployeeStats employees={statsEmployees} />
      <div className="space-y-3">
        <EmployeeFilters
          filters={filters}
          departments={departments}
          onFilterChange={(name, value) => { setFilters((current) => ({ ...current, [name]: value })); setCurrentPage(1); }}
          searchQuery={searchQuery}
          onSearchChange={(value) => { setSearchQuery(value); setCurrentPage(1); }}
          onRefresh={loadEmployees}
        />
        {loading ? <LoadingState label="Loading employees..." /> : (
          <EmployeeTable
            employees={employees}
            currentPage={currentPage}
            pageSize={pageSize}
            totalItems={totalItems}
            onPageChange={setCurrentPage}
            onPageSizeChange={(value) => { setPageSize(value); setCurrentPage(1); }}
            onDelete={(employee) => { setEmployeeToDelete(employee); setIsDeleteModalOpen(true); }}
            onEdit={(employee) => { setFormMode('edit'); setFormEmployee(employee); setIsFormOpen(true); }}
            onView={(employee) => { setSelectedEmployee(employee); setIsViewModalOpen(true); }}
          />
        )}
      </div>
      <EmployeeForm employee={formEmployee} employees={employees} departments={departments} isOpen={isFormOpen} mode={formMode} onClose={closeEmployeeForm} onSubmit={submitEmployee} />
      <EmployeeDetailsModal employee={selectedEmployee} isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} />
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        title="Delete Employee"
        itemName={employeeToDelete?.name}
        itemId={employeeToDelete?.employeeId}
        onClose={() => { setIsDeleteModalOpen(false); setEmployeeToDelete(null); }}
        onConfirm={async () => {
          try {
            await deleteEmployee(employeeToDelete.id);
            toast.success('Employee Deleted Successfully');
            setIsDeleteModalOpen(false);
            setEmployeeToDelete(null);
            await Promise.all([loadEmployees(), loadStats()]);
          } catch (error) {
            toast.error(getApiError(error));
          }
        }}
      />
      <ToastContainer position="top-right" theme="light" />
    </div>
  );
};

export default Employees;

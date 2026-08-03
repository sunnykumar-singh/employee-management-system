import { useMemo, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import DepartmentFilters from '../../components/departments/DepartmentFilters.jsx';
import DepartmentForm from '../../components/departments/DepartmentForm.jsx';
import DepartmentHeader from '../../components/departments/DepartmentHeader.jsx';
import DepartmentStats from '../../components/departments/DepartmentStats.jsx';
import DepartmentTable from '../../components/departments/DepartmentTable.jsx';
import { departments } from '../../data/departmentsData.js';
import ViewDepartmentModal from "../../components/departments/ViewDepartmentModal";
import DeleteConfirmationModal from "../../components/common/DeleteConfirmationModal";

const departmentStyles = [
  { icon: 'building', color: '#5a4ff2', background: '#ecebff', avatar: '#6659f5' },
  { icon: 'users', color: '#0ab16b', background: '#e5f8ee', avatar: '#159b61' },
  { icon: 'chart', color: '#2585f3', background: '#e7f2ff', avatar: '#2b77d8' },
];

const Departments = () => {
  const [departmentList, setDepartmentList] = useState(departments);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({ head: 'All Department Heads', status: 'All Statuses' });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [deleteDepartment, setDeleteDepartment] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [formMode, setFormMode] = useState("add");
  const nextDepartmentNumber = departmentList.reduce((largestId, department) => Math.max(largestId, department.id), 0) + 1;
  const departmentId = `DEP${String(nextDepartmentNumber).padStart(3, '0')}`;
  const filteredDepartments = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return departmentList.filter((department) => [
      department.departmentId,
      department.name,
      department.head,
      department.description,
    ].some((field) => String(field ?? '').toLowerCase().includes(query))
      && (filters.head === 'All Department Heads' || department.head === filters.head)
      && (filters.status === 'All Statuses' || department.status === filters.status));
  }, [departmentList, filters, searchQuery]);
  const departmentHeadOptions = useMemo(() => ['All Department Heads', ...new Set(departmentList.map((department) => department.head))], [departmentList]);
  const totalPages = Math.max(Math.ceil(filteredDepartments.length / pageSize), 1);
  const activePage = Math.min(currentPage, totalPages);
  const paginatedDepartments = useMemo(() => {
    const startIndex = (activePage - 1) * pageSize;
    return filteredDepartments.slice(startIndex, startIndex + pageSize);
  }, [activePage, filteredDepartments, pageSize]);

  const updateFilter = (filterName, value) => {
    setFilters((currentFilters) => ({ ...currentFilters, [filterName]: value }));
    setCurrentPage(1);
  };
  const updateSearchQuery = (value) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };
  const updatePageSize = (value) => {
    setPageSize(value);
    setCurrentPage(1);
  };

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
    setCurrentPage(Math.ceil((departmentList.length + 1) / pageSize));
    setIsFormOpen(false);
    toast.success('Department added successfully.');
  };

const updateDepartment = (values) => {
  setDepartmentList((currentDepartments) =>
    currentDepartments.map((dept) =>
      dept.id === editingDepartment.id
        ? {
            ...dept,
            departmentId: values.departmentId.trim(),
            name: values.departmentName.trim(),
            head: values.departmentHead.trim(),
            description: values.description.trim(),
            status: values.status,
            headPhoto: values.headPhoto?.[0]
              ? URL.createObjectURL(values.headPhoto[0])
              : dept.headPhoto,
          }
        : dept
    )
  );

  setIsFormOpen(false);
  setEditingDepartment(null);
  setFormMode("add");

  toast.success("Department updated successfully.");
};

const confirmDeleteDepartment = () => {
  setDepartmentList((currentDepartments) =>
    currentDepartments.filter(
      (department) => department.id !== deleteDepartment.id
    )
  );

  setDeleteDepartment(null);
  setIsDeleteOpen(false);

  toast.success("Department deleted successfully.");
};
  
  const handleViewDepartment = (department) => {
  setSelectedDepartment(department);
  setIsViewOpen(true);
};

const handleEditDepartment = (department) => {
  setEditingDepartment(department);
  setFormMode("edit");
  setIsFormOpen(true);
};

const handleDeleteDepartment = (department) => {
  setDeleteDepartment(department);
  setIsDeleteOpen(true);
};

  return <div className="mx-auto max-w-[1280px] space-y-5">
    <DepartmentHeader onAddDepartment={() => { setFormMode("add"); setEditingDepartment(null); setIsFormOpen(true); }} />
    <DepartmentStats departments={departmentList} />
    <div>
      <DepartmentFilters filters={filters} headOptions={departmentHeadOptions} onFilterChange={updateFilter} searchQuery={searchQuery} onSearchChange={updateSearchQuery} />
     <DepartmentTable departments={paginatedDepartments} currentPage={activePage} pageSize={pageSize} totalItems={filteredDepartments.length} onPageChange={setCurrentPage} onPageSizeChange={updatePageSize} onView={handleViewDepartment} onEdit={handleEditDepartment} onDelete={handleDeleteDepartment} />
    </div>
    <DepartmentForm
  department={editingDepartment}
  departmentId={departmentId}
  departments={departmentList}
  isOpen={isFormOpen}
  mode={formMode}
  onClose={() => {
    setIsFormOpen(false);
    setEditingDepartment(null);
    setFormMode("add");}} 
    onSubmit={formMode === "edit" ? updateDepartment : addDepartment} 
    />

      <ViewDepartmentModal
    isOpen={isViewOpen}
    department={selectedDepartment}
    onClose={() => setIsViewOpen(false)}/>
    
    <DeleteConfirmationModal
  isOpen={isDeleteOpen}
  title="Delete Department"
  itemName={deleteDepartment?.name}
  itemId={deleteDepartment?.departmentId}
  onClose={() => {
    setDeleteDepartment(null);
    setIsDeleteOpen(false);
  }}
  onConfirm={confirmDeleteDepartment}
/>

    <ToastContainer position="top-right" theme="light" />
  </div>;
};

export default Departments;

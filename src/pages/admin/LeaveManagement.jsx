import { useMemo, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import DeleteConfirmationModal from "../../components/common/DeleteConfirmationModal";
import LeaveHeader from "../../components/Leave/LeaveHeader";
import LeaveStats from "../../components/Leave/LeaveStats";
import LeaveFilters from "../../components/Leave/LeaveFilters";
import LeaveTable from "../../components/Leave/LeaveTable";
import ViewLeaveModal from "../../components/Leave/ViewLeaveModal";
import LeaveForm from "../../components/Leave/LeaveForm";
import leaveData from "../../data/leaveData";

const Leaves = () => {
  const initialFilters = { employeeId: 'All Employee IDs', employee: 'All Employees', department: 'All Departments', leaveType: 'All Leave Types', status: 'All Statuses' };
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [editingLeave, setEditingLeave] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [leaves, setLeaves] = useState(leaveData);
  const [leaveToDelete, setLeaveToDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState(initialFilters);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const filterOptions = useMemo(() => ({
    employeeIds: ['All Employee IDs', ...new Set(leaves.map((leave) => leave.employeeId))],
    employees: ['All Employees', ...new Set(leaves.map((leave) => leave.employee))],
    departments: ['All Departments', ...new Set(leaves.map((leave) => leave.department))],
    leaveTypes: ['All Leave Types', ...new Set(leaves.map((leave) => leave.leaveType))],
    statuses: ['All Statuses', ...new Set(leaves.map((leave) => leave.status))],
  }), [leaves]);
  const filteredLeaves = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const searchableFields = ['employee', 'employeeId', 'department', 'leaveType', 'status'];

    return leaves.filter((leave) => {
      const matchesSearch = !query || searchableFields.some((field) => String(leave[field] ?? '').toLowerCase().includes(query));
      const matchesEmployeeId = filters.employeeId === 'All Employee IDs' || leave.employeeId.toLowerCase() === filters.employeeId.toLowerCase();
      const matchesEmployee = filters.employee === 'All Employees' || leave.employee.toLowerCase() === filters.employee.toLowerCase();
      const matchesDepartment = filters.department === 'All Departments' || leave.department.toLowerCase() === filters.department.toLowerCase();
      const matchesLeaveType = filters.leaveType === 'All Leave Types' || leave.leaveType.toLowerCase() === filters.leaveType.toLowerCase();
      const matchesStatus = filters.status === 'All Statuses' || leave.status.toLowerCase() === filters.status.toLowerCase();
      return matchesSearch && matchesEmployeeId && matchesEmployee && matchesDepartment && matchesLeaveType && matchesStatus;
    });
  }, [filters, leaves, searchQuery]);
  const totalPages = Math.max(Math.ceil(filteredLeaves.length / pageSize), 1);
  const activePage = Math.min(currentPage, totalPages);
  const paginatedLeaves = useMemo(() => {
    const startIndex = (activePage - 1) * pageSize;
    return filteredLeaves.slice(startIndex, startIndex + pageSize);
  }, [activePage, filteredLeaves, pageSize]);

  const handleViewLeave = (leave) => {
    setSelectedLeave(leave);
    setIsViewOpen(true);
  };

  const closeViewModal = () => {
    setSelectedLeave(null);
    setIsViewOpen(false);
  };

  const handleEditLeave = (leave) => {
  setEditingLeave(leave);
  setIsFormOpen(true);
  };

  const closeForm = () => {
  setEditingLeave(null);
  setIsFormOpen(false);
  };

const handleUpdateLeave = (updatedLeave) => {
  setLeaves((prevLeaves) =>
      prevLeaves.map((leave) =>
      leave.id === updatedLeave.id ? updatedLeave : leave
    )
  );

  closeForm();
};

  const openDeleteConfirmation = (leave) => {
    setLeaveToDelete(leave);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteConfirmation = () => {
    setIsDeleteModalOpen(false);
    setLeaveToDelete(null);
  };

  const deleteLeave = () => {
    setLeaves((currentLeaves) => currentLeaves.filter((leave) => leave.id !== leaveToDelete.id));
    toast.success('Leave deleted successfully.');
    closeDeleteConfirmation();
  };

  const updateLeaveStatus = (leaveId, status) => {
    setLeaves((currentLeaves) => currentLeaves.map((leave) => leave.id === leaveId ? { ...leave, status } : leave));
    toast.success(`Leave ${status.toLowerCase()} successfully.`);
  };

  const updateFilter = (filterName, value) => {
    setFilters((currentFilters) => ({ ...currentFilters, [filterName]: value }));
    setCurrentPage(1);
  };
  const updateSearchQuery = (value) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };
  const resetFilters = () => {
    setSearchQuery('');
    setFilters(initialFilters);
    setCurrentPage(1);
  };

  return (
    <div className="mx-auto max-w-[1280px] space-y-5">
      <LeaveHeader />

      <LeaveStats />

      <div>
        <LeaveFilters filters={filters} filterOptions={filterOptions} onFilterChange={updateFilter} onReset={resetFilters} searchQuery={searchQuery} onSearchChange={updateSearchQuery} />

        <LeaveTable
        leaves={paginatedLeaves}
        currentPage={activePage}
        pageSize={pageSize}
        totalItems={filteredLeaves.length}
        onPageChange={setCurrentPage}
        onPageSizeChange={(value) => { setPageSize(value); setCurrentPage(1); }}
        onView={handleViewLeave}
        onEdit={handleEditLeave}
        onDelete={openDeleteConfirmation}
        onApprove={(leave) => updateLeaveStatus(leave.id, 'Approved')}
        onReject={(leave) => updateLeaveStatus(leave.id, 'Rejected')} />
      </div>

      <LeaveForm
        leave={editingLeave}
        isOpen={isFormOpen}
        onClose={closeForm}
        onSave={handleUpdateLeave}
     />

      <ViewLeaveModal
        leave={selectedLeave}
        isOpen={isViewOpen}
        onClose={closeViewModal}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        title="Delete Leave"
        itemName={leaveToDelete?.employee}
        itemId={leaveToDelete?.employeeId}
        onClose={closeDeleteConfirmation}
        onConfirm={deleteLeave}
      />

      <ToastContainer position="top-right" theme="light" />
    </div>
  );
};

export default Leaves;

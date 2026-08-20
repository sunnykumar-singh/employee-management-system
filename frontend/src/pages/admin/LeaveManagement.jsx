import { useCallback, useEffect, useMemo, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import DeleteConfirmationModal from '../../components/common/DeleteConfirmationModal';
import LoadingState from '../../components/common/LoadingState.jsx';
import LeaveFilters from '../../components/Leave/LeaveFilters';
import LeaveForm from '../../components/Leave/LeaveForm';
import LeaveHeader from '../../components/Leave/LeaveHeader';
import LeaveStats from '../../components/Leave/LeaveStats';
import LeaveTable from '../../components/Leave/LeaveTable';
import ViewLeaveModal from '../../components/Leave/ViewLeaveModal';
import useDebouncedValue from '../../hooks/useDebouncedValue.js';
import { listDepartments } from '../../services/departmentService.js';
import { approveLeave, deleteLeave, listLeaves, rejectLeave, updateLeave } from '../../services/leaveService.js';
import { getApiError } from '../../utils/apiError.js';
import { LEAVE_STATUSES, LEAVE_TYPES, mapDepartment, mapLeave, toLeavePayload } from '../../utils/mappers.js';

const initialFilters = {
  employeeId: 'All Employee IDs',
  employee: 'All Employees',
  department: 'All Departments',
  leaveType: 'All Leave Types',
  status: 'All Statuses',
  date: '',
};

const Leaves = () => {
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [editingLeave, setEditingLeave] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [leaves, setLeaves] = useState([]);
  const [leaveToDelete, setLeaveToDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState(initialFilters);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totals, setTotals] = useState({});
  const debouncedSearch = useDebouncedValue(searchQuery);

  const loadLeaves = useCallback(async () => {
    setLoading(true);
    try {
      const departmentId = departments.find((department) => department.name === filters.department)?.id;
      const page = await listLeaves({
        page: currentPage - 1,
        size: pageSize,
        search: debouncedSearch || undefined,
        leaveType: filters.leaveType === 'All Leave Types' ? undefined : filters.leaveType.toUpperCase(),
        status: filters.status === 'All Statuses' ? undefined : filters.status.toUpperCase(),
        departmentId,
        date: filters.date || undefined,
      });
      let mapped = (page.content || []).map(mapLeave);
      if (filters.employeeId !== 'All Employee IDs') mapped = mapped.filter((leave) => leave.employeeId === filters.employeeId);
      if (filters.employee !== 'All Employees') mapped = mapped.filter((leave) => leave.employee === filters.employee);
      setLeaves(mapped);
      setTotalItems(page.totalElements || 0);
    } catch (error) {
      toast.error(getApiError(error));
    } finally {
      setLoading(false);
    }
  }, [currentPage, debouncedSearch, departments, filters, pageSize]);

  const loadTotals = useCallback(async () => {
    try {
      const [total, approved, pending, rejected] = await Promise.all([
        listLeaves({ page: 0, size: 1 }),
        listLeaves({ page: 0, size: 1, status: 'APPROVED' }),
        listLeaves({ page: 0, size: 1, status: 'PENDING' }),
        listLeaves({ page: 0, size: 1, status: 'REJECTED' }),
      ]);
      setTotals({
        total: total.totalElements || 0,
        approved: approved.totalElements || 0,
        pending: pending.totalElements || 0,
        rejected: rejected.totalElements || 0,
      });
    } catch {
      setTotals({});
    }
  }, []);

  useEffect(() => {
    listDepartments({ page: 0, size: 100 })
      .then((page) => setDepartments((page.content || []).map(mapDepartment)))
      .catch((error) => toast.error(getApiError(error)));
    loadTotals();
  }, [loadTotals]);

  useEffect(() => {
    loadLeaves();
  }, [loadLeaves]);

  const filterOptions = useMemo(() => ({
    employeeIds: ['All Employee IDs', ...new Set(leaves.map((leave) => leave.employeeId))],
    employees: ['All Employees', ...new Set(leaves.map((leave) => leave.employee))],
    departments: ['All Departments', ...departments.map((department) => department.name)],
    leaveTypes: ['All Leave Types', ...LEAVE_TYPES],
    statuses: ['All Statuses', ...LEAVE_STATUSES],
  }), [departments, leaves]);

  const handleUpdateLeave = async (values) => {
    try {
      await updateLeave(editingLeave.id, toLeavePayload(editingLeave, values));
      toast.success('Leave updated successfully.');
      setIsFormOpen(false);
      setEditingLeave(null);
      await Promise.all([loadLeaves(), loadTotals()]);
    } catch (error) {
      toast.error(getApiError(error));
    }
  };

  return (
    <div className="mx-auto max-w-[1280px] space-y-5">
      <LeaveHeader />
      <LeaveStats totals={totals} />
      <div>
        <LeaveFilters
          filters={filters}
          filterOptions={filterOptions}
          onFilterChange={(name, value) => { setFilters((current) => ({ ...current, [name]: value })); setCurrentPage(1); }}
          onReset={() => { setSearchQuery(''); setFilters(initialFilters); setCurrentPage(1); }}
          searchQuery={searchQuery}
          onSearchChange={(value) => { setSearchQuery(value); setCurrentPage(1); }}
        />
        {loading ? <LoadingState label="Loading leave requests..." /> : (
          <LeaveTable
            leaves={leaves}
            currentPage={currentPage}
            pageSize={pageSize}
            totalItems={totalItems}
            onPageChange={setCurrentPage}
            onPageSizeChange={(value) => { setPageSize(value); setCurrentPage(1); }}
            onView={(leave) => { setSelectedLeave(leave); setIsViewOpen(true); }}
            onEdit={(leave) => { setEditingLeave(leave); setIsFormOpen(true); }}
            onDelete={(leave) => { setLeaveToDelete(leave); setIsDeleteModalOpen(true); }}
            onApprove={async (leave) => {
              try {
                await approveLeave(leave.id);
                toast.success('Leave approved successfully.');
                await Promise.all([loadLeaves(), loadTotals()]);
              } catch (error) {
                toast.error(getApiError(error));
              }
            }}
            onReject={async (leave) => {
              try {
                await rejectLeave(leave.id);
                toast.success('Leave rejected successfully.');
                await Promise.all([loadLeaves(), loadTotals()]);
              } catch (error) {
                toast.error(getApiError(error));
              }
            }}
          />
        )}
      </div>
      <LeaveForm leave={editingLeave} isOpen={isFormOpen} onClose={() => { setEditingLeave(null); setIsFormOpen(false); }} onSave={handleUpdateLeave} />
      <ViewLeaveModal leave={selectedLeave} isOpen={isViewOpen} onClose={() => { setSelectedLeave(null); setIsViewOpen(false); }} />
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        title="Delete Leave"
        itemName={leaveToDelete?.employee}
        itemId={leaveToDelete?.employeeId}
        onClose={() => { setIsDeleteModalOpen(false); setLeaveToDelete(null); }}
        onConfirm={async () => {
          try {
            await deleteLeave(leaveToDelete.id);
            toast.success('Leave deleted successfully.');
            setIsDeleteModalOpen(false);
            setLeaveToDelete(null);
            await Promise.all([loadLeaves(), loadTotals()]);
          } catch (error) {
            toast.error(getApiError(error));
          }
        }}
      />
      <ToastContainer position="top-right" theme="light" />
    </div>
  );
};

export default Leaves;

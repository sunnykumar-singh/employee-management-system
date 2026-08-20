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
import { applyLeave, cancelLeave, listMyLeaves } from '../../services/employeePortalService.js';
import { getApiError } from '../../utils/apiError.js';
import { LEAVE_STATUSES, LEAVE_TYPES, mapLeave } from '../../utils/mappers.js';

const initialFilters = {
  leaveType: 'All Leave Types',
  status: 'All Statuses',
};

const MyLeaves = () => {
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [leaveToCancel, setLeaveToCancel] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [filters, setFilters] = useState(initialFilters);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totals, setTotals] = useState({});

  const loadLeaves = useCallback(async () => {
    setLoading(true);
    try {
      const page = await listMyLeaves({
        page: currentPage - 1,
        size: pageSize,
        status: filters.status === 'All Statuses' ? undefined : filters.status.toUpperCase(),
      });
      let mapped = (page.content || []).map(mapLeave);
      if (filters.leaveType !== 'All Leave Types') {
        mapped = mapped.filter((leave) => leave.leaveType === filters.leaveType);
      }
      setLeaves(mapped);
      setTotalItems(page.totalElements || 0);
    } catch (error) {
      toast.error(getApiError(error));
    } finally {
      setLoading(false);
    }
  }, [currentPage, filters.leaveType, filters.status, pageSize]);

  const loadTotals = useCallback(async () => {
    try {
      const [total, approved, pending, rejected] = await Promise.all([
        listMyLeaves({ page: 0, size: 1 }),
        listMyLeaves({ page: 0, size: 1, status: 'APPROVED' }),
        listMyLeaves({ page: 0, size: 1, status: 'PENDING' }),
        listMyLeaves({ page: 0, size: 1, status: 'REJECTED' }),
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
    loadTotals();
  }, [loadTotals]);

  useEffect(() => {
    loadLeaves();
  }, [loadLeaves]);

  const filterOptions = useMemo(() => ({
    leaveTypes: ['All Leave Types', ...LEAVE_TYPES],
    statuses: ['All Statuses', ...LEAVE_STATUSES],
  }), []);

  const handleApplyLeave = async (values) => {
    try {
      await applyLeave({
        leaveType: String(values.leaveType || '').trim().replace(/\s+/g, '_').toUpperCase(),
        fromDate: values.from,
        toDate: values.to,
        reason: (values.reason || '').trim(),
      });
      toast.success('Leave request submitted successfully.');
      setIsFormOpen(false);
      await Promise.all([loadLeaves(), loadTotals()]);
    } catch (error) {
      toast.error(getApiError(error));
    }
  };

  return (
    <div className="mx-auto max-w-[1280px] space-y-5">
      <LeaveHeader
        title="My Leave"
        breadcrumbLabel="My Leave"
        dashboardTo="/employee/dashboard"
        onApplyLeave={() => setIsFormOpen(true)}
      />
      <LeaveStats totals={totals} />
      <div>
        <LeaveFilters
          filters={filters}
          filterOptions={filterOptions}
          variant="employee"
          onFilterChange={(name, value) => { setFilters((current) => ({ ...current, [name]: value })); setCurrentPage(1); }}
          onReset={() => { setFilters(initialFilters); setCurrentPage(1); }}
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
            onDelete={(leave) => { setLeaveToCancel(leave); setIsDeleteModalOpen(true); }}
            readOnly
          />
        )}
      </div>
      <LeaveForm mode="create" isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} onSave={handleApplyLeave} />
      <ViewLeaveModal leave={selectedLeave} isOpen={isViewOpen} onClose={() => { setSelectedLeave(null); setIsViewOpen(false); }} />
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        title="Cancel Leave"
        itemName={leaveToCancel?.leaveType}
        itemId={leaveToCancel?.from}
        onClose={() => { setIsDeleteModalOpen(false); setLeaveToCancel(null); }}
        onConfirm={async () => {
          try {
            await cancelLeave(leaveToCancel.id);
            toast.success('Leave request cancelled successfully.');
            setIsDeleteModalOpen(false);
            setLeaveToCancel(null);
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

export default MyLeaves;

import { useCallback, useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import AttendanceFilters from '../../components/attendance/AttendanceFilters.jsx';
import AttendanceHeader from '../../components/attendance/AttendanceHeader.jsx';
import AttendanceRecordModal from '../../components/attendance/AttendanceRecordModal.jsx';
import AttendanceStats from '../../components/attendance/AttendanceStats.jsx';
import AttendanceTable from '../../components/attendance/AttendanceTable.jsx';
import LoadingState from '../../components/common/LoadingState.jsx';
import {
  checkInAttendance,
  checkOutAttendance,
  getEmployeeDashboard,
  listMyAttendance,
} from '../../services/employeePortalService.js';
import { getApiError } from '../../utils/apiError.js';
import { mapAttendance } from '../../utils/mappers.js';

const today = new Date().toISOString().slice(0, 10);

const Attendance = () => {
  const [draftFilters, setDraftFilters] = useState({ date: '', status: 'All Status' });
  const [appliedFilters, setAppliedFilters] = useState(draftFilters);
  const [records, setRecords] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [modalMode, setModalMode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [totals, setTotals] = useState({});
  const [todayRecord, setTodayRecord] = useState(null);

  const loadTodayRecord = useCallback(async () => {
    try {
      const page = await listMyAttendance({ page: 0, size: 1, date: today });
      setTodayRecord((page.content || [])[0] ? mapAttendance(page.content[0]) : null);
    } catch {
      setTodayRecord(null);
    }
  }, []);

  const loadRecords = useCallback(async () => {
    setLoading(true);
    try {
      const status = appliedFilters.status === 'All Status' ? undefined : appliedFilters.status.toUpperCase();
      const page = await listMyAttendance({
        page: currentPage - 1,
        size: pageSize,
        date: appliedFilters.date || undefined,
        status,
      });
      setRecords((page.content || []).map(mapAttendance));
      setTotalItems(page.totalElements || 0);
    } catch (error) {
      toast.error(getApiError(error));
    } finally {
      setLoading(false);
    }
  }, [appliedFilters, currentPage, pageSize]);

  const loadTotals = useCallback(async () => {
    try {
      const dashboard = await getEmployeeDashboard();
      const present = dashboard.presentDays || 0;
      const absent = dashboard.absentDays || 0;
      const marked = present + absent;
      setTotals({
        present,
        absent,
        late: 0,
        employees: 1,
        rate: marked ? `${Math.round((present / marked) * 100)}%` : '0%',
      });
    } catch {
      setTotals({});
    }
  }, []);

  const refreshAttendance = useCallback(async () => {
    await Promise.all([loadRecords(), loadTotals(), loadTodayRecord()]);
  }, [loadRecords, loadTotals, loadTodayRecord]);

  useEffect(() => {
    loadRecords();
  }, [loadRecords]);

  useEffect(() => {
    loadTotals();
  }, [loadTotals]);

  useEffect(() => {
    loadTodayRecord();
  }, [loadTodayRecord]);

  const handleCheckIn = async () => {
    setActionLoading(true);
    try {
      await checkInAttendance();
      toast.success('Checked in successfully.');
      await refreshAttendance();
    } catch (error) {
      toast.error(getApiError(error));
    } finally {
      setActionLoading(false);
    }
  };

  const handleCheckOut = async () => {
    setActionLoading(true);
    try {
      await checkOutAttendance();
      toast.success('Checked out successfully.');
      await refreshAttendance();
    } catch (error) {
      toast.error(getApiError(error));
    } finally {
      setActionLoading(false);
    }
  };

  const canCheckIn = !todayRecord?.checkIn || todayRecord.checkIn === '-';
  const canCheckOut = Boolean(todayRecord?.checkIn && todayRecord.checkIn !== '-')
    && (!todayRecord?.checkOut || todayRecord.checkOut === '-');

  return (
    <div className="mx-auto max-w-[1280px] space-y-4">
      <AttendanceHeader
        title="My Attendance"
        breadcrumbLabel="My Attendance"
        dashboardTo="/employee/dashboard"
        onCheckIn={handleCheckIn}
        onCheckOut={handleCheckOut}
        canCheckIn={canCheckIn}
        canCheckOut={canCheckOut}
        actionLoading={actionLoading}
      />
      <AttendanceStats totals={totals} />
      <AttendanceFilters
        filters={draftFilters}
        variant="employee"
        onFilterChange={(name, value) => setDraftFilters((current) => ({ ...current, [name]: value }))}
        onApplyFilters={() => { setAppliedFilters(draftFilters); setCurrentPage(1); }}
      />
      {loading ? <LoadingState label="Loading attendance..." /> : (
        <AttendanceTable
          records={records}
          currentPage={currentPage}
          pageSize={pageSize}
          totalItems={totalItems}
          onPageChange={setCurrentPage}
          onPageSizeChange={(value) => { setPageSize(value); setCurrentPage(1); }}
          onView={(record) => { setSelectedRecord(record); setModalMode('view'); }}
          readOnly
        />
      )}
      <AttendanceRecordModal
        record={selectedRecord}
        mode={modalMode}
        isOpen={Boolean(modalMode)}
        onClose={() => { setSelectedRecord(null); setModalMode(null); }}
      />
      <ToastContainer position="top-right" theme="light" />
    </div>
  );
};

export default Attendance;

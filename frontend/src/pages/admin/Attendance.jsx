import { useCallback, useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import AttendanceFilters from '../../components/attendance/AttendanceFilters.jsx';
import AttendanceHeader from '../../components/attendance/AttendanceHeader.jsx';
import AttendanceRecordModal from '../../components/attendance/AttendanceRecordModal.jsx';
import AttendanceStats from '../../components/attendance/AttendanceStats.jsx';
import AttendanceTable from '../../components/attendance/AttendanceTable.jsx';
import LoadingState from '../../components/common/LoadingState.jsx';
import useDebouncedValue from '../../hooks/useDebouncedValue.js';
import { listAttendance, updateAttendance } from '../../services/attendanceService.js';
import { listDepartments } from '../../services/departmentService.js';
import { listEmployees } from '../../services/employeeService.js';
import { getApiError } from '../../utils/apiError.js';
import { mapAttendance, mapDepartment, toAttendancePayload } from '../../utils/mappers.js';

const today = new Date().toISOString().slice(0, 10);

const downloadFile = (contents, filename, type) => {
  const link = document.createElement('a');
  link.href = URL.createObjectURL(new Blob([contents], { type }));
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(link.href);
};

const Attendance = () => {
  const [draftFilters, setDraftFilters] = useState({ date: today, department: 'Department', designation: 'Designation', status: 'All Status' });
  const [appliedFilters, setAppliedFilters] = useState(draftFilters);
  const [records, setRecords] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [modalMode, setModalMode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [totals, setTotals] = useState({});
  const debouncedSearch = useDebouncedValue(searchQuery);

  const loadRecords = useCallback(async () => {
    setLoading(true);
    try {
      const departmentId = departments.find((department) => department.name === appliedFilters.department)?.id;
      const status = appliedFilters.status === 'All Status' ? undefined : appliedFilters.status.toUpperCase();
      const page = await listAttendance({
        page: currentPage - 1,
        size: pageSize,
        search: debouncedSearch || undefined,
        date: appliedFilters.date || undefined,
        status,
        departmentId,
      });
      const mapped = (page.content || []).map(mapAttendance);
      const visible = appliedFilters.designation === 'Designation'
        ? mapped
        : mapped.filter((record) => record.designation === appliedFilters.designation);
      setRecords(visible);
      setTotalItems(page.totalElements || 0);
    } catch (error) {
      toast.error(getApiError(error));
    } finally {
      setLoading(false);
    }
  }, [appliedFilters, currentPage, debouncedSearch, departments, pageSize]);

  const loadTotals = useCallback(async () => {
    try {
      const [present, absent, late, employees] = await Promise.all([
        listAttendance({ page: 0, size: 1, date: appliedFilters.date, status: 'PRESENT' }),
        listAttendance({ page: 0, size: 1, date: appliedFilters.date, status: 'ABSENT' }),
        listAttendance({ page: 0, size: 1, date: appliedFilters.date, status: 'LATE' }),
        listEmployees({ page: 0, size: 1 }),
      ]);
      const totalMarked = (present.totalElements || 0) + (absent.totalElements || 0) + (late.totalElements || 0);
      const rate = totalMarked ? `${Math.round(((present.totalElements || 0) / totalMarked) * 100)}%` : '0%';
      setTotals({
        present: present.totalElements || 0,
        absent: absent.totalElements || 0,
        late: late.totalElements || 0,
        employees: employees.totalElements || 0,
        rate,
      });
    } catch {
      setTotals({});
    }
  }, [appliedFilters.date]);

  useEffect(() => {
    listDepartments({ page: 0, size: 100 })
      .then((page) => setDepartments((page.content || []).map(mapDepartment)))
      .catch((error) => toast.error(getApiError(error)));
  }, []);

  useEffect(() => {
    loadRecords();
  }, [loadRecords]);

  useEffect(() => {
    loadTotals();
  }, [loadTotals]);

  const saveRecord = async (updatedRecord) => {
    try {
      await updateAttendance(updatedRecord.id, toAttendancePayload(updatedRecord));
      toast.success('Attendance updated successfully.');
      setSelectedRecord(null);
      setModalMode(null);
      await Promise.all([loadRecords(), loadTotals()]);
    } catch (error) {
      toast.error(getApiError(error));
    }
  };

  const updateSelectedStatuses = async (status) => {
    try {
      await Promise.all(selectedIds.map((id) => {
        const record = records.find((item) => item.id === id);
        return record ? updateAttendance(id, toAttendancePayload({ ...record, status })) : Promise.resolve();
      }));
      setSelectedIds([]);
      toast.success('Attendance statuses updated.');
      await Promise.all([loadRecords(), loadTotals()]);
    } catch (error) {
      toast.error(getApiError(error));
    }
  };

  const exportExcel = () => {
    const columns = ['Employee ID', 'Employee Name', 'Department', 'Designation', 'Date', 'Check In', 'Check Out', 'Status', 'Working Hours'];
    const rows = records.map((record) => [record.employeeId, record.name, record.department, record.designation, record.date, record.checkIn, record.checkOut, record.status, record.workingHours]);
    downloadFile([columns, ...rows].map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(',')).join('\n'), 'attendance-records.csv', 'text/csv;charset=utf-8');
  };

  return (
    <div className="mx-auto max-w-[1280px] space-y-4">
      <AttendanceHeader />
      <AttendanceStats totals={totals} />
      <AttendanceFilters
        filters={draftFilters}
        departments={departments}
        onFilterChange={(name, value) => setDraftFilters((current) => ({ ...current, [name]: value }))}
        onApplyFilters={() => { setAppliedFilters(draftFilters); setCurrentPage(1); }}
        onExportExcel={exportExcel}
        onExportPdf={() => toast.info('CSV export is available from Export Excel.')}
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
          onEdit={(record) => { setSelectedRecord(record); setModalMode('edit'); }}
          onTime={(record) => { setSelectedRecord(record); setModalMode('time'); }}
          searchQuery={searchQuery}
          onSearchChange={(value) => { setSearchQuery(value); setCurrentPage(1); }}
          selectedIds={selectedIds}
          onToggleRecord={(id) => setSelectedIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id])}
          onToggleAll={(ids) => setSelectedIds((current) => ids.every((id) => current.includes(id)) ? current.filter((id) => !ids.includes(id)) : [...new Set([...current, ...ids])])}
          onBulkStatusChange={updateSelectedStatuses}
        />
      )}
      <AttendanceRecordModal record={selectedRecord} mode={modalMode} isOpen={Boolean(modalMode)} onClose={() => { setSelectedRecord(null); setModalMode(null); }} onSave={saveRecord} />
      <ToastContainer position="top-right" theme="light" />
    </div>
  );
};

export default Attendance;

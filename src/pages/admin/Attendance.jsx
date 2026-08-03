import { useMemo, useState } from 'react';
import DeleteConfirmationModal from '../../components/common/DeleteConfirmationModal.jsx';
import AttendanceFilters from '../../components/attendance/AttendanceFilters.jsx';
import AttendanceHeader from '../../components/attendance/AttendanceHeader.jsx';
import AttendanceRecordModal from '../../components/attendance/AttendanceRecordModal.jsx';
import AttendanceStats from '../../components/attendance/AttendanceStats.jsx';
import AttendanceTable from '../../components/attendance/AttendanceTable.jsx';
import { attendanceRecords } from '../../data/attendanceData.js';

const formatDate = (date) => new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(`${date}T00:00:00`));
const downloadFile = (contents, filename, type) => { const link = document.createElement('a'); link.href = URL.createObjectURL(new Blob([contents], { type })); link.download = filename; document.body.appendChild(link); link.click(); link.remove(); URL.revokeObjectURL(link.href); };
const csvValue = (value) => `"${String(value).replaceAll('"', '""')}"`;
const createPdf = (records) => {
  const text = ['Attendance Records', ...records.map((record) => `${record.employeeId}  ${record.name}  ${record.status}  ${record.date}`)].join('\n').replaceAll('\\', '\\\\').replaceAll('(', '\\(').replaceAll(')', '\\)');
  const stream = `BT /F1 12 Tf 50 760 Td 15 TL (${text.replaceAll('\n', ') Tj T* (')}) Tj ET`;
  const objects = [`<< /Type /Catalog /Pages 2 0 R >>`, `<< /Type /Pages /Kids [3 0 R] /Count 1 >>`, `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>`, `<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>`, `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`];
  let pdf = '%PDF-1.4\n'; const offsets = [0]; objects.forEach((object, index) => { offsets.push(pdf.length); pdf += `${index + 1} 0 obj\n${object}\nendobj\n`; }); const xref = pdf.length; pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n${offsets.slice(1).map((offset) => `${String(offset).padStart(10, '0')} 00000 n `).join('\n')}\ntrailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return pdf;
};

const Attendance = () => {
  const [draftFilters, setDraftFilters] = useState({ date: '2026-05-24', department: 'Department', designation: 'Designation', status: 'All Status' });
  const [records, setRecords] = useState(attendanceRecords);
  const [appliedFilters, setAppliedFilters] = useState(draftFilters);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [modalMode, setModalMode] = useState(null);
  const filteredRecords = useMemo(() => records.filter((record) => record.date === formatDate(appliedFilters.date) && (appliedFilters.department === 'Department' || record.department === appliedFilters.department) && (appliedFilters.designation === 'Designation' || record.designation === appliedFilters.designation) && (appliedFilters.status === 'All Status' || record.status === appliedFilters.status)), [appliedFilters, records]);
  const searchedRecords = useMemo(() => { const query = searchQuery.trim().toLowerCase(); return filteredRecords.filter((record) => !query || [record.employeeId, record.name, record.department, record.designation].some((field) => field.toLowerCase().includes(query))); }, [filteredRecords, searchQuery]);
  const totalPages = Math.max(Math.ceil(searchedRecords.length / pageSize), 1);
  const activePage = Math.min(currentPage, totalPages);
  const paginatedRecords = useMemo(() => searchedRecords.slice((activePage - 1) * pageSize, activePage * pageSize), [activePage, searchedRecords, pageSize]);
  const updateFilter = (name, value) => setDraftFilters((currentFilters) => ({ ...currentFilters, [name]: value }));
  const applyFilters = () => { setAppliedFilters(draftFilters); setCurrentPage(1); };
  const exportExcel = () => { const columns = ['Employee ID', 'Employee Name', 'Department', 'Designation', 'Date', 'Check In', 'Check Out', 'Status', 'Working Hours']; const rows = filteredRecords.map((record) => [record.employeeId, record.name, record.department, record.designation, record.date, record.checkIn, record.checkOut, record.status, record.workingHours]); downloadFile([columns, ...rows].map((row) => row.map(csvValue).join(',')).join('\n'), 'attendance-records.csv', 'text/csv;charset=utf-8'); };
  const exportPdf = () => downloadFile(createPdf(filteredRecords), 'attendance-records.pdf', 'application/pdf');
  const openModal = (record, mode) => { setSelectedRecord(record); setModalMode(mode); };
  const closeModal = () => { setSelectedRecord(null); setModalMode(null); };
  const saveRecord = (updatedRecord) => { setRecords((currentRecords) => currentRecords.map((record) => record.id === updatedRecord.id ? updatedRecord : record)); closeModal(); };
  const updateSearchQuery = (value) => { setSearchQuery(value); setCurrentPage(1); };
  const toggleRecord = (id) => setSelectedIds((currentIds) => currentIds.includes(id) ? currentIds.filter((currentId) => currentId !== id) : [...currentIds, id]);
  const toggleAll = (ids) => setSelectedIds((currentIds) => {
    if (ids.every((id) => currentIds.includes(id))) return currentIds.filter((id) => !ids.includes(id));
    return [...new Set([...currentIds, ...ids])];
  });
  const updateSelectedStatuses = (status) => { setRecords((currentRecords) => currentRecords.map((record) => selectedIds.includes(record.id) ? { ...record, status } : record)); setSelectedIds([]); };

  return <div className="mx-auto max-w-[1280px] space-y-4"><AttendanceHeader /><AttendanceStats /><AttendanceFilters filters={draftFilters} onFilterChange={updateFilter} onApplyFilters={applyFilters} onExportExcel={exportExcel} onExportPdf={exportPdf} /><AttendanceTable records={paginatedRecords} currentPage={activePage} pageSize={pageSize} totalItems={searchedRecords.length} onPageChange={setCurrentPage} onPageSizeChange={(value) => { setPageSize(value); setCurrentPage(1); }} onView={(record) => openModal(record, 'view')} onEdit={(record) => openModal(record, 'edit')} onTime={(record) => openModal(record, 'time')} searchQuery={searchQuery} onSearchChange={updateSearchQuery} selectedIds={selectedIds} onToggleRecord={toggleRecord} onToggleAll={toggleAll} onBulkStatusChange={updateSelectedStatuses} /><AttendanceRecordModal record={selectedRecord} mode={modalMode} isOpen={Boolean(modalMode)} onClose={closeModal} onSave={saveRecord} /><DeleteConfirmationModal isOpen={false} itemName="" onClose={() => {}} onConfirm={() => {}} /></div>;
};

export default Attendance;

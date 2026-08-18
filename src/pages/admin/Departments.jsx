import { useCallback, useEffect, useMemo, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import DeleteConfirmationModal from '../../components/common/DeleteConfirmationModal';
import LoadingState from '../../components/common/LoadingState.jsx';
import DepartmentFilters from '../../components/departments/DepartmentFilters.jsx';
import DepartmentForm from '../../components/departments/DepartmentForm.jsx';
import DepartmentHeader from '../../components/departments/DepartmentHeader.jsx';
import DepartmentStats from '../../components/departments/DepartmentStats.jsx';
import DepartmentTable from '../../components/departments/DepartmentTable.jsx';
import ViewDepartmentModal from '../../components/departments/ViewDepartmentModal';
import useDebouncedValue from '../../hooks/useDebouncedValue.js';
import { createDepartment, deleteDepartment, listDepartments, updateDepartment, uploadDepartmentPhoto } from '../../services/departmentService.js';
import { getApiError } from '../../utils/apiError.js';
import { getSelectedFile, mapDepartment, toDepartmentPayload } from '../../utils/mappers.js';

const Departments = () => {
  const [departmentList, setDepartmentList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({ head: 'All Department Heads', status: 'All Statuses' });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [formMode, setFormMode] = useState('add');
  const [loading, setLoading] = useState(true);
  const [allDepartments, setAllDepartments] = useState([]);
  const debouncedSearch = useDebouncedValue(searchQuery);
  const departmentId = `DEP${String((totalItems || departmentList.length) + 1).padStart(3, '0')}`;

  const loadDepartments = useCallback(async () => {
    setLoading(true);
    try {
      const status = filters.status === 'All Statuses' ? undefined : filters.status.toUpperCase();
      const page = await listDepartments({
        page: currentPage - 1,
        size: pageSize,
        search: debouncedSearch || undefined,
        status,
      });
      const mapped = (page.content || []).map((department, index) => mapDepartment(department, index));
      const visible = filters.head === 'All Department Heads'
        ? mapped
        : mapped.filter((department) => department.head === filters.head);
      setDepartmentList(visible);
      setTotalItems(page.totalElements || 0);
    } catch (error) {
      toast.error(getApiError(error));
    } finally {
      setLoading(false);
    }
  }, [currentPage, debouncedSearch, filters.head, filters.status, pageSize]);

  const loadAllForStats = useCallback(async () => {
    try {
      const page = await listDepartments({ page: 0, size: 100 });
      setAllDepartments((page.content || []).map(mapDepartment));
    } catch {
      setAllDepartments([]);
    }
  }, []);

  useEffect(() => {
    loadDepartments();
  }, [loadDepartments]);

  useEffect(() => {
    loadAllForStats();
  }, [loadAllForStats]);

  const departmentHeadOptions = useMemo(
    () => ['All Department Heads', ...new Set(allDepartments.map((department) => department.head).filter(Boolean))],
    [allDepartments],
  );

  const saveDepartment = async (values) => {
    try {
      const payload = toDepartmentPayload(values);
      const photoFile = getSelectedFile(values.headPhoto);
      let saved;
      if (formMode === 'edit') {
        saved = await updateDepartment(editingDepartment.id, payload);
        toast.success('Department updated successfully.');
      } else {
        saved = await createDepartment(payload);
        toast.success('Department added successfully.');
      }
      if (photoFile && saved?.id) {
        await uploadDepartmentPhoto(saved.id, photoFile);
        toast.success('Department head photo uploaded successfully.');
      }
      setIsFormOpen(false);
      setEditingDepartment(null);
      setFormMode('add');
      await Promise.all([loadDepartments(), loadAllForStats()]);
    } catch (error) {
      toast.error(getApiError(error));
    }
  };

  return (
    <div className="mx-auto max-w-[1280px] space-y-5">
      <DepartmentHeader onAddDepartment={() => { setFormMode('add'); setEditingDepartment(null); setIsFormOpen(true); }} />
      <DepartmentStats departments={allDepartments} />
      <div>
        <DepartmentFilters
          filters={filters}
          headOptions={departmentHeadOptions}
          onFilterChange={(name, value) => { setFilters((current) => ({ ...current, [name]: value })); setCurrentPage(1); }}
          searchQuery={searchQuery}
          onSearchChange={(value) => { setSearchQuery(value); setCurrentPage(1); }}
          onRefresh={loadDepartments}
        />
        {loading ? <LoadingState label="Loading departments..." /> : (
          <DepartmentTable
            departments={departmentList}
            currentPage={currentPage}
            pageSize={pageSize}
            totalItems={totalItems}
            onPageChange={setCurrentPage}
            onPageSizeChange={(value) => { setPageSize(value); setCurrentPage(1); }}
            onView={(department) => { setSelectedDepartment(department); setIsViewOpen(true); }}
            onEdit={(department) => { setEditingDepartment(department); setFormMode('edit'); setIsFormOpen(true); }}
            onDelete={(department) => { setDeleteTarget(department); setIsDeleteOpen(true); }}
          />
        )}
      </div>
      <DepartmentForm
        department={editingDepartment}
        departmentId={departmentId}
        departments={allDepartments}
        isOpen={isFormOpen}
        mode={formMode}
        onClose={() => { setIsFormOpen(false); setEditingDepartment(null); setFormMode('add'); }}
        onSubmit={saveDepartment}
      />
      <ViewDepartmentModal isOpen={isViewOpen} department={selectedDepartment} onClose={() => setIsViewOpen(false)} />
      <DeleteConfirmationModal
        isOpen={isDeleteOpen}
        title="Delete Department"
        itemName={deleteTarget?.name}
        itemId={deleteTarget?.departmentId}
        onClose={() => { setDeleteTarget(null); setIsDeleteOpen(false); }}
        onConfirm={async () => {
          try {
            await deleteDepartment(deleteTarget.id);
            toast.success('Department deleted successfully.');
            setDeleteTarget(null);
            setIsDeleteOpen(false);
            await Promise.all([loadDepartments(), loadAllForStats()]);
          } catch (error) {
            toast.error(getApiError(error));
          }
        }}
      />
      <ToastContainer position="top-right" theme="light" />
    </div>
  );
};

export default Departments;

import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import AnnouncementFilters from '../../components/announcements/AnnouncementFilters';
import AnnouncementForm from '../../components/announcements/AnnouncementForm';
import AnnouncementHeader from '../../components/announcements/AnnouncementHeader';
import AnnouncementStats from '../../components/announcements/AnnouncementStats';
import AnnouncementTable from '../../components/announcements/AnnouncementTable';
import ViewAnnouncementModal from '../../components/announcements/ViewAnnouncementModal';
import DeleteConfirmationModal from '../../components/common/DeleteConfirmationModal';
import LoadingState from '../../components/common/LoadingState.jsx';
import useDebouncedValue from '../../hooks/useDebouncedValue.js';
import { createAnnouncement, deleteAnnouncement, listAnnouncements, updateAnnouncement } from '../../services/announcementService.js';
import { listDepartments } from '../../services/departmentService.js';
import { getApiError } from '../../utils/apiError.js';
import { ANNOUNCEMENT_STATUSES, mapAnnouncement, mapDepartment, toAnnouncementPayload } from '../../utils/mappers.js';

const initialFilters = { department: 'All Departments', status: 'All Statuses', date: '' };

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState('add');
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [announcementToDelete, setAnnouncementToDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState(initialFilters);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [totals, setTotals] = useState({});
  const debouncedSearch = useDebouncedValue(searchQuery);

  const loadAnnouncements = useCallback(async () => {
    setLoading(true);
    try {
      const departmentId = departments.find((department) => department.name === filters.department)?.id;
      const page = await listAnnouncements({
        page: currentPage - 1,
        size: pageSize,
        search: debouncedSearch || undefined,
        status: filters.status === 'All Statuses' ? undefined : filters.status.toUpperCase(),
        departmentId,
      });
      setAnnouncements((page.content || []).map(mapAnnouncement));
      setTotalItems(page.totalElements || 0);
    } catch (error) {
      toast.error(getApiError(error));
    } finally {
      setLoading(false);
    }
  }, [currentPage, debouncedSearch, departments, filters.department, filters.status, pageSize]);

  const loadTotals = useCallback(async () => {
    try {
      const [total, published, scheduled, drafts] = await Promise.all([
        listAnnouncements({ page: 0, size: 1 }),
        listAnnouncements({ page: 0, size: 1, status: 'PUBLISHED' }),
        listAnnouncements({ page: 0, size: 1, status: 'SCHEDULED' }),
        listAnnouncements({ page: 0, size: 1, status: 'DRAFT' }),
      ]);
      setTotals({
        total: total.totalElements || 0,
        published: published.totalElements || 0,
        scheduled: scheduled.totalElements || 0,
        drafts: drafts.totalElements || 0,
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
    loadAnnouncements();
  }, [loadAnnouncements]);

  const filterOptions = useMemo(() => ({
    departments: ['All Departments', ...departments.map((department) => department.name)],
    statuses: ['All Statuses', ...ANNOUNCEMENT_STATUSES],
  }), [departments]);

  const closeAnnouncementForm = () => {
    setIsFormOpen(false);
    setFormMode('add');
    setEditingAnnouncement(null);
  };

  const openCreateForm = () => {
    setFormMode('add');
    setEditingAnnouncement(null);
    setIsFormOpen(true);
  };

  const openEditForm = (announcement) => {
    setFormMode('edit');
    setEditingAnnouncement(announcement);
    setIsFormOpen(true);
  };

  const submitAnnouncement = async (values) => {
    try {
      if (!values.department) {
        toast.error('Please select a department.');
        return;
      }
      const payload = toAnnouncementPayload(values, departments);
      if (values.department !== 'All Departments' && !payload.departmentId) {
        toast.error('Please select a valid department.');
        return;
      }
      if (formMode === 'edit' && editingAnnouncement?.id) {
        if (payload.status === 'SCHEDULED' && !payload.scheduledAt) {
          payload.scheduledAt = editingAnnouncement.scheduledAt || new Date(Date.now() + 60 * 60 * 1000).toISOString();
        }
        await updateAnnouncement(editingAnnouncement.id, payload);
        toast.success('Announcement updated successfully.');
      } else {
        if (payload.status === 'SCHEDULED' && !payload.scheduledAt) {
          payload.scheduledAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();
        }
        await createAnnouncement(payload);
        toast.success('Announcement created successfully.');
      }
      closeAnnouncementForm();
      await Promise.all([loadAnnouncements(), loadTotals()]);
    } catch (error) {
      toast.error(getApiError(error));
    }
  };

  return (
    <div className="mx-auto max-w-[1280px] space-y-5">
      <AnnouncementHeader onAddAnnouncement={openCreateForm} />
      <AnnouncementStats totals={totals} />
      <div>
        <AnnouncementFilters
          filters={filters}
          filterOptions={filterOptions}
          onFilterChange={(name, value) => { setFilters((current) => ({ ...current, [name]: value })); setCurrentPage(1); }}
          onReset={() => { setSearchQuery(''); setFilters(initialFilters); setCurrentPage(1); }}
          searchQuery={searchQuery}
          onSearchChange={(value) => { setSearchQuery(value); setCurrentPage(1); }}
        />
        {loading ? <LoadingState label="Loading announcements..." /> : (
          <AnnouncementTable
            announcements={announcements}
            currentPage={currentPage}
            pageSize={pageSize}
            totalItems={totalItems}
            onPageChange={setCurrentPage}
            onPageSizeChange={(value) => { setPageSize(value); setCurrentPage(1); }}
            onView={(announcement) => { setSelectedAnnouncement(announcement); setIsViewOpen(true); }}
            onEdit={openEditForm}
            onDelete={(announcement) => { setAnnouncementToDelete(announcement); setIsDeleteModalOpen(true); }}
          />
        )}
      </div>
      <ViewAnnouncementModal announcement={selectedAnnouncement} isOpen={isViewOpen} onClose={() => { setSelectedAnnouncement(null); setIsViewOpen(false); }} />
      <AnnouncementForm
        isOpen={isFormOpen}
        mode={formMode}
        announcement={editingAnnouncement}
        onClose={closeAnnouncementForm}
        onSave={submitAnnouncement}
        departments={departments}
      />
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        title="Delete Announcement"
        itemName={announcementToDelete?.title}
        itemId={announcementToDelete?.announcementId}
        onClose={() => { setIsDeleteModalOpen(false); setAnnouncementToDelete(null); }}
        onConfirm={async () => {
          try {
            await deleteAnnouncement(announcementToDelete.id);
            toast.success('Announcement deleted successfully.');
            setIsDeleteModalOpen(false);
            setAnnouncementToDelete(null);
            await Promise.all([loadAnnouncements(), loadTotals()]);
          } catch (error) {
            toast.error(getApiError(error));
          }
        }}
      />
      <ToastContainer position="top-right" theme="light" />
    </div>
  );
};

export default Announcements;

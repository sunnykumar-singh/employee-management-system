import { useMemo, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import DeleteConfirmationModal from "../../components/common/DeleteConfirmationModal";
import AnnouncementHeader from "../../components/announcements/AnnouncementHeader";
import AnnouncementStats from "../../components/announcements/AnnouncementStats";
import AnnouncementFilters from "../../components/announcements/AnnouncementFilters";
import AnnouncementTable from "../../components/announcements/AnnouncementTable";
import ViewAnnouncementModal from "../../components/announcements/ViewAnnouncementModal";
import AnnouncementForm from "../../components/announcements/AnnouncementForm";
import { announcements as announcementsData } from "../../data/announcementsData";

const toInputDate = (date) => {
  if (!date) return '';
  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) return date;
  const parsedDate = new Date(`${date} 12:00:00`);
  return Number.isNaN(parsedDate.getTime()) ? '' : parsedDate.toISOString().slice(0, 10);
};

const Announcements = () => {
  const initialFilters = { department: 'All Departments', status: 'All Statuses', date: '' };
  const [announcements, setAnnouncements] = useState(announcementsData);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [announcementToDelete, setAnnouncementToDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState(initialFilters);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const filterOptions = useMemo(() => ({
    departments: ['All Departments', ...new Set(announcements.map((announcement) => announcement.department))],
    statuses: ['All Statuses', ...new Set(announcements.map((announcement) => announcement.status))],
  }), [announcements]);
  const filteredAnnouncements = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    const searchableFields = ['title', 'category', 'department', 'status'];

    return announcements.filter((announcement) => {
      const matchesSearch = !normalizedQuery || searchableFields.some((field) => String(announcement[field] ?? '').toLowerCase().includes(normalizedQuery));
      const matchesDepartment = filters.department === 'All Departments' || announcement.department.toLowerCase() === filters.department.toLowerCase();
      const matchesStatus = filters.status === 'All Statuses' || announcement.status.toLowerCase() === filters.status.toLowerCase();
      const matchesDate = !filters.date || toInputDate(announcement.date) === filters.date;
      return matchesSearch && matchesDepartment && matchesStatus && matchesDate;
    });
  }, [announcements, filters, searchQuery]);
  const totalPages = Math.max(Math.ceil(filteredAnnouncements.length / pageSize), 1);
  const activePage = Math.min(currentPage, totalPages);
  const paginatedAnnouncements = useMemo(() => {
    const startIndex = (activePage - 1) * pageSize;
    return filteredAnnouncements.slice(startIndex, startIndex + pageSize);
  }, [activePage, filteredAnnouncements, pageSize]);

  const handleViewAnnouncement = (announcement) => {
    setSelectedAnnouncement(announcement);
    setIsViewOpen(true);
  };

  const updateFilter = (filterName, value) => {
    setFilters((currentFilters) => ({ ...currentFilters, [filterName]: value }));
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setSearchQuery('');
    setFilters(initialFilters);
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

  const closeViewModal = () => {
    setSelectedAnnouncement(null);
    setIsViewOpen(false);
  };

  const openAddAnnouncementForm = () => {
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
  };

  const submitAnnouncement = (values) => {
    const nextId = announcements.reduce((largestId, announcement) => Math.max(largestId, announcement.id), 0) + 1;
    const formattedDate = new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date());

    setAnnouncements((currentAnnouncements) => [...currentAnnouncements, {
      id: nextId,
      announcementId: `ANN${String(nextId).padStart(3, '0')}`,
      title: values.title.trim(),
      category: values.category,
      department: values.department,
      status: values.status,
      date: formattedDate,
      message: values.message.trim(),
    }]);

    toast.success('Announcement created successfully.');
    closeForm();
  };

  const openDeleteConfirmation = (announcement) => {
    setAnnouncementToDelete(announcement);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteConfirmation = () => {
    setIsDeleteModalOpen(false);
    setAnnouncementToDelete(null);
  };

  const deleteAnnouncement = () => {
    setAnnouncements((currentAnnouncements) => currentAnnouncements.filter((announcement) => announcement.id !== announcementToDelete.id));
    toast.success('Announcement deleted successfully.');
    closeDeleteConfirmation();
  };

  return (
    <div className="mx-auto max-w-[1280px] space-y-5">
      <AnnouncementHeader onAddAnnouncement={openAddAnnouncementForm} />

      <AnnouncementStats />

      <div>
        <AnnouncementFilters filters={filters} filterOptions={filterOptions} onFilterChange={updateFilter} onReset={resetFilters} searchQuery={searchQuery} onSearchChange={updateSearchQuery} />

        <AnnouncementTable announcements={paginatedAnnouncements} currentPage={activePage} pageSize={pageSize} totalItems={filteredAnnouncements.length} onPageChange={setCurrentPage} onPageSizeChange={updatePageSize} onView={handleViewAnnouncement} onDelete={openDeleteConfirmation} />
      </div>

      <ViewAnnouncementModal
        announcement={selectedAnnouncement}
        isOpen={isViewOpen}
        onClose={closeViewModal}
      />

      <AnnouncementForm
        isOpen={isFormOpen}
        onClose={closeForm}
        onSave={submitAnnouncement}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        title="Delete Announcement"
        itemName={announcementToDelete?.title}
        itemId={announcementToDelete?.announcementId}
        onClose={closeDeleteConfirmation}
        onConfirm={deleteAnnouncement}
      />

      <ToastContainer position="top-right" theme="light" />
    </div>
  );
};

export default Announcements;

import { useCallback, useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import AnnouncementFilters from '../../components/announcements/AnnouncementFilters';
import AnnouncementHeader from '../../components/announcements/AnnouncementHeader';
import AnnouncementStats from '../../components/announcements/AnnouncementStats';
import AnnouncementTable from '../../components/announcements/AnnouncementTable';
import ViewAnnouncementModal from '../../components/announcements/ViewAnnouncementModal';
import LoadingState from '../../components/common/LoadingState.jsx';
import useDebouncedValue from '../../hooks/useDebouncedValue.js';
import { listMyAnnouncements } from '../../services/employeePortalService.js';
import { getApiError } from '../../utils/apiError.js';
import { mapAnnouncement } from '../../utils/mappers.js';

const initialFilters = { department: 'All Departments', status: 'All Statuses', date: '' };

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
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
      const page = await listMyAnnouncements({
        page: currentPage - 1,
        size: pageSize,
        search: debouncedSearch || undefined,
      });
      setAnnouncements((page.content || []).map(mapAnnouncement));
      setTotalItems(page.totalElements || 0);
      setTotals({
        total: page.totalElements || 0,
        published: page.totalElements || 0,
        scheduled: 0,
        drafts: 0,
      });
    } catch (error) {
      toast.error(getApiError(error));
    } finally {
      setLoading(false);
    }
  }, [currentPage, debouncedSearch, pageSize]);

  useEffect(() => {
    loadAnnouncements();
  }, [loadAnnouncements]);

  return (
    <div className="mx-auto max-w-[1280px] space-y-5">
      <AnnouncementHeader title="Announcements" breadcrumbLabel="Announcements" dashboardTo="/employee/dashboard" />
      <AnnouncementStats totals={totals} />
      <div>
        <AnnouncementFilters
          filters={filters}
          filterOptions={{ departments: ['All Departments'], statuses: ['All Statuses'] }}
          variant="employee"
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
            readOnly
          />
        )}
      </div>
      <ViewAnnouncementModal
        announcement={selectedAnnouncement}
        isOpen={isViewOpen}
        onClose={() => { setSelectedAnnouncement(null); setIsViewOpen(false); }}
      />
      <ToastContainer position="top-right" theme="light" />
    </div>
  );
};

export default Announcements;

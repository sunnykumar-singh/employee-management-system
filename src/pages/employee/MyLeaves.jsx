import { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import LoadingState from '../../components/common/LoadingState.jsx';
import LeaveTable from '../../components/Leave/LeaveTable';
import { useAuth } from '../../context/AuthContext.jsx';
import { listLeaves } from '../../services/leaveService.js';
import { getApiError } from '../../utils/apiError.js';
import { mapLeave } from '../../utils/mappers.js';

const MyLeaves = () => {
  const { user } = useAuth();
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const page = await listLeaves({
          page: currentPage - 1,
          size: pageSize,
          search: user?.fullName || user?.email,
        });
        setLeaves((page.content || []).map(mapLeave));
        setTotalItems(page.totalElements || 0);
      } catch (error) {
        toast.error(getApiError(error));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [currentPage, pageSize, user]);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-[26px] font-bold tracking-tight text-[#101828]">My Leaves</h1>
        <p className="mt-1 text-sm text-[#667085]">Your leave requests from the HR system.</p>
      </div>
      {loading ? <LoadingState label="Loading your leaves..." /> : (
        <LeaveTable
          leaves={leaves}
          currentPage={currentPage}
          pageSize={pageSize}
          totalItems={totalItems}
          onPageChange={setCurrentPage}
          onPageSizeChange={(value) => { setPageSize(value); setCurrentPage(1); }}
          onView={() => {}}
          onEdit={() => {}}
          onDelete={() => {}}
          onApprove={() => {}}
          onReject={() => {}}
        />
      )}
      <ToastContainer position="top-right" theme="light" />
    </div>
  );
};

export default MyLeaves;

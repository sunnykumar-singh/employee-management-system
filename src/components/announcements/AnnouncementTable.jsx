import AnnouncementRow from "./AnnouncementRow";
import Pagination from "../common/Pagination";
import EmptyState from "../employees/EmptyState";

const AnnouncementTable = ({ announcements, currentPage, pageSize, totalItems, onPageChange, onPageSizeChange, onView, onEdit, onDelete }) => {
  return (
    <div className="mt-6 overflow-hidden rounded-xl border border-[#e7edf5] bg-white shadow-sm">
      <div className="overflow-x-auto">
        {announcements.length ? (
          <table className="min-w-full">
            <thead className="bg-[#f8fafc]">
              <tr className="text-left text-[10px] font-semibold text-[#526078]">
                <th className="px-5 py-4">#</th>
                <th className="px-5 py-4">Announcement ID</th>
                <th className="px-5 py-4">Title</th>
                <th className="px-5 py-4">Department</th>
                <th className="px-5 py-4">Date</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {announcements.map((announcement, index) => (
                <AnnouncementRow
                  key={announcement.id}
                  serialNumber={(currentPage - 1) * pageSize + index + 1}
                  announcement={announcement}
                  onView={onView}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </tbody>
          </table>
        ) : (
          <EmptyState />
        )}
      </div>

      <Pagination currentPage={currentPage} totalItems={totalItems} pageSize={pageSize} onPageChange={onPageChange} onPageSizeChange={onPageSizeChange} />
    </div>
  );
};

export default AnnouncementTable;

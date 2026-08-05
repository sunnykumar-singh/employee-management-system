import AnnouncementRow from "./AnnouncementRow";
import Pagination from "../common/Pagination";

const announcementData = [
  {
    id: 1,
    announcementId: "ANN001",
    title: "Company Annual Day Celebration",
    department: "HR",
    date: "05 Aug 2026",
    status: "Published",
  },
  {
    id: 2,
    announcementId: "ANN002",
    title: "New Office Timing Policy",
    department: "HR",
    date: "03 Aug 2026",
    status: "Published",
  },
  {
    id: 3,
    announcementId: "ANN003",
    title: "Diwali Bonus Announcement",
    department: "Finance",
    date: "01 Aug 2026",
    status: "Scheduled",
  },
  {
    id: 4,
    announcementId: "ANN004",
    title: "System Maintenance on Sunday",
    department: "IT",
    date: "30 Jul 2026",
    status: "Draft",
  },
  {
    id: 5,
    announcementId: "ANN005",
    title: "Inter-Department Cricket Tournament",
    department: "HR",
    date: "28 Jul 2026",
    status: "Published",
  },
  {
    id: 6,
    announcementId: "ANN006",
    title: "Updated Travel Reimbursement Guidelines",
    department: "Finance",
    date: "25 Jul 2026",
    status: "Archived",
  },
];

const AnnouncementTable = () => {
  return (
    <div className="mt-6 overflow-hidden rounded-xl border border-[#e7edf5] bg-white shadow-sm">
      <div className="overflow-x-auto">
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
            {announcementData.map((announcement, index) => (
              <AnnouncementRow
                key={announcement.id}
                index={index}
                announcement={announcement}
              />
            ))}
          </tbody>
        </table>
      </div>

      <Pagination />
    </div>
  );
};

export default AnnouncementTable;

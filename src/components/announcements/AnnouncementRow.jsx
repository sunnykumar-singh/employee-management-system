import AnnouncementActions from "./AnnouncementActions";
import StatusBadge from "./StatusBadge";

const AnnouncementRow = ({ announcement, index }) => {
  return (
    <tr className="border-t border-[#edf2f7] text-[11px] hover:bg-[#f8fafc] transition">
      <td className="px-5 py-4 font-medium text-[#344767]">
        {index + 1}
      </td>

      <td className="px-5 py-4 font-medium text-[#344767]">
        {announcement.announcementId}
      </td>

      <td className="whitespace-nowrap px-5 py-4 font-medium text-[#101828]">
        {announcement.title}
      </td>

      <td className="whitespace-nowrap px-5 py-4 text-[#667085]">
        {announcement.department}
      </td>

      <td className="whitespace-nowrap px-5 py-4 text-[#667085]">
        {announcement.date}
      </td>

      <td className="whitespace-nowrap px-5 py-4">
        <StatusBadge status={announcement.status} />
      </td>

      <td className="px-5 py-4">
        <AnnouncementActions />
      </td>
    </tr>
  );
};

export default AnnouncementRow;

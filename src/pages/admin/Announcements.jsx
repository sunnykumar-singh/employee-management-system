import AnnouncementHeader from "../../components/announcements/AnnouncementHeader";
import AnnouncementStats from "../../components/announcements/AnnouncementStats";
import AnnouncementFilters from "../../components/announcements/AnnouncementFilters";
import AnnouncementTable from "../../components/announcements/AnnouncementTable";

const Announcements = () => {
  return (
    <div className="mx-auto max-w-[1280px] space-y-5">
      <AnnouncementHeader />

      <AnnouncementStats />

      <div>
        <AnnouncementFilters />

        <AnnouncementTable />
      </div>
    </div>
  );
};

export default Announcements;

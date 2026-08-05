import { ChevronRight, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const AnnouncementHeader = ({ onAddAnnouncement }) => (
  <header className="flex flex-wrap items-start justify-between gap-4">
    <div>
      <h1 className="text-[26px] font-bold leading-none tracking-tight text-[#101828]">Announcements</h1>
      <nav className="mt-2 flex items-center gap-1 text-[12px]" aria-label="Breadcrumb"><Link className="font-medium text-[#4a45e9] hover:underline" to="/admin/dashboard">Dashboard</Link><ChevronRight size={14} className="text-[#98a2b3]" /><span className="text-[#344767]">Announcements</span></nav>
    </div>
    <button className="flex items-center gap-2 rounded-md bg-[#4b3df2] px-4 py-2.5 text-xs font-medium text-white shadow-[0_4px_9px_rgba(75,61,242,0.25)] transition hover:bg-[#4032e8]" type="button" onClick={onAddAnnouncement}><Plus size={15} /> Add Announcement</button>
  </header>
);

export default AnnouncementHeader;

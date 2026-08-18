import { Bell, Megaphone } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { listAnnouncements } from '../../services/announcementService.js';
import { mapAnnouncement } from '../../utils/mappers.js';

const Dashboard = () => {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    listAnnouncements({ page: 0, size: 6, status: 'PUBLISHED' })
      .then((page) => setAnnouncements((page.content || []).map(mapAnnouncement)))
      .catch(() => setAnnouncements([]));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[27px] font-bold tracking-tight text-[#101828]">Dashboard</h1>
        <p className="mt-1 text-[15px] text-[#344767]">Welcome back, {user?.fullName || 'Employee'}! 👋</p>
      </div>
      <section className="rounded-xl border border-[#e5eaf2] bg-white p-5 shadow-[0_3px_12px_rgba(16,24,40,0.02)]">
        <h2 className="mb-4 text-[16px] font-bold text-[#101828]">Announcements</h2>
        <div className="space-y-3">
          {announcements.length ? announcements.map((announcement, index) => (
            <article className="flex gap-4 rounded-xl border border-[#e7edf5] p-4" key={announcement.id}>
              <span className={`flex size-[60px] shrink-0 items-center justify-center rounded-xl ${index % 2 === 0 ? 'bg-[#ece9ff] text-[#5b3df1]' : 'bg-[#e3f8ed] text-[#22aa62]'}`}>
                {index % 2 === 0 ? <Megaphone size={28} /> : <Bell size={27} />}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex justify-between gap-3">
                  <h3 className="text-[13px] font-bold">{announcement.title}</h3>
                  <time className="whitespace-nowrap text-xs font-medium text-[#3639ed]">{announcement.date}</time>
                </div>
                <p className="mt-2 text-xs leading-5 text-[#344767]">{announcement.message}</p>
              </div>
            </article>
          )) : <p className="text-sm text-[#667085]">No announcements yet.</p>}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;

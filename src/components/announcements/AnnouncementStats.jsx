import { Megaphone, CheckCircle2, Clock3, FileText } from 'lucide-react';
import StatCard from './StatCard';

const AnnouncementStats = ({ totals = {} }) => {
  const stats = [
    { title: 'Total Announcements', value: totals.total ?? 0, icon: Megaphone, color: 'bg-blue-100 text-blue-600' },
    { title: 'Published', value: totals.published ?? 0, icon: CheckCircle2, color: 'bg-green-100 text-green-600' },
    { title: 'Scheduled', value: totals.scheduled ?? 0, icon: Clock3, color: 'bg-yellow-100 text-yellow-600' },
    { title: 'Drafts', value: totals.drafts ?? 0, icon: FileText, color: 'bg-purple-100 text-purple-600' },
  ];

  return (
    <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </section>
  );
};

export default AnnouncementStats;

import {
  ClipboardList,
  CheckCircle2,
  Clock3,
  XCircle,
} from "lucide-react";
import StatCard from "./StatCard";

const LeaveStats = ({ totals = {} }) => {
  const stats = [
    {
      title: "Total Requests",
      value: totals.total ?? 0,
      icon: ClipboardList,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Approved",
      value: totals.approved ?? 0,
      icon: CheckCircle2,
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Pending",
      value: totals.pending ?? 0,
      icon: Clock3,
      color: "bg-yellow-100 text-yellow-600",
    },
    {
      title: "Rejected",
      value: totals.rejected ?? 0,
      icon: XCircle,
      color: "bg-red-100 text-red-600",
    },
  ];

  return (
    <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </section>
  );
};

export default LeaveStats;
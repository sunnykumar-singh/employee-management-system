const StatusBadge = ({ status }) => {
  const styles = {
    Published: "bg-green-100 text-green-700",
    Scheduled: "bg-yellow-100 text-yellow-700",
    Draft: "bg-gray-100 text-gray-700",
    Archived: "bg-blue-100 text-blue-700",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-[10px] font-semibold ${
        styles[status] || "bg-gray-100 text-gray-700"
      }`}
    >
      {status}
    </span>
  );
};

export default StatusBadge;

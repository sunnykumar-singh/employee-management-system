const StatCard = ({ title, value, icon: Icon, color }) => {
  return (
    <div className="rounded-xl border border-[#e7edf5] bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-[#667085]">
            {title}
          </p>

          <h2 className="mt-2 text-3xl font-bold text-[#101828]">
            {value}
          </h2>
        </div>

        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl ${color}`}
        >
          <Icon size={22} />
        </div>
      </div>
    </div>
  );
};

export default StatCard;

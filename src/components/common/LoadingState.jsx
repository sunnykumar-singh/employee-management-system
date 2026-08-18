const LoadingState = ({ label = 'Loading...' }) => (
  <div className="rounded-lg border border-[#e4eaf2] bg-white px-4 py-6 text-center text-sm text-[#667085] shadow-[0_2px_8px_rgba(16,24,40,0.02)]">
    {label}
  </div>
);

export default LoadingState;

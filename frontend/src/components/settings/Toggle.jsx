const Toggle = ({ checked, onChange, label }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    aria-label={`${label} notifications ${checked ? 'enabled' : 'disabled'}`}
    className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full p-0.5 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-[#dedcff] ${
      checked
        ? 'bg-[linear-gradient(135deg,#635bff,#4338ca)] shadow-[0_4px_10px_rgba(79,70,229,0.28)]'
        : 'bg-[#d6dce6] shadow-inner hover:bg-[#c7d0dc]'
    }`}
    onClick={() => onChange(!checked)}
  >
    <span
      className={`size-6 rounded-full bg-white shadow-[0_2px_5px_rgba(15,23,42,0.2)] transition-transform duration-200 ${
        checked ? 'translate-x-5' : 'translate-x-0'
      }`}
    />
  </button>
);

export default Toggle;

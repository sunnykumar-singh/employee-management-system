import { Bell, ChevronDown, Expand, Menu, Search, UserRound } from 'lucide-react';

const Navbar = ({ onMenuToggle }) => (
  <header className="sticky top-0 z-30 h-[78px] border-b border-[#e8edf5] bg-white px-4 sm:px-7 lg:px-8">
    <div className="flex h-full items-center gap-3">
        <button
          className="rounded-lg p-2 text-[#092041] transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          type="button"
          onClick={onMenuToggle}
          aria-label="Open navigation menu"
        >
          <Menu size={21} />
        </button>
        <label className="relative mx-auto hidden w-full max-w-[478px] md:block">
          <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#102751]" size={20} />
          <input
            className="w-full rounded-lg border border-[#dce3ee] bg-white py-3 pl-12 pr-4 text-sm text-[#102751] outline-none placeholder:text-[#344767] transition focus:border-[#6254f5]"
            type="search"
            placeholder="Search"
            aria-label="Search"
          />
        </label>

        <div className="ml-auto flex items-center gap-2 sm:gap-4">
          <button className="relative rounded-lg p-2 text-[#092041] transition hover:bg-slate-100" type="button" aria-label="Notifications">
            <Bell size={20} />
            <span className="absolute right-1 top-0 flex size-4 items-center justify-center rounded-full bg-[#ff4d4f] text-[9px] font-bold text-white">5</span>
          </button>
          <button className="hidden rounded-lg p-2 text-[#092041] transition hover:bg-slate-100 sm:block" type="button" aria-label="Fullscreen">
            <Expand size={20} />
          </button>
          <button className="ml-1 flex items-center gap-2 rounded-xl p-1 text-left transition hover:bg-slate-100 sm:ml-2" type="button" aria-label="Admin menu">
            <span className="flex size-11 items-center justify-center rounded-full bg-[#e7d5bc] text-[#102751]"><UserRound size={25} /></span>
            <span className="hidden sm:block"><span className="block text-sm font-semibold text-[#101828]">Admin User</span><span className="block text-xs text-[#344767]">Super Admin</span></span>
            <ChevronDown className="hidden text-[#092041] sm:block" size={17} />
          </button>
        </div>
    </div>
  </header>
);

export default Navbar;

import { FiBell, FiChevronDown, FiMenu } from "react-icons/fi";

function Header() {
  return (
    <header className="fixed left-0 right-0 top-0 z-20 h-20 border-b border-[#e3edf6] bg-white/95 backdrop-blur lg:left-64">
      <div className="flex h-full items-center justify-between px-4 sm:px-6 lg:px-7">
        <div className="flex items-center gap-3">
          <button className="rounded-lg p-2 text-[#51708e] hover:bg-[#f2f8fd] lg:hidden" aria-label="Open navigation">
            <FiMenu size={20} />
          </button>
          <div>
            <p className="text-[11px] font-semibold text-[#41688f] sm:text-xs">Welcome back, Explorer 🌊</p>
            <h2 className="mt-0.5 text-sm font-semibold text-[#6b87a3] sm:text-[13px]">Smarter shipping decisions. Greater possibilities.</h2>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-5">
          <button className="relative rounded-lg p-2 text-[#52708d] transition hover:bg-[#f2f8fd]" aria-label="Notifications">
            <FiBell size={20} />
            <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-rose-400 ring-2 ring-white" />
          </button>
          <div className="flex items-center gap-2.5 border-l border-[#e7eef5] pl-3 sm:pl-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#174e82] text-xs font-bold text-white">PU</div>
            <div className="hidden sm:block">
              <p className="text-xs font-bold text-[#284e74]">Procurement User</p>
              <p className="text-[10px] text-[#7892aa]">SAIL Operations</p>
            </div>
            <FiChevronDown className="hidden text-[#7892aa] sm:block" size={15} />
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;

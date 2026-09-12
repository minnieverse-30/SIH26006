import { FiBell, FiUser } from "react-icons/fi";

function Header() {
  return (
    <header className="fixed left-64 right-0 top-0 z-10 h-20 border-b border-slate-200 bg-white">

      <div className="flex h-full items-center justify-between px-8">

        {/* Left */}
        <div>
          <p className="text-sm text-slate-500">
            Decision Support System
          </p>

          <h2 className="text-lg font-semibold text-slate-800">
            Freight & Vessel Intelligence
          </h2>
        </div>


        {/* Right */}
        <div className="flex items-center gap-5">

          <button className="relative text-slate-500 hover:text-slate-800">
            <FiBell size={20} />

            <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-red-500" />
          </button>


          <div className="flex items-center gap-3 border-l border-slate-200 pl-5">

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-blue-700">
              <FiUser size={18} />
            </div>

            <div>
              <p className="text-sm font-medium text-slate-800">
                Procurement User
              </p>

              <p className="text-xs text-slate-500">
                SAIL
              </p>
            </div>

          </div>

        </div>

      </div>

    </header>
  );
}

export default Header;
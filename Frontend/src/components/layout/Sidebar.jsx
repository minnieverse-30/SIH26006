import { NavLink } from "react-router-dom";
import {
  FiGrid,
  FiPlusCircle,
  FiTrendingUp,
  FiAnchor,
  FiDollarSign,
  FiCheckCircle,
  FiSliders,
  FiNavigation,
  FiFileText,
  FiWind,
} from "react-icons/fi";

const menuItems = [
  { name: "Dashboard", icon: FiGrid, path: "/" },
  { name: "New Analysis", icon: FiPlusCircle, path: "/analysis/new", accent: true },
  { name: "Freight Forecast", icon: FiTrendingUp, path: "/forecast" },
  { name: "Vessel Match", icon: FiAnchor, path: "/vessel-match" },
  { name: "Vessel Tracking", icon: FiNavigation, path: "/vessel-tracking" },
  { name: "Cost Comparison", icon: FiDollarSign, path: "/cost-comparison" },
  { name: "Decision", icon: FiCheckCircle, path: "/decision" },
  { name: "What-If Analysis", icon: FiSliders, path: "/what-if" },
  { name: "Reports", icon: FiFileText, path: "/reports" },
];

function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-[#e3edf6] bg-white lg:flex">
      <div className="flex h-20 shrink-0 items-center border-b border-[#e7eff7] px-6">
        <div className="flex items-center gap-3">
          <div className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl bg-[#edf7ff] text-[#1764a3]">
            <FiWind size={27} strokeWidth={1.7} />
            <span className="absolute bottom-1.5 left-2 h-[2px] w-7 rounded-full bg-[#1f9fe5]" />
          </div>
          <div>
            <h1 className="text-[16px] font-extrabold tracking-[0.13em] text-[#173f6f]">SAYLVI</h1>
            <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.13em] text-[#6d8ba9]">Maritime Logistics</p>
            <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#6d8ba9]">Intelligence</p>
          </div>
        </div>
      </div>

      <nav className="sf-scrollbar flex-1 overflow-y-auto px-3 py-6">
        <div className="space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                end={item.path === "/"}
                className={({ isActive }) =>
                  `group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[13px] font-semibold transition-all ${
                    isActive
                      ? "bg-[#e8f5ff] text-[#1765a3] shadow-[inset_2px_0_0_#20a9ed]"
                      : "text-[#315b83] hover:bg-[#f2f8fd] hover:text-[#1765a3]"
                  }`
                }
              >
                <Icon size={18} strokeWidth={1.8} className="shrink-0" />
                <span>{item.name}</span>
                {item.accent && (
                  <span className="ml-auto rounded-full bg-[#e6f7ff] px-2 py-0.5 text-[8px] font-extrabold uppercase tracking-wider text-[#0789cf]">
                    Start
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>
      </nav>

      <div className="shrink-0 border-t border-[#e7eff7] p-4">
        <div className="rounded-xl border border-[#e2edf7] bg-[#f7fbff] p-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#315b83]">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Prototype environment
          </div>
          <p className="mt-1.5 text-[10px] leading-4 text-[#7b95ad]">AI decision support • SIH 2026</p>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;

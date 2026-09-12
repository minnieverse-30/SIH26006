import { useNavigate } from "react-router-dom";

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
} from "react-icons/fi";

function Sidebar() {

  const navigate = useNavigate();

  const menuItems = [
    {
      name: "Dashboard",
      icon: FiGrid,
      path: "/",
    },
    {
      name: "New Analysis",
      icon: FiPlusCircle,
      path: "/new-analysis",
    },
    {
      name: "Freight Forecast",
      icon: FiTrendingUp,
      path: "/forecast",
    },
    {
      name: "Vessel Match",
      icon: FiAnchor,
      path: "/vessel-match",
    },
    { name: "Vessel Tracking", icon: FiNavigation, path: "/vessel-tracking" },
    {
      name: "Cost Comparison",
      icon: FiDollarSign,
      path: "/cost-comparison",
    },
    {
      name: "Decision",
      icon: FiCheckCircle,
      path: "/decision",
    },
    {
      name: "What-If Analysis",
      icon: FiSliders,
      path: "/what-if",
    },
    {
      name: "Reports",
      icon: FiFileText,
      path: "/reports",
    },
  ];

  return (
    <aside className="fixed top-0 left-0 w-64 h-screen text-white bg-slate-900">

      {/* Logo */}

      <div className="flex items-center h-20 px-6 border-b border-slate-700">

        <div>

          <h1 className="text-xl font-bold tracking-wide">
            SAIL-FORGE
          </h1>

          <p className="text-xs text-slate-400">
            Chartering Intelligence
          </p>

        </div>

      </div>


      {/* Navigation */}

      <nav className="p-4">

        {menuItems.map((item) => {

          const Icon = item.icon;

          return (
            <button
              key={item.name}
              onClick={() => navigate(item.path)}
              className="flex items-center w-full gap-3 px-4 py-3 mb-1 text-sm transition rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white"
            >

              <Icon size={18} />

              <span>
                {item.name}
              </span>

            </button>
          );

        })}

      </nav>


      {/* Bottom */}

      <div className="absolute bottom-0 w-full p-4 border-t border-slate-700">

        <p className="text-xs text-slate-500">
          AI-Powered Decision Support
        </p>

        <p className="mt-1 text-xs text-slate-400">
          SAIL • SIH 2026
        </p>

      </div>

    </aside>
  );
}

export default Sidebar;
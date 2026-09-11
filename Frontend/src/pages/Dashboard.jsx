import { useNavigate } from "react-router-dom";
import {
  FiArrowUpRight,
  FiAnchor,
  FiBarChart2,
  FiCheckCircle,
  FiChevronRight,
  FiClock,
  FiDollarSign,
  FiPlus,
  FiShield,
  FiTrendingUp,
  FiLayers,
  FiAlertTriangle,
} from "react-icons/fi";

const stats = [
  { label: "Active analyses", value: "12", delta: "+3 this week", icon: FiBarChart2 },
  { label: "Forecasts generated", value: "28", delta: "+12.5% accuracy", icon: FiTrendingUp },
  { label: "Vessel matches", value: "46", delta: "8 high confidence", icon: FiAnchor },
  { label: "Recommendations", value: "18", delta: "6 book-now signals", icon: FiCheckCircle },
];

const recentAnalyses = [
  { id: "ANL-001", cargo: "Coking Coal", route: "Australia → Paradip", confidence: "94%", status: "BOOK NOW", tone: "green", time: "18 min ago" },
  { id: "ANL-002", cargo: "Iron Ore", route: "Brazil → Visakhapatnam", confidence: "81%", status: "WAIT", tone: "amber", time: "1 hr ago" },
  { id: "ANL-003", cargo: "Thermal Coal", route: "Indonesia → Mundra", confidence: "76%", status: "ANALYZE", tone: "blue", time: "3 hrs ago" },
  { id: "ANL-004", cargo: "LNG", route: "Qatar → Hazira", confidence: "88%", status: "BOOK NOW", tone: "green", time: "5 hrs ago" },
];

function StatusBadge({ tone, children }) {
  const styles = {
    green: "bg-[#edfff8] text-[#0b9b72] ring-[#b8efd9]",
    amber: "bg-[#fff9e9] text-[#d88a00] ring-[#f4d98d]",
    blue: "bg-[#edf7ff] text-[#1687d0] ring-[#b9def7]",
  };
  return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-extrabold tracking-wide ring-1 ${styles[tone]}`}>{children}</span>;
}

function Dashboard() {
  const navigate = useNavigate();

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" :
    hour < 17 ? "Good afternoon" :
    "Good evening";

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-[#f4f8fc] p-4 sm:p-6 lg:p-7">
      <div className="mx-auto max-w-[1600px]">
        <section className="relative min-h-[220px] overflow-hidden rounded-[18px] border border-[#d9e8f4] bg-gradient-to-r from-[#f8fcff] via-[#f2f9ff] to-[#e8f5ff] px-6 py-6 shadow-[0_8px_30px_rgba(43,94,139,.07)] sm:px-7 sm:py-7">
          <div className="absolute inset-y-0 right-0 w-[48%] bg-[radial-gradient(circle_at_70%_45%,rgba(89,184,233,.18),transparent_55%)]" />
          <div className="absolute bottom-0 right-0 h-20 w-full bg-gradient-to-t from-white/40 to-transparent" />
          <div className="relative z-10 max-w-[62%] lg:max-w-[61%]">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#d7ecfa] bg-[#e9f7ff] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-[#2b9bda]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#31b4ee]" />
              Intelligence workspace
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-[#173f6f] sm:text-[30px]">
  {greeting}. Your Voyage Planning Workspace is ready.
</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#4d7195]">Turn freight signals, vessel availability and commercial constraints into a faster, evidence-led chartering decision.</p>
          </div>

          <div className="absolute right-0 top-0 hidden h-full w-[48%] lg:block">
            <div className="absolute right-[8%] top-[20%] h-[115px] w-[74%] rotate-[-2deg] rounded-[50%] bg-[#bde5f6]/60 blur-xl" />
            <div className="absolute bottom-[-28px] right-[8%] h-[115px] w-[85%] rounded-[50%] bg-[#9fd8ee]/45 blur-lg" />
            <div className="absolute right-[12%] top-[27%] h-20 w-[55%] -skew-x-12 rounded-[45%] bg-white/55 blur-md" />
            <div className="absolute bottom-[19%] right-[18%] h-10 w-[62%] rounded-[50%] bg-[#7cc7e8]/35 blur-md" />
          </div>

          <button onClick={() => navigate("/analysis/new")} className="relative z-20 mt-5 inline-flex items-center gap-2 rounded-xl bg-[#15568e] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-[#15568e]/15 transition hover:bg-[#104876] lg:absolute lg:bottom-8 lg:right-7">
            <FiPlus size={17} />
            Start new analysis
            <FiArrowUpRight size={16} />
          </button>

          <div className="relative z-20 mt-6 flex flex-wrap gap-x-7 gap-y-2 border-t border-[#d9e8f2] pt-4 text-[11px] font-medium text-[#55799b] lg:absolute lg:bottom-5 lg:left-7 lg:mt-0 lg:w-[57%]">
            <span className="inline-flex items-center gap-1.5"><FiShield size={13} className="text-[#2c8ac5]" /> Risk-aware workflow <FiChevronRight size={12} className="text-[#9cb5ca]" /></span>
            <span className="inline-flex items-center gap-1.5"><FiTrendingUp size={13} className="text-[#218ed1]" /> Forecast → Match → Decide <FiChevronRight size={12} className="text-[#9cb5ca]" /></span>
            <span className="inline-flex items-center gap-1.5"><FiLayers size={13} className="text-[#218ed1]" /> Live-ready architecture</span>
          </div>
        </section>

        <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map(({ label, value, delta, icon: Icon }) => (
            <div key={label} className="sf-card p-5 transition hover:-translate-y-0.5">
              <div className="flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#edf7ff] text-[#188fd6] ring-1 ring-[#d9edf9]"><Icon size={19} /></div>
                <FiArrowUpRight className="text-[#9bb8d0]" size={17} />
              </div>
              <p className="mt-5 text-xs font-medium text-[#6886a3]">{label}</p>
              <div className="mt-1 flex items-end justify-between gap-3">
                <p className="text-3xl font-extrabold tracking-tight text-[#183e68]">{value}</p>
                <p className="pb-1 text-[10px] font-bold text-[#12ad7f]">{delta}</p>
              </div>
            </div>
          ))}
        </section>

        <section className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-[1.65fr_1fr]">
          <div className="sf-card overflow-hidden">
            <div className="flex flex-col gap-3 border-b border-[#e8f0f6] p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-[#edf7ff] text-[#247eb8]"><FiClock size={16} /></div>
                <div><h2 className="text-sm font-extrabold text-[#244e76]">Recent analyses</h2><p className="mt-1 text-xs text-[#7793ad]">Latest chartering decisions across the workspace</p></div>
              </div>
              <button onClick={() => navigate("/analysis/new")} className="inline-flex items-center gap-1 text-xs font-bold text-[#1768a8] hover:text-[#0e4f82]">View workspace <FiChevronRight size={14} /></button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-left">
                <thead className="bg-[#f8fbfe] text-[10px] uppercase tracking-wider text-[#8ba3b9]">
                  <tr><th className="px-5 py-3 font-bold">Analysis ID</th><th className="px-5 py-3 font-bold">Route</th><th className="px-5 py-3 font-bold">Confidence</th><th className="px-5 py-3 font-bold">Decision</th><th className="px-5 py-3 font-bold">Updated</th></tr>
                </thead>
                <tbody className="divide-y divide-[#edf2f7]">
                  {recentAnalyses.map((item) => (
                    <tr key={item.id} className="transition hover:bg-[#f8fbfe]">
                      <td className="px-5 py-3.5"><p className="text-xs font-extrabold text-[#234d75]">{item.id}</p><p className="mt-0.5 text-[11px] text-[#7892aa]">{item.cargo}</p></td>
                      <td className="px-5 py-3.5 text-xs font-semibold text-[#526f8b]">{item.route}</td>
                      <td className="px-5 py-3.5"><span className="text-xs font-extrabold text-[#234d75]">{item.confidence}</span></td>
                      <td className="px-5 py-3.5"><StatusBadge tone={item.tone}>{item.status}</StatusBadge></td>
                      <td className="px-5 py-3.5 text-[11px] text-[#8aa1b7]">{item.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="sf-card p-5">
            <div className="flex items-center justify-between">
              <div><div className="flex items-center gap-2"><FiCheckCircle className="text-[#198bcf]" size={17} /><h2 className="text-sm font-extrabold text-[#244e76]">Decision pulse</h2></div><p className="mt-1 text-xs text-[#7793ad]">Current workspace signal</p></div>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#eafff7] text-[#0ca77b]"><FiCheckCircle size={18} /></div>
            </div>
            <div className="mt-5 rounded-xl bg-[#f5faff] p-4">
              <div className="flex items-center justify-between"><span className="text-xs font-semibold text-[#557594]">Book-now confidence</span><span className="text-sm font-extrabold text-[#234d75]">82%</span></div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#dbe8f2]"><div className="h-full w-[82%] rounded-full bg-[#25acd9]" /></div>
              <p className="mt-3 text-[11px] leading-5 text-[#6d89a4]">Strongest signals are coming from freight outlook and vessel availability. Final recommendations should be validated against live market data.</p>
            </div>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3 xl:grid-cols-3">
              <div className="rounded-xl border border-[#e8f0f6] bg-white p-3"><FiTrendingUp className="text-[#1b96d7]" size={16} /><p className="mt-2 text-xs font-medium text-[#7892aa]">Freight trend</p><p className="text-sm font-extrabold text-[#2374ad]">Increasing</p><p className="mt-2 text-[10px] font-bold text-[#12ad7f]">+5.8%</p></div>
              <div className="rounded-xl border border-[#e8f0f6] bg-white p-3"><FiAnchor className="text-[#1b96d7]" size={16} /><p className="mt-2 text-xs font-medium text-[#7892aa]">Vessel availability</p><p className="text-sm font-extrabold text-[#2374ad]">High</p><p className="mt-2 text-[10px] font-bold text-[#12ad7f]">+12%</p></div>
              <div className="rounded-xl border border-[#e8f0f6] bg-white p-3"><FiAlertTriangle className="text-[#2374ad]" size={16} /><p className="mt-2 text-xs font-medium text-[#7892aa]">Delay risk</p><p className="text-sm font-extrabold text-[#2374ad]">Low</p><p className="mt-2 text-[10px] font-bold text-[#12ad7f]">8%</p></div>
            </div>
          </div>
        </section>

        <p className="mt-5 text-[10px] text-[#91a6ba]">Prototype data is displayed for UI development. Production forecasts, vessel positions and recommendations will be supplied by the intelligence backend.</p>
      </div>
    </div>
  );
}

export default Dashboard;

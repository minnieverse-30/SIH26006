import {
  FiTrendingUp,
  FiCalendar,
  FiInfo,
  FiArrowUp,
  FiActivity,
} from "react-icons/fi";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

function Forecast() {
  const forecastData = [
    { month: "Sep", actual: 32, forecast: 32 },
    { month: "Oct", actual: 35, forecast: 35 },
    { month: "Nov", actual: 38, forecast: 38 },
    { month: "Dec", actual: 41, forecast: 41 },
    { month: "Jan", actual: null, forecast: 44 },
    { month: "Feb", actual: null, forecast: 47 },
    { month: "Mar", actual: null, forecast: 49 },
    { month: "Apr", actual: null, forecast: 51 },
  ];

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      {/* Header */}
      <div className="mb-8 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white">
              <FiTrendingUp size={22} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                Freight Forecast
              </h1>

              <p className="text-sm text-slate-500">
                AI-powered freight rate outlook for the selected route
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white px-4 py-3">
          <p className="text-xs text-slate-500">Analysis ID</p>
          <p className="mt-1 text-sm font-semibold text-slate-800">
            ANL-1024
          </p>
        </div>
      </div>

      {/* Route Summary */}
      <div className="mb-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Cargo
            </p>
            <p className="mt-1 font-semibold text-slate-800">
              Coking Coal
            </p>
            <p className="text-xs text-slate-500">50,000 MT</p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Route
            </p>
            <p className="mt-1 font-semibold text-slate-800">
              Port Hedland → Paradip
            </p>
            <p className="text-xs text-slate-500">Australia → India</p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Required Arrival
            </p>
            <p className="mt-1 flex items-center gap-2 font-semibold text-slate-800">
              <FiCalendar size={15} />
              15 Oct 2026
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Contract
            </p>
            <p className="mt-1 font-semibold text-slate-800">Spot</p>
          </div>
        </div>
      </div>

      {/* Forecast KPI Cards */}
      <div className="mb-6 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Current Freight</p>

          <div className="mt-2 flex items-end gap-2">
            <h2 className="text-2xl font-bold text-slate-800">$41</h2>
            <span className="mb-1 text-sm text-slate-500">/ MT</span>
          </div>

          <p className="mt-2 flex items-center gap-1 text-xs font-medium text-green-600">
            <FiArrowUp size={13} />
            7.8% from previous month
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Forecast Rate</p>

          <div className="mt-2 flex items-end gap-2">
            <h2 className="text-2xl font-bold text-slate-800">$49</h2>
            <span className="mb-1 text-sm text-slate-500">/ MT</span>
          </div>

          <p className="mt-2 text-xs font-medium text-amber-600">
            Expected increase
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Forecast Horizon</p>

          <h2 className="mt-2 text-2xl font-bold text-slate-800">
            4 Months
          </h2>

          <p className="mt-2 text-xs text-slate-500">
            Oct 2026 – Jan 2027
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Model Confidence</p>

          <h2 className="mt-2 text-2xl font-bold text-slate-800">86%</h2>

          <p className="mt-2 text-xs font-medium text-green-600">
            High confidence
          </p>
        </div>
      </div>

      {/* Main Chart + Outlook */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Chart */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-800">
                Freight Rate Forecast
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Historical rates and predicted freight movement
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-slate-400" />
                Historical
              </div>

              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-blue-600" />
                Forecast
              </div>
            </div>
          </div>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={forecastData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                />

                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value) => `$${value}`}
                />

                <Tooltip
                  formatter={(value) => [`$${value}/MT`, "Freight"]}
                />

                <Area
                  type="monotone"
                  dataKey="actual"
                  stroke="#64748b"
                  fill="#e2e8f0"
                  strokeWidth={2}
                  connectNulls={false}
                />

                <Area
                  type="monotone"
                  dataKey="forecast"
                  stroke="#2563eb"
                  fill="#dbeafe"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Outlook */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <FiActivity size={20} />
            </div>

            <div>
              <h2 className="font-semibold text-slate-800">
                Market Outlook
              </h2>

              <p className="text-xs text-slate-500">
                AI-generated interpretation
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4">
            <p className="text-sm font-semibold text-amber-800">
              Rising Freight Trend
            </p>

            <p className="mt-2 text-sm leading-6 text-amber-700">
              Freight rates are expected to increase over the forecast
              horizon based on the current market trend.
            </p>
          </div>

          <div className="mt-5 space-y-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Current Trend
              </p>

              <p className="mt-1 text-sm font-semibold text-slate-800">
                Increasing
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Expected Movement
              </p>

              <p className="mt-1 text-sm font-semibold text-slate-800">
                +19.5%
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Key Factors
              </p>

              <ul className="mt-2 space-y-2 text-sm text-slate-600">
                <li>• Route demand</li>
                <li>• Port congestion</li>
                <li>• Vessel availability</li>
                <li>• Fuel market conditions</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Model Information */}
      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-start gap-3">
          <FiInfo className="mt-0.5 text-blue-600" size={18} />

          <div>
            <h3 className="text-sm font-semibold text-slate-800">
              Forecast Methodology
            </h3>

            <p className="mt-1 text-sm leading-6 text-slate-500">
              Forecast results are generated using historical freight
              trends and relevant market indicators. Predictions represent
              an estimated range and should be evaluated alongside vessel,
              port, cost and operational constraints.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Action */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={() => {
            window.location.href = "/vessel-match";
          }}
          className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          Continue to Vessel Match →
        </button>
      </div>
    </div>
  );
}

export default Forecast;
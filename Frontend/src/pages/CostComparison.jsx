import {
  FiDollarSign,
  FiTrendingUp,
  FiAlertTriangle,
  FiCheckCircle,
  FiArrowRight,
  FiInfo,
} from "react-icons/fi";

function CostComparison() {
  const options = [
    {
      vessel: "MV SAIL Horizon",
      freight: 2025000,
      fuel: 310000,
      port: 95000,
      idle: 45000,
      risk: 28000,
      total: 2503000,
      riskLevel: "Low",
      recommended: true,
    },
    {
      vessel: "MV Ocean Carrier",
      freight: 2060000,
      fuel: 325000,
      port: 98000,
      idle: 52000,
      risk: 35000,
      total: 2570000,
      riskLevel: "Low",
      recommended: false,
    },
    {
      vessel: "MV Eastern Star",
      freight: 2190000,
      fuel: 345000,
      port: 102000,
      idle: 85000,
      risk: 62000,
      total: 2784000,
      riskLevel: "Medium",
      recommended: false,
    },
  ];

  const formatCurrency = (value) => {
    return `$${value.toLocaleString("en-US")}`;
  };

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      {/* Header */}
      <div className="mb-8 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white">
            <FiDollarSign size={22} />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Cost Comparison
            </h1>

            <p className="text-sm text-slate-500">
              Compare total expected chartering cost and risk
            </p>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white px-4 py-3">
          <p className="text-xs text-slate-500">Analysis ID</p>
          <p className="mt-1 text-sm font-semibold text-slate-800">
            ANL-1024
          </p>
        </div>
      </div>

      {/* Cost Summary */}
      <div className="mb-6 grid grid-cols-1 gap-5 md:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Recommended Vessel</p>

          <h2 className="mt-2 text-xl font-bold text-slate-800">
            MV SAIL Horizon
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Highest overall value
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Lowest Total Cost</p>

          <h2 className="mt-2 text-2xl font-bold text-slate-800">
            $2.503M
          </h2>

          <p className="mt-1 flex items-center gap-1 text-xs font-medium text-green-600">
            <FiTrendingUp size={13} />
            2.6% below next best option
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Cost Risk Exposure</p>

          <h2 className="mt-2 text-2xl font-bold text-slate-800">
            $28K
          </h2>

          <p className="mt-1 text-xs font-medium text-green-600">
            Low risk exposure
          </p>
        </div>
      </div>

      {/* Recommended Option */}
      <div className="mb-6 rounded-xl border border-green-200 bg-green-50 p-5">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-green-600 text-white">
              <FiCheckCircle size={22} />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-green-700">
                Best Overall Option
              </p>

              <h2 className="mt-1 text-xl font-bold text-slate-800">
                MV SAIL Horizon
              </h2>

              <p className="mt-1 text-sm text-slate-600">
                Lowest total expected cost with low operational risk.
              </p>
            </div>
          </div>

          <div className="text-left lg:text-right">
            <p className="text-xs text-slate-500">Total Expected Cost</p>
            <p className="text-2xl font-bold text-green-700">
              $2.503M
            </p>
          </div>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-800">
            Total Cost Breakdown
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Estimated cost includes freight, fuel, port charges,
            idle/demurrage and risk exposure.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px] text-left">
            <thead className="bg-slate-50">
              <tr className="text-xs uppercase tracking-wide text-slate-500">
                <th className="px-6 py-4">Vessel</th>
                <th className="px-6 py-4">Freight</th>
                <th className="px-6 py-4">Fuel</th>
                <th className="px-6 py-4">Port / Handling</th>
                <th className="px-6 py-4">Idle / Demurrage</th>
                <th className="px-6 py-4">Risk Exposure</th>
                <th className="px-6 py-4">Total Cost</th>
                <th className="px-6 py-4">Risk</th>
              </tr>
            </thead>

            <tbody>
              {options.map((option) => (
                <tr
                  key={option.vessel}
                  className={`border-t border-slate-100 ${
                    option.recommended ? "bg-green-50/40" : ""
                  }`}
                >
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      {option.recommended && (
                        <FiCheckCircle
                          className="text-green-600"
                          size={17}
                        />
                      )}

                      <div>
                        <p className="font-semibold text-slate-800">
                          {option.vessel}
                        </p>

                        {option.recommended && (
                          <p className="mt-1 text-xs font-medium text-green-600">
                            Recommended
                          </p>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-5 text-sm text-slate-700">
                    {formatCurrency(option.freight)}
                  </td>

                  <td className="px-6 py-5 text-sm text-slate-700">
                    {formatCurrency(option.fuel)}
                  </td>

                  <td className="px-6 py-5 text-sm text-slate-700">
                    {formatCurrency(option.port)}
                  </td>

                  <td className="px-6 py-5 text-sm text-slate-700">
                    {formatCurrency(option.idle)}
                  </td>

                  <td className="px-6 py-5 text-sm text-slate-700">
                    {formatCurrency(option.risk)}
                  </td>

                  <td className="px-6 py-5 text-sm font-bold text-slate-800">
                    {formatCurrency(option.total)}
                  </td>

                  <td className="px-6 py-5">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        option.riskLevel === "Low"
                          ? "bg-green-100 text-green-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {option.riskLevel}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Formula */}
        <div className="border-t border-slate-200 bg-slate-50 px-6 py-5">
          <div className="flex items-start gap-3">
            <FiInfo
              className="mt-0.5 shrink-0 text-blue-600"
              size={18}
            />

            <div>
              <p className="text-sm font-semibold text-slate-700">
                Total Expected Cost
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Freight + Fuel + Port / Handling + Idle /
                Demurrage + Risk Exposure
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Decision Insight */}
      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-start gap-3">
          <FiAlertTriangle
            className="mt-0.5 text-amber-500"
            size={20}
          />

          <div>
            <h3 className="text-sm font-semibold text-slate-800">
              Cost Optimization Insight
            </h3>

            <p className="mt-1 max-w-4xl text-sm leading-6 text-slate-500">
              Although MV Pacific Trader may offer a lower base freight
              rate, vessel and port constraints can increase the overall
              exposure. The recommended option considers total expected
              cost rather than freight rate alone.
            </p>
          </div>
        </div>
      </div>

      {/* Continue */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={() => {
            window.location.href = "/decision";
          }}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          View Final Decision
          <FiArrowRight size={17} />
        </button>
      </div>
    </div>
  );
}

export default CostComparison;
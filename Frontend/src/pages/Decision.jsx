import {
  FiCheckCircle,
  FiAlertTriangle,
  FiXCircle,
  FiTrendingUp,
  FiAnchor,
  FiDollarSign,
  FiShield,
  FiArrowRight,
  FiInfo,
} from "react-icons/fi";

function Decision() {
  return (
    <div className="min-h-screen bg-slate-100 p-8">
      {/* Header */}
      <div className="mb-8 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white">
            <FiCheckCircle size={22} />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Chartering Decision
            </h1>

            <p className="text-sm text-slate-500">
              AI-assisted recommendation based on forecast, feasibility,
              cost and risk
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

      {/* Main Recommendation */}
      <div className="mb-6 rounded-2xl border border-green-200 bg-white shadow-sm">
        <div className="border-b border-green-100 bg-green-50 p-6">
          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-green-600 text-white">
                <FiCheckCircle size={28} />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-green-700">
                  AI Recommendation
                </p>

                <h2 className="mt-1 text-3xl font-bold text-slate-800">
                  BOOK NOW
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                  Current freight conditions, vessel availability and
                  expected cost indicate that booking now provides the
                  strongest overall option.
                </p>
              </div>
            </div>

            <div className="rounded-xl bg-white px-6 py-4 text-center shadow-sm">
              <p className="text-xs font-medium text-slate-500">
                Decision Confidence
              </p>

              <p className="mt-1 text-3xl font-bold text-green-600">
                89%
              </p>

              <p className="text-xs text-slate-500">
                High confidence
              </p>
            </div>
          </div>
        </div>

        {/* Recommended Vessel */}
        <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Recommended Vessel
            </p>

            <div className="mt-2 flex items-center gap-2">
              <FiAnchor className="text-blue-600" size={18} />
              <p className="font-semibold text-slate-800">
                MV SAIL Horizon
              </p>
            </div>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Total Expected Cost
            </p>

            <div className="mt-2 flex items-center gap-2">
              <FiDollarSign className="text-blue-600" size={18} />
              <p className="font-semibold text-slate-800">
                $2.503M
              </p>
            </div>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Vessel Match
            </p>

            <p className="mt-2 font-semibold text-slate-800">
              96% compatibility
            </p>
          </div>
        </div>
      </div>

      {/* Decision Factors */}
      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Why Book */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50 text-green-600">
              <FiTrendingUp size={20} />
            </div>

            <div>
              <h2 className="font-semibold text-slate-800">
                Why BOOK NOW?
              </h2>

              <p className="text-xs text-slate-500">
                Key supporting factors
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <FiCheckCircle
                className="mt-0.5 shrink-0 text-green-600"
                size={17}
              />

              <div>
                <p className="text-sm font-medium text-slate-800">
                  Freight rates are trending upward
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Forecast indicates further rate increases over the
                  upcoming months.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <FiCheckCircle
                className="mt-0.5 shrink-0 text-green-600"
                size={17}
              />

              <div>
                <p className="text-sm font-medium text-slate-800">
                  Suitable vessel is available
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  MV SAIL Horizon meets the cargo and route requirements.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <FiCheckCircle
                className="mt-0.5 shrink-0 text-green-600"
                size={17}
              />

              <div>
                <p className="text-sm font-medium text-slate-800">
                  Lowest overall expected cost
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  The selected option has the strongest cost-risk balance.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Risk */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <FiShield size={20} />
            </div>

            <div>
              <h2 className="font-semibold text-slate-800">
                Risk Assessment
              </h2>

              <p className="text-xs text-slate-500">
                Current operational exposure
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">
                Freight Risk
              </span>

              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">
                Medium
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">
                Port Risk
              </span>

              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                Low
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">
                Vessel Risk
              </span>

              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                Low
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">
                Contract Risk
              </span>

              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                Low
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Alternative Decisions */}
      <div className="mb-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-slate-800">
            Decision Alternatives
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            AI evaluates alternative actions before recommending the
            preferred option.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* Book */}
          <div className="rounded-xl border-2 border-green-200 bg-green-50 p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-green-700">
                BOOK NOW
              </span>

              <FiCheckCircle
                className="text-green-600"
                size={20}
              />
            </div>

            <p className="mt-3 text-sm text-slate-600">
              Strongest option under current market and vessel
              conditions.
            </p>

            <p className="mt-4 text-xs font-medium text-green-700">
              Recommended
            </p>
          </div>

          {/* Wait */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-amber-700">
                WAIT
              </span>

              <FiAlertTriangle
                className="text-amber-500"
                size={20}
              />
            </div>

            <p className="mt-3 text-sm text-slate-600">
              Waiting may expose the charter to higher expected freight
              rates.
            </p>

            <p className="mt-4 text-xs font-medium text-amber-700">
              Less favorable
            </p>
          </div>

          {/* Avoid */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-red-700">
                AVOID
              </span>

              <FiXCircle className="text-red-500" size={20} />
            </div>

            <p className="mt-3 text-sm text-slate-600">
              No critical reason to reject the recommended vessel at
              present.
            </p>

            <p className="mt-4 text-xs font-medium text-red-700">
              Not preferred
            </p>
          </div>
        </div>
      </div>

      {/* Explanation */}
      <div className="mb-6 rounded-xl border border-blue-200 bg-blue-50 p-5">
        <div className="flex items-start gap-3">
          <FiInfo
            className="mt-0.5 shrink-0 text-blue-600"
            size={19}
          />

          <div>
            <h3 className="text-sm font-semibold text-blue-900">
              Decision Explanation
            </h3>

            <p className="mt-1 max-w-5xl text-sm leading-6 text-blue-800">
              The recommendation combines freight forecast, vessel
              compatibility, port feasibility, total expected cost and
              operational risk. The system recommends BOOK NOW because
              current conditions indicate that delaying the charter
              could increase expected cost.
            </p>
          </div>
        </div>
      </div>

      {/* Human Approval */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
          <div>
            <h2 className="text-lg font-semibold text-slate-800">
              Procurement Review
            </h2>

            <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
              AI provides decision support only. Final commercial
              approval and chartering action remain with the authorized
              procurement team.
            </p>
          </div>

          <button
            onClick={() => {
              window.location.href = "/what-if";
            }}
            className="flex shrink-0 items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Run What-If Analysis
            <FiArrowRight size={17} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Decision;
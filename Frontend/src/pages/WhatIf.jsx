import { useState } from "react";
import {
  FiSliders,
  FiTrendingUp,
  FiDollarSign,
  FiClock,
  FiAlertTriangle,
  FiCheckCircle,
  FiRefreshCw,
} from "react-icons/fi";

function WhatIf() {
  const [freightChange, setFreightChange] = useState(0);
  const [delayDays, setDelayDays] = useState(0);
  const [fuelChange, setFuelChange] = useState(0);

  const baseCost = 2503000;

  const freightImpact = baseCost * (freightChange / 100);
  const fuelImpact = 310000 * (fuelChange / 100);
  const delayImpact = delayDays * 18000;

  const newTotalCost =
    baseCost + freightImpact + fuelImpact + delayImpact;

  const costDifference = newTotalCost - baseCost;

  const resetScenario = () => {
    setFreightChange(0);
    setDelayDays(0);
    setFuelChange(0);
  };

  const getDecision = () => {
    if (newTotalCost <= 2600000 && delayDays <= 3) {
      return "BOOK NOW";
    }

    if (newTotalCost <= 2800000 && delayDays <= 7) {
      return "WAIT";
    }

    return "AVOID";
  };

  const decision = getDecision();

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      {/* Header */}
      <div className="mb-8 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white">
            <FiSliders size={22} />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              What-If Analysis
            </h1>

            <p className="text-sm text-slate-500">
              Simulate market and operational scenarios before deciding
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

      {/* Current Baseline */}
      <div className="mb-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Vessel
            </p>

            <p className="mt-1 font-semibold text-slate-800">
              MV SAIL Horizon
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Current Cost
            </p>

            <p className="mt-1 font-semibold text-slate-800">
              $2.503M
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Current Decision
            </p>

            <span className="mt-1 inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
              BOOK NOW
            </span>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Match Score
            </p>

            <p className="mt-1 font-semibold text-slate-800">
              96%
            </p>
          </div>
        </div>
      </div>

      {/* Scenario Controls */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Controls */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-800">
                Scenario Parameters
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Adjust variables to simulate different conditions.
              </p>
            </div>

            <button
              onClick={resetScenario}
              className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-50"
            >
              <FiRefreshCw size={14} />
              Reset
            </button>
          </div>

          {/* Freight */}
          <div className="mb-7">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FiTrendingUp
                  className="text-blue-600"
                  size={17}
                />

                <label className="text-sm font-medium text-slate-700">
                  Freight Rate Change
                </label>
              </div>

              <span className="text-sm font-bold text-blue-600">
                {freightChange > 0 ? "+" : ""}
                {freightChange}%
              </span>
            </div>

            <input
              type="range"
              min="-20"
              max="30"
              value={freightChange}
              onChange={(e) =>
                setFreightChange(Number(e.target.value))
              }
              className="w-full accent-blue-600"
            />

            <div className="mt-2 flex justify-between text-xs text-slate-400">
              <span>-20%</span>
              <span>0%</span>
              <span>+30%</span>
            </div>
          </div>

          {/* Delay */}
          <div className="mb-7">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FiClock
                  className="text-amber-600"
                  size={17}
                />

                <label className="text-sm font-medium text-slate-700">
                  Vessel Delay
                </label>
              </div>

              <span className="text-sm font-bold text-amber-600">
                {delayDays} days
              </span>
            </div>

            <input
              type="range"
              min="0"
              max="14"
              value={delayDays}
              onChange={(e) =>
                setDelayDays(Number(e.target.value))
              }
              className="w-full accent-amber-500"
            />

            <div className="mt-2 flex justify-between text-xs text-slate-400">
              <span>0 days</span>
              <span>7 days</span>
              <span>14 days</span>
            </div>
          </div>

          {/* Fuel */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FiDollarSign
                  className="text-slate-600"
                  size={17}
                />

                <label className="text-sm font-medium text-slate-700">
                  Fuel Cost Change
                </label>
              </div>

              <span className="text-sm font-bold text-slate-700">
                {fuelChange > 0 ? "+" : ""}
                {fuelChange}%
              </span>
            </div>

            <input
              type="range"
              min="-20"
              max="30"
              value={fuelChange}
              onChange={(e) =>
                setFuelChange(Number(e.target.value))
              }
              className="w-full accent-slate-600"
            />

            <div className="mt-2 flex justify-between text-xs text-slate-400">
              <span>-20%</span>
              <span>0%</span>
              <span>+30%</span>
            </div>
          </div>
        </div>

        {/* Scenario Result */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-slate-800">
              Scenario Result
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Estimated impact of the selected conditions.
            </p>
          </div>

          {/* New Cost */}
          <div className="rounded-xl bg-slate-50 p-5">
            <p className="text-sm text-slate-500">
              Revised Total Expected Cost
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-800">
              $
              {(newTotalCost / 1000000).toFixed(3)}
              M
            </p>

            <div className="mt-2 flex items-center gap-2">
              <span
                className={`text-sm font-medium ${
                  costDifference > 0
                    ? "text-red-600"
                    : costDifference < 0
                    ? "text-green-600"
                    : "text-slate-500"
                }`}
              >
                {costDifference > 0 ? "+" : ""}
                ${Math.abs(costDifference).toLocaleString()}
              </span>

              <span className="text-xs text-slate-500">
                vs current estimate
              </span>
            </div>
          </div>

          {/* Decision */}
          <div className="mt-5">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Revised Decision
            </p>

            <div
              className={`rounded-xl border p-5 ${
                decision === "BOOK NOW"
                  ? "border-green-200 bg-green-50"
                  : decision === "WAIT"
                  ? "border-amber-200 bg-amber-50"
                  : "border-red-200 bg-red-50"
              }`}
            >
              <div className="flex items-center gap-3">
                {decision === "BOOK NOW" && (
                  <FiCheckCircle
                    className="text-green-600"
                    size={23}
                  />
                )}

                {decision === "WAIT" && (
                  <FiAlertTriangle
                    className="text-amber-600"
                    size={23}
                  />
                )}

                {decision === "AVOID" && (
                  <FiAlertTriangle
                    className="text-red-600"
                    size={23}
                  />
                )}

                <div>
                  <p
                    className={`text-xl font-bold ${
                      decision === "BOOK NOW"
                        ? "text-green-700"
                        : decision === "WAIT"
                        ? "text-amber-700"
                        : "text-red-700"
                    }`}
                  >
                    {decision}
                  </p>

                  <p className="mt-1 text-xs text-slate-600">
                    Decision recalculated from the simulated scenario.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Impact Summary */}
          <div className="mt-5 space-y-3">
            <div className="flex justify-between border-b border-slate-100 pb-3">
              <span className="text-sm text-slate-500">
                Freight impact
              </span>

              <span className="text-sm font-medium text-slate-800">
                ${freightImpact.toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between border-b border-slate-100 pb-3">
              <span className="text-sm text-slate-500">
                Fuel impact
              </span>

              <span className="text-sm font-medium text-slate-800">
                ${fuelImpact.toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-sm text-slate-500">
                Delay impact
              </span>

              <span className="text-sm font-medium text-slate-800">
                ${delayImpact.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* AI Insight */}
      <div className="mt-6 rounded-xl border border-blue-200 bg-blue-50 p-5">
        <div className="flex items-start gap-3">
          <FiAlertTriangle
            className="mt-0.5 shrink-0 text-blue-600"
            size={19}
          />

          <div>
            <h3 className="text-sm font-semibold text-blue-900">
              Scenario Insight
            </h3>

            <p className="mt-1 text-sm leading-6 text-blue-800">
              The system recalculates expected cost and decision
              sensitivity when market or operational assumptions change.
              This allows procurement teams to understand how robust
              the recommendation is before taking action.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WhatIf;
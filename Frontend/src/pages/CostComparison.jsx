import { API_BASE_URL } from "../config/api";
import { useEffect, useState } from "react";
import {
  FiDollarSign,
  FiTrendingUp,
  FiAlertTriangle,
  FiCheckCircle,
  FiArrowRight,
  FiInfo,
  FiRefreshCw,
} from "react-icons/fi";

function CostComparison() {
  const [costData, setCostData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const route = "AUS-PAR";
  const cargoQuantity = 100000;

  const analysisId =
    sessionStorage.getItem("sailForgeAnalysisId") || "--";

  // ===============================
  // Fetch Cost Data
  // ===============================

  const fetchCost = async () => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams({
        route,
        cargo_quantity: cargoQuantity,
        fuel_cost: 500000,
        port_cost: 150000,
        idle_cost: 100000,
        risk_cost: 200000,
      });

      const response = await fetch(
        `${API_BASE_URL}/api/cost?${params.toString()}`
      );

      const data = await response.json();

      console.log("COST RESPONSE:", data);

      if (!response.ok) {
        throw new Error(
          data.detail || "Failed to load cost data"
        );
      }

      setCostData(data.data);
    } catch (err) {
      console.error("COST ERROR:", err);

      setError(
        err.message || "Unable to load cost analysis."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCost();
  }, []);

  // ===============================
  // Formatters
  // ===============================

  const formatCurrency = (value) => {
    if (value === undefined || value === null) {
      return "--";
    }

    return `$${Number(value).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const formatMillions = (value) => {
    if (value === undefined || value === null) {
      return "--";
    }

    return `$${(Number(value) / 1000000).toFixed(3)}M`;
  };

  const formatThousands = (value) => {
    if (value === undefined || value === null) {
      return "--";
    }

    return `$${(Number(value) / 1000).toFixed(1)}K`;
  };

  // ===============================
  // Loading
  // ===============================

  if (loading) {
    return (
      <div className="min-h-screen p-8 bg-slate-100">
        <div className="flex min-h-[500px] items-center justify-center">
          <div className="text-center">
            <FiRefreshCw
              className="mx-auto mb-4 text-blue-600 animate-spin"
              size={30}
            />

            <p className="font-medium text-slate-700">
              Loading cost analysis...
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Fetching latest backend cost calculation
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ===============================
  // Error
  // ===============================

  if (error) {
    return (
      <div className="min-h-screen p-8 bg-slate-100">
        <div className="max-w-2xl p-8 mx-auto text-center bg-white border border-red-200 shadow-sm rounded-xl">
          <FiAlertTriangle
            className="mx-auto mb-4 text-red-500"
            size={35}
          />

          <h2 className="text-xl font-bold text-slate-800">
            Unable to load cost analysis
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            {error}
          </p>

          <button
            onClick={fetchCost}
            className="inline-flex items-center gap-2 px-5 py-3 mt-6 text-sm font-semibold text-white transition bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            <FiRefreshCw size={16} />
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!costData) {
    return null;
  }

  // ===============================
  // Cost Values
  // ===============================

  const breakdown = costData.cost_breakdown || {};

  const totalCost = Number(
    costData.total_expected_cost || 0
  );

  const freightCost = Number(
    breakdown.freight_cost || 0
  );

  const fuelCost = Number(
    breakdown.fuel_cost || 0
  );

  const portCost = Number(
    breakdown.port_cost || 0
  );

  const idleCost = Number(
    breakdown.idle_cost || 0
  );

  const riskCost = Number(
    breakdown.risk_cost || 0
  );

  const extraCosts =
    fuelCost +
    portCost +
    idleCost +
    riskCost;

  return (
    <div className="min-h-screen p-8 bg-slate-100">

      {/* Header */}

      <div className="flex flex-col justify-between gap-4 mb-8 lg:flex-row lg:items-center">

        <div className="flex items-center gap-3">

          <div className="flex items-center justify-center text-white bg-blue-600 h-11 w-11 rounded-xl">
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

        <div className="px-4 py-3 bg-white border rounded-lg border-slate-200">

          <p className="text-xs text-slate-500">
            Analysis ID
          </p>

          <p className="mt-1 text-sm font-semibold text-slate-800">
            {analysisId}
          </p>

        </div>

      </div>

      {/* Route Information */}

      <div className="p-5 mb-6 bg-white border shadow-sm rounded-xl border-slate-200">

        <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">

          <div>

            <p className="text-xs tracking-wide uppercase text-slate-400">
              Current Analysis
            </p>

            <h2 className="mt-1 text-lg font-bold text-slate-800">
              Route {costData.route}
            </h2>

          </div>

          <div className="flex flex-wrap gap-3">

            <div className="px-4 py-2 rounded-lg bg-slate-50">

              <p className="text-xs text-slate-500">
                Cargo
              </p>

              <p className="text-sm font-semibold text-slate-800">
                {Number(cargoQuantity).toLocaleString()} MT
              </p>

            </div>

            <div className="px-4 py-2 rounded-lg bg-slate-50">

              <p className="text-xs text-slate-500">
                Forecast Rate
              </p>

              <p className="text-sm font-semibold text-slate-800">
                {formatCurrency(
                  costData.forecast_freight_rate
                )}
                /MT
              </p>

            </div>

            <div className="px-4 py-2 rounded-lg bg-slate-50">

              <p className="text-xs text-slate-500">
                Model
              </p>

              <p className="text-sm font-semibold text-slate-800">
                {costData.model_status || "BASELINE"}
              </p>

            </div>

          </div>

        </div>

      </div>

      {/* Cost Summary */}

      <div className="grid grid-cols-1 gap-5 mb-6 md:grid-cols-3">

        <div className="p-5 bg-white border shadow-sm rounded-xl border-slate-200">

          <p className="text-sm text-slate-500">
            Total Expected Cost
          </p>

          <h2 className="mt-2 text-2xl font-bold text-slate-800">
            {formatMillions(totalCost)}
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Based on current forecast
          </p>

        </div>

        <div className="p-5 bg-white border shadow-sm rounded-xl border-slate-200">

          <p className="text-sm text-slate-500">
            Expected Cost / MT
          </p>

          <h2 className="mt-2 text-2xl font-bold text-slate-800">
            {formatCurrency(
              costData.expected_cost_per_tonne
            )}
          </h2>

          <p className="flex items-center gap-1 mt-1 text-xs font-medium text-blue-600">
            <FiTrendingUp size={13} />
            Current forecast basis
          </p>

        </div>

        <div className="p-5 bg-white border shadow-sm rounded-xl border-slate-200">

          <p className="text-sm text-slate-500">
            Risk Exposure
          </p>

          <h2 className="mt-2 text-2xl font-bold text-slate-800">
            {formatThousands(riskCost)}
          </h2>

          <p className="mt-1 text-xs font-medium text-amber-600">
            Current configured risk cost
          </p>

        </div>

      </div>

      {/* Current Cost Assessment */}

      <div className="p-5 mb-6 border border-green-200 rounded-xl bg-green-50">

        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">

          <div className="flex items-start gap-4">

            <div className="flex items-center justify-center text-white bg-green-600 rounded-lg h-11 w-11 shrink-0">
              <FiCheckCircle size={22} />
            </div>

            <div>

              <p className="text-xs font-semibold tracking-wide text-green-700 uppercase">
                Current Cost Assessment
              </p>

              <h2 className="mt-1 text-xl font-bold text-slate-800">
                Route {costData.route}
              </h2>

              <p className="mt-1 text-sm text-slate-600">
                Current expected cost is calculated using the
                forecast freight rate and configured cost
                components.
              </p>

            </div>

          </div>

          <div className="text-left lg:text-right">

            <p className="text-xs text-slate-500">
              Total Expected Cost
            </p>

            <p className="text-2xl font-bold text-green-700">
              {formatMillions(totalCost)}
            </p>

          </div>

        </div>

      </div>

      {/* Cost Breakdown */}

      <div className="bg-white border shadow-sm rounded-xl border-slate-200">

        <div className="p-6 border-b border-slate-200">

          <h2 className="text-lg font-semibold text-slate-800">
            Total Cost Breakdown
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Estimated cost includes freight, fuel, port
            charges, idle/demurrage and risk exposure.
          </p>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full min-w-[800px] text-left">

            <thead className="bg-slate-50">

              <tr className="text-xs tracking-wide uppercase text-slate-500">

                <th className="px-6 py-4">
                  Cost Component
                </th>

                <th className="px-6 py-4">
                  Amount
                </th>

                <th className="px-6 py-4">
                  Per MT
                </th>

                <th className="px-6 py-4">
                  Status
                </th>

              </tr>

            </thead>

            <tbody>

              {/* Freight */}

              <tr className="border-t border-slate-100">

                <td className="px-6 py-5">

                  <p className="font-semibold text-slate-800">
                    Freight Cost
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Forecast freight rate × cargo quantity
                  </p>

                </td>

                <td className="px-6 py-5 text-sm font-semibold text-slate-700">
                  {formatCurrency(freightCost)}
                </td>

                <td className="px-6 py-5 text-sm text-slate-700">
                  {formatCurrency(
                    costData.forecast_freight_rate
                  )}
                </td>

                <td className="px-6 py-5">

                  <span className="px-3 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full">
                    Forecast Based
                  </span>

                </td>

              </tr>

              {/* Fuel */}

              <tr className="border-t border-slate-100">

                <td className="px-6 py-5">

                  <p className="font-semibold text-slate-800">
                    Fuel Cost
                  </p>

                </td>

                <td className="px-6 py-5 text-sm text-slate-700">
                  {formatCurrency(fuelCost)}
                </td>

                <td className="px-6 py-5 text-sm text-slate-700">
                  {formatCurrency(
                    fuelCost / cargoQuantity
                  )}
                </td>

                <td className="px-6 py-5">

                  <span className="px-3 py-1 text-xs font-medium rounded-full bg-slate-100 text-slate-600">
                    Configured
                  </span>

                </td>

              </tr>

              {/* Port */}

              <tr className="border-t border-slate-100">

                <td className="px-6 py-5">

                  <p className="font-semibold text-slate-800">
                    Port / Handling
                  </p>

                </td>

                <td className="px-6 py-5 text-sm text-slate-700">
                  {formatCurrency(portCost)}
                </td>

                <td className="px-6 py-5 text-sm text-slate-700">
                  {formatCurrency(
                    portCost / cargoQuantity
                  )}
                </td>

                <td className="px-6 py-5">

                  <span className="px-3 py-1 text-xs font-medium rounded-full bg-slate-100 text-slate-600">
                    Configured
                  </span>

                </td>

              </tr>

              {/* Idle */}

              <tr className="border-t border-slate-100">

                <td className="px-6 py-5">

                  <p className="font-semibold text-slate-800">
                    Idle / Demurrage
                  </p>

                </td>

                <td className="px-6 py-5 text-sm text-slate-700">
                  {formatCurrency(idleCost)}
                </td>

                <td className="px-6 py-5 text-sm text-slate-700">
                  {formatCurrency(
                    idleCost / cargoQuantity
                  )}
                </td>

                <td className="px-6 py-5">

                  <span className="px-3 py-1 text-xs font-medium rounded-full bg-slate-100 text-slate-600">
                    Configured
                  </span>

                </td>

              </tr>

              {/* Risk */}

              <tr className="border-t border-slate-100">

                <td className="px-6 py-5">

                  <p className="font-semibold text-slate-800">
                    Risk Exposure
                  </p>

                </td>

                <td className="px-6 py-5 text-sm text-slate-700">
                  {formatCurrency(riskCost)}
                </td>

                <td className="px-6 py-5 text-sm text-slate-700">
                  {formatCurrency(
                    riskCost / cargoQuantity
                  )}
                </td>

                <td className="px-6 py-5">

                  <span className="px-3 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-700">
                    Risk Input
                  </span>

                </td>

              </tr>

              {/* Total */}

              <tr className="border-t-2 border-slate-200 bg-slate-50">

                <td className="px-6 py-5">

                  <p className="font-bold text-slate-800">
                    Total Expected Cost
                  </p>

                </td>

                <td className="px-6 py-5 text-lg font-bold text-slate-900">
                  {formatCurrency(totalCost)}
                </td>

                <td className="px-6 py-5 text-lg font-bold text-slate-900">
                  {formatCurrency(
                    costData.expected_cost_per_tonne
                  )}
                </td>

                <td className="px-6 py-5">

                  <span className="px-3 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded-full">
                    Calculated
                  </span>

                </td>

              </tr>

            </tbody>

          </table>

        </div>

        {/* Formula */}

        <div className="px-6 py-5 border-t border-slate-200 bg-slate-50">

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

      {/* Cost Insight */}

      <div className="p-6 mt-6 bg-white border shadow-sm rounded-xl border-slate-200">

        <div className="flex items-start gap-3">

          <FiAlertTriangle
            className="mt-0.5 text-amber-500"
            size={20}
          />

          <div>

            <h3 className="text-sm font-semibold text-slate-800">
              Cost Optimization Insight
            </h3>

            <p className="max-w-4xl mt-1 text-sm leading-6 text-slate-500">
              The current estimate is primarily driven by
              the forecast freight rate. Additional fuel,
              port, idle and risk costs are incorporated
              into the backend calculation for this
              analysis.
            </p>

            {extraCosts === 0 && (
              <p className="mt-2 text-xs font-medium text-amber-600">
                Note: Fuel, port, idle and risk inputs are
                currently configured as zero for this analysis.
              </p>
            )}

          </div>

        </div>

      </div>

      {/* Continue */}

      <div className="flex justify-end mt-6">

        <button
          onClick={() => {
            window.location.href = "/decision";
          }}
          className="flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white transition bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          View Final Decision
          <FiArrowRight size={17} />
        </button>

      </div>

    </div>
  );
}

export default CostComparison;
import { useState } from "react";
import {
  FiArrowRight,
  FiCheckCircle,
  FiClock,
  FiDollarSign,
  FiLoader,
  FiShield,
  FiTrendingDown,
  FiTrendingUp,
  FiXCircle,
} from "react-icons/fi";

function NewAnalysis() {
  const [form, setForm] = useState({
    route: "C5",
    cargoQuantity: 100000,
    origin: "Tubarao",
    destination: "Qingdao",
    fuelCost: 0,
    portCost: 0,
    idleCost: 0,
    riskCost: 0,
    portDelayDays: 0,
    vesselAvailability: "AVAILABLE",
    contractFlexibility: "FLEXIBLE",
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const updateField = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const runAnalysis = async () => {
    try {
      setLoading(true);
      setError("");
      setResult(null);

      if (Number(form.cargoQuantity) <= 0) {
        throw new Error("Cargo quantity must be greater than zero.");
      }

      const params = new URLSearchParams({
        route: form.route,
        cargo_quantity: Number(form.cargoQuantity),
        origin: form.origin,
        destination: form.destination,
        fuel_cost: Number(form.fuelCost),
        port_cost: Number(form.portCost),
        idle_cost: Number(form.idleCost),
        risk_cost: Number(form.riskCost),
        port_delay_days: Number(form.portDelayDays),
        vessel_availability: form.vesselAvailability,
        contract_flexibility: form.contractFlexibility,
      });

      const response = await fetch(
        `http://127.0.0.1:8000/api/decision?${params.toString()}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Unable to generate chartering analysis."
        );
      }

      setResult(data.data);
    } catch (err) {
      console.error("ANALYSIS ERROR:", err);

      setError(
        err.message || "Unable to connect to SAIL-FORGE backend."
      );
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    if (value === undefined || value === null) {
      return "--";
    }

    return `$${Number(value).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const getDecisionConfig = (decision) => {
    if (decision === "BOOK") {
      return {
        label: "BOOK NOW",
        bg: "bg-green-50",
        border: "border-green-200",
        text: "text-green-700",
        icon: FiCheckCircle,
      };
    }

    if (decision === "WAIT") {
      return {
        label: "WAIT",
        bg: "bg-amber-50",
        border: "border-amber-200",
        text: "text-amber-700",
        icon: FiClock,
      };
    }

    return {
      label: "AVOID",
      bg: "bg-red-50",
      border: "border-red-200",
      text: "text-red-700",
      icon: FiXCircle,
    };
  };

  const decisionConfig = result
    ? getDecisionConfig(result.decision)
    : null;

  const DecisionIcon = decisionConfig?.icon;

  return (
    <div className="space-y-6">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div>

        <p className="text-xs font-semibold tracking-widest text-blue-600 uppercase">
          SAIL-FORGE
        </p>

        <h1 className="mt-1 text-2xl font-bold text-slate-800">
          New Chartering Analysis
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Configure cargo and route parameters to generate a procurement
          decision.
        </p>

      </div>


      {/* =====================================================
          INPUT + PIPELINE
      ===================================================== */}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

        {/* =================================================
            FORM
        ================================================= */}

        <div className="p-6 bg-white border shadow-sm xl:col-span-2 rounded-xl border-slate-200">

          {/* Cargo & Route */}

          <div>

            <div className="mb-5">
              <h2 className="font-semibold text-slate-800">
                Cargo & Route
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Define the commercial movement to be evaluated.
              </p>
            </div>


            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

              {/* Route */}

              <div>
                <label className="text-sm font-medium text-slate-700">
                  Freight Route
                </label>

                <select
                  value={form.route}
                  onChange={(e) =>
                    updateField("route", e.target.value)
                  }
                  className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="C5">C5</option>
                  <option value="C3">C3</option>
                  <option value="Santos-Rizhao">
                    Santos-Rizhao
                  </option>
                  <option value="USG-North China">
                    USG-North China
                  </option>
                  <option value="Taboneo-Vizag">
                    Taboneo-Vizag
                  </option>
                </select>
              </div>


              {/* Cargo */}

              <div>
                <label className="text-sm font-medium text-slate-700">
                  Cargo Quantity (MT)
                </label>

                <input
                  type="number"
                  min="1"
                  value={form.cargoQuantity}
                  onChange={(e) =>
                    updateField(
                      "cargoQuantity",
                      e.target.value
                    )
                  }
                  className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>


              {/* Origin */}

              <div>
                <label className="text-sm font-medium text-slate-700">
                  Origin Port
                </label>

                <select
                  value={form.origin}
                  onChange={(e) =>
                    updateField("origin", e.target.value)
                  }
                  className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="Tubarao">Tubarao</option>
                  <option value="West Australia">
                    West Australia
                  </option>
                  <option value="Santos">Santos</option>
                  <option value="US Gulf">US Gulf</option>
                  <option value="Taboneo">Taboneo</option>
                </select>
              </div>


              {/* Destination */}

              <div>
                <label className="text-sm font-medium text-slate-700">
                  Destination Port
                </label>

                <select
                  value={form.destination}
                  onChange={(e) =>
                    updateField(
                      "destination",
                      e.target.value
                    )
                  }
                  className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="Qingdao">Qingdao</option>
                  <option value="Rizhao">Rizhao</option>
                  <option value="North China">
                    North China
                  </option>
                  <option value="Vizag">Vizag</option>
                </select>
              </div>

            </div>

          </div>


          {/* Divider */}

          <div className="border-t my-7 border-slate-100" />


          {/* Charter Parameters */}

          <div>

            <div className="mb-5">
              <h2 className="font-semibold text-slate-800">
                Charter Parameters
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Operational conditions used by the risk and decision engines.
              </p>
            </div>


            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">

              {/* Vessel */}

              <div>
                <label className="text-sm font-medium text-slate-700">
                  Vessel Availability
                </label>

                <select
                  value={form.vesselAvailability}
                  onChange={(e) =>
                    updateField(
                      "vesselAvailability",
                      e.target.value
                    )
                  }
                  className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="AVAILABLE">
                    Available
                  </option>

                  <option value="UNAVAILABLE">
                    Unavailable
                  </option>
                </select>
              </div>


              {/* Contract */}

              <div>
                <label className="text-sm font-medium text-slate-700">
                  Contract Flexibility
                </label>

                <select
                  value={form.contractFlexibility}
                  onChange={(e) =>
                    updateField(
                      "contractFlexibility",
                      e.target.value
                    )
                  }
                  className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="FLEXIBLE">
                    Flexible
                  </option>

                  <option value="FIXED">
                    Fixed
                  </option>
                </select>
              </div>


              {/* Delay */}

              <div>
                <label className="text-sm font-medium text-slate-700">
                  Port Delay (Days)
                </label>

                <input
                  type="number"
                  min="0"
                  value={form.portDelayDays}
                  onChange={(e) =>
                    updateField(
                      "portDelayDays",
                      e.target.value
                    )
                  }
                  className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

            </div>

          </div>


          {/* Divider */}

          <div className="border-t my-7 border-slate-100" />


          {/* Advanced Costs */}

          <details>

            <summary className="text-sm font-semibold cursor-pointer text-slate-700">
              Advanced Cost Parameters
            </summary>

            <div className="grid grid-cols-1 gap-5 mt-5 md:grid-cols-2">

              <div>
                <label className="text-sm font-medium text-slate-700">
                  Fuel Cost (USD)
                </label>

                <input
                  type="number"
                  min="0"
                  value={form.fuelCost}
                  onChange={(e) =>
                    updateField("fuelCost", e.target.value)
                  }
                  className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                />
              </div>


              <div>
                <label className="text-sm font-medium text-slate-700">
                  Port / Handling Cost (USD)
                </label>

                <input
                  type="number"
                  min="0"
                  value={form.portCost}
                  onChange={(e) =>
                    updateField("portCost", e.target.value)
                  }
                  className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                />
              </div>


              <div>
                <label className="text-sm font-medium text-slate-700">
                  Idle / Demurrage Cost (USD)
                </label>

                <input
                  type="number"
                  min="0"
                  value={form.idleCost}
                  onChange={(e) =>
                    updateField("idleCost", e.target.value)
                  }
                  className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                />
              </div>


              <div>
                <label className="text-sm font-medium text-slate-700">
                  Risk Cost (USD)
                </label>

                <input
                  type="number"
                  min="0"
                  value={form.riskCost}
                  onChange={(e) =>
                    updateField("riskCost", e.target.value)
                  }
                  className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                />
              </div>

            </div>

          </details>


          {/* Run Button */}

          <button
            onClick={runAnalysis}
            disabled={loading}
            className="flex items-center justify-center w-full gap-2 px-5 py-3 text-sm font-semibold text-white transition rounded-lg mt-7 bg-slate-800 hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
          >

            {loading ? (
              <>
                <FiLoader
                  className="animate-spin"
                  size={17}
                />
                Running Chartering Analysis...
              </>
            ) : (
              <>
                <FiActivity size={17} />
                Run Chartering Analysis
              </>
            )}

          </button>


          {/* Error */}

          {error && (
            <div className="p-4 mt-4 text-sm text-red-700 border border-red-200 rounded-lg bg-red-50">
              {error}
            </div>
          )}

        </div>


        {/* =================================================
            PIPELINE
        ================================================= */}

        <div className="p-6 bg-white border shadow-sm rounded-xl border-slate-200">

          <h2 className="font-semibold text-slate-800">
            Analysis Pipeline
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            SAIL-FORGE decision workflow
          </p>


          <div className="mt-6 space-y-5">

            {[
              ["Forecast", "Freight market outlook"],
              ["Feasibility", "Vessel & port constraints"],
              ["Cost", "Total expected exposure"],
              ["Risk", "Operational & market risk"],
              ["Decision", "BOOK / WAIT / AVOID"],
            ].map(([title, description], index) => (

              <div
                key={title}
                className="flex items-start gap-3"
              >

                <div className="flex flex-col items-center">

                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold ${
                      result && index < 5
                        ? "bg-blue-600 text-white"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {index + 1}
                  </div>

                  {index !== 4 && (
                    <div className="w-px mt-1 h-7 bg-slate-200" />
                  )}

                </div>


                <div className="pt-1">

                  <p className="text-sm font-semibold text-slate-700">
                    {title}
                  </p>

                  <p className="mt-0.5 text-xs text-slate-400">
                    {description}
                  </p>

                </div>

              </div>

            ))}

          </div>


          <div className="p-4 border border-blue-100 rounded-lg mt-7 bg-blue-50">

            <div className="flex gap-3">

              <FiShield
                className="mt-0.5 shrink-0 text-blue-600"
                size={17}
              />

              <p className="text-xs leading-5 text-blue-800">
                The system supports procurement decisions using
                explainable market, vessel, cost and risk indicators.
                Final commercial approval remains with the procurement team.
              </p>

            </div>

          </div>

        </div>

      </div>


      {/* =====================================================
          RESULT
      ===================================================== */}

      {result && (
        <div className="space-y-6">

          {/* Decision */}

          <div
            className={`rounded-xl border p-6 shadow-sm ${decisionConfig.bg} ${decisionConfig.border}`}
          >

            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">

              <div className="flex items-start gap-4">

                <div className="p-3 bg-white shadow-sm rounded-xl">
                  <DecisionIcon
                    className={decisionConfig.text}
                    size={28}
                  />
                </div>

                <div>

                  <p className="text-xs font-bold tracking-widest uppercase text-slate-500">
                    Procurement Recommendation
                  </p>

                  <h2
                    className={`mt-1 text-3xl font-black ${decisionConfig.text}`}
                  >
                    {decisionConfig.label}
                  </h2>

                  <p className="mt-2 text-sm text-slate-600">
                    {result.reasons?.[0] ||
                      "Decision generated from current system inputs."}
                  </p>

                </div>

              </div>


              <div className="px-5 py-3 text-center rounded-lg bg-white/80">

                <p className="text-xs text-slate-500">
                  Decision Confidence
                </p>

                <p className="mt-1 font-bold text-slate-800">
                  {result.decision_confidence || "--"}
                </p>

              </div>

            </div>

          </div>


          {/* KPI */}

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">

            <div className="p-5 bg-white border shadow-sm rounded-xl border-slate-200">

              <FiTrendingDown
                className="text-blue-600"
                size={20}
              />

              <p className="mt-4 text-xs tracking-wide uppercase text-slate-400">
                Freight Forecast
              </p>

              <p className="mt-1 text-2xl font-bold text-slate-800">
                {formatCurrency(
                  result.forecast?.forecast_rate
                )}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                {result.forecast?.trend || "--"} •{" "}
                {result.forecast?.confidence || "--"}
              </p>

            </div>


            <div className="p-5 bg-white border shadow-sm rounded-xl border-slate-200">

              <FiDollarSign
                className="text-slate-700"
                size={20}
              />

              <p className="mt-4 text-xs tracking-wide uppercase text-slate-400">
                Expected Cost
              </p>

              <p className="mt-1 text-2xl font-bold text-slate-800">
                {formatCurrency(
                  result.cost?.total_expected_cost
                )}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                {formatCurrency(
                  result.cost?.expected_cost_per_tonne
                )}{" "}
                / MT
              </p>

            </div>


            <div className="p-5 bg-white border shadow-sm rounded-xl border-slate-200">

              <FiAnchor
                className="text-slate-700"
                size={20}
              />

              <p className="mt-4 text-xs tracking-wide uppercase text-slate-400">
                Feasible Vessels
              </p>

              <p className="mt-1 text-2xl font-bold text-slate-800">
                {result.feasibility?.feasible_vessel_count ??
                  0}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                of{" "}
                {result.feasibility?.total_vessels_checked ??
                  0}{" "}
                checked
              </p>

            </div>


            <div className="p-5 bg-white border shadow-sm rounded-xl border-slate-200">

              <FiShield
                className="text-slate-700"
                size={20}
              />

              <p className="mt-4 text-xs tracking-wide uppercase text-slate-400">
                Risk
              </p>

              <p className="mt-1 text-2xl font-bold text-slate-800">
                {result.risk?.risk_score ?? 0}
                <span className="text-sm text-slate-400">
                  /100
                </span>
              </p>

              <p className="mt-1 text-xs text-slate-500">
                {result.risk?.risk_level || "--"}
              </p>

            </div>

          </div>


          {/* Vessel + Reasons */}

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

            <div className="p-6 bg-white border shadow-sm rounded-xl border-slate-200">

              <h2 className="font-semibold text-slate-800">
                Feasible Vessel Options
              </h2>

              <div className="mt-4 space-y-3">

                {(result.feasibility?.vessels || [])
                  .map((vessel, index) => (

                    <div
                      key={vessel.vessel_id || index}
                      className="flex items-center justify-between p-4 border rounded-lg border-slate-100"
                    >

                      <div>

                        <p className="text-sm font-semibold text-slate-800">
                          {vessel.name ||
                            vessel.vessel_name ||
                            `Vessel ${index + 1}`}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {vessel.vessel_type ||
                            vessel.type ||
                            "Compatible vessel"}
                        </p>

                      </div>

                      <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700">
                        FEASIBLE
                      </span>

                    </div>

                  ))}

                {(result.feasibility?.vessels || [])
                  .length === 0 && (
                  <p className="text-sm text-slate-500">
                    No feasible vessel options found.
                  </p>
                )}

              </div>

            </div>


            <div className="p-6 bg-white border shadow-sm rounded-xl border-slate-200">

              <h2 className="font-semibold text-slate-800">
                Decision Rationale
              </h2>

              <div className="mt-4 space-y-3">

                {(result.reasons || []).map(
                  (reason, index) => (

                    <div
                      key={index}
                      className="flex items-start gap-3 p-4 rounded-lg bg-slate-50"
                    >

                      <div className="flex items-center justify-center w-6 h-6 text-xs font-bold text-blue-700 bg-blue-100 rounded-full shrink-0">
                        {index + 1}
                      </div>

                      <p className="text-sm leading-6 text-slate-600">
                        {reason}
                      </p>

                    </div>

                  )
                )}

              </div>

            </div>

          </div>


          {/* Disclaimer */}

          <div className="p-4 border rounded-lg border-slate-200 bg-slate-50">

            <p className="text-xs leading-5 text-slate-500">
              <strong className="text-slate-600">
                Procurement advisory:
              </strong>{" "}
              This analysis is decision support based on available
              data and model outputs. Final chartering approval,
              commercial negotiation and vessel nomination remain
              with the authorized procurement team.
            </p>

          </div>

        </div>
      )}

    </div>
  );
}

export default NewAnalysis;
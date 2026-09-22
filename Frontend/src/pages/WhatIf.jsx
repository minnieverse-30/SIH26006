import { API_BASE_URL } from "../config/api";
import { useEffect, useState } from "react";
import {
  FiSliders,
  FiTrendingUp,
  FiDollarSign,
  FiClock,
  FiAlertTriangle,
  FiCheckCircle,
  FiXCircle,
  FiRefreshCw,
  FiAnchor,
  FiArrowRight,
  FiActivity,
} from "react-icons/fi";

function WhatIf() {
  const [analysis, setAnalysis] = useState(null);

  const [freightChange, setFreightChange] = useState(0);
  const [delayDays, setDelayDays] = useState(0);
  const [fuelChange, setFuelChange] = useState(0);

  const [baseResult, setBaseResult] = useState(null);
  const [scenarioResult, setScenarioResult] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAnalysis = async () => {
    try {
      setLoading(true);
      setError("");

      let currentAnalysis;

      const analysisId = sessionStorage.getItem(
        "sailForgeAnalysisId"
      );

      // --------------------------------------------------
      // LOAD ACTIVE ANALYSIS
      // --------------------------------------------------

      if (analysisId) {
        const analysisResponse = await fetch(
          `${API_BASE_URL}/api/analyses/${analysisId}`
        );

        const analysisData = await analysisResponse.json();

        if (!analysisResponse.ok) {
          throw new Error(
            analysisData.detail ||
              "Unable to load saved analysis."
          );
        }

        currentAnalysis =
          analysisData.data || analysisData;
      } else {
        // Fallback to New Analysis defaults
        currentAnalysis = {
          route: "AUS-PAR",
          cargo_quantity: 100000,
          origin: "Hay Point",
          destination: "Paradip",
          fuel_cost: 500000,
          port_cost: 150000,
          idle_cost: 100000,
          risk_cost: 200000,
          port_delay_days: 2,
          vessel_availability: "HIGH",
          contract_flexibility: "FLEXIBLE",
        };
      }

      setAnalysis(currentAnalysis);

      // --------------------------------------------------
      // BASE DECISION
      // --------------------------------------------------

      const baseParams = new URLSearchParams({
        route: currentAnalysis.route,
        cargo_quantity: currentAnalysis.cargo_quantity,
        origin: currentAnalysis.origin,
        destination: currentAnalysis.destination,
        fuel_cost: currentAnalysis.fuel_cost ?? 0,
        port_cost: currentAnalysis.port_cost ?? 0,
        idle_cost: currentAnalysis.idle_cost ?? 0,
        risk_cost: currentAnalysis.risk_cost ?? 0,
        port_delay_days:
          currentAnalysis.port_delay_days ?? 0,
        vessel_availability:
          currentAnalysis.vessel_availability || "HIGH",
        contract_flexibility:
          currentAnalysis.contract_flexibility || "FLEXIBLE",
      });

      // --------------------------------------------------
      // WHAT-IF SCENARIO
      // --------------------------------------------------

      const scenarioParams = new URLSearchParams({
        route: currentAnalysis.route,
        cargo_quantity: currentAnalysis.cargo_quantity,
        freight_change_percent: freightChange,
        fuel_change_percent: fuelChange,
        port_delay_days: delayDays,
        vessel_availability:
          currentAnalysis.vessel_availability || "HIGH",
        contract_flexibility:
          currentAnalysis.contract_flexibility || "FLEXIBLE",
      });

      const [baseResponse, scenarioResponse] =
        await Promise.all([
          fetch(
            `${API_BASE_URL}/api/decision?${baseParams.toString()}`
          ),
          fetch(
            `${API_BASE_URL}/api/what-if?${scenarioParams.toString()}`
          ),
        ]);

      const baseData = await baseResponse.json();
      const scenarioData = await scenarioResponse.json();

      if (!baseResponse.ok) {
        throw new Error(
          baseData.detail ||
            "Unable to load base decision."
        );
      }

      if (!scenarioResponse.ok) {
        throw new Error(
          scenarioData.detail ||
            "Unable to run what-if analysis."
        );
      }

      setBaseResult(baseData.data || baseData);
      setScenarioResult(
        scenarioData.data || scenarioData
      );
    } catch (err) {
      console.error("WHAT-IF ERROR:", err);

      setError(
        err.message ||
          "Unable to run scenario analysis."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalysis();
  }, [freightChange, delayDays, fuelChange]);

  const resetScenario = () => {
    setFreightChange(0);
    setDelayDays(0);
    setFuelChange(0);
  };

  const formatCurrency = (value) => {
    if (
      value === undefined ||
      value === null ||
      Number.isNaN(Number(value))
    ) {
      return "--";
    }

    return `$${Number(value).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const formatMillions = (value) => {
    if (
      value === undefined ||
      value === null ||
      Number.isNaN(Number(value))
    ) {
      return "--";
    }

    return `$${(Number(value) / 1000000).toFixed(3)}M`;
  };

  const getDecisionStyle = (decision) => {
    if (decision === "BOOK") {
      return {
        bg: "bg-green-50",
        border: "border-green-200",
        text: "text-green-700",
        icon: (
          <FiCheckCircle
            className="text-green-600"
            size={23}
          />
        ),
      };
    }

    if (decision === "WAIT") {
      return {
        bg: "bg-amber-50",
        border: "border-amber-200",
        text: "text-amber-700",
        icon: (
          <FiAlertTriangle
            className="text-amber-600"
            size={23}
          />
        ),
      };
    }

    return {
      bg: "bg-red-50",
      border: "border-red-200",
      text: "text-red-700",
      icon: (
        <FiXCircle
          className="text-red-600"
          size={23}
        />
      ),
    };
  };

  const getDecisionLabel = (decision) => {
    if (decision === "BOOK") return "BOOK NOW";
    if (decision === "WAIT") return "WAIT";
    if (decision === "AVOID") return "AVOID";
    return "--";
  };

  const getRiskStyle = (level) => {
    if (level === "LOW") {
      return "bg-green-100 text-green-700";
    }

    if (level === "MEDIUM") {
      return "bg-amber-100 text-amber-700";
    }

    return "bg-red-100 text-red-700";
  };

  // --------------------------------------------------
  // BASE VALUES
  // --------------------------------------------------

  const baseDecision =
    baseResult?.decision || "--";

  const baseForecast =
    baseResult?.forecast?.forecast_rate ??
    baseResult?.forecast?.forecast_freight_rate ??
    0;

  const baseCost =
    baseResult?.cost?.total_expected_cost ??
    0;

  const baseRisk =
    baseResult?.risk?.risk_score ??
    0;

  const baseRiskLevel =
    baseResult?.risk?.risk_level ??
    "UNKNOWN";

  const baseTrend =
    baseResult?.forecast?.trend ??
    "UNKNOWN";

  const baseFeasibleVessels =
    baseResult?.feasibility?.feasible_vessel_count ??
    0;

  const baseTotalVessels =
    baseResult?.feasibility?.total_vessels_checked ??
    0;

  // --------------------------------------------------
  // SCENARIO VALUES
  // --------------------------------------------------

  const scenarioDecision =
    scenarioResult?.decision ??
    scenarioResult?.scenario_decision ??
    "--";

  const scenarioForecast =
    scenarioResult?.scenario_freight_rate ??
    scenarioResult?.scenario_forecast
      ?.forecast_freight_rate ??
    scenarioResult?.forecast
      ?.forecast_freight_rate ??
    scenarioResult?.base_forecast
      ?.forecast_freight_rate ??
    baseForecast;

  const scenarioCost =
    scenarioResult?.scenario_total_cost ??
    scenarioResult?.scenario_cost
      ?.total_expected_cost ??
    scenarioResult?.cost
      ?.total_expected_cost ??
    scenarioResult?.total_expected_cost ??
    baseCost;

  const scenarioRisk =
    scenarioResult?.risk?.risk_score ??
    scenarioResult?.scenario_risk?.risk_score ??
    baseRisk;

  const scenarioRiskLevel =
    scenarioResult?.risk?.risk_level ??
    scenarioResult?.scenario_risk?.risk_level ??
    baseRiskLevel;

  // --------------------------------------------------
  // COMPARISON
  // --------------------------------------------------

  const costDifference =
    scenarioCost - baseCost;

  const freightDifference =
    scenarioForecast - baseForecast;

  const riskDifference =
    scenarioRisk - baseRisk;

  const decisionChanged =
    baseDecision !== scenarioDecision;

  // --------------------------------------------------
  // EXPLANATION
  // --------------------------------------------------

  const getDecisionExplanation = () => {
    if (decisionChanged) {
      if (
        scenarioDecision === "BOOK" &&
        baseDecision !== "BOOK"
      ) {
        return `The scenario improves the chartering outlook. Freight assumptions changed by ${freightChange}%, while the operational delay assumption is ${delayDays} day(s). The resulting cost and risk profile is more favorable for booking.`;
      }

      if (
        scenarioDecision === "WAIT" &&
        baseDecision === "BOOK"
      ) {
        return "The scenario increases exposure to changing market or operational conditions. The system therefore shifts from BOOK NOW to WAIT to avoid committing under a less favorable scenario.";
      }

      if (scenarioDecision === "AVOID") {
        return "The scenario creates an unfavorable risk or operational condition. The system recommends avoiding the option rather than proceeding with the charter.";
      }

      return "The recommendation changed because the scenario assumptions altered the calculated freight, expected cost and/or risk indicators.";
    }

    if (
      freightChange === 0 &&
      delayDays === 0 &&
      fuelChange === 0
    ) {
      return "No scenario assumptions have been changed. The system is showing the baseline procurement recommendation for this cargo movement.";
    }

    return `The recommendation remains ${getDecisionLabel(
      baseDecision
    )} despite the changed assumptions. The current scenario does not cross the decision thresholds used by the decision-support engine.`;
  };

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------

  if (loading && !scenarioResult) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="text-center">
          <FiRefreshCw
            className="mx-auto text-blue-600 animate-spin"
            size={30}
          />

          <p className="mt-3 text-sm text-slate-500">
            Running scenario analysis...
          </p>
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // ERROR
  // --------------------------------------------------

  if (error && !scenarioResult) {
    return (
      <div className="p-6 border border-red-200 rounded-xl bg-red-50">
        <div className="flex items-center gap-3">
          <FiAlertTriangle
            className="text-red-600"
            size={22}
          />

          <div>
            <h2 className="font-semibold text-red-800">
              What-If Analysis Failed
            </h2>

            <p className="mt-1 text-sm text-red-700">
              {error}
            </p>
          </div>
        </div>

        <button
          onClick={fetchAnalysis}
          className="px-4 py-2 mt-4 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  const scenarioDecisionStyle =
    getDecisionStyle(scenarioDecision);

  return (
    <div className="min-h-screen p-8 bg-slate-100">

      {/* HEADER */}

      <div className="flex flex-col justify-between gap-4 mb-8 lg:flex-row lg:items-center">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center text-white bg-blue-600 h-11 w-11 rounded-xl">
            <FiSliders size={22} />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              What-If Analysis
            </h1>

            <p className="text-sm text-slate-500">
              Stress-test chartering decisions under changing
              market and operational conditions
            </p>
          </div>
        </div>

        <div className="px-4 py-3 bg-white border rounded-lg border-slate-200">
          <p className="text-xs text-slate-500">
            Active Analysis
          </p>

          <p className="mt-1 text-sm font-semibold text-slate-800">
            {analysis?.route || "--"} •{" "}
            {Number(
              analysis?.cargo_quantity || 0
            ).toLocaleString()}{" "}
            MT
          </p>
        </div>
      </div>

      {/* CURRENT ANALYSIS */}

      <div className="p-5 mb-6 bg-white border shadow-sm rounded-xl border-slate-200">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-5">

          <div>
            <p className="text-xs tracking-wide uppercase text-slate-500">
              Route
            </p>

            <p className="mt-1 font-semibold text-slate-800">
              {analysis?.origin || "--"} →{" "}
              {analysis?.destination || "--"}
            </p>
          </div>

          <div>
            <p className="text-xs tracking-wide uppercase text-slate-500">
              Cargo
            </p>

            <p className="mt-1 font-semibold text-slate-800">
              {Number(
                analysis?.cargo_quantity || 0
              ).toLocaleString()}{" "}
              MT
            </p>
          </div>

          <div>
            <p className="text-xs tracking-wide uppercase text-slate-500">
              Base Freight
            </p>

            <p className="mt-1 font-semibold text-slate-800">
              {formatCurrency(baseForecast)}/MT
            </p>
          </div>

          <div>
            <p className="text-xs tracking-wide uppercase text-slate-500">
              Base Decision
            </p>

            <span className="inline-block px-3 py-1 mt-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-700">
              {getDecisionLabel(baseDecision)}
            </span>
          </div>

          <div>
            <p className="text-xs tracking-wide uppercase text-slate-500">
              Feasible Vessels
            </p>

            <p className="mt-1 font-semibold text-slate-800">
              {baseFeasibleVessels} /{" "}
              {baseTotalVessels}
            </p>
          </div>

        </div>
      </div>

      {/* SCENARIO CONTROLS */}

      <div className="p-6 mb-6 bg-white border shadow-sm rounded-xl border-slate-200">

        <div className="flex flex-col justify-between gap-4 mb-7 md:flex-row md:items-center">

          <div>
            <h2 className="text-lg font-semibold text-slate-800">
              Scenario Parameters
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Change assumptions and observe how the chartering
              recommendation responds.
            </p>
          </div>

          <button
            onClick={resetScenario}
            className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium border rounded-lg border-slate-200 text-slate-600 hover:bg-slate-50"
          >
            <FiRefreshCw size={15} />
            Reset Scenario
          </button>

        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">

          {/* FREIGHT */}

          <div>
            <div className="flex items-center justify-between mb-3">

              <div className="flex items-center gap-2">
                <FiTrendingUp
                  className="text-blue-600"
                  size={17}
                />

                <span className="text-sm font-medium text-slate-700">
                  Freight Rate
                </span>
              </div>

              <span className="font-bold text-blue-600">
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
                setFreightChange(
                  Number(e.target.value)
                )
              }
              className="w-full accent-blue-600"
            />

            <div className="flex justify-between mt-2 text-xs text-slate-400">
              <span>-20%</span>
              <span>0%</span>
              <span>+30%</span>
            </div>
          </div>

          {/* DELAY */}

          <div>
            <div className="flex items-center justify-between mb-3">

              <div className="flex items-center gap-2">
                <FiClock
                  className="text-amber-600"
                  size={17}
                />

                <span className="text-sm font-medium text-slate-700">
                  Port / Vessel Delay
                </span>
              </div>

              <span className="font-bold text-amber-600">
                {delayDays} days
              </span>

            </div>

            <input
              type="range"
              min="0"
              max="14"
              value={delayDays}
              onChange={(e) =>
                setDelayDays(
                  Number(e.target.value)
                )
              }
              className="w-full accent-amber-500"
            />

            <div className="flex justify-between mt-2 text-xs text-slate-400">
              <span>0 days</span>
              <span>7 days</span>
              <span>14 days</span>
            </div>
          </div>

          {/* FUEL */}

          <div>
            <div className="flex items-center justify-between mb-3">

              <div className="flex items-center gap-2">
                <FiDollarSign
                  className="text-slate-600"
                  size={17}
                />

                <span className="text-sm font-medium text-slate-700">
                  Fuel Cost
                </span>
              </div>

              <span className="font-bold text-slate-700">
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
                setFuelChange(
                  Number(e.target.value)
                )
              }
              className="w-full accent-slate-600"
            />

            <div className="flex justify-between mt-2 text-xs text-slate-400">
              <span>-20%</span>
              <span>0%</span>
              <span>+30%</span>
            </div>
          </div>

        </div>
      </div>

      {/* BASE VS SCENARIO */}

      <div className="grid grid-cols-1 gap-6 mb-6 lg:grid-cols-2">

        {/* BASE */}

        <div className="p-6 bg-white border shadow-sm rounded-xl border-slate-200">

          <div className="flex items-center justify-between mb-5">

            <div>
              <p className="text-xs font-semibold tracking-wide uppercase text-slate-400">
                Baseline
              </p>

              <h2 className="mt-1 text-lg font-semibold text-slate-800">
                Current Recommendation
              </h2>
            </div>

            <div className="p-2 rounded-lg bg-slate-100">
              <FiActivity
                className="text-slate-600"
                size={20}
              />
            </div>

          </div>

          <div className="grid grid-cols-2 gap-4">

            <div className="p-4 rounded-lg bg-slate-50">
              <p className="text-xs text-slate-500">
                Freight
              </p>

              <p className="mt-2 text-xl font-bold text-slate-800">
                {formatCurrency(baseForecast)}
              </p>

              <p className="text-xs text-slate-400">
                per MT
              </p>
            </div>

            <div className="p-4 rounded-lg bg-slate-50">
              <p className="text-xs text-slate-500">
                Expected Cost
              </p>

              <p className="mt-2 text-xl font-bold text-slate-800">
                {formatMillions(baseCost)}
              </p>
            </div>

            <div className="p-4 rounded-lg bg-slate-50">
              <p className="text-xs text-slate-500">
                Risk
              </p>

              <p className="mt-2 text-xl font-bold text-slate-800">
                {baseRisk}/100
              </p>

              <span
                className={`mt-1 inline-block rounded-full px-2 py-1 text-[10px] font-bold ${getRiskStyle(
                  baseRiskLevel
                )}`}
              >
                {baseRiskLevel}
              </span>
            </div>

            <div className="p-4 rounded-lg bg-slate-50">
              <p className="text-xs text-slate-500">
                Market Trend
              </p>

              <p className="mt-2 text-xl font-bold text-slate-800">
                {baseTrend}
              </p>
            </div>

          </div>

          <div className="p-4 mt-5 border rounded-lg border-amber-200 bg-amber-50">
            <p className="text-xs font-semibold text-amber-700">
              BASE DECISION
            </p>

            <p className="mt-1 text-xl font-bold text-amber-700">
              {getDecisionLabel(baseDecision)}
            </p>
          </div>

        </div>

        {/* SCENARIO */}

        <div className="p-6 bg-white border border-blue-200 shadow-sm rounded-xl">

          <div className="flex items-center justify-between mb-5">

            <div>
              <p className="text-xs font-semibold tracking-wide text-blue-500 uppercase">
                Simulated Scenario
              </p>

              <h2 className="mt-1 text-lg font-semibold text-slate-800">
                Revised Recommendation
              </h2>
            </div>

            <div className="p-2 rounded-lg bg-blue-50">
              <FiSliders
                className="text-blue-600"
                size={20}
              />
            </div>

          </div>

          <div className="grid grid-cols-2 gap-4">

            <div className="p-4 rounded-lg bg-blue-50">
              <p className="text-xs text-slate-500">
                Scenario Freight
              </p>

              <p className="mt-2 text-xl font-bold text-slate-800">
                {formatCurrency(scenarioForecast)}
              </p>

              <p className="text-xs text-slate-400">
                per MT
              </p>
            </div>

            <div className="p-4 rounded-lg bg-blue-50">
              <p className="text-xs text-slate-500">
                Scenario Cost
              </p>

              <p className="mt-2 text-xl font-bold text-slate-800">
                {formatMillions(scenarioCost)}
              </p>
            </div>

            <div className="p-4 rounded-lg bg-blue-50">
              <p className="text-xs text-slate-500">
                Scenario Risk
              </p>

              <p className="mt-2 text-xl font-bold text-slate-800">
                {scenarioRisk}/100
              </p>

              <span
                className={`mt-1 inline-block rounded-full px-2 py-1 text-[10px] font-bold ${getRiskStyle(
                  scenarioRiskLevel
                )}`}
              >
                {scenarioRiskLevel}
              </span>
            </div>

            <div className="p-4 rounded-lg bg-blue-50">
              <p className="text-xs text-slate-500">
                Cost Impact
              </p>

              <p
                className={`mt-2 text-xl font-bold ${
                  costDifference > 0
                    ? "text-red-600"
                    : costDifference < 0
                    ? "text-green-600"
                    : "text-slate-800"
                }`}
              >
                {costDifference > 0 ? "+" : ""}
                {formatCurrency(costDifference)}
              </p>
            </div>

          </div>

          <div
            className={`mt-5 rounded-lg border p-4 ${scenarioDecisionStyle.bg} ${scenarioDecisionStyle.border}`}
          >
            <p
              className={`text-xs font-semibold ${scenarioDecisionStyle.text}`}
            >
              SCENARIO DECISION
            </p>

            <div className="flex items-center gap-2 mt-1">
              {scenarioDecisionStyle.icon}

              <p
                className={`text-xl font-bold ${scenarioDecisionStyle.text}`}
              >
                {getDecisionLabel(
                  scenarioDecision
                )}
              </p>
            </div>
          </div>

        </div>

      </div>

      {/* IMPACT COMPARISON */}

      <div className="p-6 mb-6 bg-white border shadow-sm rounded-xl border-slate-200">

        <div className="mb-5">
          <h2 className="text-lg font-semibold text-slate-800">
            Scenario Impact
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Quantified difference between the baseline and simulated scenario.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

          {/* FREIGHT IMPACT */}

          <div className="p-4 border rounded-lg border-slate-100">

            <p className="text-xs tracking-wide uppercase text-slate-400">
              Freight Impact
            </p>

            <div className="flex items-center gap-3 mt-3">
              <span className="font-semibold text-slate-700">
                {formatCurrency(baseForecast)}
              </span>

              <FiArrowRight
                className="text-slate-400"
                size={17}
              />

              <span className="font-bold text-slate-800">
                {formatCurrency(scenarioForecast)}
              </span>
            </div>

            <p
              className={`mt-2 text-sm font-semibold ${
                freightDifference > 0
                  ? "text-red-600"
                  : freightDifference < 0
                  ? "text-green-600"
                  : "text-slate-500"
              }`}
            >
              {freightDifference > 0 ? "+" : ""}
              {formatCurrency(freightDifference)} / MT
            </p>

          </div>

          {/* COST IMPACT */}

          <div className="p-4 border rounded-lg border-slate-100">

            <p className="text-xs tracking-wide uppercase text-slate-400">
              Cost Impact
            </p>

            <div className="flex items-center gap-3 mt-3">
              <span className="font-semibold text-slate-700">
                {formatMillions(baseCost)}
              </span>

              <FiArrowRight
                className="text-slate-400"
                size={17}
              />

              <span className="font-bold text-slate-800">
                {formatMillions(scenarioCost)}
              </span>
            </div>

            <p
              className={`mt-2 text-sm font-semibold ${
                costDifference > 0
                  ? "text-red-600"
                  : costDifference < 0
                  ? "text-green-600"
                  : "text-slate-500"
              }`}
            >
              {costDifference > 0 ? "+" : ""}
              {formatCurrency(costDifference)}
            </p>

          </div>

          {/* RISK IMPACT */}

          <div className="p-4 border rounded-lg border-slate-100">

            <p className="text-xs tracking-wide uppercase text-slate-400">
              Risk Impact
            </p>

            <div className="flex items-center gap-3 mt-3">
              <span className="font-semibold text-slate-700">
                {baseRisk}
              </span>

              <FiArrowRight
                className="text-slate-400"
                size={17}
              />

              <span className="font-bold text-slate-800">
                {scenarioRisk}
              </span>
            </div>

            <p
              className={`mt-2 text-sm font-semibold ${
                riskDifference > 0
                  ? "text-red-600"
                  : riskDifference < 0
                  ? "text-green-600"
                  : "text-slate-500"
              }`}
            >
              {riskDifference > 0 ? "+" : ""}
              {riskDifference} points
            </p>

          </div>

        </div>
      </div>

      {/* WHY DECISION CHANGED */}

      <div
        className={`mb-6 rounded-xl border p-6 ${
          decisionChanged
            ? "border-blue-200 bg-blue-50"
            : "border-slate-200 bg-white"
        }`}
      >

        <div className="flex items-start gap-4">

          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
              decisionChanged
                ? "bg-blue-600 text-white"
                : "bg-slate-100 text-slate-600"
            }`}
          >
            <FiActivity size={21} />
          </div>

          <div className="flex-1">

            <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">

              <div>
                <h2 className="text-lg font-semibold text-slate-800">
                  Why Did the Recommendation{" "}
                  {decisionChanged
                    ? "Change?"
                    : "Stay the Same?"}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Explainable decision-support output for procurement review.
                </p>
              </div>

              <div
                className={`rounded-full px-4 py-2 text-xs font-bold ${
                  decisionChanged
                    ? "bg-blue-100 text-blue-700"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {decisionChanged
                  ? "DECISION CHANGED"
                  : "DECISION UNCHANGED"}
              </div>

            </div>

            <p className="mt-5 text-sm leading-7 text-slate-700">
              {getDecisionExplanation()}
            </p>

            <div className="grid grid-cols-1 gap-3 mt-5 md:grid-cols-3">

              <div className="p-3 rounded-lg bg-white/80">
                <p className="text-xs text-slate-400">
                  Freight assumption
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-700">
                  {freightChange > 0 ? "+" : ""}
                  {freightChange}%
                </p>
              </div>

              <div className="p-3 rounded-lg bg-white/80">
                <p className="text-xs text-slate-400">
                  Delay assumption
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-700">
                  {delayDays} day(s)
                </p>
              </div>

              <div className="p-3 rounded-lg bg-white/80">
                <p className="text-xs text-slate-400">
                  Fuel assumption
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-700">
                  {fuelChange > 0 ? "+" : ""}
                  {fuelChange}%
                </p>
              </div>

            </div>

          </div>
        </div>
      </div>

      {/* PROCUREMENT EXPLANATION */}

      <div className="p-5 bg-white border shadow-sm rounded-xl border-slate-200">

        <div className="flex items-start gap-3">

          <FiAnchor
            className="mt-1 text-blue-600 shrink-0"
            size={19}
          />

          <div>
            <h3 className="text-sm font-semibold text-slate-800">
              Procurement Decision Support
            </h3>

            <p className="mt-1 text-sm leading-6 text-slate-500">
              What-If analysis helps procurement teams understand
              how sensitive a chartering recommendation is to freight
              market movements, fuel exposure and operational delays.
              The system provides explainable decision support; final
              commercial approval remains with the authorized
              procurement team.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}

export default WhatIf;
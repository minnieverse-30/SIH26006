import { API_BASE_URL } from "../config/api";
import { useEffect, useState } from "react";

import {
  FiActivity,
  FiAnchor,
  FiAlertTriangle,
  FiArrowRight,
  FiCheckCircle,
  FiClock,
  FiDollarSign,
  FiRefreshCw,
  FiShield,
  FiTrendingDown,
  FiTrendingUp,
  FiXCircle,
} from "react-icons/fi";

function Dashboard() {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ============================================================
  // LOAD SAVED ANALYSIS FROM DATABASE
  // ============================================================

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const analysisId = sessionStorage.getItem(
        "saylivAnalysisId"
      );

      if (!analysisId) {
        throw new Error(
          "No analysis found. Please run a new chartering analysis first."
        );
      }

      const response = await fetch(
        `${API_BASE_URL}/api/analyses/${analysisId}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Unable to load saved analysis."
        );
      }

      if (!data.data) {
        throw new Error(
          "Analysis data is missing from the server response."
        );
      }

      setAnalysis(data.data);

      console.log(
        "Dashboard loaded analysis:",
        data.data
      );
    } catch (err) {
      console.error("DASHBOARD ERROR:", err);

      setError(
        err.message ||
          "Unable to load SAYLIV analysis."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  // ============================================================
  // FORMATTERS
  // ============================================================

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

  // ============================================================
  // DECISION CONFIG
  // ============================================================

  const getDecisionConfig = (decision) => {
    switch (decision) {
      case "BOOK":
        return {
          label: "BOOK NOW",
          bg: "bg-green-50",
          border: "border-green-200",
          text: "text-green-700",
          icon: FiCheckCircle,
        };

      case "WAIT":
        return {
          label: "WAIT",
          bg: "bg-amber-50",
          border: "border-amber-200",
          text: "text-amber-700",
          icon: FiClock,
        };

      case "AVOID":
        return {
          label: "AVOID",
          bg: "bg-red-50",
          border: "border-red-200",
          text: "text-red-700",
          icon: FiXCircle,
        };

      default:
        return {
          label: "--",
          bg: "bg-slate-50",
          border: "border-slate-200",
          text: "text-slate-700",
          icon: FiActivity,
        };
    }
  };

  const getRiskClass = (level) => {
    if (level === "LOW") {
      return "bg-green-100 text-green-700";
    }

    if (level === "MEDIUM") {
      return "bg-amber-100 text-amber-700";
    }

    if (level === "HIGH") {
      return "bg-red-100 text-red-700";
    }

    return "bg-slate-100 text-slate-600";
  };

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="text-center">
          <FiRefreshCw
            className="mx-auto text-blue-600 animate-spin"
            size={32}
          />

          <p className="mt-3 text-sm text-slate-500">
            Loading chartering intelligence...
          </p>
        </div>
      </div>
    );
  }

  // ============================================================
  // ERROR
  // ============================================================

  if (error) {
    return (
      <div className="p-6 border border-red-200 rounded-xl bg-red-50">
        <div className="flex items-start gap-3">
          <FiAlertTriangle
            className="mt-0.5 text-red-600"
            size={22}
          />

          <div>
            <h2 className="font-semibold text-red-800">
              Dashboard Data Unavailable
            </h2>

            <p className="mt-1 text-sm text-red-700">
              {error}
            </p>
          </div>
        </div>

        <button
          onClick={loadDashboard}
          className="flex items-center gap-2 px-4 py-2 mt-4 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
        >
          <FiRefreshCw size={15} />
          Retry
        </button>
      </div>
    );
  }

  // ============================================================
  // DATABASE DATA MAPPING
  // ============================================================

  const decisionConfig = getDecisionConfig(
    analysis?.decision
  );

  const DecisionIcon = decisionConfig.icon;

  const forecastRate =
    analysis?.forecast_rate ?? 0;

  const trend =
    analysis?.forecast_trend ?? "UNKNOWN";

  const confidence =
    analysis?.decision_confidence ?? "UNKNOWN";

  const totalCost =
    analysis?.total_expected_cost ?? 0;

  const costPerTonne =
    analysis?.expected_cost_per_tonne ?? 0;

  const riskScore =
    analysis?.risk_score ?? 0;

  const riskLevel =
    analysis?.risk_level ?? "UNKNOWN";

  return (
    <div className="space-y-6">

      {/* ========================================================
          HEADER
      ======================================================== */}

      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <p className="text-xs font-semibold tracking-widest text-blue-600 uppercase">
            SAYLIV
          </p>

          <h1 className="mt-1 text-2xl font-bold text-slate-800">
            Executive Command Center
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            AI-powered freight and vessel chartering intelligence
          </p>
        </div>

        <button
          onClick={loadDashboard}
          className="flex items-center self-start gap-2 px-4 py-2 text-sm font-medium bg-white border rounded-lg shadow-sm border-slate-200 text-slate-600 hover:bg-slate-50"
        >
          <FiRefreshCw size={15} />
          Refresh Analysis
        </button>
      </div>

      {/* ========================================================
          ACTIVE ANALYSIS
      ======================================================== */}

      <div className="p-5 bg-white border shadow-sm rounded-xl border-slate-200">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">

          <div>
            <p className="text-xs font-semibold tracking-wide uppercase text-slate-400">
              Active Chartering Analysis
            </p>

            <div className="flex flex-wrap items-center gap-3 mt-2">

              <span className="rounded-lg bg-slate-800 px-3 py-1.5 text-sm font-bold text-white">
                {analysis?.route || "--"}
              </span>

              <span className="font-semibold text-slate-800">
                {analysis?.origin || "--"}
              </span>

              <FiArrowRight
                className="text-slate-400"
                size={17}
              />

              <span className="font-semibold text-slate-800">
                {analysis?.destination || "--"}
              </span>

            </div>
          </div>

          <div className="flex flex-wrap gap-3">

            <div className="px-4 py-2 rounded-lg bg-slate-50">
              <p className="text-[10px] uppercase tracking-wide text-slate-400">
                Cargo
              </p>

              <p className="text-sm font-bold text-slate-700">
                {Number(
                  analysis?.cargo_quantity || 0
                ).toLocaleString()}{" "}
                MT
              </p>
            </div>

            <div className="px-4 py-2 rounded-lg bg-slate-50">
              <p className="text-[10px] uppercase tracking-wide text-slate-400">
                Status
              </p>

              <p className="flex items-center gap-1.5 text-sm font-bold text-green-700">
                <span className="h-1.5 w-1.5 rounded-full bg-green-600" />
                LIVE
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* ========================================================
          DECISION BANNER
      ======================================================== */}

      <div
        className={`rounded-xl border p-6 shadow-sm ${decisionConfig.bg} ${decisionConfig.border}`}
      >
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">

          <div className="flex items-start gap-4">

            <div className="p-3 bg-white shadow-sm rounded-xl">
              <DecisionIcon
                className={decisionConfig.text}
                size={28}
              />
            </div>

            <div>

              <p className="text-xs font-bold tracking-widest uppercase text-slate-500">
                Recommended Procurement Action
              </p>

              <h2
                className={`mt-1 text-3xl font-black ${decisionConfig.text}`}
              >
                {decisionConfig.label}
              </h2>

              <p className="max-w-2xl mt-2 text-sm leading-6 text-slate-600">
                {analysis?.decision === "WAIT"
                  ? "Current operational and market risk is high."
                  : analysis?.decision === "BOOK"
                  ? "Current market conditions support chartering."
                  : analysis?.decision === "AVOID"
                  ? "Current constraints do not support chartering."
                  : "Recommendation generated from current analysis."}
              </p>

            </div>

          </div>

          <div className="px-6 py-4 text-center rounded-xl bg-white/80">

            <p className="text-xs tracking-wide uppercase text-slate-500">
              Confidence
            </p>

            <p className="mt-1 text-xl font-bold text-slate-800">
              {analysis?.decision_confidence || "--"}
            </p>

          </div>

        </div>
      </div>

      {/* ========================================================
          KPI CARDS
      ======================================================== */}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">

        {/* FREIGHT */}

        <div className="p-5 bg-white border shadow-sm rounded-xl border-slate-200">

          <div className="flex items-center justify-between">

            <div className="p-2 rounded-lg bg-blue-50">
              {trend === "FALLING" ? (
                <FiTrendingDown
                  className="text-blue-600"
                  size={19}
                />
              ) : (
                <FiTrendingUp
                  className="text-blue-600"
                  size={19}
                />
              )}
            </div>

            <span
              className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                trend === "FALLING"
                  ? "bg-green-100 text-green-700"
                  : trend === "RISING"
                  ? "bg-red-100 text-red-700"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              {trend}
            </span>

          </div>

          <p className="mt-4 text-xs tracking-wide uppercase text-slate-400">
            Freight Forecast
          </p>

          <p className="mt-1 text-2xl font-bold text-slate-800">
            {formatCurrency(forecastRate)}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            per metric tonne
          </p>

        </div>

        {/* COST */}

        <div className="p-5 bg-white border shadow-sm rounded-xl border-slate-200">

          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-slate-100">
            <FiDollarSign
              className="text-slate-700"
              size={19}
            />
          </div>

          <p className="mt-4 text-xs tracking-wide uppercase text-slate-400">
            Expected Cost
          </p>

          <p className="mt-1 text-2xl font-bold text-slate-800">
            {formatMillions(totalCost)}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            {formatCurrency(costPerTonne)} / MT
          </p>

        </div>

        {/* VESSELS */}

        <div className="p-5 bg-white border shadow-sm rounded-xl border-slate-200">

          <div className="flex items-center justify-between">

            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-slate-100">
              <FiAnchor
                className="text-slate-700"
                size={19}
              />
            </div>

            <span className="text-xs font-semibold text-green-600">
              {analysis?.vessel_availability ||
                "UNKNOWN"}
            </span>

          </div>

          <p className="mt-4 text-xs tracking-wide uppercase text-slate-400">
            Vessel Feasibility
          </p>

          <p className="mt-1 text-2xl font-bold text-slate-800">
            -- / --
          </p>

          <p className="mt-1 text-xs text-slate-500">
            view vessel analysis for details
          </p>

        </div>

        {/* RISK */}

        <div className="p-5 bg-white border shadow-sm rounded-xl border-slate-200">

          <div className="flex items-center justify-between">

            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-slate-100">
              <FiShield
                className="text-slate-700"
                size={19}
              />
            </div>

            <span
              className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getRiskClass(
                riskLevel
              )}`}
            >
              {riskLevel}
            </span>

          </div>

          <p className="mt-4 text-xs tracking-wide uppercase text-slate-400">
            Risk Score
          </p>

          <p className="mt-1 text-2xl font-bold text-slate-800">
            {riskScore}
            <span className="text-sm font-medium text-slate-400">
              /100
            </span>
          </p>

          <p className="mt-1 text-xs text-slate-500">
            composite risk exposure
          </p>

        </div>

      </div>

      {/* ========================================================
          TWO COLUMN INTELLIGENCE
      ======================================================== */}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

        {/* MARKET */}

        <div className="p-6 bg-white border shadow-sm rounded-xl border-slate-200">

          <div className="flex items-center gap-3">

            <div className="p-2 rounded-lg bg-blue-50">
              <FiActivity
                className="text-blue-600"
                size={19}
              />
            </div>

            <div>
              <h2 className="font-semibold text-slate-800">
                Market Intelligence
              </h2>

              <p className="text-xs text-slate-500">
                Current freight outlook
              </p>
            </div>

          </div>

          <div className="mt-5 space-y-4">

            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <span className="text-sm text-slate-500">
                Forecast Rate
              </span>

              <span className="font-semibold text-slate-800">
                {formatCurrency(forecastRate)} / MT
              </span>
            </div>

            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <span className="text-sm text-slate-500">
                Market Direction
              </span>

              <span
                className={`font-semibold ${
                  trend === "FALLING"
                    ? "text-green-600"
                    : trend === "RISING"
                    ? "text-red-600"
                    : "text-slate-700"
                }`}
              >
                {trend}
              </span>
            </div>

            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <span className="text-sm text-slate-500">
                Forecast Confidence
              </span>

              <span className="font-semibold text-slate-800">
                {confidence}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">
                Model
              </span>

              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-slate-100 text-slate-600">
                BASELINE
              </span>
            </div>

          </div>

          {confidence === "LOW" && (
            <div className="flex gap-3 p-4 mt-5 border rounded-lg border-amber-200 bg-amber-50">

              <FiAlertTriangle
                className="mt-0.5 shrink-0 text-amber-600"
                size={17}
              />

              <p className="text-xs leading-5 text-amber-800">
                Forecast confidence is limited because
                the current historical dataset is small.
                Use the forecast as decision support, not
                as a guaranteed market rate.
              </p>

            </div>
          )}

        </div>

        {/* DATABASE STATUS */}

        <div className="p-6 bg-white border shadow-sm rounded-xl border-slate-200">

          <div className="flex items-center gap-3">

            <div className="p-2 rounded-lg bg-green-50">
              <FiActivity
                className="text-green-600"
                size={19}
              />
            </div>

            <div>
              <h2 className="font-semibold text-slate-800">
                Analysis Intelligence
              </h2>

              <p className="text-xs text-slate-500">
                Saved analysis from the configured database
              </p>
            </div>

          </div>

          <div className="mt-5 space-y-4">

            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <span className="text-sm text-slate-500">
                Analysis ID
              </span>

              <span className="font-semibold text-slate-800">
                #{analysis?.id || "--"}
              </span>
            </div>

            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <span className="text-sm text-slate-500">
                Vessel Availability
              </span>

              <span className="font-semibold text-slate-800">
                {analysis?.vessel_availability ||
                  "--"}
              </span>
            </div>

            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <span className="text-sm text-slate-500">
                Contract Flexibility
              </span>

              <span className="font-semibold text-slate-800">
                {analysis?.contract_flexibility ||
                  "--"}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">
                Data Source
              </span>

              <span className="px-3 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded-full">
                DATABASE
              </span>
            </div>

          </div>

        </div>

      </div>

      {/* ========================================================
          WHY THIS DECISION
      ======================================================== */}

      <div className="p-6 bg-white border shadow-sm rounded-xl border-slate-200">

        <div className="flex items-center gap-3">

          <div className="p-2 rounded-lg bg-blue-50">
            <FiShield
              className="text-blue-600"
              size={19}
            />
          </div>

          <div>

            <h2 className="font-semibold text-slate-800">
              Why This Decision?
            </h2>

            <p className="text-xs text-slate-500">
              Explainable decision engine output
            </p>

          </div>

        </div>

        <div className="grid grid-cols-1 gap-3 mt-5 md:grid-cols-2">

          <div className="flex items-start gap-3 p-4 rounded-lg bg-slate-50">

            <div className="flex items-center justify-center w-6 h-6 text-xs font-bold text-blue-700 bg-blue-100 rounded-full shrink-0">
              1
            </div>

            <p className="text-sm leading-6 text-slate-600">
              {analysis?.decision === "WAIT"
                ? "Current operational and market risk is high."
                : analysis?.decision === "BOOK"
                ? "Current market conditions support chartering."
                : analysis?.decision === "AVOID"
                ? "Current vessel or route constraints make chartering unsuitable."
                : "Recommendation generated from the current analysis."}
            </p>

          </div>

          <div className="flex items-start gap-3 p-4 rounded-lg bg-slate-50">

            <div className="flex items-center justify-center w-6 h-6 text-xs font-bold text-blue-700 bg-blue-100 rounded-full shrink-0">
              2
            </div>

            <p className="text-sm leading-6 text-slate-600">
              Decision confidence is{" "}
              <strong>
                {analysis?.decision_confidence ||
                  "UNKNOWN"}
              </strong>{" "}
              based on the available forecast and
              analysis data.
            </p>

          </div>

        </div>

      </div>

      {/* ========================================================
          SYSTEM STATUS
      ======================================================== */}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

        <div className="flex items-center gap-3 p-4 bg-white border rounded-xl border-slate-200">

          <div className="h-2.5 w-2.5 rounded-full bg-green-500" />

          <div>
            <p className="text-xs text-slate-400">
              Forecast Engine
            </p>

            <p className="text-sm font-semibold text-slate-700">
              Operational
            </p>
          </div>

        </div>

        <div className="flex items-center gap-3 p-4 bg-white border rounded-xl border-slate-200">

          <div className="h-2.5 w-2.5 rounded-full bg-green-500" />

          <div>
            <p className="text-xs text-slate-400">
              Vessel Engine
            </p>

            <p className="text-sm font-semibold text-slate-700">
              Operational
            </p>
          </div>

        </div>

        <div className="flex items-center gap-3 p-4 bg-white border rounded-xl border-slate-200">

          <div className="h-2.5 w-2.5 rounded-full bg-green-500" />

          <div>
            <p className="text-xs text-slate-400">
              Decision Engine
            </p>

            <p className="text-sm font-semibold text-slate-700">
              Operational
            </p>
          </div>

        </div>

      </div>

      {/* ========================================================
          DISCLAIMER
      ======================================================== */}

      <div className="p-4 border rounded-lg border-slate-200 bg-slate-50">

        <p className="text-xs leading-5 text-slate-500">

          <strong className="text-slate-600">
            Procurement advisory:
          </strong>{" "}

          SAYLIV provides analytical decision support
          based on available market, vessel, cost and risk
          data. Final charter approval, commercial negotiation
          and vessel nomination remain with the authorized
          procurement team.

        </p>

      </div>

    </div>
  );
}

export default Dashboard;
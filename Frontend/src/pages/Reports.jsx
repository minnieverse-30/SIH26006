import { API_BASE_URL } from "../config/api";
import { useEffect, useState } from "react";
import {
  FiFileText,
  FiDownload,
  FiRefreshCw,
  FiAnchor,
  FiTrendingDown,
  FiTrendingUp,
  FiDollarSign,
  FiAlertTriangle,
  FiCheckCircle,
  FiXCircle,
  FiShield,
  FiClock,
} from "react-icons/fi";

function Reports() {
  const [result, setResult] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const analysisId = sessionStorage.getItem("sailForgeAnalysisId");

  const fallbackAnalysis = {
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

  const fetchReportData = async () => {
    try {
      setLoading(true);
      setError("");

      let currentAnalysis = fallbackAnalysis;

      // ---------------------------------------------
      // GET ACTIVE ANALYSIS FROM DATABASE
      // ---------------------------------------------
      if (analysisId) {
        const analysisResponse = await fetch(
          `${API_BASE_URL}/api/analyses/${analysisId}`
        );

        const analysisData = await analysisResponse.json();

        if (!analysisResponse.ok) {
          throw new Error(
            analysisData.detail || "Unable to load saved analysis."
          );
        }

        currentAnalysis = analysisData.data || analysisData;
      }

      setAnalysis(currentAnalysis);

      // ---------------------------------------------
      // REGENERATE FULL DECISION REPORT
      // ---------------------------------------------
      const params = new URLSearchParams({
        route: currentAnalysis.route,
        cargo_quantity: currentAnalysis.cargo_quantity,
        origin: currentAnalysis.origin,
        destination: currentAnalysis.destination,
        fuel_cost: currentAnalysis.fuel_cost ?? 0,
        port_cost: currentAnalysis.port_cost ?? 0,
        idle_cost: currentAnalysis.idle_cost ?? 0,
        risk_cost: currentAnalysis.risk_cost ?? 0,
        port_delay_days: currentAnalysis.port_delay_days ?? 0,
        vessel_availability:
          currentAnalysis.vessel_availability || "HIGH",
        contract_flexibility:
          currentAnalysis.contract_flexibility || "FLEXIBLE",
      });

      const response = await fetch(
        `${API_BASE_URL}/api/decision?${params.toString()}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Unable to generate decision report."
        );
      }

      setResult(data.data);
    } catch (err) {
      console.error("REPORT ERROR:", err);

      setError(
        err.message || "Unable to generate procurement report."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData();
  }, []);

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

  const getDecisionStyle = (decision) => {
    if (decision === "BOOK") {
      return {
        bg: "bg-green-50",
        border: "border-green-200",
        text: "text-green-700",
        icon: (
          <FiCheckCircle
            className="text-green-600"
            size={28}
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
          <FiClock
            className="text-amber-600"
            size={28}
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
          size={28}
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

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="text-center">
          <FiRefreshCw
            className="mx-auto text-blue-600 animate-spin"
            size={30}
          />

          <p className="mt-3 text-sm text-slate-500">
            Generating procurement decision report...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 border border-red-200 rounded-xl bg-red-50">
        <div className="flex items-center gap-3">
          <FiAlertTriangle
            className="text-red-600"
            size={22}
          />

          <div>
            <h2 className="font-semibold text-red-800">
              Report Generation Failed
            </h2>

            <p className="mt-1 text-sm text-red-700">
              {error}
            </p>
          </div>
        </div>

        <button
          onClick={fetchReportData}
          className="flex items-center gap-2 px-4 py-2 mt-4 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
        >
          <FiRefreshCw size={15} />
          Retry
        </button>
      </div>
    );
  }

  const decisionStyle = getDecisionStyle(
    result?.decision
  );

  const feasibleVessels =
    result?.feasibility?.vessels || [];

  const feasibleCount =
    result?.feasibility?.feasible_vessel_count ?? 0;

  const totalVessels =
    result?.feasibility?.total_vessels_checked ?? 0;

  const forecastRate =
    result?.forecast?.forecast_rate ??
    result?.forecast?.forecast_freight_rate ??
    0;

  const trend =
    result?.forecast?.trend ?? "UNKNOWN";

  const confidence =
    result?.forecast?.confidence ?? "UNKNOWN";

  const totalCost =
    result?.cost?.total_expected_cost ?? 0;

  const costPerTonne =
    result?.cost?.expected_cost_per_tonne ?? 0;

  const riskScore =
    result?.risk?.risk_score ?? 0;

  const riskLevel =
    result?.risk?.risk_level ?? "UNKNOWN";

  const riskFactors =
    result?.risk?.risk_factors || [];

  const reasons =
    result?.reasons || [];

  return (
    <div className="min-h-screen p-8 bg-slate-100">

      {/* HEADER */}
      <div className="flex flex-col justify-between gap-5 mb-6 lg:flex-row lg:items-start">

        <div className="flex items-start gap-4">

          <div className="flex items-center justify-center w-12 h-12 text-white shrink-0 rounded-xl bg-slate-800">
            <FiFileText size={23} />
          </div>

          <div>
            <p className="text-xs font-semibold tracking-widest text-blue-600 uppercase">
              SAIL-FORGE
            </p>

            <h1 className="mt-1 text-2xl font-bold text-slate-800">
              Procurement Decision Report
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Freight forecasting and vessel chartering decision support
            </p>
          </div>

        </div>

        <div className="flex gap-3">

          <button
            onClick={fetchReportData}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-white border rounded-lg shadow-sm border-slate-200 text-slate-600 hover:bg-slate-50"
          >
            <FiRefreshCw size={15} />
            Refresh
          </button>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg shadow-sm bg-slate-800 hover:bg-slate-900"
          >
            <FiDownload size={15} />
            Print / Save Report
          </button>

        </div>

      </div>

      {/* REPORT META */}
      <div className="p-5 mb-6 bg-white border shadow-sm rounded-xl border-slate-200">

        <div className="grid grid-cols-1 gap-5 md:grid-cols-4">

          <div>
            <p className="text-xs tracking-wide uppercase text-slate-400">
              Analysis ID
            </p>

            <p className="mt-1 font-semibold text-slate-800">
              {analysisId || "LOCAL-ANALYSIS"}
            </p>
          </div>

          <div>
            <p className="text-xs tracking-wide uppercase text-slate-400">
              Route
            </p>

            <p className="mt-1 font-semibold text-slate-800">
              {analysis?.origin} → {analysis?.destination}
            </p>

            <p className="mt-1 text-xs text-slate-400">
              {analysis?.route}
            </p>
          </div>

          <div>
            <p className="text-xs tracking-wide uppercase text-slate-400">
              Cargo
            </p>

            <p className="mt-1 font-semibold text-slate-800">
              {Number(
                analysis?.cargo_quantity || 0
              ).toLocaleString()} MT
            </p>
          </div>

          <div>
            <p className="text-xs tracking-wide uppercase text-slate-400">
              System Status
            </p>

            <span className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
              <span className="h-1.5 w-1.5 rounded-full bg-green-600" />
              ANALYSIS COMPLETE
            </span>
          </div>

        </div>

      </div>

      {/* EXECUTIVE DECISION */}
      <div
        className={`mb-6 rounded-xl border p-6 shadow-sm ${decisionStyle.bg} ${decisionStyle.border}`}
      >

        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">

          <div className="flex items-start gap-4">

            <div className="mt-1">
              {decisionStyle.icon}
            </div>

            <div>

              <p className="text-xs font-bold tracking-widest uppercase text-slate-500">
                Procurement Recommendation
              </p>

              <h2
                className={`mt-1 text-3xl font-black ${decisionStyle.text}`}
              >
                {getDecisionLabel(result?.decision)}
              </h2>

              <p className="max-w-2xl mt-2 text-sm leading-6 text-slate-600">
                The recommendation is generated from freight trend,
                vessel feasibility, expected cost and operational risk.
              </p>

            </div>

          </div>

          <div className="px-6 py-4 text-center rounded-xl bg-white/80">

            <p className="text-xs tracking-wide uppercase text-slate-500">
              Decision Confidence
            </p>

            <p className="mt-1 text-xl font-bold text-slate-800">
              {result?.decision_confidence || "--"}
            </p>

          </div>

        </div>

      </div>

      {/* EXECUTIVE SUMMARY */}
      <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-2 lg:grid-cols-4">

        {/* FREIGHT */}
        <div className="p-5 bg-white border shadow-sm rounded-xl border-slate-200">

          <div className="flex items-center justify-between">

            <p className="text-xs tracking-wide uppercase text-slate-400">
              Freight Forecast
            </p>

            {trend === "FALLING" ? (
              <FiTrendingDown
                className="text-green-600"
                size={19}
              />
            ) : (
              <FiTrendingUp
                className="text-red-600"
                size={19}
              />
            )}

          </div>

          <p className="mt-3 text-2xl font-bold text-slate-800">
            {formatCurrency(forecastRate)}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            per MT
          </p>

          <span
            className={`mt-3 inline-block rounded-full px-2.5 py-1 text-xs font-semibold ${
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

        {/* COST */}
        <div className="p-5 bg-white border shadow-sm rounded-xl border-slate-200">

          <p className="text-xs tracking-wide uppercase text-slate-400">
            Expected Cost
          </p>

          <p className="mt-3 text-2xl font-bold text-slate-800">
            {formatMillions(totalCost)}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Total estimated exposure
          </p>

          <p className="mt-3 text-sm font-semibold text-slate-700">
            {formatCurrency(costPerTonne)} / MT
          </p>

        </div>

        {/* VESSEL */}
        <div className="p-5 bg-white border shadow-sm rounded-xl border-slate-200">

          <p className="text-xs tracking-wide uppercase text-slate-400">
            Vessel Feasibility
          </p>

          <p className="mt-3 text-2xl font-bold text-slate-800">
            {feasibleCount} / {totalVessels}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Suitable vessel options
          </p>

          <span className="mt-3 inline-block rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700">
            FEASIBLE
          </span>

        </div>

        {/* RISK */}
        <div className="p-5 bg-white border shadow-sm rounded-xl border-slate-200">

          <p className="text-xs tracking-wide uppercase text-slate-400">
            Risk Exposure
          </p>

          <p className="mt-3 text-2xl font-bold text-slate-800">
            {riskScore}/100
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Composite risk score
          </p>

          <span
            className={`mt-3 inline-block rounded-full px-2.5 py-1 text-xs font-semibold ${getRiskStyle(
              riskLevel
            )}`}
          >
            {riskLevel}
          </span>

        </div>

      </div>

      {/* MARKET + VESSEL */}
      <div className="grid grid-cols-1 gap-6 mb-6 lg:grid-cols-2">

        {/* MARKET */}
        <div className="p-6 bg-white border shadow-sm rounded-xl border-slate-200">

          <div className="flex items-center gap-3 mb-5">

            <div className="p-2 rounded-lg bg-blue-50">
              <FiTrendingUp
                className="text-blue-600"
                size={19}
              />
            </div>

            <div>
              <h2 className="font-semibold text-slate-800">
                Freight Market Outlook
              </h2>

              <p className="text-xs text-slate-500">
                Forecast engine output
              </p>
            </div>

          </div>

          <div className="grid grid-cols-2 gap-4">

            <div className="p-4 rounded-lg bg-slate-50">
              <p className="text-xs text-slate-500">
                Forecast Rate
              </p>

              <p className="mt-1 text-xl font-bold text-slate-800">
                {formatCurrency(forecastRate)}
              </p>

              <p className="text-xs text-slate-400">
                per MT
              </p>
            </div>

            <div className="p-4 rounded-lg bg-slate-50">
              <p className="text-xs text-slate-500">
                Market Trend
              </p>

              <p className="mt-1 text-xl font-bold text-slate-800">
                {trend}
              </p>
            </div>

            <div className="p-4 rounded-lg bg-slate-50">
              <p className="text-xs text-slate-500">
                Model Confidence
              </p>

              <p className="mt-1 text-xl font-bold text-slate-800">
                {confidence}
              </p>
            </div>

            <div className="p-4 rounded-lg bg-slate-50">
              <p className="text-xs text-slate-500">
                Model Status
              </p>

              <p className="mt-1 text-xl font-bold text-slate-800">
                {result?.forecast?.model_status || "BASELINE"}
              </p>
            </div>

          </div>

          <div className="p-4 mt-5 border rounded-lg border-amber-200 bg-amber-50">

            <p className="text-xs font-semibold text-amber-700">
              DATA QUALITY NOTE
            </p>

            <p className="mt-1 text-sm leading-6 text-amber-800">
              Forecast confidence is currently limited by the available
              historical observations. The result should be treated as
              decision support rather than a guaranteed future freight rate.
            </p>

          </div>

        </div>

        {/* VESSEL */}
        <div className="p-6 bg-white border shadow-sm rounded-xl border-slate-200">

          <div className="flex items-center gap-3 mb-5">

            <div className="p-2 rounded-lg bg-slate-100">
              <FiAnchor
                className="text-slate-700"
                size={19}
              />
            </div>

            <div>
              <h2 className="font-semibold text-slate-800">
                Vessel Feasibility
              </h2>

              <p className="text-xs text-slate-500">
                Constraint-based vessel screening
              </p>
            </div>

          </div>

          <div className="flex items-center justify-between p-4 mb-4 rounded-lg bg-slate-50">

            <div>
              <p className="text-xs text-slate-500">
                Suitable Vessels
              </p>

              <p className="mt-1 text-xl font-bold text-slate-800">
                {feasibleCount} of {totalVessels}
              </p>
            </div>

            <FiCheckCircle
              className="text-green-600"
              size={24}
            />

          </div>

          <div className="space-y-3">

            {feasibleVessels.length > 0 ? (
              feasibleVessels.map((vessel, index) => (
                <div
                  key={vessel.vessel_id || index}
                  className="flex items-center justify-between p-3 border rounded-lg border-slate-100"
                >

                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      {vessel.name ||
                        vessel.vessel_name ||
                        `Vessel ${index + 1}`}
                    </p>

                    <p className="text-xs text-slate-500">
                      {vessel.vessel_type ||
                        vessel.type ||
                        "Compatible vessel"}
                    </p>
                  </div>

                  <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700">
                    FEASIBLE
                  </span>

                </div>
              ))
            ) : (
              <div className="p-4 text-sm text-red-700 rounded-lg bg-red-50">
                No feasible vessel options found.
              </div>
            )}

          </div>

        </div>

      </div>

      {/* COST ANALYSIS */}
      <div className="p-6 mb-6 bg-white border shadow-sm rounded-xl border-slate-200">

        <div className="flex items-center gap-3 mb-5">

          <div className="p-2 rounded-lg bg-blue-50">
            <FiDollarSign
              className="text-blue-600"
              size={19}
            />
          </div>

          <div>
            <h2 className="font-semibold text-slate-800">
              Cost Exposure
            </h2>

            <p className="text-xs text-slate-500">
              Expected chartering cost for the selected cargo movement
            </p>
          </div>

        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

          <div className="p-4 border rounded-lg border-slate-100">

            <p className="text-xs text-slate-500">
              Freight Component
            </p>

            <p className="mt-2 text-lg font-bold text-slate-800">
              {formatCurrency(
                forecastRate *
                Number(analysis?.cargo_quantity || 0)
              )}
            </p>

          </div>

          <div className="p-4 border rounded-lg border-slate-100">

            <p className="text-xs text-slate-500">
              Total Expected Cost
            </p>

            <p className="mt-2 text-lg font-bold text-slate-800">
              {formatCurrency(totalCost)}
            </p>

          </div>

          <div className="p-4 border rounded-lg border-slate-100">

            <p className="text-xs text-slate-500">
              Expected Cost / MT
            </p>

            <p className="mt-2 text-lg font-bold text-slate-800">
              {formatCurrency(costPerTonne)}
            </p>

          </div>

        </div>

        <p className="mt-4 text-xs text-slate-400">
          Cost exposure is calculated from the current analysis inputs
          and the freight forecast returned by the decision engine.
        </p>

      </div>

      {/* RISK */}
      <div className="p-6 mb-6 bg-white border shadow-sm rounded-xl border-slate-200">

        <div className="flex items-center gap-3 mb-5">

          <div className="p-2 rounded-lg bg-slate-100">
            <FiShield
              className="text-slate-700"
              size={19}
            />
          </div>

          <div>
            <h2 className="font-semibold text-slate-800">
              Risk Assessment
            </h2>

            <p className="text-xs text-slate-500">
              Operational and market risk indicators
            </p>
          </div>

        </div>

        <div className="flex flex-col gap-5 md:flex-row md:items-center">

          <div className="flex flex-col items-center justify-center border-8 rounded-full h-28 w-28 shrink-0 border-slate-100">

            <p className="text-2xl font-bold text-slate-800">
              {riskScore}
            </p>

            <p className="text-[10px] text-slate-400">
              / 100
            </p>

          </div>

          <div className="flex-1">

            <div className="flex items-center gap-3">

              <h3 className="font-semibold text-slate-800">
                Overall Risk
              </h3>

              <span
                className={`rounded-full px-3 py-1 text-xs font-bold ${getRiskStyle(
                  riskLevel
                )}`}
              >
                {riskLevel}
              </span>

            </div>

            <div className="mt-4 space-y-2">

              {riskFactors.length > 0 ? (
                riskFactors.map((factor, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-2 text-sm text-slate-600"
                  >

                    <FiAlertTriangle
                      className="mt-0.5 shrink-0 text-amber-500"
                      size={15}
                    />

                    <span>
                      {typeof factor === "string"
                        ? factor
                        : factor.factor ||
                          factor.name ||
                          `Risk factor ${index + 1}`}
                    </span>

                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500">
                  No additional risk factors reported.
                </p>
              )}

            </div>

          </div>

        </div>

      </div>

      {/* DECISION RATIONALE */}
      <div className="p-6 mb-6 border border-blue-200 rounded-xl bg-blue-50">

        <div className="flex items-center gap-3 mb-5">

          <div className="p-2 text-white bg-blue-600 rounded-lg">
            <FiFileText size={18} />
          </div>

          <div>
            <h2 className="font-semibold text-blue-900">
              Decision Rationale
            </h2>

            <p className="text-xs text-blue-700">
              Explainable reasoning behind the recommendation
            </p>
          </div>

        </div>

        <div className="space-y-3">

          {reasons.length > 0 ? (
            reasons.map((reason, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-4 rounded-lg bg-white/80"
              >

                <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                  {index + 1}
                </div>

                <p className="text-sm leading-6 text-slate-700">
                  {reason}
                </p>

              </div>
            ))
          ) : (
            <p className="text-sm text-slate-600">
              No decision reasons were returned by the decision engine.
            </p>
          )}

        </div>

      </div>

      {/* FINAL ACTION */}
      <div
        className={`mb-6 rounded-xl border p-6 ${decisionStyle.border} ${decisionStyle.bg}`}
      >

        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">

          <div>

            <p className="text-xs font-bold tracking-widest uppercase text-slate-500">
              Recommended Procurement Action
            </p>

            <h2
              className={`mt-1 text-2xl font-black ${decisionStyle.text}`}
            >
              {getDecisionLabel(result?.decision)}
            </h2>

            <p className="max-w-3xl mt-2 text-sm leading-6 text-slate-600">
              Use this recommendation as an analytical input to the
              chartering process. Commercial approval, negotiation and
              final vessel nomination remain the responsibility of the
              authorized procurement team.
            </p>

          </div>

          <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-white/80">

            <FiShield
              className="text-slate-600"
              size={18}
            />

            <span className="text-xs font-medium text-slate-600">
              Human approval required
            </span>

          </div>

        </div>

      </div>

      {/* FOOTER */}
      <div className="pt-5 border-t border-slate-200">

        <div className="flex flex-col justify-between gap-3 text-xs text-slate-400 md:flex-row">

          <p>
            SAIL-FORGE • AI-Powered Freight Forecasting & Vessel
            Chartering Decision Support System
          </p>

          <p>
            Decision generated from current available data and model outputs.
          </p>

        </div>

      </div>

    </div>
  );
}

export default Reports;
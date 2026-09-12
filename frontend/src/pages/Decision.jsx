import { useEffect, useState } from "react";
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
  FiRefreshCw,
} from "react-icons/fi";

function Decision() {
  const [decisionData, setDecisionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Current analysis parameters
  const route = "C5";
  const cargoQuantity = 100000;
  const origin = "Tubarao";
  const destination = "Qingdao";

  const fetchDecision = async () => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams({
        route,
        cargo_quantity: cargoQuantity,
        origin,
        destination,
        fuel_cost: 0,
        port_cost: 0,
        idle_cost: 0,
        risk_cost: 0,
        port_delay_days: 0,
        vessel_availability: "AVAILABLE",
        contract_flexibility: "FLEXIBLE",
      });

      const response = await fetch(
        `http://127.0.0.1:8000/api/decision?${params.toString()}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Failed to load decision analysis"
        );
      }

      setDecisionData(data.data);
    } catch (err) {
      console.error("DECISION ERROR:", err);
      setError(err.message || "Unable to load decision analysis.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDecision();
  }, []);

  const formatCurrency = (value) => {
    if (value === undefined || value === null) return "--";

    return `$${Number(value).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const formatMillions = (value) => {
    if (value === undefined || value === null) return "--";

    return `$${(Number(value) / 1000000).toFixed(3)}M`;
  };

  const getDecisionStyle = (decision) => {
    switch (decision) {
      case "BOOK":
        return {
          bg: "bg-green-50",
          border: "border-green-200",
          iconBg: "bg-green-600",
          text: "text-green-700",
          icon: FiCheckCircle,
        };

      case "WAIT":
        return {
          bg: "bg-amber-50",
          border: "border-amber-200",
          iconBg: "bg-amber-500",
          text: "text-amber-700",
          icon: FiAlertTriangle,
        };

      case "AVOID":
        return {
          bg: "bg-red-50",
          border: "border-red-200",
          iconBg: "bg-red-600",
          text: "text-red-700",
          icon: FiXCircle,
        };

      default:
        return {
          bg: "bg-slate-50",
          border: "border-slate-200",
          iconBg: "bg-slate-600",
          text: "text-slate-700",
          icon: FiInfo,
        };
    }
  };

  const getRiskBadge = (level) => {
    if (level === "LOW") {
      return "bg-green-100 text-green-700";
    }

    if (level === "MEDIUM") {
      return "bg-amber-100 text-amber-700";
    }

    return "bg-red-100 text-red-700";
  };

  const getRiskIcon = (level) => {
    if (level === "LOW") return FiCheckCircle;
    if (level === "MEDIUM") return FiAlertTriangle;
    return FiXCircle;
  };

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
              Generating chartering decision...
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Combining forecast, vessel feasibility, cost and risk
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-8 bg-slate-100">
        <div className="max-w-2xl p-8 mx-auto text-center bg-white border border-red-200 shadow-sm rounded-xl">
          <FiAlertTriangle
            className="mx-auto mb-4 text-red-500"
            size={35}
          />

          <h2 className="text-xl font-bold text-slate-800">
            Unable to generate decision
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            {error}
          </p>

          <button
            onClick={fetchDecision}
            className="inline-flex items-center gap-2 px-5 py-3 mt-6 text-sm font-semibold text-white transition bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            <FiRefreshCw size={16} />
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!decisionData) return null;

  const decision = decisionData.decision;
  const decisionStyle = getDecisionStyle(decision);
  const DecisionIcon = decisionStyle.icon;

  const forecast = decisionData.forecast || {};
  const feasibility = decisionData.feasibility || {};
  const cost = decisionData.cost || {};
  const risk = decisionData.risk || {};

  const feasibleVessels = feasibility.vessels || [];
  const recommendedVessel =
    feasibleVessels.length > 0 ? feasibleVessels[0] : null;

  const reasons = decisionData.reasons || [];
  const riskFactors = risk.risk_factors || [];

  const RiskIcon = getRiskIcon(risk.risk_level);

  return (
    <div className="min-h-screen p-8 bg-slate-100">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 mb-8 lg:flex-row lg:items-center">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center text-white bg-blue-600 h-11 w-11 rounded-xl">
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

        <div className="px-4 py-3 bg-white border rounded-lg border-slate-200">
          <p className="text-xs text-slate-500">
            Analysis ID
          </p>

          <p className="mt-1 text-sm font-semibold text-slate-800">
            ANL-1024
          </p>
        </div>
      </div>

      {/* Main Recommendation */}
      <div
        className={`mb-6 rounded-2xl border ${decisionStyle.border} bg-white shadow-sm`}
      >
        <div
          className={`border-b ${decisionStyle.border} ${decisionStyle.bg} p-6`}
        >
          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
            <div className="flex items-start gap-4">
              <div
                className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl ${decisionStyle.iconBg} text-white`}
              >
                <DecisionIcon size={28} />
              </div>

              <div>
                <p
                  className={`text-xs font-bold uppercase tracking-wider ${decisionStyle.text}`}
                >
                  AI Recommendation
                </p>

                <h2 className="mt-1 text-3xl font-bold text-slate-800">
                  {decision}
                  {decision === "BOOK" && " NOW"}
                </h2>

                <p className="max-w-2xl mt-2 text-sm leading-6 text-slate-600">
                  {reasons[0] ||
                    "Recommendation generated from current market, vessel, cost and risk indicators."}
                </p>
              </div>
            </div>

            <div className="px-6 py-4 text-center bg-white shadow-sm rounded-xl">
              <p className="text-xs font-medium text-slate-500">
                Decision Confidence
              </p>

              <p
                className={`mt-1 text-3xl font-bold ${decisionStyle.text}`}
              >
                {decisionData.decision_confidence}
              </p>

              <p className="text-xs text-slate-500">
                Based on forecast data
              </p>
            </div>
          </div>
        </div>

        {/* Decision Summary */}
        <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-4">
          <div>
            <p className="text-xs tracking-wide uppercase text-slate-500">
              Recommended Vessel
            </p>

            <div className="flex items-center gap-2 mt-2">
              <FiAnchor
                className="text-blue-600"
                size={18}
              />

              <p className="font-semibold text-slate-800">
                {recommendedVessel?.vessel_name || "No feasible vessel"}
              </p>
            </div>
          </div>

          <div>
            <p className="text-xs tracking-wide uppercase text-slate-500">
              Total Expected Cost
            </p>

            <div className="flex items-center gap-2 mt-2">
              <FiDollarSign
                className="text-blue-600"
                size={18}
              />

              <p className="font-semibold text-slate-800">
                {formatMillions(cost.total_expected_cost)}
              </p>
            </div>
          </div>

          <div>
            <p className="text-xs tracking-wide uppercase text-slate-500">
              Vessel Match
            </p>

            <p className="mt-2 font-semibold text-slate-800">
              {feasibility.feasible_vessel_count ?? 0} feasible
            </p>
          </div>

          <div>
            <p className="text-xs tracking-wide uppercase text-slate-500">
              Risk Score
            </p>

            <p className="mt-2 font-semibold text-slate-800">
              {risk.risk_score ?? "--"}/100
            </p>
          </div>
        </div>
      </div>

      {/* Decision Factors */}
      <div className="grid grid-cols-1 gap-6 mb-6 lg:grid-cols-2">
        {/* Why Decision */}
        <div className="p-6 bg-white border shadow-sm rounded-xl border-slate-200">
          <div className="flex items-center gap-3 mb-5">
            <div className="flex items-center justify-center w-10 h-10 text-green-600 rounded-lg bg-green-50">
              <FiTrendingUp size={20} />
            </div>

            <div>
              <h2 className="font-semibold text-slate-800">
                Decision Factors
              </h2>

              <p className="text-xs text-slate-500">
                Key supporting factors
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {reasons.length > 0 ? (
              reasons.map((reason, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3"
                >
                  <FiCheckCircle
                    className="mt-0.5 shrink-0 text-green-600"
                    size={17}
                  />

                  <p className="text-sm leading-6 text-slate-700">
                    {reason}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">
                No additional decision reasons were returned.
              </p>
            )}
          </div>
        </div>

        {/* Risk */}
        <div className="p-6 bg-white border shadow-sm rounded-xl border-slate-200">
          <div className="flex items-center gap-3 mb-5">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-amber-50 text-amber-600">
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
                Overall Risk
              </span>

              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${getRiskBadge(
                  risk.risk_level
                )}`}
              >
                {risk.risk_level || "--"}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">
                Risk Score
              </span>

              <span className="font-semibold text-slate-800">
                {risk.risk_score ?? "--"}/100
              </span>
            </div>

            {riskFactors.length > 0 &&
              riskFactors.map((factor, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between"
                >
                  <span className="text-sm text-slate-600">
                    {factor.factor || factor.name || `Risk Factor ${index + 1}`}
                  </span>

                  <div className="flex items-center gap-2">
                    <RiskIcon
                      className="text-slate-400"
                      size={15}
                    />

                    <span className="text-xs text-slate-500">
                      {factor.impact !== undefined
                        ? `+${factor.impact}`
                        : factor.value || "Active"}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Market + Vessel + Cost */}
      <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-3">
        <div className="p-5 bg-white border shadow-sm rounded-xl border-slate-200">
          <p className="text-xs tracking-wide uppercase text-slate-500">
            Freight Outlook
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-800">
            {formatCurrency(forecast.forecast_rate)}
            <span className="ml-1 text-sm font-normal text-slate-500">
              / MT
            </span>
          </p>

          <p className="mt-2 text-xs font-medium text-slate-500">
            Trend:{" "}
            <span
              className={
                forecast.trend === "RISING"
                  ? "text-red-600"
                  : forecast.trend === "FALLING"
                  ? "text-green-600"
                  : "text-slate-700"
              }
            >
              {forecast.trend || "--"}
            </span>
          </p>
        </div>

        <div className="p-5 bg-white border shadow-sm rounded-xl border-slate-200">
          <p className="text-xs tracking-wide uppercase text-slate-500">
            Vessel Feasibility
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-800">
            {feasibility.feasible_vessel_count ?? 0}
          </p>

          <p className="mt-2 text-xs text-slate-500">
            feasible of {feasibility.total_vessels_checked ?? 0} checked
          </p>
        </div>

        <div className="p-5 bg-white border shadow-sm rounded-xl border-slate-200">
          <p className="text-xs tracking-wide uppercase text-slate-500">
            Cost / MT
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-800">
            {formatCurrency(cost.expected_cost_per_tonne)}
          </p>

          <p className="mt-2 text-xs text-slate-500">
            Expected total cost basis
          </p>
        </div>
      </div>

      {/* Alternative Decisions */}
      <div className="p-6 mb-6 bg-white border shadow-sm rounded-xl border-slate-200">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-slate-800">
            Decision Alternatives
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            AI evaluates the available action based on current market,
            feasibility and risk conditions.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* Book */}
          <div
            className={`rounded-xl border p-5 ${
              decision === "BOOK"
                ? "border-2 border-green-200 bg-green-50"
                : "border-slate-200 bg-slate-50"
            }`}
          >
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
              Book when rising rates or stable conditions make immediate
              chartering favorable.
            </p>

            <p
              className={`mt-4 text-xs font-medium ${
                decision === "BOOK"
                  ? "text-green-700"
                  : "text-slate-500"
              }`}
            >
              {decision === "BOOK"
                ? "Recommended"
                : "Not selected"}
            </p>
          </div>

          {/* Wait */}
          <div
            className={`rounded-xl border p-5 ${
              decision === "WAIT"
                ? "border-2 border-amber-200 bg-amber-50"
                : "border-slate-200 bg-slate-50"
            }`}
          >
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
              Wait when falling freight trends or other conditions
              indicate potential benefit from delaying.
            </p>

            <p
              className={`mt-4 text-xs font-medium ${
                decision === "WAIT"
                  ? "text-amber-700"
                  : "text-slate-500"
              }`}
            >
              {decision === "WAIT"
                ? "Recommended"
                : "Not selected"}
            </p>
          </div>

          {/* Avoid */}
          <div
            className={`rounded-xl border p-5 ${
              decision === "AVOID"
                ? "border-2 border-red-200 bg-red-50"
                : "border-slate-200 bg-slate-50"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-red-700">
                AVOID
              </span>

              <FiXCircle
                className="text-red-500"
                size={20}
              />
            </div>

            <p className="mt-3 text-sm text-slate-600">
              Avoid when no feasible vessel exists or operational risk
              makes the current charter unsuitable.
            </p>

            <p
              className={`mt-4 text-xs font-medium ${
                decision === "AVOID"
                  ? "text-red-700"
                  : "text-slate-500"
              }`}
            >
              {decision === "AVOID"
                ? "Recommended"
                : "Not selected"}
            </p>
          </div>
        </div>
      </div>

      {/* Explanation */}
      <div className="p-5 mb-6 border border-blue-200 rounded-xl bg-blue-50">
        <div className="flex items-start gap-3">
          <FiInfo
            className="mt-0.5 shrink-0 text-blue-600"
            size={19}
          />

          <div>
            <h3 className="text-sm font-semibold text-blue-900">
              Decision Explanation
            </h3>

            <p className="max-w-5xl mt-1 text-sm leading-6 text-blue-800">
              {decisionData.note ||
                "The recommendation combines freight forecast, vessel compatibility, total expected cost and operational risk."}
            </p>
          </div>
        </div>
      </div>

      {/* Human Approval */}
      <div className="p-6 bg-white border shadow-sm rounded-xl border-slate-200">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
          <div>
            <h2 className="text-lg font-semibold text-slate-800">
              Procurement Review
            </h2>

            <p className="max-w-2xl mt-1 text-sm leading-6 text-slate-500">
              AI provides decision support only. Final commercial approval
              and chartering action remain with the authorized procurement
              team.
            </p>
          </div>

          <button
            onClick={() => {
              window.location.href = "/what-if";
            }}
            className="flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white transition bg-blue-600 rounded-lg shrink-0 hover:bg-blue-700"
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
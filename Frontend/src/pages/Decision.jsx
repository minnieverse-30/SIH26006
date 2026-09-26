import { API_BASE_URL } from "../config/api";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiAlertTriangle,
  FiArrowRight,
  FiCheckCircle,
  FiClock,
  FiDollarSign,
  FiLoader,
  FiShield,
  FiTrendingUp,
  FiXCircle,
} from "react-icons/fi";

function Decision() {
  const navigate = useNavigate();

  const [decisionData, setDecisionData] = useState(null);
  const [analysisId, setAnalysisId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDecision();
  }, []);

  async function fetchDecision() {
    try {
      setLoading(true);
      setError("");

      const storedAnalysisId = sessionStorage.getItem(
        "saylivAnalysisId"
      );

      let analysis;

      if (storedAnalysisId) {
        setAnalysisId(storedAnalysisId);

        const analysisResponse = await fetch(
          `${API_BASE_URL}/api/analyses/${storedAnalysisId}`
        );

        if (!analysisResponse.ok) {
          throw new Error("Unable to load saved analysis.");
        }

        const analysisResult = await analysisResponse.json();

        analysis = analysisResult.data || analysisResult;
      } else {
        analysis = {
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

      const params = new URLSearchParams({
        route: analysis.route,
        cargo_quantity: analysis.cargo_quantity,
        origin: analysis.origin,
        destination: analysis.destination,
        fuel_cost: analysis.fuel_cost ?? 0,
        port_cost: analysis.port_cost ?? 0,
        idle_cost: analysis.idle_cost ?? 0,
        risk_cost: analysis.risk_cost ?? 0,
        port_delay_days: analysis.port_delay_days ?? 0,
        vessel_availability:
          analysis.vessel_availability || "HIGH",
        contract_flexibility:
          analysis.contract_flexibility || "FLEXIBLE",
      });

      const response = await fetch(
        `${API_BASE_URL}/api/decision?${params.toString()}`
      );

      if (!response.ok) {
        throw new Error("Unable to generate decision.");
      }

      const result = await response.json();

      setDecisionData(result.data || result);
    } catch (err) {
      console.error("Decision error:", err);
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white bg-slate-950">
        <div className="flex items-center gap-3 text-slate-300">
          <FiLoader className="text-xl animate-spin" />
          <span>Generating chartering decision...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-6 text-white bg-slate-950">
        <div className="max-w-3xl p-8 mx-auto mt-20 border bg-red-500/10 border-red-500/30 rounded-2xl">
          <div className="flex items-center gap-3 mb-4 text-red-400">
            <FiAlertTriangle className="text-2xl" />
            <h2 className="text-xl font-semibold">
              Decision generation failed
            </h2>
          </div>

          <p className="mb-6 text-slate-300">{error}</p>

          <button
            onClick={fetchDecision}
            className="px-5 py-3 font-semibold transition bg-white rounded-xl text-slate-900 hover:bg-slate-200"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!decisionData) {
    return null;
  }

  const decision = decisionData.decision || "WAIT";
  const confidence =
    decisionData.confidence ||
    decisionData.decision_confidence ||
    "MEDIUM";

  const forecast = decisionData.forecast || {};
  const feasibility = decisionData.feasibility || {};
  const cost = decisionData.cost || {};
  const risk = decisionData.risk || {};

  const recommendedVessel =
    feasibility.vessels?.find(
      (vessel) =>
        vessel.feasible === true ||
        vessel.status === "FEASIBLE"
    ) || feasibility.vessels?.[0];

  const vesselCount =
    feasibility.feasible_vessel_count ??
    feasibility.vessels?.filter(
      (vessel) =>
        vessel.feasible === true ||
        vessel.status === "FEASIBLE"
    ).length ??
    0;

  const totalVessels =
    feasibility.total_vessels_checked ??
    feasibility.vessels?.length ??
    0;

  const riskScore = risk.risk_score ?? 0;
  const riskLevel = risk.risk_level || "MEDIUM";

  const totalCost =
    cost.total_expected_cost ??
    cost.total_cost ??
    0;

  const costPerTonne =
    cost.expected_cost_per_tonne ??
    cost.cost_per_tonne ??
    0;

  const forecastRate =
    forecast.forecast_rate ??
    forecast.forecast_freight_rate ??
    0;

  const trend = forecast.trend || "STABLE";

  const reasons = decisionData.reasons || [];

  const riskFactors =
    risk.risk_factors ||
    risk.factors ||
    [];

  const getDecisionStyles = () => {
    if (decision === "BOOK") {
      return {
        bg: "bg-emerald-500/10",
        border: "border-emerald-500/30",
        text: "text-emerald-400",
        icon: <FiCheckCircle />,
        label: "BOOK",
      };
    }

    if (decision === "AVOID") {
      return {
        bg: "bg-red-500/10",
        border: "border-red-500/30",
        text: "text-red-400",
        icon: <FiXCircle />,
        label: "AVOID",
      };
    }

    return {
      bg: "bg-amber-500/10",
      border: "border-amber-500/30",
      text: "text-amber-400",
      icon: <FiClock />,
      label: "WAIT",
    };
  };

  const decisionStyle = getDecisionStyles();

  const getRiskStyles = () => {
    if (riskLevel === "HIGH") {
      return "text-red-400 bg-red-500/10 border-red-500/20";
    }

    if (riskLevel === "MEDIUM") {
      return "text-amber-400 bg-amber-500/10 border-amber-500/20";
    }

    return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
  };

  const formatCurrency = (value) => {
    if (value === null || value === undefined || Number.isNaN(Number(value))) {
      return "$0";
    }

    return `$${Number(value).toLocaleString(undefined, {
      maximumFractionDigits: 2,
    })}`;
  };

  return (
    <div className="min-h-screen p-6 text-white bg-slate-950">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="flex flex-col gap-4 mb-8 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="mb-1 text-sm font-medium text-cyan-400">
              SAYLIV / DECISION ENGINE
            </p>

            <h1 className="text-3xl font-bold">
              Chartering Decision
            </h1>

            <p className="mt-2 text-slate-400">
              AI-assisted recommendation based on freight, vessel,
              cost and risk analysis.
            </p>
          </div>

          <div className="text-left md:text-right">
            <p className="text-xs text-slate-500">
              Analysis ID
            </p>

            <p className="font-mono text-cyan-400">
              {analysisId || "LIVE ANALYSIS"}
            </p>
          </div>
        </div>

        {/* Main Decision */}
        <div
          className={`${decisionStyle.bg} ${decisionStyle.border} border rounded-3xl p-8 mb-6`}
        >
          <div className="grid items-center gap-8 lg:grid-cols-3">

            <div className="lg:col-span-2">
              <p className="mb-3 text-sm tracking-wider uppercase text-slate-400">
                Recommended Action
              </p>

              <div className="flex items-center gap-4">
                <div
                  className={`w-16 h-16 rounded-2xl ${decisionStyle.bg} ${decisionStyle.text} flex items-center justify-center text-3xl`}
                >
                  {decisionStyle.icon}
                </div>

                <div>
                  <h2
                    className={`text-5xl font-black ${decisionStyle.text}`}
                  >
                    {decisionStyle.label}
                  </h2>

                  <p className="mt-2 text-slate-300">
                    Decision confidence:{" "}
                    <span className="font-semibold">
                      {confidence}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:border-l lg:border-white/10 lg:pl-8">
              <p className="mb-2 text-sm text-slate-400">
                Decision Engine
              </p>

              <p className="text-xl font-semibold">
                {decisionData.model_status ||
                  "RULE_BASED_DECISION"}
              </p>

              <p className="mt-2 text-sm text-slate-500">
                Recommendation generated from current analysis inputs.
              </p>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-4 mb-6 md:grid-cols-4">

          <div className="p-5 border bg-slate-900 border-white/10 rounded-2xl">
            <div className="flex items-center gap-3 mb-3 text-cyan-400">
              <FiTrendingUp />
              <span className="text-sm">Forecast Rate</span>
            </div>

            <p className="text-2xl font-bold">
              {formatCurrency(forecastRate)}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              {trend}
            </p>
          </div>

          <div className="p-5 border bg-slate-900 border-white/10 rounded-2xl">
            <div className="flex items-center gap-3 mb-3 text-blue-400">
              <FiDollarSign />
              <span className="text-sm">Expected Cost</span>
            </div>

            <p className="text-2xl font-bold">
              {formatCurrency(totalCost)}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Total voyage estimate
            </p>
          </div>

          <div className="p-5 border bg-slate-900 border-white/10 rounded-2xl">
            <div className="flex items-center gap-3 mb-3 text-purple-400">
              <FiShield />
              <span className="text-sm">Risk Score</span>
            </div>

            <p className="text-2xl font-bold">
              {riskScore}
            </p>

            <span
              className={`inline-block mt-2 px-2 py-1 rounded-lg border text-xs ${getRiskStyles()}`}
            >
              {riskLevel}
            </span>
          </div>

          <div className="p-5 border bg-slate-900 border-white/10 rounded-2xl">
            <div className="flex items-center gap-3 mb-3 text-emerald-400">
              <FiCheckCircle />
              <span className="text-sm">Vessel Match</span>
            </div>

            <p className="text-2xl font-bold">
              {vesselCount}/{totalVessels}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Feasible vessels
            </p>
          </div>
        </div>

        {/* Decision Explanation */}
        <div className="grid gap-6 mb-6 lg:grid-cols-2">

          <div className="p-6 border bg-slate-900 border-white/10 rounded-2xl">
            <h3 className="mb-5 text-lg font-semibold">
              Why this decision?
            </h3>

            {reasons.length > 0 ? (
              <div className="space-y-3">
                {reasons.map((reason, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-4 bg-slate-800/50 rounded-xl"
                  >
                    <FiCheckCircle className="mt-1 text-cyan-400 shrink-0" />

                    <p className="text-sm text-slate-300">
                      {reason}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-400">
                The recommendation is based on the combined forecast,
                cost, vessel feasibility and risk assessment.
              </p>
            )}
          </div>

          <div className="p-6 border bg-slate-900 border-white/10 rounded-2xl">
            <h3 className="mb-5 text-lg font-semibold">
              Risk Factors
            </h3>

            {riskFactors.length > 0 ? (
              <div className="space-y-3">
                {riskFactors.map((factor, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-4 bg-slate-800/50 rounded-xl"
                  >
                    <FiAlertTriangle className="mt-1 text-amber-400 shrink-0" />

                    <p className="text-sm text-slate-300">
                      {typeof factor === "string"
                        ? factor
                        : factor.description ||
                          factor.name ||
                          JSON.stringify(factor)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-400">
                No additional risk factors were returned.
              </p>
            )}
          </div>
        </div>

        {/* Vessel + Cost */}
        <div className="grid gap-6 mb-6 lg:grid-cols-2">

          <div className="p-6 border bg-slate-900 border-white/10 rounded-2xl">
            <h3 className="mb-5 text-lg font-semibold">
              Recommended Vessel
            </h3>

            {recommendedVessel ? (
              <div className="p-5 bg-slate-800/50 rounded-2xl">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xl font-semibold">
                      {recommendedVessel.name ||
                        recommendedVessel.vessel_name ||
                        "Recommended Vessel"}
                    </p>

                    <p className="text-sm text-slate-400">
                      {recommendedVessel.vessel_id ||
                        recommendedVessel.id ||
                        "Vessel"}
                    </p>
                  </div>

                  <FiCheckCircle className="text-2xl text-emerald-400" />
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-slate-500">Type</p>
                    <p className="text-slate-200">
                      {recommendedVessel.vessel_type || "--"}
                    </p>
                  </div>

                  <div>
                    <p className="text-slate-500">Capacity</p>
                    <p className="text-slate-200">
                      {recommendedVessel.capacity_tonnes
                        ? `${recommendedVessel.capacity_tonnes.toLocaleString()} t`
                        : "--"}
                    </p>
                  </div>

                  <div>
                    <p className="text-slate-500">Draft</p>
                    <p className="text-slate-200">
                      {recommendedVessel.draft_m
                        ? `${recommendedVessel.draft_m} m`
                        : "--"}
                    </p>
                  </div>

                  <div>
                    <p className="text-slate-500">Status</p>
                    <p className="text-emerald-400">
                      {recommendedVessel.status ||
                        (recommendedVessel.feasible
                          ? "FEASIBLE"
                          : "CHECK")}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-sm text-slate-400">
                No recommended vessel available.
              </div>
            )}
          </div>

          <div className="p-6 border bg-slate-900 border-white/10 rounded-2xl">
            <h3 className="mb-5 text-lg font-semibold">
              Cost Assessment
            </h3>

            <div className="space-y-4">

              <div className="flex justify-between pb-3 border-b border-white/5">
                <span className="text-slate-400">
                  Freight Cost
                </span>

                <span>
                  {formatCurrency(cost.freight_cost)}
                </span>
              </div>

              <div className="flex justify-between pb-3 border-b border-white/5">
                <span className="text-slate-400">
                  Fuel Cost
                </span>

                <span>
                  {formatCurrency(cost.fuel_cost)}
                </span>
              </div>

              <div className="flex justify-between pb-3 border-b border-white/5">
                <span className="text-slate-400">
                  Port Cost
                </span>

                <span>
                  {formatCurrency(cost.port_cost)}
                </span>
              </div>

              <div className="flex justify-between pb-3 border-b border-white/5">
                <span className="text-slate-400">
                  Risk Cost
                </span>

                <span>
                  {formatCurrency(cost.risk_cost)}
                </span>
              </div>

              <div className="flex justify-between pt-2">
                <span className="font-semibold">
                  Cost / Tonne
                </span>

                <span className="font-bold text-cyan-400">
                  {formatCurrency(costPerTonne)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Alternatives */}
        <div className="p-6 mb-6 border bg-slate-900 border-white/10 rounded-2xl">
          <h3 className="mb-5 text-lg font-semibold">
            Decision Alternatives
          </h3>

          <div className="grid gap-4 md:grid-cols-3">

            <div
              className={`rounded-xl border p-5 ${
                decision === "BOOK"
                  ? "border-emerald-500/40 bg-emerald-500/10"
                  : "border-white/10 bg-slate-800/30"
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <FiCheckCircle className="text-emerald-400" />
                <span className="font-semibold">BOOK</span>
              </div>

              <p className="text-sm text-slate-400">
                Enter the chartering window now when market conditions
                support immediate booking.
              </p>
            </div>

            <div
              className={`rounded-xl border p-5 ${
                decision === "WAIT"
                  ? "border-amber-500/40 bg-amber-500/10"
                  : "border-white/10 bg-slate-800/30"
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <FiClock className="text-amber-400" />
                <span className="font-semibold">WAIT</span>
              </div>

              <p className="text-sm text-slate-400">
                Monitor the market before committing to a charter.
              </p>
            </div>

            <div
              className={`rounded-xl border p-5 ${
                decision === "AVOID"
                  ? "border-red-500/40 bg-red-500/10"
                  : "border-white/10 bg-slate-800/30"
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <FiXCircle className="text-red-400" />
                <span className="font-semibold">AVOID</span>
              </div>

              <p className="text-sm text-slate-400">
                Do not proceed when feasibility or risk makes the
                charter unattractive.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Action */}
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div>
            <p className="text-sm text-slate-500">
              SAYLIV Decision Support
            </p>

            <p className="mt-1 text-xs text-slate-600">
              Forecast + Vessel Feasibility + Cost + Risk
            </p>
          </div>

          <button
            onClick={() => navigate("/what-if")}
            className="flex items-center gap-2 px-6 py-3 font-semibold transition rounded-xl bg-cyan-500 text-slate-950 hover:bg-cyan-400"
          >
            Open What-If Analysis
            <FiArrowRight />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Decision;
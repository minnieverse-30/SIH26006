import { API_BASE_URL } from "../config/api";
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
import { useNavigate } from "react-router-dom";

function NewAnalysis() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    route: "AUS-PAR",
    cargoQuantity: 100000,

    origin: "Hay Point",
    destination: "Paradip",

    fuelCost: 500000,
    portCost: 150000,
    idleCost: 100000,
    riskCost: 200000,

    portDelayDays: 2,

    vesselAvailability: "HIGH",
    contractFlexibility: "FLEXIBLE",
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const runAnalysis = async () => {
    try {
      setLoading(true);
      setError("");
      setResult(null);

      // -----------------------------
      // FRONTEND VALIDATION
      // -----------------------------

      if (Number(form.cargoQuantity) <= 0) {
        throw new Error("Cargo quantity must be greater than zero.");
      }

      if (Number(form.portDelayDays) < 0) {
        throw new Error("Port delay cannot be negative.");
      }

      // -----------------------------
      // CREATE QUERY PARAMETERS
      // -----------------------------

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

      // -----------------------------
      // SAVE ANALYSIS
      // FastAPI -> PostgreSQL
      // -----------------------------

      const response = await fetch(
        `${API_BASE_URL}/api/analyses?${params.toString()}`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Unable to save chartering analysis."
        );
      }

      // -----------------------------
      // GET RESPONSE DATA
      // -----------------------------

      const analysisId = data.analysis_id;
      const analysisResult = data.data;

      console.log("Analysis saved successfully.");
      console.log("Analysis ID:", analysisId);

      setResult(analysisResult);

      // -----------------------------
      // STORE ONLY ANALYSIS ID
      // Actual data is in PostgreSQL
      // -----------------------------

      sessionStorage.setItem(
        "sailForgeAnalysisId",
        String(analysisId)
      );
    } catch (err) {
      console.error("ANALYSIS ERROR:", err);

      setError(
        err.message ||
          "Unable to connect to SAIL-FORGE backend."
      );
    } finally {
      setLoading(false);
    }
  };

  const openDashboard = () => {
    navigate("/");
  };

  return (
    <div className="space-y-8">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div>
        <div className="flex items-center gap-2 mb-2 text-sm text-slate-400">
          <span>Chartering</span>
          <FiArrowRight />
          <span className="text-cyan-400">New Analysis</span>
        </div>

        <h1 className="text-3xl font-bold text-white">
          New Chartering Analysis
        </h1>

        <p className="mt-2 text-slate-400">
          Configure cargo, route, cost and operational parameters
          to generate an intelligent chartering recommendation.
        </p>
      </div>

      {/* =====================================================
          MAIN FORM
      ===================================================== */}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

        {/* ===================================================
            LEFT SIDE - INPUT FORM
        =================================================== */}

        <div className="space-y-6 xl:col-span-2">

          {/* ROUTE & CARGO */}

          <div className="p-6 bg-white shadow-xl rounded-2xl">

            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-cyan-100">
                <FiArrowRight className="text-xl text-cyan-600" />
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Route & Cargo
                </h2>

                <p className="text-sm text-slate-500">
                  Define the cargo movement for this charter.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

              {/* ROUTE */}

              <div>
                <label className="block mb-2 text-sm font-semibold text-slate-700">
                  Trade Route
                </label>

                <select
                  name="route"
                  value={form.route}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border rounded-xl border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="AUS-PAR">
                    AUS-PAR — Australia → Paradip
                  </option>

                  <option value="ZAF-PAR">
                    ZAF-PAR — South Africa → Paradip
                  </option>

                  <option value="IDN-PAR">
                    IDN-PAR — Indonesia → Paradip
                  </option>

                  <option value="IDN-KRI">
                    IDN-KRI — Indonesia → Kamarajar
                  </option>
                </select>
              </div>

              {/* CARGO */}

              <div>
                <label className="block mb-2 text-sm font-semibold text-slate-700">
                  Cargo Quantity (tonnes)
                </label>

                <input
                  type="number"
                  name="cargoQuantity"
                  value={form.cargoQuantity}
                  onChange={handleChange}
                  min="1"
                  className="w-full px-4 py-3 border rounded-xl border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              {/* ORIGIN */}

              <div>
                <label className="block mb-2 text-sm font-semibold text-slate-700">
                  Loading Port
                </label>

                <select
                  name="origin"
                  value={form.origin}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border rounded-xl border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="Hay Point">
                    Hay Point, Australia
                  </option>

                  <option value="Richards Bay">
                    Richards Bay, South Africa
                  </option>

                  <option value="South Kalimantan">
                    South Kalimantan, Indonesia
                  </option>

                  <option value="East Kalimantan">
                    East Kalimantan, Indonesia
                  </option>

                  <option value="Banjarmasin">
                    Banjarmasin, Indonesia
                  </option>
                </select>
              </div>

              {/* DESTINATION */}

              <div>
                <label className="block mb-2 text-sm font-semibold text-slate-700">
                  Discharge Port
                </label>

                <select
                  name="destination"
                  value={form.destination}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border rounded-xl border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="Paradip">Paradip</option>
                  <option value="Dhamra">Dhamra</option>
                  <option value="Visakhapatnam">
                    Visakhapatnam
                  </option>
                  <option value="Gangavaram">
                    Gangavaram
                  </option>
                  <option value="Kamarajar">
                    Kamarajar
                  </option>
                  <option value="Chennai">Chennai</option>
                  <option value="Haldia">Haldia</option>
                </select>
              </div>
            </div>
          </div>

          {/* =================================================
              COST PARAMETERS
          ================================================= */}

          <div className="p-6 bg-white shadow-xl rounded-2xl">

            <div className="flex items-center gap-3 mb-6">

              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-100">
                <FiDollarSign className="text-xl text-emerald-600" />
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Cost Parameters
                </h2>

                <p className="text-sm text-slate-500">
                  Estimated operational cost inputs.
                </p>
              </div>

            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

              {/* FUEL */}

              <div>
                <label className="block mb-2 text-sm font-semibold text-slate-700">
                  Fuel Cost (USD)
                </label>

                <input
                  type="number"
                  name="fuelCost"
                  value={form.fuelCost}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-3 border rounded-xl border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* PORT */}

              <div>
                <label className="block mb-2 text-sm font-semibold text-slate-700">
                  Port Cost (USD)
                </label>

                <input
                  type="number"
                  name="portCost"
                  value={form.portCost}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-3 border rounded-xl border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* IDLE */}

              <div>
                <label className="block mb-2 text-sm font-semibold text-slate-700">
                  Idle / Demurrage Cost (USD)
                </label>

                <input
                  type="number"
                  name="idleCost"
                  value={form.idleCost}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-3 border rounded-xl border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* RISK */}

              <div>
                <label className="block mb-2 text-sm font-semibold text-slate-700">
                  Risk Cost (USD)
                </label>

                <input
                  type="number"
                  name="riskCost"
                  value={form.riskCost}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-3 border rounded-xl border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

            </div>
          </div>

          {/* =================================================
              OPERATIONAL PARAMETERS
          ================================================= */}

          <div className="p-6 bg-white shadow-xl rounded-2xl">

            <div className="flex items-center gap-3 mb-6">

              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-amber-100">
                <FiClock className="text-xl text-amber-600" />
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Operational Parameters
                </h2>

                <p className="text-sm text-slate-500">
                  Current vessel and port conditions.
                </p>
              </div>

            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">

              {/* PORT DELAY */}

              <div>
                <label className="block mb-2 text-sm font-semibold text-slate-700">
                  Port Delay (days)
                </label>

                <input
                  type="number"
                  name="portDelayDays"
                  value={form.portDelayDays}
                  onChange={handleChange}
                  min="0"
                  step="0.5"
                  className="w-full px-4 py-3 border rounded-xl border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* VESSEL AVAILABILITY */}

              <div>
                <label className="block mb-2 text-sm font-semibold text-slate-700">
                  Vessel Availability
                </label>

                <select
                  name="vesselAvailability"
                  value={form.vesselAvailability}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border rounded-xl border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="HIGH">High</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="LOW">Low</option>
                </select>
              </div>

              {/* CONTRACT FLEXIBILITY */}

              <div>
                <label className="block mb-2 text-sm font-semibold text-slate-700">
                  Contract Flexibility
                </label>

                <select
                  name="contractFlexibility"
                  value={form.contractFlexibility}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border rounded-xl border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="FLEXIBLE">Flexible</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="FIXED">Fixed</option>
                </select>
              </div>

            </div>
          </div>

          {/* =================================================
              ERROR
          ================================================= */}

          {error && (
            <div className="flex items-start gap-3 p-5 border border-red-200 bg-red-50 rounded-2xl">

              <FiXCircle className="text-red-600 text-xl mt-0.5" />

              <div>
                <h3 className="font-semibold text-red-800">
                  Analysis Failed
                </h3>

                <p className="mt-1 text-sm text-red-700">
                  {error}
                </p>
              </div>

            </div>
          )}

          {/* =================================================
              RUN ANALYSIS BUTTON
          ================================================= */}

          <button
            onClick={runAnalysis}
            disabled={loading}
            className="flex items-center justify-center w-full gap-3 px-6 py-4 font-semibold text-white transition shadow-xl bg-slate-900 hover:bg-slate-800 disabled:bg-slate-500 rounded-2xl"
          >

            {loading ? (
              <>
                <FiLoader className="text-xl animate-spin" />
                Running Chartering Analysis...
              </>
            ) : (
              <>
                Run Chartering Analysis
                <FiArrowRight className="text-xl" />
              </>
            )}

          </button>

        </div>

        {/* ===================================================
            RIGHT SIDE - INFO PANEL
        =================================================== */}

        <div className="space-y-6">

          <div className="p-6 text-white shadow-xl bg-slate-900 rounded-2xl">

            <div className="flex items-center gap-3 mb-5">

              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-cyan-500/20">
                <FiShield className="text-xl text-cyan-400" />
              </div>

              <div>
                <h2 className="font-bold">
                  SAIL-FORGE Intelligence
                </h2>

                <p className="text-xs text-slate-400">
                  Chartering Decision Engine
                </p>
              </div>

            </div>

            <div className="space-y-4">

              <div className="flex items-center gap-3">
                <FiCheckCircle className="text-emerald-400" />
                <span className="text-sm text-slate-300">
                  Freight forecasting
                </span>
              </div>

              <div className="flex items-center gap-3">
                <FiCheckCircle className="text-emerald-400" />
                <span className="text-sm text-slate-300">
                  Vessel feasibility
                </span>
              </div>

              <div className="flex items-center gap-3">
                <FiCheckCircle className="text-emerald-400" />
                <span className="text-sm text-slate-300">
                  Cost estimation
                </span>
              </div>

              <div className="flex items-center gap-3">
                <FiCheckCircle className="text-emerald-400" />
                <span className="text-sm text-slate-300">
                  Risk assessment
                </span>
              </div>

              <div className="flex items-center gap-3">
                <FiCheckCircle className="text-emerald-400" />
                <span className="text-sm text-slate-300">
                  BOOK / WAIT / AVOID decision
                </span>
              </div>

            </div>
          </div>

          {/* PIPELINE */}

          <div className="p-6 bg-white shadow-xl rounded-2xl">

            <h3 className="mb-5 font-bold text-slate-900">
              Analysis Pipeline
            </h3>

            <div className="space-y-5">

              {[
                "Input Validation",
                "Freight Forecast",
                "Vessel Feasibility",
                "Cost Analysis",
                "Risk Assessment",
                "Chartering Decision",
              ].map((step, index) => (
                <div
                  key={step}
                  className="flex items-center gap-3"
                >

                  <div className="flex items-center justify-center w-8 h-8 text-sm font-bold rounded-full bg-cyan-100 text-cyan-700">
                    {index + 1}
                  </div>

                  <span className="text-sm text-slate-700">
                    {step}
                  </span>

                </div>
              ))}

            </div>
          </div>

        </div>
      </div>

      {/* =====================================================
          RESULT
      ===================================================== */}

      {result && (
        <div className="p-6 bg-white shadow-xl rounded-2xl">

          <div className="flex flex-col gap-4 mb-6 md:flex-row md:items-center md:justify-between">

            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Analysis Result
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                AI-assisted chartering recommendation generated
                successfully.
              </p>
            </div>

            <div
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold ${
                result.decision === "BOOK"
                  ? "bg-emerald-100 text-emerald-700"
                  : result.decision === "WAIT"
                  ? "bg-amber-100 text-amber-700"
                  : "bg-red-100 text-red-700"
              }`}
            >

              {result.decision === "BOOK" && (
                <FiCheckCircle />
              )}

              {result.decision === "WAIT" && <FiClock />}

              {result.decision === "AVOID" && <FiXCircle />}

              {result.decision}
            </div>

          </div>

          {/* KPI CARDS */}

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">

            {/* DECISION */}

            <div className="p-5 border rounded-xl bg-slate-50 border-slate-200">

              <p className="text-xs tracking-wide uppercase text-slate-500">
                Decision Confidence
              </p>

              <p className="mt-2 text-2xl font-bold text-slate-900">
                {result.decision_confidence}
              </p>

            </div>

            {/* FORECAST */}

            <div className="p-5 border rounded-xl bg-slate-50 border-slate-200">

              <div className="flex items-center justify-between">

                <p className="text-xs tracking-wide uppercase text-slate-500">
                  Forecast Rate
                </p>

                {result.forecast?.trend === "RISING" ? (
                  <FiTrendingUp className="text-red-500" />
                ) : (
                  <FiTrendingDown className="text-emerald-500" />
                )}

              </div>

              <p className="mt-2 text-2xl font-bold text-slate-900">
                ${result.forecast?.forecast_rate}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                {result.forecast?.unit}
              </p>

            </div>

            {/* COST */}

            <div className="p-5 border rounded-xl bg-slate-50 border-slate-200">

              <p className="text-xs tracking-wide uppercase text-slate-500">
                Expected Cost
              </p>

              <p className="mt-2 text-2xl font-bold text-slate-900">
                $
                {Number(
                  result.cost?.total_expected_cost || 0
                ).toLocaleString()}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Total expected cost
              </p>

            </div>

            {/* VESSELS */}

            <div className="p-5 border rounded-xl bg-slate-50 border-slate-200">

              <p className="text-xs tracking-wide uppercase text-slate-500">
                Feasible Vessels
              </p>

              <p className="mt-2 text-2xl font-bold text-slate-900">
                {result.feasibility?.feasible_vessel_count || 0}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                of{" "}
                {result.feasibility?.total_vessels_checked || 0}{" "}
                checked
              </p>

            </div>

            {/* RISK */}

            <div className="p-5 border rounded-xl bg-slate-50 border-slate-200">

              <p className="text-xs tracking-wide uppercase text-slate-500">
                Risk Score
              </p>

              <p className="mt-2 text-2xl font-bold text-slate-900">
                {result.risk?.risk_score || 0}/100
              </p>

              <p className="mt-1 text-xs text-slate-500">
                {result.risk?.risk_level}
              </p>

            </div>

          </div>

          {/* TREND + REASONS */}

          <div className="grid grid-cols-1 gap-6 mt-6 lg:grid-cols-2">

            {/* FORECAST */}

            <div className="p-5 border border-slate-200 rounded-xl">

              <h3 className="mb-4 font-bold text-slate-900">
                Freight Outlook
              </h3>

              <div className="flex items-center gap-3">

                {result.forecast?.trend === "RISING" ? (
                  <FiTrendingUp className="text-2xl text-red-500" />
                ) : (
                  <FiTrendingDown className="text-2xl text-emerald-500" />
                )}

                <div>

                  <p className="font-semibold text-slate-900">
                    {result.forecast?.trend}
                  </p>

                  <p className="text-sm text-slate-500">
                    Forecast confidence:{" "}
                    {result.forecast?.confidence}
                  </p>

                </div>

              </div>

            </div>

            {/* REASONS */}

            <div className="p-5 border border-slate-200 rounded-xl">

              <h3 className="mb-4 font-bold text-slate-900">
                Why This Decision?
              </h3>

              <div className="space-y-3">

                {result.reasons?.map((reason, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3"
                  >

                    <FiCheckCircle className="text-cyan-600 mt-0.5 flex-shrink-0" />

                    <p className="text-sm text-slate-600">
                      {reason}
                    </p>

                  </div>
                ))}

              </div>

            </div>

          </div>

          {/* COST PER TONNE */}

          <div className="p-5 mt-6 border bg-slate-50 border-slate-200 rounded-xl">

            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">

              <div>
                <p className="text-sm text-slate-500">
                  Expected Cost Per Tonne
                </p>

                <p className="text-2xl font-bold text-slate-900">
                  $
                  {Number(
                    result.cost?.expected_cost_per_tonne || 0
                  ).toFixed(2)}
                  /tonne
                </p>
              </div>

              <div className="text-sm text-slate-500">
                Model:{" "}
                <span className="font-semibold text-slate-700">
                  {result.model_status}
                </span>
              </div>

            </div>

          </div>

          {/* DASHBOARD BUTTON */}

          <div className="flex justify-end mt-6">

            <button
              onClick={openDashboard}
              className="flex items-center gap-2 px-6 py-3 font-semibold text-white transition bg-cyan-600 hover:bg-cyan-700 rounded-xl"
            >
              View Analysis Dashboard
              <FiArrowRight />
            </button>

          </div>

        </div>
      )}

    </div>
  );
}

export default NewAnalysis;
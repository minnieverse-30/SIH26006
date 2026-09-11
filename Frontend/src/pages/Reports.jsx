import { useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiDownload,
  FiCheckCircle,
  FiAlertTriangle,
  FiTrendingUp,
  FiAnchor,
  FiDollarSign,
  FiShield,
  FiFileText,
} from "react-icons/fi";

function Reports() {
  const navigate = useNavigate();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      {/* Header */}
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <FiFileText />
            Analysis Report
          </div>

          <h1 className="mt-2 text-3xl font-bold text-slate-800">
            Chartering Decision Report
          </h1>

          <p className="mt-2 text-slate-500">
            Consolidated freight, vessel, cost and decision analysis
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <FiArrowLeft />
            Dashboard
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 rounded-lg bg-slate-800 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-700"
          >
            <FiDownload />
            Download Report
          </button>
        </div>
      </div>

      {/* Analysis Info */}
      <div className="mb-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="text-sm text-slate-500">Analysis ID</p>
            <h2 className="mt-1 text-xl font-bold text-slate-800">
              ANL-1024
            </h2>
          </div>

          <div>
            <p className="text-sm text-slate-500">Generated On</p>
            <p className="mt-1 font-medium text-slate-800">
              11 September 2026
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Status</p>
            <span className="mt-1 inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
              <FiCheckCircle size={15} />
              Analysis Complete
            </span>
          </div>
        </div>
      </div>

      {/* Request Summary */}
      <div className="mb-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800">
          Cargo & Route Summary
        </h2>

        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-3 lg:grid-cols-6">
          <SummaryItem label="Cargo" value="Coking Coal" />
          <SummaryItem label="Quantity" value="50,000 MT" />
          <SummaryItem label="Origin" value="Port Hedland" />
          <SummaryItem label="Destination" value="Paradip" />
          <SummaryItem label="Arrival Date" value="15 Oct 2026" />
          <SummaryItem label="Contract" value="Spot" />
        </div>
      </div>

      {/* Decision */}
      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-green-200 bg-green-50 p-6 lg:col-span-2">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-green-700">
                AI RECOMMENDATION
              </p>

              <h2 className="mt-2 text-4xl font-bold text-green-800">
                BOOK NOW
              </h2>

              <p className="mt-2 text-sm text-green-700">
                Recommended based on freight outlook, vessel availability,
                expected cost and risk exposure.
              </p>
            </div>

            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
              <FiCheckCircle size={30} className="text-green-600" />
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3">
            <Metric label="Confidence" value="89%" />
            <Metric label="Recommended Vessel" value="MV SAIL Horizon" />
            <Metric label="Compatibility" value="96%" />
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Total Expected Cost</p>

          <h2 className="mt-2 text-3xl font-bold text-slate-800">
            $2.503M
          </h2>

          <p className="mt-2 text-sm text-green-600">
            Lowest expected cost option
          </p>

          <div className="mt-5 border-t border-slate-200 pt-5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">Freight</span>
              <span className="font-medium">$2.025M</span>
            </div>

            <div className="mt-3 flex items-center justify-between text-sm">
              <span className="text-slate-500">Fuel</span>
              <span className="font-medium">$310K</span>
            </div>

            <div className="mt-3 flex items-center justify-between text-sm">
              <span className="text-slate-500">Port / Handling</span>
              <span className="font-medium">$95K</span>
            </div>

            <div className="mt-3 flex items-center justify-between text-sm">
              <span className="text-slate-500">Risk Exposure</span>
              <span className="font-medium">$28K</span>
            </div>
          </div>
        </div>
      </div>

      {/* Forecast + Vessel */}
      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Forecast */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-3">
              <FiTrendingUp className="text-blue-600" size={20} />
            </div>

            <div>
              <h2 className="font-semibold text-slate-800">
                Freight Forecast
              </h2>
              <p className="text-sm text-slate-500">
                Expected market movement
              </p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <Metric label="Current Rate" value="$41 / MT" />
            <Metric label="Forecast Rate" value="$49 / MT" />
            <Metric label="Expected Change" value="+19.5%" />
            <Metric label="Model Confidence" value="86%" />
          </div>

          <div className="mt-5 rounded-lg bg-slate-50 p-4">
            <p className="text-sm text-slate-600">
              <span className="font-semibold text-slate-800">
                Outlook:
              </span>{" "}
              Freight rates are expected to rise over the forecast horizon,
              increasing the exposure associated with waiting.
            </p>
          </div>
        </div>

        {/* Vessel */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-3">
              <FiAnchor className="text-blue-600" size={20} />
            </div>

            <div>
              <h2 className="font-semibold text-slate-800">
                Recommended Vessel
              </h2>
              <p className="text-sm text-slate-500">
                Best feasibility match
              </p>
            </div>
          </div>

          <div className="mt-5 rounded-lg border border-blue-100 bg-blue-50 p-5">
            <h3 className="text-lg font-bold text-slate-800">
              MV SAIL Horizon
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Capesize • 82,000 MT
            </p>

            <div className="mt-4 grid grid-cols-2 gap-4">
              <Metric label="Match Score" value="96%" />
              <Metric label="Draft" value="17.2 m" />
              <Metric label="LOA" value="290 m" />
              <Metric label="Availability" value="12 Oct 2026" />
            </div>
          </div>
        </div>
      </div>

      {/* Risk Assessment */}
      <div className="mb-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-orange-100 p-3">
            <FiShield className="text-orange-600" size={20} />
          </div>

          <div>
            <h2 className="font-semibold text-slate-800">
              Risk Assessment
            </h2>
            <p className="text-sm text-slate-500">
              Key risk dimensions considered by the decision engine
            </p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
          <RiskItem label="Freight Risk" level="Medium" />
          <RiskItem label="Port Risk" level="Low" />
          <RiskItem label="Vessel Risk" level="Low" />
          <RiskItem label="Contract Risk" level="Low" />
          <RiskItem label="Data Risk" level="Low" />
        </div>
      </div>

      {/* Decision Explanation */}
      <div className="mb-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800">
          Decision Explanation
        </h2>

        <div className="mt-5 space-y-4">
          <Reason
            title="Freight rates are trending upward"
            text="The forecast indicates an expected increase in freight rates, making delayed chartering potentially more expensive."
          />

          <Reason
            title="Suitable vessel is currently available"
            text="MV SAIL Horizon satisfies the major vessel and port compatibility requirements for the requested cargo movement."
          />

          <Reason
            title="Lowest overall expected cost"
            text="The recommended option provides the lowest total expected cost after considering freight, fuel, port costs, idle exposure and risk."
          />
        </div>
      </div>

      {/* Auditability */}
      <div className="mb-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800">
          Data & Auditability
        </h2>

        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-3">
          <AuditItem
            label="Data Source"
            value="Freight + Vessel + Port Demo Dataset"
          />

          <AuditItem
            label="Effective Date"
            value="September 2026"
          />

          <AuditItem
            label="Decision Engine"
            value="Forecast + Feasibility + Cost + Risk"
          />
        </div>

        <div className="mt-5 rounded-lg bg-slate-50 p-4">
          <p className="text-sm leading-6 text-slate-600">
            This report is generated by the SAYLVI decision-support
            system. AI recommendations are intended to assist procurement
            teams and do not replace final commercial approval.
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="flex flex-col justify-between gap-4 border-t border-slate-300 pt-6 text-sm text-slate-500 md:flex-row">
        <p>SAYLVI • AI-Powered Chartering Intelligence</p>

        <button
          onClick={() => navigate("/")}
          className="font-medium text-blue-600 hover:text-blue-700"
        >
          Return to Dashboard →
        </button>
      </div>
    </div>
  );
}

/* Reusable Components */

function SummaryItem({ label, value }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-slate-800">
        {value}
      </p>
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <div>
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-semibold text-slate-800">
        {value}
      </p>
    </div>
  );
}

function RiskItem({ label, level }) {
  const levelClass =
    level === "Low"
      ? "bg-green-100 text-green-700"
      : level === "Medium"
      ? "bg-yellow-100 text-yellow-700"
      : "bg-red-100 text-red-700";

  return (
    <div className="rounded-lg border border-slate-200 p-4">
      <p className="text-sm text-slate-500">{label}</p>

      <span
        className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-semibold ${levelClass}`}
      >
        {level}
      </span>
    </div>
  );
}

function Reason({ title, text }) {
  return (
    <div className="flex gap-3 rounded-lg bg-slate-50 p-4">
      <FiCheckCircle
        className="mt-0.5 shrink-0 text-green-600"
        size={20}
      />

      <div>
        <h3 className="text-sm font-semibold text-slate-800">
          {title}
        </h3>

        <p className="mt-1 text-sm leading-6 text-slate-600">
          {text}
        </p>
      </div>
    </div>
  );
}

function AuditItem({ label, value }) {
  return (
    <div className="rounded-lg border border-slate-200 p-4">
      <p className="text-xs uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-2 text-sm font-medium text-slate-800">
        {value}
      </p>
    </div>
  );
}

export default Reports;
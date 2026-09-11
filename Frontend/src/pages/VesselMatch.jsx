import {
  FiAnchor,
  FiCheckCircle,
  FiAlertTriangle,
  FiMapPin,
  FiCalendar,
  FiArrowRight,
} from "react-icons/fi";

function VesselMatch() {
  const vessels = [
    {
      name: "MV SAIL Horizon",
      type: "Capesize",
      capacity: "82,000 MT",
      draft: "17.2 m",
      loa: "290 m",
      availability: "12 Oct 2026",
      match: 96,
      portStatus: "Compatible",
      risk: "Low",
      freight: "$40.5 / MT",
    },
    {
      name: "MV Ocean Carrier",
      type: "Capesize",
      capacity: "76,000 MT",
      draft: "16.8 m",
      loa: "285 m",
      availability: "14 Oct 2026",
      match: 91,
      portStatus: "Compatible",
      risk: "Low",
      freight: "$41.2 / MT",
    },
    {
      name: "MV Eastern Star",
      type: "Panamax",
      capacity: "64,000 MT",
      draft: "14.5 m",
      loa: "225 m",
      availability: "18 Oct 2026",
      match: 82,
      portStatus: "Compatible",
      risk: "Medium",
      freight: "$43.8 / MT",
    },
    {
      name: "MV Pacific Trader",
      type: "Capesize",
      capacity: "88,000 MT",
      draft: "18.1 m",
      loa: "300 m",
      availability: "20 Oct 2026",
      match: 68,
      portStatus: "Draft Review",
      risk: "Medium",
      freight: "$39.8 / MT",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      {/* Header */}
      <div className="mb-8 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white">
            <FiAnchor size={22} />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Vessel Match
            </h1>

            <p className="text-sm text-slate-500">
              AI-assisted vessel and port compatibility analysis
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

      {/* Request Summary */}
      <div className="mb-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Cargo
            </p>
            <p className="mt-1 font-semibold text-slate-800">
              Coking Coal
            </p>
            <p className="text-xs text-slate-500">50,000 MT</p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Route
            </p>
            <p className="mt-1 flex items-center gap-2 font-semibold text-slate-800">
              <FiMapPin size={15} />
              Port Hedland → Paradip
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Arrival Requirement
            </p>
            <p className="mt-1 flex items-center gap-2 font-semibold text-slate-800">
              <FiCalendar size={15} />
              15 Oct 2026
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Suitable Vessels
            </p>
            <p className="mt-1 font-semibold text-slate-800">
              3 of 4
            </p>
          </div>
        </div>
      </div>

      {/* Best Match */}
      <div className="mb-6 rounded-xl border border-blue-200 bg-blue-50 p-5">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white">
              <FiCheckCircle size={22} />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                Recommended Vessel
              </p>

              <h2 className="mt-1 text-xl font-bold text-slate-800">
                MV SAIL Horizon
              </h2>

              <p className="mt-1 text-sm text-slate-600">
                Highest compatibility with cargo, route and arrival
                requirements.
              </p>
            </div>
          </div>

          <div className="rounded-lg bg-white px-5 py-3 text-center shadow-sm">
            <p className="text-xs text-slate-500">Match Score</p>
            <p className="text-2xl font-bold text-blue-600">96%</p>
          </div>
        </div>
      </div>

      {/* Vessel Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-800">
            Vessel Compatibility
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Ranked based on capacity, port constraints, availability,
            freight and operational risk.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] text-left">
            <thead className="bg-slate-50">
              <tr className="text-xs uppercase tracking-wide text-slate-500">
                <th className="px-6 py-4">Vessel</th>
                <th className="px-6 py-4">Capacity</th>
                <th className="px-6 py-4">Draft</th>
                <th className="px-6 py-4">LOA</th>
                <th className="px-6 py-4">Availability</th>
                <th className="px-6 py-4">Port Status</th>
                <th className="px-6 py-4">Risk</th>
                <th className="px-6 py-4">Freight</th>
                <th className="px-6 py-4">Match</th>
              </tr>
            </thead>

            <tbody>
              {vessels.map((vessel, index) => (
                <tr
                  key={vessel.name}
                  className={`border-t border-slate-100 ${
                    index === 0 ? "bg-blue-50/40" : ""
                  }`}
                >
                  {/* Vessel */}
                  <td className="px-6 py-5">
                    <div>
                      <p className="font-semibold text-slate-800">
                        {vessel.name}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {vessel.type}
                      </p>
                    </div>
                  </td>

                  {/* Capacity */}
                  <td className="px-6 py-5 text-sm text-slate-700">
                    {vessel.capacity}
                  </td>

                  {/* Draft */}
                  <td className="px-6 py-5 text-sm text-slate-700">
                    {vessel.draft}
                  </td>

                  {/* LOA */}
                  <td className="px-6 py-5 text-sm text-slate-700">
                    {vessel.loa}
                  </td>

                  {/* Availability */}
                  <td className="px-6 py-5 text-sm text-slate-700">
                    {vessel.availability}
                  </td>

                  {/* Port */}
                  <td className="px-6 py-5">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        vessel.portStatus === "Compatible"
                          ? "bg-green-100 text-green-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {vessel.portStatus}
                    </span>
                  </td>

                  {/* Risk */}
                  <td className="px-6 py-5">
                    <span
                      className={`flex w-fit items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${
                        vessel.risk === "Low"
                          ? "bg-green-100 text-green-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {vessel.risk !== "Low" && (
                        <FiAlertTriangle size={12} />
                      )}
                      {vessel.risk}
                    </span>
                  </td>

                  {/* Freight */}
                  <td className="px-6 py-5 text-sm font-semibold text-slate-800">
                    {vessel.freight}
                  </td>

                  {/* Match */}
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-20 overflow-hidden rounded-full bg-slate-200">
                        <div
                          className="h-full rounded-full bg-blue-600"
                          style={{ width: `${vessel.match}%` }}
                        />
                      </div>

                      <span className="text-sm font-semibold text-slate-800">
                        {vessel.match}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="border-t border-slate-200 bg-slate-50 px-6 py-4">
          <p className="text-xs text-slate-500">
            Match score considers vessel capacity, draft, LOA, port
            compatibility, availability, freight and operational risk.
          </p>
        </div>
      </div>

      {/* Next Action */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={() => {
            window.location.href = "/cost-comparison";
          }}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          Compare Total Cost
          <FiArrowRight size={17} />
        </button>
      </div>
    </div>
  );
}

export default VesselMatch;

import { useEffect, useState } from "react";

import {
  FiAnchor,
  FiCheckCircle,
  FiAlertTriangle,
  FiMapPin,
  FiCalendar,
  FiArrowRight,
  FiRefreshCw,
} from "react-icons/fi";

function VesselMatch() {
  // ==============================
  // ANALYSIS INPUT
  // ==============================

  const cargoQuantity = 100000;
  const origin = "Hay Point";
  const destination = "Paradip";

  // ==============================
  // STATE
  // ==============================

  const [vessels, setVessels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==============================
  // FETCH VESSELS
  // ==============================

  const fetchVessels = async () => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams({
        cargo_quantity: String(cargoQuantity),
        origin: origin,
        destination: destination,
      });

      const response = await fetch(
        `http://127.0.0.1:8000/api/vessels/feasibility?${params.toString()}`
      );

      const data = await response.json();

      console.log("VESSEL FEASIBILITY RESPONSE:", data);

      if (!response.ok) {
        throw new Error(
          data.detail || "Failed to load vessel data"
        );
      }

      setVessels(data.data?.vessels || []);
    } catch (err) {
      console.error("Vessel feasibility error:", err);

      setError(
        err.message || "Unable to load vessel data"
      );

      setVessels([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVessels();
  }, []);

  // ==============================
  // DERIVED DATA
  // ==============================

  const feasibleVessels = vessels.filter(
    (vessel) => vessel.status === "FEASIBLE"
  );

  const recommendedVessel =
    feasibleVessels.length > 0
      ? feasibleVessels[0]
      : null;

  // ==============================
  // CHECK HELPERS
  // ==============================

  const getCheckCount = (vessel) => {
    if (!vessel.checks) return 0;

    return Object.values(vessel.checks).filter(Boolean).length;
  };

  const getTotalChecks = (vessel) => {
    if (!vessel.checks) return 0;

    return Object.keys(vessel.checks).length;
  };

  const getMatchScore = (vessel) => {
    const total = getTotalChecks(vessel);

    if (total === 0) return 0;

    const passed = getCheckCount(vessel);

    return Math.round((passed / total) * 100);
  };

  const getRisk = (vessel) => {
    if (vessel.status === "FEASIBLE") {
      return "Low";
    }

    const failedChecks = vessel.checks
      ? Object.values(vessel.checks).filter(
          (value) => !value
        ).length
      : 0;

    if (failedChecks >= 3) {
      return "High";
    }

    return "Medium";
  };

  // ==============================
  // RENDER
  // ==============================

  return (
    <div className="min-h-screen p-8 bg-slate-100">

      {/* HEADER */}

      <div className="flex flex-col justify-between gap-4 mb-8 lg:flex-row lg:items-center">

        <div className="flex items-center gap-3">

          <div className="flex items-center justify-center text-white bg-blue-600 h-11 w-11 rounded-xl">
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

        <div className="px-4 py-3 bg-white border rounded-lg border-slate-200">

          <p className="text-xs text-slate-500">
            Analysis Route
          </p>

          <p className="mt-1 text-sm font-semibold text-slate-800">
            {origin} → {destination}
          </p>

        </div>

      </div>

      {/* ERROR */}

      {error && (

        <div className="flex items-center justify-between gap-4 p-4 mb-6 border border-red-200 rounded-xl bg-red-50">

          <div>

            <p className="font-semibold text-red-700">
              Unable to load vessel data
            </p>

            <p className="mt-1 text-sm text-red-600">
              {error}
            </p>

          </div>

          <button
            onClick={fetchVessels}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white transition bg-red-600 rounded-lg hover:bg-red-700"
          >
            <FiRefreshCw size={15} />
            Retry
          </button>

        </div>

      )}

      {/* REQUEST SUMMARY */}

      <div className="p-5 mb-6 bg-white border shadow-sm rounded-xl border-slate-200">

        <div className="grid grid-cols-1 gap-5 md:grid-cols-4">

          <div>

            <p className="text-xs tracking-wide uppercase text-slate-500">
              Cargo
            </p>

            <p className="mt-1 font-semibold text-slate-800">
              Coking Coal
            </p>

            <p className="text-xs text-slate-500">
              {cargoQuantity.toLocaleString()} MT
            </p>

          </div>

          <div>

            <p className="text-xs tracking-wide uppercase text-slate-500">
              Route
            </p>

            <p className="flex items-center gap-2 mt-1 font-semibold text-slate-800">
              <FiMapPin size={15} />
              {origin} → {destination}
            </p>

          </div>

          <div>

            <p className="text-xs tracking-wide uppercase text-slate-500">
              Vessel Screening
            </p>

            <p className="flex items-center gap-2 mt-1 font-semibold text-slate-800">
              <FiCalendar size={15} />
              Current Availability
            </p>

          </div>

          <div>

            <p className="text-xs tracking-wide uppercase text-slate-500">
              Suitable Vessels
            </p>

            <p className="mt-1 font-semibold text-slate-800">

              {loading
                ? "Checking..."
                : `${feasibleVessels.length} of ${vessels.length}`}

            </p>

          </div>

        </div>

      </div>

      {/* LOADING */}

      {loading && (

        <div className="p-6 mb-6 border border-blue-200 rounded-xl bg-blue-50">

          <div className="flex items-center gap-3">

            <FiRefreshCw
              size={22}
              className="text-blue-600 animate-spin"
            />

            <div>

              <p className="font-semibold text-blue-800">
                Screening vessels...
              </p>

              <p className="mt-1 text-sm text-blue-600">
                Checking vessel capacity and port compatibility.
              </p>

            </div>

          </div>

        </div>

      )}

      {/* BEST MATCH */}

      {!loading && recommendedVessel && (

        <div className="p-5 mb-6 border border-blue-200 rounded-xl bg-blue-50">

          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">

            <div className="flex items-start gap-4">

              <div className="flex items-center justify-center text-white bg-blue-600 rounded-lg h-11 w-11 shrink-0">

                <FiCheckCircle size={22} />

              </div>

              <div>

                <p className="text-xs font-semibold tracking-wide text-blue-600 uppercase">
                  Recommended Vessel
                </p>

                <h2 className="mt-1 text-xl font-bold text-slate-800">
                  {recommendedVessel.vessel_name}
                </h2>

                <p className="mt-1 text-sm text-slate-600">

                  {recommendedVessel.vessel_type} with{" "}

                  {recommendedVessel.capacity_tonnes?.toLocaleString()}{" "}

                  tonnes capacity meets the current screening criteria.

                </p>

              </div>

            </div>

            <div className="px-5 py-3 text-center bg-white rounded-lg shadow-sm">

              <p className="text-xs text-slate-500">
                Compatibility
              </p>

              <p className="text-2xl font-bold text-blue-600">
                {getMatchScore(recommendedVessel)}%
              </p>

            </div>

          </div>

        </div>

      )}

      {/* NO FEASIBLE VESSEL */}

      {!loading &&
        !error &&
        vessels.length > 0 &&
        feasibleVessels.length === 0 && (

          <div className="p-5 mb-6 border rounded-xl border-amber-200 bg-amber-50">

            <div className="flex items-start gap-3">

              <FiAlertTriangle
                size={22}
                className="mt-0.5 text-amber-600"
              />

              <div>

                <p className="font-semibold text-amber-800">
                  No feasible vessel found
                </p>

                <p className="mt-1 text-sm text-amber-700">
                  None of the screened vessels currently satisfies
                  all cargo, port and availability constraints.
                </p>

              </div>

            </div>

          </div>

        )}

      {/* VESSEL TABLE */}

      <div className="bg-white border shadow-sm rounded-xl border-slate-200">

        <div className="p-6 border-b border-slate-200">

          <h2 className="text-lg font-semibold text-slate-800">
            Vessel Compatibility
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Ranked using vessel capacity, port constraints,
            availability and compatibility checks.
          </p>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full min-w-[1000px] text-left">

            <thead className="bg-slate-50">

              <tr className="text-xs tracking-wide uppercase text-slate-500">

                <th className="px-6 py-4">
                  Vessel
                </th>

                <th className="px-6 py-4">
                  Capacity
                </th>

                <th className="px-6 py-4">
                  Status
                </th>

                <th className="px-6 py-4">
                  Risk
                </th>

                <th className="px-6 py-4">
                  Capacity Check
                </th>

                <th className="px-6 py-4">
                  Draft
                </th>

                <th className="px-6 py-4">
                  LOA
                </th>

                <th className="px-6 py-4">
                  Beam
                </th>

                <th className="px-6 py-4">
                  Vessel Type
                </th>

                <th className="px-6 py-4">
                  Match
                </th>

              </tr>

            </thead>

            <tbody>

              {!loading &&
                vessels.map((vessel) => {

                  const matchScore =
                    getMatchScore(vessel);

                  const risk =
                    getRisk(vessel);

                  const checks =
                    vessel.checks || {};

                  return (

                    <tr
                      key={vessel.vessel_id}
                      className={`border-t border-slate-100 ${
                        vessel.status === "FEASIBLE"
                          ? "bg-blue-50/30"
                          : ""
                      }`}
                    >

                      {/* VESSEL */}

                      <td className="px-6 py-5">

                        <div>

                          <p className="font-semibold text-slate-800">
                            {vessel.vessel_name}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {vessel.vessel_type}
                          </p>

                          <p className="mt-1 text-[11px] text-slate-400">
                            ID: {vessel.vessel_id}
                          </p>

                        </div>

                      </td>

                      {/* CAPACITY */}

                      <td className="px-6 py-5 text-sm text-slate-700">

                        {vessel.capacity_tonnes?.toLocaleString()} MT

                      </td>

                      {/* STATUS */}

                      <td className="px-6 py-5">

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            vessel.status === "FEASIBLE"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >

                          {vessel.status === "FEASIBLE"
                            ? "Feasible"
                            : "Not Feasible"}

                        </span>

                      </td>

                      {/* RISK */}

                      <td className="px-6 py-5">

                        <span
                          className={`flex w-fit items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${
                            risk === "Low"
                              ? "bg-green-100 text-green-700"
                              : risk === "Medium"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >

                          {risk !== "Low" && (
                            <FiAlertTriangle size={12} />
                          )}

                          {risk}

                        </span>

                      </td>

                      {/* CAPACITY CHECK */}

                      <td className="px-6 py-5">

                        {checks.capacity ? (
                          <FiCheckCircle
                            className="text-green-600"
                            size={18}
                          />
                        ) : (
                          <FiAlertTriangle
                            className="text-red-500"
                            size={18}
                          />
                        )}

                      </td>

                      {/* DRAFT */}

                      <td className="px-6 py-5">

                        {checks.destination_draft ? (
                          <FiCheckCircle
                            className="text-green-600"
                            size={18}
                          />
                        ) : (
                          <FiAlertTriangle
                            className="text-red-500"
                            size={18}
                          />
                        )}

                      </td>

                      {/* LOA */}

                      <td className="px-6 py-5">

                        {checks.destination_loa ? (
                          <FiCheckCircle
                            className="text-green-600"
                            size={18}
                          />
                        ) : (
                          <FiAlertTriangle
                            className="text-red-500"
                            size={18}
                          />
                        )}

                      </td>

                      {/* BEAM */}

                      <td className="px-6 py-5">

                        {checks.destination_beam ? (
                          <FiCheckCircle
                            className="text-green-600"
                            size={18}
                          />
                        ) : (
                          <FiAlertTriangle
                            className="text-red-500"
                            size={18}
                          />
                        )}

                      </td>

                      {/* VESSEL TYPE */}

                      <td className="px-6 py-5">

                        {checks.destination_vessel_type ? (
                          <FiCheckCircle
                            className="text-green-600"
                            size={18}
                          />
                        ) : (
                          <FiAlertTriangle
                            className="text-red-500"
                            size={18}
                          />
                        )}

                      </td>

                      {/* MATCH */}

                      <td className="px-6 py-5">

                        <div className="flex items-center gap-3">

                          <div className="w-20 h-2 overflow-hidden rounded-full bg-slate-200">

                            <div
                              className="h-full bg-blue-600 rounded-full"
                              style={{
                                width: `${matchScore}%`,
                              }}
                            />

                          </div>

                          <span className="text-sm font-semibold text-slate-800">
                            {matchScore}%
                          </span>

                        </div>

                      </td>

                    </tr>

                  );
                })}

              {/* EMPTY */}

              {!loading &&
                !error &&
                vessels.length === 0 && (

                  <tr>

                    <td
                      colSpan="10"
                      className="px-6 py-12 text-center"
                    >

                      <FiAlertTriangle
                        className="mx-auto mb-3 text-slate-400"
                        size={28}
                      />

                      <p className="font-medium text-slate-700">
                        No vessel data available
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        Try refreshing the analysis.
                      </p>

                    </td>

                  </tr>

                )}

            </tbody>

          </table>

        </div>

        {/* TABLE FOOTER */}

        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50">

          <p className="text-xs text-slate-500">

            Compatibility is calculated from vessel capacity,
            destination port draft, LOA, beam, vessel type
            and current availability.

          </p>

        </div>

      </div>

      {/* NEXT ACTION */}

      <div className="flex justify-end mt-6">

        <button
          onClick={() => {
            window.location.href = "/vessel-tracking";
          }}
          className="flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white transition bg-blue-600 rounded-lg hover:bg-blue-700"
        >

          Track Vessels

          <FiArrowRight size={17} />

        </button>

      </div>

    </div>
  );
}

export default VesselMatch;
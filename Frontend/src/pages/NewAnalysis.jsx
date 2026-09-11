import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FiArrowRight,
  FiCalendar,
  FiMapPin,
  FiPackage,
  FiClock,
  FiAlertCircle,
} from "react-icons/fi";

function NewAnalysis() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    cargoType: "",
    quantity: "",
    loadingPort: "",
    destinationPort: "",
    arrivalDate: "",
    contractDuration: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (
      !formData.cargoType ||
      !formData.quantity ||
      !formData.loadingPort ||
      !formData.destinationPort ||
      !formData.arrivalDate ||
      !formData.contractDuration
    ) {
      setError("Please complete all required fields.");
      return;
    }

    if (Number(formData.quantity) <= 0) {
      setError("Cargo quantity must be greater than 0.");
      return;
    }

    if (formData.loadingPort === formData.destinationPort) {
      setError("Loading port and destination port must be different.");
      return;
    }

    // Backend-ready payload
    const payload = {
      cargo: {
        type: formData.cargoType,
        quantity: Number(formData.quantity),
      },
      route: {
        loadingPort: formData.loadingPort,
        destinationPort: formData.destinationPort,
      },
      contract: {
        requiredArrivalDate: formData.arrivalDate,
        duration: formData.contractDuration,
      },
    };

    console.log("Analysis Request:", payload);

    // Temporary mock analysis ID
    const analysisId = "ANL-1024";

    // Later backend response se ye ID aayegi
    navigate(`/forecast?analysisId=${analysisId}`);
  };

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white">
            <FiPackage size={22} />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              New Analysis
            </h1>

            <p className="text-sm text-slate-500">
              Create a cargo and route request for chartering analysis
            </p>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-8 rounded-xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
              Step 1 of 1
            </p>

            <h2 className="mt-1 text-lg font-semibold text-slate-800">
              Cargo & Route Details
            </h2>
          </div>

          <span className="rounded-full bg-blue-50 px-4 py-2 text-xs font-medium text-blue-700">
            New Request
          </span>
        </div>

        <div className="mt-4 h-1.5 w-full rounded-full bg-slate-100">
          <div className="h-1.5 w-full rounded-full bg-blue-600" />
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-slate-200 bg-white shadow-sm"
      >
        {/* Cargo */}
        <div className="border-b border-slate-200 p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-slate-800">
              Cargo Information
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Enter the basic details of the cargo to be chartered.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Cargo Type */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Cargo Type <span className="text-red-500">*</span>
              </label>

              <select
                name="cargoType"
                value={formData.cargoType}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">Select cargo type</option>
                <option>Coking Coal</option>
                <option>Iron Ore</option>
                <option>Thermal Coal</option>
                <option>Limestone</option>
                <option>Steel Raw Material</option>
              </select>
            </div>

            {/* Quantity */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Cargo Quantity <span className="text-red-500">*</span>
              </label>

              <div className="flex">
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  min="1"
                  placeholder="Enter quantity"
                  className="w-full rounded-l-lg border border-r-0 border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

                <div className="flex items-center rounded-r-lg border border-slate-300 bg-slate-50 px-4 text-sm font-medium text-slate-500">
                  MT
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Route */}
        <div className="border-b border-slate-200 p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-slate-800">
              Route Details
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Specify the loading and destination ports.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Loading Port */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
                <FiMapPin className="text-blue-600" size={16} />
                Loading Port <span className="text-red-500">*</span>
              </label>

              <select
                name="loadingPort"
                value={formData.loadingPort}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">Select loading port</option>
                <option>Port Hedland, Australia</option>
                <option>Newcastle, Australia</option>
                <option>Richards Bay, South Africa</option>
                <option>Tubarao, Brazil</option>
              </select>
            </div>

            {/* Destination */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
                <FiMapPin className="text-green-600" size={16} />
                Destination Port <span className="text-red-500">*</span>
              </label>

              <select
                name="destinationPort"
                value={formData.destinationPort}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">Select destination port</option>
                <option>Paradip Port</option>
                <option>Visakhapatnam Port</option>
                <option>Haldia Port</option>
                <option>Mumbai Port</option>
              </select>
            </div>
          </div>
        </div>

        {/* Chartering */}
        <div className="p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-slate-800">
              Chartering Requirements
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Define when the cargo is required and the contract period.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Arrival */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
                <FiCalendar className="text-blue-600" size={16} />
                Required Arrival Date{" "}
                <span className="text-red-500">*</span>
              </label>

              <input
                type="date"
                name="arrivalDate"
                value={formData.arrivalDate}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Contract */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
                <FiClock className="text-blue-600" size={16} />
                Contract Duration{" "}
                <span className="text-red-500">*</span>
              </label>

              <select
                name="contractDuration"
                value={formData.contractDuration}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">Select duration</option>
                <option>Spot</option>
                <option>1 Month</option>
                <option>3 Months</option>
                <option>6 Months</option>
                <option>12 Months</option>
              </select>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mx-6 mb-5 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <FiAlertCircle size={18} />
            {error}
          </div>
        )}

        {/* Footer */}
        <div className="flex flex-col items-center justify-between gap-4 rounded-b-2xl border-t border-slate-200 bg-slate-50 px-6 py-5 sm:flex-row">
          <p className="text-xs text-slate-500">
            Analysis will use freight, vessel, port and market data.
          </p>

          <button
            type="submit"
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md"
          >
            Start Analysis
            <FiArrowRight size={17} />
          </button>
        </div>
      </form>
    </div>
  );
}

export default NewAnalysis;
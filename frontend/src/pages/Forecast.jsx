import { useEffect, useState } from "react";

import {
  FiTrendingUp,
  FiCalendar,
  FiInfo,
  FiArrowUp,
  FiArrowDown,
  FiActivity,
  FiRefreshCw,
} from "react-icons/fi";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

function Forecast() {
  // ==============================
  // ROUTE
  // ==============================

  const route = "C5";

  // ==============================
  // STATE
  // ==============================

  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==============================
  // FETCH FORECAST
  // ==============================

  useEffect(() => {
    fetchForecast();
  }, []);

  const fetchForecast = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `http://127.0.0.1:8000/api/forecast?route=${encodeURIComponent(
          route
        )}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to load forecast");
      }

      setForecast(data.data);
    } catch (err) {
      setError(err.message || "Unable to load forecast");
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // HELPERS
  // ==============================

  const formatRate = (value) => {
    if (value === undefined || value === null) {
      return "--";
    }

    return `$${Number(value).toFixed(2)}`;
  };

  const formatNumber = (value) => {
    if (value === undefined || value === null) {
      return "--";
    }

    return Number(value).toLocaleString();
  };

  const getTrendColor = (trend) => {
    if (trend === "RISING") {
      return "text-red-600";
    }

    if (trend === "FALLING") {
      return "text-green-600";
    }

    return "text-slate-600";
  };

  const getTrendBackground = (trend) => {
    if (trend === "RISING") {
      return "border-red-200 bg-red-50";
    }

    if (trend === "FALLING") {
      return "border-green-200 bg-green-50";
    }

    return "border-slate-200 bg-slate-50";
  };

  const getConfidenceColor = (confidence) => {
    if (confidence === "HIGH") {
      return "text-green-600";
    }

    if (confidence === "MEDIUM") {
      return "text-amber-600";
    }

    return "text-red-600";
  };

  // ==============================
  // CHART DATA
  // ==============================

  const chartData = forecast
    ? [
        {
          label: "Latest",
          actual: forecast.latest_freight_rate,
          forecast: forecast.latest_freight_rate,
        },
        {
          label: "Forecast",
          actual: null,
          forecast: forecast.forecast_freight_rate,
        },
      ]
    : [];

  // ==============================
  // RENDER
  // ==============================

  return (
    <div className="min-h-screen p-8 bg-slate-100">

      {/* ================= HEADER ================= */}

      <div className="flex flex-col justify-between gap-4 mb-8 lg:flex-row lg:items-center">

        <div>

          <div className="flex items-center gap-3">

            <div className="flex items-center justify-center text-white bg-blue-600 h-11 w-11 rounded-xl">
              <FiTrendingUp size={22} />
            </div>

            <div>

              <h1 className="text-2xl font-bold text-slate-800">
                Freight Forecast
              </h1>

              <p className="text-sm text-slate-500">
                Freight rate outlook generated from historical route data
              </p>

            </div>

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


      {/* ================= ERROR ================= */}

      {error && (

        <div className="flex items-center justify-between gap-4 p-4 mb-6 border border-red-200 rounded-xl bg-red-50">

          <div>

            <p className="font-semibold text-red-700">
              Unable to load forecast
            </p>

            <p className="mt-1 text-sm text-red-600">
              {error}
            </p>

          </div>

          <button
            onClick={fetchForecast}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white transition bg-red-600 rounded-lg hover:bg-red-700"
          >
            <FiRefreshCw size={15} />
            Retry
          </button>

        </div>

      )}


      {/* ================= LOADING ================= */}

      {loading && (

        <div className="p-5 mb-6 border border-blue-200 rounded-xl bg-blue-50">

          <div className="flex items-center gap-3">

            <FiRefreshCw
              size={22}
              className="text-blue-600 animate-spin"
            />

            <div>

              <p className="font-semibold text-blue-800">
                Generating freight forecast...
              </p>

              <p className="mt-1 text-sm text-blue-600">
                Reading historical freight data for route {route}.
              </p>

            </div>

          </div>

        </div>

      )}


      {/* ================= CONTENT ================= */}

      {!loading && forecast && (

        <>

          {/* ================= ROUTE SUMMARY ================= */}

          <div className="p-5 mb-6 bg-white border shadow-sm rounded-xl border-slate-200">

            <div className="grid grid-cols-1 gap-5 md:grid-cols-4">

              <div>

                <p className="text-xs tracking-wide uppercase text-slate-500">
                  Route
                </p>

                <p className="mt-1 font-semibold text-slate-800">
                  {forecast.route}
                </p>

                <p className="text-xs text-slate-500">
                  Freight corridor
                </p>

              </div>


              <div>

                <p className="text-xs tracking-wide uppercase text-slate-500">
                  Latest Observation
                </p>

                <p className="flex items-center gap-2 mt-1 font-semibold text-slate-800">

                  <FiCalendar size={15} />

                  {forecast.latest_date || "--"}

                </p>

                <p className="text-xs text-slate-500">
                  Latest available freight data
                </p>

              </div>


              <div>

                <p className="text-xs tracking-wide uppercase text-slate-500">
                  Historical Observations
                </p>

                <p className="mt-1 font-semibold text-slate-800">
                  {formatNumber(forecast.historical_observations)}
                </p>

                <p className="text-xs text-slate-500">
                  records used
                </p>

              </div>


              <div>

                <p className="text-xs tracking-wide uppercase text-slate-500">
                  Model Status
                </p>

                <p className="mt-1 font-semibold text-slate-800">
                  {forecast.model_status || "BASELINE"}
                </p>

                <p className="text-xs text-slate-500">
                  {forecast.method || "Historical baseline"}
                </p>

              </div>

            </div>

          </div>


          {/* ================= KPI CARDS ================= */}

          <div className="grid grid-cols-1 gap-5 mb-6 md:grid-cols-2 lg:grid-cols-4">

            {/* Latest Freight */}

            <div className="p-5 bg-white border shadow-sm rounded-xl border-slate-200">

              <p className="text-sm text-slate-500">
                Latest Freight
              </p>

              <div className="flex items-end gap-2 mt-2">

                <h2 className="text-2xl font-bold text-slate-800">
                  {formatRate(forecast.latest_freight_rate)}
                </h2>

                <span className="mb-1 text-sm text-slate-500">
                  / MT
                </span>

              </div>

              <p className="mt-2 text-xs text-slate-500">
                Latest observed route rate
              </p>

            </div>


            {/* Forecast Rate */}

            <div className="p-5 bg-white border shadow-sm rounded-xl border-slate-200">

              <p className="text-sm text-slate-500">
                Forecast Rate
              </p>

              <div className="flex items-end gap-2 mt-2">

                <h2 className="text-2xl font-bold text-slate-800">
                  {formatRate(forecast.forecast_freight_rate)}
                </h2>

                <span className="mb-1 text-sm text-slate-500">
                  / MT
                </span>

              </div>

              <p
                className={`mt-2 flex items-center gap-1 text-xs font-medium ${getTrendColor(
                  forecast.trend
                )}`}
              >

                {forecast.trend === "RISING" && (
                  <FiArrowUp size={13} />
                )}

                {forecast.trend === "FALLING" && (
                  <FiArrowDown size={13} />
                )}

                {forecast.trend || "STABLE"}

              </p>

            </div>


            {/* Forecast Range */}

            <div className="p-5 bg-white border shadow-sm rounded-xl border-slate-200">

              <p className="text-sm text-slate-500">
                Forecast Range
              </p>

              <h2 className="mt-2 text-2xl font-bold text-slate-800">

                {forecast.forecast_range
                  ? `${formatRate(
                      forecast.forecast_range.lower
                    )} – ${formatRate(
                      forecast.forecast_range.upper
                    )}`
                  : "--"}

              </h2>

              <p className="mt-2 text-xs text-slate-500">
                Estimated rate range
              </p>

            </div>


            {/* Confidence */}

            <div className="p-5 bg-white border shadow-sm rounded-xl border-slate-200">

              <p className="text-sm text-slate-500">
                Model Confidence
              </p>

              <h2
                className={`mt-2 text-2xl font-bold ${getConfidenceColor(
                  forecast.confidence
                )}`}
              >
                {forecast.confidence || "--"}
              </h2>

              <p className="mt-2 text-xs text-slate-500">
                Based on available historical observations
              </p>

            </div>

          </div>


          {/* ================= CHART + OUTLOOK ================= */}

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

            {/* CHART */}

            <div className="p-6 bg-white border shadow-sm rounded-xl border-slate-200 xl:col-span-2">

              <div className="flex items-center justify-between mb-6">

                <div>

                  <h2 className="text-lg font-semibold text-slate-800">
                    Freight Rate Forecast
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Latest observed rate versus current forecast
                  </p>

                </div>

                <div className="flex items-center gap-4 text-xs text-slate-500">

                  <div className="flex items-center gap-2">

                    <span className="h-2.5 w-2.5 rounded-full bg-slate-400" />

                    Latest

                  </div>

                  <div className="flex items-center gap-2">

                    <span className="h-2.5 w-2.5 rounded-full bg-blue-600" />

                    Forecast

                  </div>

                </div>

              </div>


              <div className="h-80">

                <ResponsiveContainer width="100%" height="100%">

                  <AreaChart data={chartData}>

                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                    />

                    <XAxis
                      dataKey="label"
                      tick={{ fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                    />

                    <YAxis
                      tick={{ fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(value) => `$${value}`}
                    />

                    <Tooltip
                      formatter={(value) => [
                        `$${Number(value).toFixed(2)}/MT`,
                        "Freight",
                      ]}
                    />

                    <Area
                      type="monotone"
                      dataKey="actual"
                      stroke="#64748b"
                      fill="#e2e8f0"
                      strokeWidth={2}
                    />

                    <Area
                      type="monotone"
                      dataKey="forecast"
                      stroke="#2563eb"
                      fill="#dbeafe"
                      strokeWidth={2}
                    />

                  </AreaChart>

                </ResponsiveContainer>

              </div>

            </div>


            {/* MARKET OUTLOOK */}

            <div className="p-6 bg-white border shadow-sm rounded-xl border-slate-200">

              <div className="flex items-center gap-3">

                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-lg ${getTrendBackground(
                    forecast.trend
                  )}`}
                >

                  <FiActivity
                    size={20}
                    className={getTrendColor(forecast.trend)}
                  />

                </div>

                <div>

                  <h2 className="font-semibold text-slate-800">
                    Market Outlook
                  </h2>

                  <p className="text-xs text-slate-500">
                    Forecast interpretation
                  </p>

                </div>

              </div>


              <div
                className={`mt-6 rounded-lg border p-4 ${getTrendBackground(
                  forecast.trend
                )}`}
              >

                <p
                  className={`text-sm font-semibold ${getTrendColor(
                    forecast.trend
                  )}`}
                >

                  {forecast.trend === "RISING"
                    ? "Rising Freight Trend"
                    : forecast.trend === "FALLING"
                    ? "Falling Freight Trend"
                    : "Stable Freight Trend"}

                </p>


                <p className="mt-2 text-sm leading-6 text-slate-600">

                  {forecast.trend === "RISING"
                    ? "Freight rates are showing an upward movement based on the available historical observations."
                    : forecast.trend === "FALLING"
                    ? "Freight rates are showing a downward movement based on the available historical observations."
                    : "Freight rates are relatively stable based on the available historical observations."}

                </p>

              </div>


              <div className="mt-5 space-y-4">

                <div>

                  <p className="text-xs font-medium tracking-wide uppercase text-slate-500">
                    Current Trend
                  </p>

                  <p
                    className={`mt-1 text-sm font-semibold ${getTrendColor(
                      forecast.trend
                    )}`}
                  >
                    {forecast.trend || "--"}
                  </p>

                </div>


                <div>

                  <p className="text-xs font-medium tracking-wide uppercase text-slate-500">
                    Volatility
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-800">

                    {forecast.volatility !== undefined &&
                    forecast.volatility !== null
                      ? `$${Number(
                          forecast.volatility
                        ).toFixed(2)} / MT`
                      : "--"}

                  </p>

                </div>


                <div>

                  <p className="text-xs font-medium tracking-wide uppercase text-slate-500">
                    Forecast Confidence
                  </p>

                  <p
                    className={`mt-1 text-sm font-semibold ${getConfidenceColor(
                      forecast.confidence
                    )}`}
                  >
                    {forecast.confidence || "--"}
                  </p>

                </div>


                <div>

                  <p className="text-xs font-medium tracking-wide uppercase text-slate-500">
                    Forecast Method
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-800">
                    {forecast.method || "Weighted historical baseline"}
                  </p>

                </div>

              </div>

            </div>

          </div>


          {/* ================= MODEL INFORMATION ================= */}

          <div className="p-5 mt-6 bg-white border shadow-sm rounded-xl border-slate-200">

            <div className="flex items-start gap-3">

              <FiInfo
                className="mt-0.5 text-blue-600"
                size={18}
              />

              <div>

                <h3 className="text-sm font-semibold text-slate-800">
                  Forecast Methodology
                </h3>

                <p className="mt-1 text-sm leading-6 text-slate-500">

                  {forecast.note ||
                    "Forecast results are generated using historical freight observations. The forecast is an analytical estimate and should be evaluated alongside vessel, port, cost and operational constraints."}

                </p>

              </div>

            </div>

          </div>


          {/* ================= DATA LIMITATION ================= */}

          {forecast.confidence === "LOW" && (

            <div className="p-5 mt-6 border rounded-xl border-amber-200 bg-amber-50">

              <div className="flex items-start gap-3">

                <FiInfo
                  className="mt-0.5 text-amber-600"
                  size={18}
                />

                <div>

                  <h3 className="text-sm font-semibold text-amber-800">
                    Limited Historical Data
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-amber-700">

                    The current route has a limited number of historical
                    observations. The system therefore uses a baseline
                    historical method and reports LOW confidence rather
                    than claiming high predictive accuracy.

                  </p>

                </div>

              </div>

            </div>

          )}


          {/* ================= BOTTOM ACTION ================= */}

          <div className="flex justify-end mt-6">

            <button
              onClick={() => {
                window.location.href = "/vessel-match";
              }}
              className="px-6 py-3 text-sm font-semibold text-white transition bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Continue to Vessel Match →
            </button>

          </div>

        </>

      )}

    </div>
  );
}

export default Forecast;
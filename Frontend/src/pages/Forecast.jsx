import { API_BASE_URL } from "../config/api";
import { useEffect, useState } from "react";
import {
  FiAlertCircle,
  FiArrowDown,
  FiArrowUp,
  FiBarChart2,
  FiCheckCircle,
  FiLoader,
  FiMinus,
  FiTrendingUp,
} from "react-icons/fi";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function Forecast() {
  const [route, setRoute] = useState("AUS-PAR");
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchForecast = async (selectedRoute) => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_BASE_URL}/api/forecast?route=${encodeURIComponent(
          selectedRoute
        )}`
      );

      const data = await response.json();

      console.log("FORECAST API RESPONSE:", data);

      if (!response.ok) {
        throw new Error(data.detail || "Unable to fetch forecast.");
      }

      const forecastData = data.data;

      const normalizedForecast = {
        route: forecastData.route,
        latest_freight_rate: forecastData.latest_freight_rate,
        forecast_freight_rate: forecastData.forecast_freight_rate,
        forecast_lower_bound: forecastData.forecast_range?.lower,
        forecast_upper_bound: forecastData.forecast_range?.upper,
        trend: forecastData.trend,
        confidence: forecastData.confidence,
        volatility: forecastData.volatility,
        observations: forecastData.historical_observations,
        unit: forecastData.unit,
        model_status: forecastData.model_status,
        method: forecastData.method,
        historical_series: forecastData.historical_series || [],
        model_metrics: forecastData.model_metrics || null,
        forecast_explanation: forecastData.forecast_explanation || null,
      };

      setForecast(normalizedForecast);
    } catch (err) {
      console.error("Forecast error:", err);

      setError(err.message || "Unable to connect to forecast service.");
      setForecast(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchForecast("AUS-PAR");
  }, []);

  const latestRate = Number(forecast?.latest_freight_rate);
  const forecastRate = Number(forecast?.forecast_freight_rate);
  const lowerBound = Number(forecast?.forecast_lower_bound);
  const upperBound = Number(forecast?.forecast_upper_bound);
  const volatility = Number(forecast?.volatility);

  const getTrendIcon = () => {
    if (!forecast) return <FiMinus />;

    if (forecast.trend === "RISING") {
      return <FiArrowUp />;
    }

    if (forecast.trend === "FALLING") {
      return <FiArrowDown />;
    }

    return <FiMinus />;
  };

  const getTrendText = () => {
    if (!forecast) return "No data";

    if (forecast.trend === "RISING") {
      return "Freight rates are expected to rise";
    }

    if (forecast.trend === "FALLING") {
      return "Freight rates are expected to fall";
    }

    if (forecast.trend === "STABLE") {
      return "Freight rates are relatively stable";
    }

    return "Insufficient historical data";
  };

  const chartData = forecast
    ? [
        ...forecast.historical_series.map((point) => ({
          period: point.date,
          rate: point.rate,
          type: "Historical",
        })),
        ...(Number.isFinite(forecastRate)
          ? [{ period: "30-day forecast", rate: forecastRate, type: "Forecast" }]
          : []),
      ]
    : [];

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <div className="flex items-center gap-3">
          <div className="p-3 text-blue-400 rounded-xl bg-blue-500/10">
            <FiBarChart2 size={24} />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-white">
              Freight Forecast
            </h1>

            <p className="mt-1 text-sm text-slate-400">
              Historical freight analysis and short-term rate forecast
            </p>
          </div>
        </div>
      </div>

      {/* ROUTE SELECTOR */}
      <div className="p-5 border rounded-2xl border-slate-800 bg-slate-900">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="flex-1">
            <label className="block mb-2 text-sm font-medium text-slate-300">
              Select Route
            </label>

            <select
              value={route}
              onChange={(e) => {
                const selectedRoute = e.target.value;

                setRoute(selectedRoute);
                fetchForecast(selectedRoute);
              }}
              className="w-full px-4 py-3 text-white border outline-none rounded-xl border-slate-700 bg-slate-950 focus:border-blue-500"
            >
              <option value="AUS-PAR">
                Hay Point → Paradip
              </option>

              <option value="ZAF-PAR">
                Richards Bay → Paradip
              </option>

              <option value="IDN-PAR">
                South Kalimantan → Paradip
              </option>

              <option value="IDN-SK-PAR">
                South Kalimantan → Paradip
              </option>

              <option value="IDN-KRI">
                East Kalimantan → Krishnapatnam
              </option>
            </select>
          </div>

          <button
            onClick={() => fetchForecast(route)}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-6 py-3 font-medium text-white transition bg-blue-600 rounded-xl hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <>
                <FiLoader className="animate-spin" />
                Loading...
              </>
            ) : (
              <>
                <FiTrendingUp />
                Refresh Forecast
              </>
            )}
          </button>
        </div>
      </div>

      {/* ERROR */}
      {error && (
        <div className="flex items-start gap-3 p-4 text-red-300 border rounded-2xl border-red-500/30 bg-red-500/10">
          <FiAlertCircle className="mt-0.5 shrink-0" />

          <div>
            <p className="font-medium">
              Forecast service unavailable
            </p>

            <p className="mt-1 text-sm">
              {error}
            </p>
          </div>
        </div>
      )}

      {/* LOADING */}
      {loading && !forecast && (
        <div className="flex items-center justify-center py-20 border rounded-2xl border-slate-800 bg-slate-900">
          <div className="flex items-center gap-3 text-slate-400">
            <FiLoader className="animate-spin" />
            Loading forecast...
          </div>
        </div>
      )}

      {/* FORECAST DATA */}
      {forecast && (
        <>
          {/* KPI CARDS */}
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {/* Latest Rate */}
            <div className="p-5 border rounded-2xl border-slate-800 bg-slate-900">
              <p className="text-sm text-slate-400">
                Latest Freight Rate
              </p>

              <p className="mt-2 text-2xl font-bold text-white">
                {Number.isFinite(latestRate)
                  ? `$${latestRate.toFixed(2)}`
                  : "--"}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                {forecast.unit}
              </p>
            </div>

            {/* Forecast Rate */}
            <div className="p-5 border rounded-2xl border-slate-800 bg-slate-900">
              <p className="text-sm text-slate-400">
                Forecast Rate
              </p>

              <p className="mt-2 text-2xl font-bold text-blue-400">
                {Number.isFinite(forecastRate)
                  ? `$${forecastRate.toFixed(2)}`
                  : "--"}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Expected short-term rate
              </p>
            </div>

            {/* Trend */}
            <div className="p-5 border rounded-2xl border-slate-800 bg-slate-900">
              <p className="text-sm text-slate-400">
                Trend
              </p>

              <div className="flex items-center gap-2 mt-2">
                <span className="text-2xl text-white">
                  {getTrendIcon()}
                </span>

                <span className="text-xl font-bold text-white">
                  {forecast.trend}
                </span>
              </div>

              <p className="mt-1 text-xs text-slate-500">
                Market direction
              </p>
            </div>

            {/* Confidence */}
            <div className="p-5 border rounded-2xl border-slate-800 bg-slate-900">
              <p className="text-sm text-slate-400">
                Confidence
              </p>

              <div className="flex items-center gap-2 mt-2">
                <FiCheckCircle className="text-emerald-400" />

                <span className="text-xl font-bold text-white">
                  {forecast.confidence}
                </span>
              </div>

              <p className="mt-1 text-xs text-slate-500">
                Based on historical observations
              </p>
            </div>
          </div>

          {/* CHART + INTELLIGENCE */}
          <div className="grid gap-6 xl:grid-cols-3">
            {/* CHART */}
            <div className="p-6 border rounded-2xl border-slate-800 bg-slate-900 xl:col-span-2">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-white">
                  Freight Rate Outlook
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  {forecast.route} · Latest vs forecast
                </p>
              </div>

              {chartData.length > 0 ? (
                <div className="h-80">
                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >
                    <LineChart data={chartData}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#1e293b"
                      />

                      <XAxis
                        dataKey="period"
                        stroke="#64748b"
                        tick={{ fill: "#94a3b8" }}
                      />

                      <YAxis
                        stroke="#64748b"
                        tick={{ fill: "#94a3b8" }}
                      />

                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#020617",
                          border: "1px solid #334155",
                          borderRadius: "12px",
                          color: "#fff",
                        }}
                        formatter={(value) => [
                          `$${Number(value).toFixed(2)}`,
                          "Freight Rate",
                        ]}
                      />

                      <Line
                        type="monotone"
                        dataKey="rate"
                        strokeWidth={3}
                        dot={{ r: 5 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="flex items-center justify-center h-80 text-slate-500">
                  Forecast chart data unavailable
                </div>
              )}
            </div>

            {/* INTELLIGENCE */}
            <div className="p-6 border rounded-2xl border-slate-800 bg-slate-900">
              <h2 className="text-lg font-semibold text-white">
                Forecast Intelligence
              </h2>

              <div className="mt-6 space-y-5">
                <div>
                  <p className="text-xs tracking-wider uppercase text-slate-500">
                    Market Signal
                  </p>

                  <div className="flex items-center gap-2 mt-2 text-white">
                    <span className="text-xl">
                      {getTrendIcon()}
                    </span>

                    <span className="font-semibold">
                      {getTrendText()}
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-xs tracking-wider uppercase text-slate-500">
                    Forecast Range
                  </p>

                  <p className="mt-2 text-xl font-bold text-white">
                    {Number.isFinite(lowerBound)
                      ? `$${lowerBound.toFixed(2)}`
                      : "--"}
                    {" – "}
                    {Number.isFinite(upperBound)
                      ? `$${upperBound.toFixed(2)}`
                      : "--"}
                  </p>
                </div>

                <div>
                  <p className="text-xs tracking-wider uppercase text-slate-500">
                    Volatility
                  </p>

                  <p className="mt-2 text-xl font-bold text-white">
                    {Number.isFinite(volatility)
                      ? volatility.toFixed(2)
                      : "--"}
                  </p>
                </div>

                <div>
                  <p className="text-xs tracking-wider uppercase text-slate-500">
                    Historical Observations
                  </p>

                  <p className="mt-2 text-xl font-bold text-white">
                    {forecast.observations || "--"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* MODEL PERFORMANCE */}
          <div className="grid gap-6 md:grid-cols-3">
            <div className="p-5 border rounded-2xl border-slate-800 bg-slate-900">
              <p className="text-sm text-slate-400">Validation MAE</p>
              <p className="mt-2 text-2xl font-bold text-white">
                {forecast.model_metrics?.validation_mae ?? "--"}
              </p>
              <p className="mt-1 text-xs text-slate-500">Lower is better</p>
            </div>
            <div className="p-5 border rounded-2xl border-slate-800 bg-slate-900">
              <p className="text-sm text-slate-400">Validation RMSE</p>
              <p className="mt-2 text-2xl font-bold text-white">
                {forecast.model_metrics?.validation_rmse ?? "--"}
              </p>
              <p className="mt-1 text-xs text-slate-500">Validation error metric</p>
            </div>
            <div className="p-5 border rounded-2xl border-slate-800 bg-slate-900">
              <p className="text-sm text-slate-400">Data Coverage</p>
              <p className="mt-2 text-2xl font-bold text-white">
                {forecast.observations || "--"}
              </p>
              <p className="mt-1 text-xs text-slate-500">Historical route observations</p>
            </div>
          </div>

          <div className="p-5 border rounded-2xl border-amber-500/20 bg-amber-500/5">
            <div className="flex items-start gap-3">
              <FiAlertCircle className="mt-1 text-amber-400" />
              <div>
                <p className="font-semibold text-white">Forecast Interpretation</p>
                <p className="mt-1 text-sm text-slate-400">
                  {forecast.forecast_explanation?.caution || "Use the forecast with the available data context."}
                </p>
                <p className="mt-2 text-xs text-slate-500">
                  {forecast.forecast_explanation?.uncertainty || "Forecast range represents uncertainty, not a formal prediction interval."}
                </p>
              </div>
            </div>
          </div>

          {/* MODEL STATUS */}
          <div className="p-5 border rounded-2xl border-blue-500/20 bg-blue-500/5">
            <div className="flex items-start gap-3">
              <FiBarChart2 className="mt-1 text-blue-400" />

              <div>
                <p className="font-semibold text-white">
                  Forecast Model Status
                </p>

                <p className="mt-1 text-sm text-slate-400">
                  {forecast.model_status}
                </p>

                <p className="mt-2 text-xs text-slate-500">
                  Method: {forecast.method}
                </p>

                <p className="mt-2 text-xs text-slate-500">
                  This prototype uses historical freight observations
                  to generate a short-term rate estimate and market
                  direction.
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Forecast;
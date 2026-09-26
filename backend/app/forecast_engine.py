try:
    import pandas as pd
    import numpy as np
except Exception as error:
    # Forecasting is optional for APIs such as vessel feasibility. Keeping a
    # blocked native data-science DLL from aborting app import lets those
    # independent endpoints remain available.
    pd = None
    np = None
    FORECAST_DEPENDENCY_ERROR = error
else:
    FORECAST_DEPENDENCY_ERROR = None
from pathlib import Path
import json
import csv
import statistics

try:
    from ml.predictor import predict_route
except Exception:
    predict_route = None


# ============================================================
# PATH
# ============================================================

PROJECT_ROOT = Path(__file__).resolve().parents[1]

METRICS_FILE = Path(__file__).resolve().parents[1] / "ml" / "artifacts" / "metrics.json"

DATA_FILE = (
    PROJECT_ROOT
    / "data"
    / "processed"
    / "freight_processed.csv"
)


# ============================================================
# LOAD DATA
# ============================================================

def load_freight_data():
    """
    Load the processed freight dataset.
    """

    if FORECAST_DEPENDENCY_ERROR is not None:
        raise RuntimeError(
            "Forecast dependencies could not be loaded: "
            f"{FORECAST_DEPENDENCY_ERROR}"
        ) from FORECAST_DEPENDENCY_ERROR

    if not DATA_FILE.exists():
        raise FileNotFoundError(
            f"Processed freight dataset not found: {DATA_FILE}"
        )

    df = pd.read_csv(DATA_FILE)

    df["date"] = pd.to_datetime(df["date"])

    df["freight_rate"] = pd.to_numeric(
        df["freight_rate"],
        errors="coerce"
    )

    return df


# ============================================================
# ROUTE FILTER
# ============================================================

def get_route_data(df, route):
    """
    Return historical records for a specific route.
    """

    route_df = df[
        df["route"].str.lower() == route.lower()
    ].copy()

    if route_df.empty:
        raise ValueError(
            f"No freight data found for route: {route}"
        )

    route_df = route_df.sort_values("date")

    return route_df


# ============================================================
# BASELINE FORECAST
# ============================================================

def calculate_baseline_forecast(route_df):
    """
    Calculate a simple weighted baseline forecast.

    Recent observations receive higher weight.
    This is intentionally simple because the current
    dataset is too small for a reliable ML model.
    """

    rates = route_df["freight_rate"].values

    if len(rates) == 1:
        forecast = rates[-1]

    else:
        weights = np.arange(
            1,
            len(rates) + 1
        )

        forecast = np.average(
            rates,
            weights=weights
        )

    return float(forecast)


# ============================================================
# VOLATILITY
# ============================================================

def calculate_volatility(route_df):
    """
    Calculate historical freight-rate volatility.
    """

    rates = route_df["freight_rate"]

    if len(rates) < 2:
        return 0.0

    volatility = rates.std()

    return float(volatility)


# ============================================================
# TREND
# ============================================================

def calculate_trend(route_df):
    """
    Determine whether freight rates are increasing,
    decreasing or relatively stable.
    """

    rates = route_df["freight_rate"].values

    if len(rates) < 2:
        return "INSUFFICIENT_DATA"

    first_rate = rates[0]
    last_rate = rates[-1]

    if first_rate == 0:
        return "INSUFFICIENT_DATA"

    percentage_change = (
        (last_rate - first_rate)
        / first_rate
    ) * 100

    if percentage_change > 5:
        return "RISING"

    if percentage_change < -5:
        return "FALLING"

    return "STABLE"


# ============================================================
# CONFIDENCE LEVEL
# ============================================================

def calculate_confidence(route_df):
    """
    Estimate confidence based on amount of historical data.

    This is NOT model accuracy.
    """

    observations = len(route_df)

    if observations >= 100:
        return "HIGH"

    if observations >= 30:
        return "MEDIUM"

    return "LOW"


# ============================================================
# FORECAST RANGE
# ============================================================

def calculate_forecast_range(
    forecast,
    volatility
):
    """
    Generate an uncertainty range around the baseline.

    This is a simple statistical range, not a formal
    prediction interval.
    """

    if volatility == 0:
        lower = forecast
        upper = forecast

    else:
        lower = forecast - volatility
        upper = forecast + volatility

    lower = max(0, lower)

    return (
        round(float(lower), 2),
        round(float(upper), 2)
    )


# ============================================================
# MAIN FORECAST FUNCTION
# ============================================================

def generate_forecast(route):
    """
    Generate freight forecast using the trained ML model when available.
    Falls back to the weighted historical baseline when the ML model cannot
    be used (for example, insufficient route history).
    """
    # In restricted Windows environments, pandas/numpy native DLLs may be
    # blocked. The small forecast dataset can still use the baseline path.
    if FORECAST_DEPENDENCY_ERROR is not None:
        return _generate_standard_library_forecast(route)

    df = load_freight_data()
    route_df = get_route_data(df, route)

    baseline = calculate_baseline_forecast(route_df)
    volatility = calculate_volatility(route_df)
    trend = calculate_trend(route_df)
    confidence = calculate_confidence(route_df)
    lower, upper = calculate_forecast_range(baseline, volatility)
    latest_record = route_df.iloc[-1]

    historical_series = [
        {
            "date": row["date"].strftime("%Y-%m-%d"),
            "rate": round(float(row["freight_rate"]), 2)
        }
        for _, row in route_df.iterrows()
    ]

    model_metrics = None
    if METRICS_FILE.exists():
        try:
            with open(METRICS_FILE, "r", encoding="utf-8") as file:
                model_metrics = json.load(file)
        except (OSError, json.JSONDecodeError):
            model_metrics = None

    method = "Weighted historical baseline"
    model_status = "BASELINE"
    forecast = baseline
    ml_info = None

    if predict_route is not None:
        try:
            ml_info = predict_route(route)
            forecast = float(ml_info["forecast_freight_rate"])
            lower = float(ml_info["forecast_range"]["lower"])
            upper = float(ml_info["forecast_range"]["upper"])
            method = ml_info["method"]
            model_status = ml_info["model_status"]
        except (ValueError, FileNotFoundError):
            pass
        except Exception:
            # Forecasting should remain available even if the ML artifact
            # is temporarily unavailable.
            pass

    return {
        "route": route,
        "vessel_type": latest_record["vessel_type"],
        "latest_date": latest_record["date"].strftime("%Y-%m-%d"),
        "latest_freight_rate": round(float(latest_record["freight_rate"]), 2),
        "forecast_freight_rate": round(forecast, 2),
        "forecast_range": {
            "lower": round(max(0.0, lower), 2),
            "upper": round(upper, 2)
        },
        "unit": latest_record["unit"],
        "trend": trend,
        "volatility": round(volatility, 2),
        "confidence": confidence,
        "historical_observations": len(route_df),
        "method": method,
        "model_status": model_status,
        "baseline_forecast": round(baseline, 2),
        "ml_details": ml_info,
        "historical_series": historical_series,
        "model_metrics": model_metrics,
        "forecast_explanation": {
            "signal": trend,
            "data_points": len(route_df),
            "uncertainty": "The range reflects forecast uncertainty and recent volatility; it is not a formal prediction interval.",
            "caution": "Confidence is based on historical coverage, and current model metrics are indicative because the prototype dataset is small."
        },
        "note": (
            "The ML model is a prototype trained on the available historical "
            "dataset. Its validation metrics are indicative only because the "
            "dataset is small. The system falls back to the statistical "
            "baseline when ML history/model artifacts are unavailable."
        )
    }


def _generate_standard_library_forecast(route):
    if not DATA_FILE.exists():
        raise FileNotFoundError(f"Processed freight dataset not found: {DATA_FILE}")

    with DATA_FILE.open("r", newline="", encoding="utf-8-sig") as file:
        rows = [
            row for row in csv.DictReader(file)
            if (row.get("route") or "").strip().lower() == route.lower()
        ]
    if not rows:
        raise ValueError(f"No freight data found for route: {route}")

    rows.sort(key=lambda row: row.get("date", ""))
    valid_rows = []
    for row in rows:
        try:
            row["freight_rate"] = float(row["freight_rate"])
        except (KeyError, TypeError, ValueError):
            continue
        if row.get("date"):
            valid_rows.append(row)
    if not valid_rows:
        raise ValueError(f"No valid freight observations found for route: {route}")

    rates = [row["freight_rate"] for row in valid_rows]
    weights = range(1, len(rates) + 1)
    baseline = sum(rate * weight for rate, weight in zip(rates, weights)) / sum(weights)
    volatility = statistics.stdev(rates) if len(rates) > 1 else 0.0
    first_rate, last_rate = rates[0], rates[-1]
    change = ((last_rate - first_rate) / first_rate * 100) if first_rate else None
    if change is None or len(rates) < 2:
        trend = "INSUFFICIENT_DATA"
    elif change > 5:
        trend = "RISING"
    elif change < -5:
        trend = "FALLING"
    else:
        trend = "STABLE"

    observations = len(valid_rows)
    confidence = "HIGH" if observations >= 100 else "MEDIUM" if observations >= 30 else "LOW"
    lower, upper = calculate_forecast_range(baseline, volatility)
    latest = valid_rows[-1]
    metrics = None
    if METRICS_FILE.exists():
        try:
            with METRICS_FILE.open("r", encoding="utf-8") as file:
                metrics = json.load(file)
        except (OSError, json.JSONDecodeError):
            pass

    return {
        "route": route, "vessel_type": latest.get("vessel_type"),
        "latest_date": latest["date"][:10],
        "latest_freight_rate": round(last_rate, 2),
        "forecast_freight_rate": round(baseline, 2),
        "forecast_range": {"lower": round(max(0.0, lower), 2), "upper": round(upper, 2)},
        "unit": latest.get("unit"), "trend": trend,
        "volatility": round(volatility, 2), "confidence": confidence,
        "historical_observations": observations,
        "method": "Weighted historical baseline", "model_status": "BASELINE",
        "baseline_forecast": round(baseline, 2), "ml_details": None,
        "historical_series": [
            {"date": row["date"][:10], "rate": round(row["freight_rate"], 2)}
            for row in valid_rows
        ],
        "model_metrics": metrics,
        "forecast_explanation": {
            "signal": trend, "data_points": observations,
            "uncertainty": "The range reflects forecast uncertainty and recent volatility; it is not a formal prediction interval.",
            "caution": "Confidence is based on historical coverage, and current model metrics are indicative because the prototype dataset is small."
        },
        "note": (
            "The ML model is a prototype trained on the available historical dataset. "
            "Its validation metrics are indicative only because the dataset is small. "
            "The system falls back to the statistical baseline when ML history/model "
            "artifacts are unavailable."
        )
    }



import pandas as pd
import numpy as np
from pathlib import Path

try:
    from ml.predictor import predict_route
except Exception:
    predict_route = None


# ============================================================
# PATH
# ============================================================

PROJECT_ROOT = Path(__file__).resolve().parents[1]

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
    df = load_freight_data()
    route_df = get_route_data(df, route)

    baseline = calculate_baseline_forecast(route_df)
    volatility = calculate_volatility(route_df)
    trend = calculate_trend(route_df)
    confidence = calculate_confidence(route_df)
    lower, upper = calculate_forecast_range(baseline, volatility)
    latest_record = route_df.iloc[-1]

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
        "note": (
            "The ML model is a prototype trained on the available historical "
            "dataset. Its validation metrics are indicative only because the "
            "dataset is small. The system falls back to the statistical "
            "baseline when ML history/model artifacts are unavailable."
        )
    }


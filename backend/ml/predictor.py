"""Prediction service for SAYLVI's freight-rate ML model."""
from pathlib import Path
import json
import joblib
import numpy as np
import pandas as pd

ROOT = Path(__file__).resolve().parents[1]
DATA_FILE = ROOT / "data" / "processed" / "freight_processed.csv"
MODEL_FILE = ROOT / "ml" / "artifacts" / "freight_model.joblib"
METRICS_FILE = ROOT / "ml" / "artifacts" / "metrics.json"

def _features_for_route(df: pd.DataFrame, route: str) -> tuple[pd.DataFrame, pd.DataFrame]:
    df = df.copy()
    df["date"] = pd.to_datetime(df["date"], errors="coerce")
    df["freight_rate"] = pd.to_numeric(df["freight_rate"], errors="coerce")
    df = df.dropna(subset=["date", "freight_rate", "route", "vessel_type"])
    df = df.sort_values(["date", "route"]).reset_index(drop=True)
    start = df["date"].min()

    g = df.groupby("route", group_keys=False)
    df["lag_1"] = g["freight_rate"].shift(1)
    df["lag_2"] = g["freight_rate"].shift(2)
    df["rolling_mean_3"] = g["freight_rate"].transform(
        lambda s: s.shift(1).rolling(3, min_periods=1).mean()
    )
    df["rolling_std_3"] = g["freight_rate"].transform(
        lambda s: s.shift(1).rolling(3, min_periods=2).std()
    )
    df["month"] = df["date"].dt.month
    df["day_of_year"] = df["date"].dt.dayofyear
    df["time_index"] = (df["date"] - start).dt.days

    route_df = df[df["route"].str.lower() == route.lower()].copy()
    return df, route_df

def predict_route(route: str) -> dict:
    if not MODEL_FILE.exists():
        raise FileNotFoundError("ML model has not been trained yet.")

    df = pd.read_csv(DATA_FILE)
    _, route_df = _features_for_route(df, route)
    if route_df.empty:
        raise ValueError(f"No freight data found for route: {route}")
    if len(route_df) < 3:
        raise ValueError("Not enough route history for ML prediction.")

    latest = route_df.iloc[-1]
    latest_date = latest["date"]
    future_date = latest_date + pd.Timedelta(days=30)

    history = route_df["freight_rate"].astype(float).tolist()
    lag_1 = history[-1]
    lag_2 = history[-2]
    previous = history[-3:]
    rolling_mean = float(np.mean(previous))
    rolling_std = float(np.std(previous, ddof=1)) if len(previous) >= 2 else 0.0

    start = pd.to_datetime(df["date"]).min()
    X_future = pd.DataFrame([{
        "route": route_df.iloc[-1]["route"],
        "vessel_type": route_df.iloc[-1]["vessel_type"],
        "month": int(future_date.month),
        "day_of_year": int(future_date.dayofyear),
        "time_index": int((future_date - start).days),
        "lag_1": lag_1,
        "lag_2": lag_2,
        "rolling_mean_3": rolling_mean,
        "rolling_std_3": rolling_std if np.isfinite(rolling_std) else 0.0,
    }])

    model = joblib.load(MODEL_FILE)
    prediction = float(model.predict(X_future)[0])

    metrics = {}
    if METRICS_FILE.exists():
        metrics = json.loads(METRICS_FILE.read_text(encoding="utf-8"))

    # A transparent uncertainty band based on validation error + recent volatility.
    mae = float(metrics.get("validation_mae", 0.0))
    band = max(mae, rolling_std if np.isfinite(rolling_std) else 0.0)
    lower = max(0.0, prediction - band)
    upper = prediction + band

    return {
        "forecast_freight_rate": round(prediction, 2),
        "forecast_range": {
            "lower": round(lower, 2),
            "upper": round(upper, 2),
        },
        "forecast_date": future_date.strftime("%Y-%m-%d"),
        "method": "Random Forest ML",
        "model_status": "ML",
        "model_validation_mae": round(mae, 2),
        "historical_observations": len(route_df),
        "training_rows": metrics.get("training_rows"),
        "validation_rows": metrics.get("validation_rows"),
        "warning": metrics.get("warning"),
    }

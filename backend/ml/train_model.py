"""
SAYLVI freight-rate ML training pipeline.

This is a small-data prototype. It trains a global Random Forest model using
time-series features and route/vessel metadata. It never claims the model is
production-grade when the dataset is too small.
"""
from pathlib import Path
import json
import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error
from sklearn.model_selection import TimeSeriesSplit
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline

ROOT = Path(__file__).resolve().parents[1]
DATA_FILE = ROOT / "data" / "processed" / "freight_processed.csv"
MODEL_DIR = ROOT / "ml" / "artifacts"
MODEL_FILE = MODEL_DIR / "freight_model.joblib"
METRICS_FILE = MODEL_DIR / "metrics.json"

TARGET = "freight_rate"
CATEGORICAL = ["route", "vessel_type"]
NUMERIC = ["month", "day_of_year", "time_index", "lag_1", "lag_2",
           "rolling_mean_3", "rolling_std_3"]

def build_features(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()
    df["date"] = pd.to_datetime(df["date"], errors="coerce")
    df[TARGET] = pd.to_numeric(df[TARGET], errors="coerce")
    df = df.dropna(subset=["date", TARGET, "route", "vessel_type"])
    df = df.sort_values(["date", "route"]).reset_index(drop=True)

    g = df.groupby("route", group_keys=False)
    df["lag_1"] = g[TARGET].shift(1)
    df["lag_2"] = g[TARGET].shift(2)
    df["rolling_mean_3"] = g[TARGET].transform(lambda s: s.shift(1).rolling(3, min_periods=1).mean())
    df["rolling_std_3"] = g[TARGET].transform(lambda s: s.shift(1).rolling(3, min_periods=2).std())

    start = df["date"].min()
    df["month"] = df["date"].dt.month
    df["day_of_year"] = df["date"].dt.dayofyear
    df["time_index"] = (df["date"] - start).dt.days
    return df

def train_model() -> dict:
    if not DATA_FILE.exists():
        raise FileNotFoundError(f"Dataset not found: {DATA_FILE}")

    raw = pd.read_csv(DATA_FILE)
    data = build_features(raw)

    # We need at least two prior observations for a meaningful lag-based row.
    data = data.dropna(subset=["lag_1", "lag_2"]).reset_index(drop=True)
    if len(data) < 12:
        raise ValueError(
            f"Only {len(data)} usable ML rows are available. "
            "At least 12 are required for the prototype."
        )

    X = data[CATEGORICAL + NUMERIC]
    y = data[TARGET].astype(float)

    # Time-aware holdout: last 20% is validation data.
    split = max(1, int(len(data) * 0.2))
    if len(data) - split < 8:
        split = max(1, len(data) - 8)

    X_train, X_test = X.iloc[:-split], X.iloc[-split:]
    y_train, y_test = y.iloc[:-split], y.iloc[-split:]

    preprocessor = ColumnTransformer([
        ("categorical", OneHotEncoder(handle_unknown="ignore"), CATEGORICAL),
        ("numeric", "passthrough", NUMERIC),
    ])

    model = RandomForestRegressor(
        n_estimators=300,
        max_depth=6,
        min_samples_leaf=2,
        random_state=42,
        n_jobs=-1,
    )

    pipeline = Pipeline([
        ("preprocessor", preprocessor),
        ("model", model),
    ])
    pipeline.fit(X_train, y_train)

    pred = pipeline.predict(X_test)
    mae = float(mean_absolute_error(y_test, pred))
    rmse = float(np.sqrt(mean_squared_error(y_test, pred)))

    # Fit final model on all available rows after honest holdout evaluation.
    pipeline.fit(X, y)

    MODEL_DIR.mkdir(parents=True, exist_ok=True)
    joblib.dump(pipeline, MODEL_FILE)

    metrics = {
        "model": "RandomForestRegressor",
        "features": CATEGORICAL + NUMERIC,
        "dataset_rows": int(len(raw)),
        "usable_ml_rows": int(len(data)),
        "training_rows": int(len(X_train)),
        "validation_rows": int(len(X_test)),
        "validation_mae": round(mae, 4),
        "validation_rmse": round(rmse, 4),
        "trained_on": "historical freight data",
        "warning": (
            "Prototype model: dataset is small. Metrics are indicative, "
            "not production-grade. Add substantially more historical data."
        ),
    }
    METRICS_FILE.write_text(json.dumps(metrics, indent=2), encoding="utf-8")
    return metrics

if __name__ == "__main__":
    print(json.dumps(train_model(), indent=2))

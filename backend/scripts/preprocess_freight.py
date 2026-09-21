import pandas as pd
import json
from pathlib import Path


# ============================================================
# PATH CONFIGURATION
# ============================================================

PROJECT_ROOT = Path(__file__).resolve().parents[1]

RAW_FILE = PROJECT_ROOT / "data" / "raw" / "freight_data.csv"
PROCESSED_DIR = PROJECT_ROOT / "data" / "processed"

PROCESSED_FILE = PROCESSED_DIR / "freight_processed.csv"
QUALITY_REPORT_FILE = PROCESSED_DIR / "freight_quality_report.json"


# ============================================================
# REQUIRED COLUMNS
# ============================================================

REQUIRED_COLUMNS = [
    "date",
    "route",
    "origin",
    "destination",
    "vessel_type",
    "freight_rate",
    "unit",
    "source",
    "source_date",
    "source_url",
]


# ============================================================
# LOAD DATA
# ============================================================

print("\n========== FREIGHT DATA PREPROCESSING ==========\n")

if not RAW_FILE.exists():
    raise FileNotFoundError(
        f"Raw dataset not found: {RAW_FILE}"
    )

df = pd.read_csv(RAW_FILE)

print(f"Raw records loaded: {len(df)}")


# ============================================================
# NORMALIZE COLUMN NAMES
# ============================================================

df.columns = df.columns.str.strip()


# ============================================================
# VALIDATE REQUIRED COLUMNS
# ============================================================

missing_columns = [
    column for column in REQUIRED_COLUMNS
    if column not in df.columns
]

if missing_columns:
    raise ValueError(
        f"Missing required columns: {missing_columns}"
    )


# ============================================================
# INITIAL DATA QUALITY CHECK
# ============================================================

initial_rows = len(df)

missing_values_before = int(df.isnull().sum().sum())

duplicate_rows = int(df.duplicated().sum())


# ============================================================
# CLEAN TEXT COLUMNS
# ============================================================

TEXT_COLUMNS = [
    "route",
    "origin",
    "destination",
    "vessel_type",
    "unit",
    "source",
    "source_url",
]

for column in TEXT_COLUMNS:
    df[column] = df[column].astype("string").str.strip()


# ============================================================
# DATE PROCESSING
# ============================================================

df["date"] = pd.to_datetime(
    df["date"],
    errors="coerce"
)

df["source_date"] = pd.to_datetime(
    df["source_date"],
    errors="coerce"
)

invalid_dates = int(
    df["date"].isna().sum()
)

invalid_source_dates = int(
    df["source_date"].isna().sum()
)


# ============================================================
# FREIGHT RATE PROCESSING
# ============================================================

df["freight_rate"] = pd.to_numeric(
    df["freight_rate"],
    errors="coerce"
)

invalid_rates = int(
    df["freight_rate"].isna().sum()
)

non_positive_rates = int(
    (df["freight_rate"] <= 0).sum()
)


# ============================================================
# UNIT VALIDATION
# ============================================================

VALID_UNITS = ["$/tonne"]

invalid_units = int(
    (~df["unit"].isin(VALID_UNITS)).sum()
)


# ============================================================
# REMOVE DUPLICATES
# ============================================================

df = df.drop_duplicates()


# ============================================================
# REMOVE INVALID ESSENTIAL RECORDS
# ============================================================

before_cleaning = len(df)

df = df.dropna(
    subset=[
        "date",
        "route",
        "origin",
        "destination",
        "vessel_type",
        "freight_rate",
    ]
)

df = df[df["freight_rate"] > 0]

after_cleaning = len(df)

rows_removed = before_cleaning - after_cleaning


# ============================================================
# SORT BY DATE
# ============================================================

df = df.sort_values(
    by=["date", "route"]
).reset_index(drop=True)


# ============================================================
# STANDARDIZE DATE FORMAT
# ============================================================

df["date"] = df["date"].dt.strftime("%Y-%m-%d")

df["source_date"] = df["source_date"].dt.strftime("%Y-%m-%d")


# ============================================================
# CREATE PROCESSED DIRECTORY
# ============================================================

PROCESSED_DIR.mkdir(
    parents=True,
    exist_ok=True
)


# ============================================================
# SAVE PROCESSED DATA
# ============================================================

df.to_csv(
    PROCESSED_FILE,
    index=False
)


# ============================================================
# DATA QUALITY REPORT
# ============================================================

date_values = pd.to_datetime(
    df["date"],
    errors="coerce"
)

quality_report = {
    "dataset": "freight_data.csv",

    "records": {
        "initial": initial_rows,
        "processed": len(df),
        "removed": rows_removed,
    },

    "data_quality": {
        "missing_values_before": missing_values_before,
        "duplicate_rows": duplicate_rows,
        "invalid_dates": invalid_dates,
        "invalid_source_dates": invalid_source_dates,
        "invalid_freight_rates": invalid_rates,
        "non_positive_freight_rates": non_positive_rates,
        "invalid_units": invalid_units,
    },

    "date_range": {
        "start": (
            date_values.min().strftime("%Y-%m-%d")
            if not date_values.empty
            else None
        ),
        "end": (
            date_values.max().strftime("%Y-%m-%d")
            if not date_values.empty
            else None
        ),
    },

    "routes": sorted(
        df["route"].dropna().unique().tolist()
    ),

    "vessel_types": sorted(
        df["vessel_type"].dropna().unique().tolist()
    ),

    "forecasting_readiness": {
        "records_available": len(df),
        "status": (
            "INSUFFICIENT_HISTORICAL_DATA"
            if len(df) < 30
            else "READY_FOR_BASELINE_MODEL"
        ),
        "note": (
            "Current dataset is suitable for pipeline validation "
            "and prototype analysis, but it is too small for "
            "reliable production forecasting."
        ),
    },

    "status": "PASSED"
}


# ============================================================
# SAVE QUALITY REPORT
# ============================================================

with open(
    QUALITY_REPORT_FILE,
    "w",
    encoding="utf-8"
) as file:

    json.dump(
        quality_report,
        file,
        indent=4
    )


# ============================================================
# FINAL OUTPUT
# ============================================================

print("\n========== PREPROCESSING COMPLETE ==========\n")

print(f"Initial records       : {initial_rows}")
print(f"Processed records     : {len(df)}")
print(f"Rows removed          : {rows_removed}")

print(f"\nProcessed dataset:")
print(PROCESSED_FILE)

print(f"\nQuality report:")
print(QUALITY_REPORT_FILE)

print("\nForecasting readiness:")
print(
    quality_report["forecasting_readiness"]["status"]
)

print("\n=============================================\n")
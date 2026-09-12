import pandas as pd

# Raw dataset path
file_path = "data/raw/freight_data.csv"

# Load dataset
df = pd.read_csv(file_path)

print("\n========== DATASET OVERVIEW ==========")
print("Rows:", df.shape[0])
print("Columns:", df.shape[1])

print("\n========== COLUMN NAMES ==========")
print(df.columns.tolist())

print("\n========== FIRST 5 RECORDS ==========")
print(df.head())

print("\n========== DATA TYPES ==========")
print(df.dtypes)

print("\n========== MISSING VALUES ==========")
print(df.isnull().sum())

print("\n========== DUPLICATE ROWS ==========")
print("Duplicates:", df.duplicated().sum())

print("\n========== VESSEL TYPES ==========")
print(df["vessel_type"].value_counts())

print("\n========== ROUTES ==========")
print(df["route"].value_counts())

print("\n========== FREIGHT RATE STATISTICS ==========")
print(df["freight_rate"].describe())

print("\n========== DATE RANGE ==========")
print("Start:", df["date"].min())
print("End:", df["date"].max())

print("\n========== UNIQUE ORIGINS ==========")
print(df["origin"].unique())

print("\n========== UNIQUE DESTINATIONS ==========")
print(df["destination"].unique())
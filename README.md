# SAYLIV

**Smart Maritime Intelligence for Freight Forecasting, Vessel Screening and Chartering Decision Support**

SAYLIV is a modular decision-support prototype for bulk-cargo chartering. It combines historical freight forecasting with explainable vessel feasibility, cost, risk and decision analysis.

## Architecture

```
React Frontend
      ↓ REST
FastAPI Backend
      ↓
┌──────────┬──────────┬──────────┐
│ Forecast │  Vessel  │   Cost   │
│   ML     │ Screening│ Analysis │
└────┬─────┴─────┬────┴─────┬────┘
     └───────────┼───────────┘
                 ↓
             Risk Engine
                 ↓
          Decision Engine
                 ↓
        BOOK / WAIT / AVOID
                 ↓
            Explanation
```

## Current intelligence

- **Freight forecasting:** Scikit-learn Random Forest Regression with route, vessel type, temporal and lag/rolling features.
- **Validation:** chronological holdout with MAE and RMSE.
- **Forecast uncertainty:** transparent range using validation error/recent volatility; not a formal prediction interval.
- **Vessel intelligence:** explainable constraint screening and compatibility scoring.
- **Risk intelligence:** rule-based market, operational, vessel and commercial risk factors.
- **Cost intelligence:** deterministic cost calculation with transparent cost-efficiency heuristics.
- **Decision intelligence:** multi-factor explainable score producing BOOK / WAIT / AVOID.
- **What-if analysis:** scenario changes to freight, fuel and operational inputs.
- **Cargo pooling:** combine compatible lots by route, cargo type and loading week, then screen the pooled volume against current vessel constraints.
- **Tracking:** current prototype vessel-position feed; it is not production live AIS.

## ML model

The current model is intentionally a prototype because the available dataset is small.

- Model: `RandomForestRegressor`
- Current dataset rows: 30
- Usable ML rows: 20
- Training rows: 16
- Validation rows: 4
- Validation MAE: 3.0859
- Validation RMSE: 3.5214

These metrics are indicative only and should not be presented as production-grade accuracy.

## Run locally

### Backend

From the repository root:

```powershell
cd backend
..\.venv\Scripts\python.exe -m uvicorn app.main:app --reload
```

API:
- `http://127.0.0.1:8000`
- Swagger: `http://127.0.0.1:8000/docs`
- Health: `http://127.0.0.1:8000/health`

### Frontend

```powershell
cd Frontend
npm.cmd run dev
```

Frontend:
- `http://localhost:5173`

## Deploy on Render

The repository includes a Render Blueprint at [`render.yaml`](render.yaml). To deploy it, connect this GitHub repository in Render and create a new Blueprint from the repository. Render will build the FastAPI backend and Vite frontend, connect them, and create a PostgreSQL database.

The Blueprint uses Render's free plans for a demo. Free web services can sleep when idle, and free PostgreSQL databases expire 30 days after creation. Upgrade the database to a paid plan before that deadline to keep saved analyses; Render's current smallest paid PostgreSQL plan is listed on its [pricing page](https://render.com/pricing). See Render's [free instance limitations](https://render.com/docs/free).

## Demo flow

1. Open **New Analysis**.
2. Select a supported route and enter cargo/operational inputs.
3. Run the analysis.
4. Review the **Command Center** recommendation.
5. Open **Freight Forecast** for historical data, forecast, uncertainty and model metrics.
6. Open **Vessel Match** for constraint-based screening.
7. Open **Risk / Cost / Decision** views for the supporting factors.
8. Use **What-If Analysis** to show how changing assumptions affects the decision.

## Technical honesty

SAYLIV is a decision-support prototype, not an automated chartering authority. Commercial approval remains with the procurement team.

The current implementation does **not** claim:
- live AIS vessel tracking;
- live fuel or port-market feeds;
- production-grade forecast accuracy;
- ML-based vessel matching or risk scoring;
- formal statistical prediction intervals;
- universal coverage of all global ports/routes.

## Development checks

The frontend includes Vite build/lint scripts. GitHub Actions can be used to automatically build and test repository changes; workflow definitions live under `.github/workflows`.


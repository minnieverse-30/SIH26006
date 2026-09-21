# SAYLVI Freight ML

## What this adds
- Random Forest freight-rate forecasting
- Route/vessel categorical features
- Time features
- Lag-1 and lag-2 freight rates
- 3-observation rolling mean and volatility
- Time-aware validation
- MAE/RMSE reporting
- Saved model artifact
- Prediction uncertainty band using validation error/recent volatility
- Automatic fallback to the weighted historical baseline

## Train / retrain

From the `backend` folder:

```bash
python -m ml.train_model
```

This creates:
- `ml/artifacts/freight_model.joblib`
- `ml/artifacts/metrics.json`

## API

The existing endpoint now uses the ML model automatically:

```text
GET /api/forecast?route=AUS-PAR
```

The response contains:
- `forecast_freight_rate`
- `forecast_range`
- `method`
- `model_status`
- `baseline_forecast`
- `ml_details`

## Current data limitation

The supplied dataset has 30 records, with 20 usable rows after lag-feature construction. The model is therefore a hackathon prototype, not a production forecasting model. As more historical observations are added, retrain the model and re-evaluate the validation metrics.

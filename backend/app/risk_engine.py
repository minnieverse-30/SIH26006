from app.forecast_engine import generate_forecast


def calculate_risk(
    route: str,
    cargo_quantity: float,
    port_delay_days: float = 0.0,
    vessel_availability: str = "AVAILABLE",
    contract_flexibility: str = "FLEXIBLE"
):

    # ============================================================
    # VALIDATION
    # ============================================================

    if cargo_quantity <= 0:
        raise ValueError(
            "Cargo quantity must be greater than zero."
        )

    if port_delay_days < 0:
        raise ValueError(
            "Port delay days cannot be negative."
        )

    # ============================================================
    # FORECAST
    # ============================================================

    forecast = generate_forecast(route)

    risk_score = 0

    risk_factors = []
    risk_categories = []

    # ============================================================
    # 1. FREIGHT RISK
    # ============================================================

    if forecast["confidence"] == "LOW":

        risk_score += 25

        factor = {"factor": "Freight Forecast", "category": "MARKET", "level": "MEDIUM", "impact": 25, "reason": "Historical freight data is limited."}
        risk_factors.append(factor)
        risk_categories.append("MARKET")

    if forecast["trend"] == "RISING":

        risk_score += 20

        factor = {"factor": "Freight Trend", "category": "MARKET", "level": "HIGH", "impact": 20, "reason": "Freight rates are showing a rising trend."}
        risk_factors.append(factor)
        risk_categories.append("MARKET")

    # ============================================================
    # 2. PORT DELAY RISK
    # ============================================================

    if port_delay_days >= 5:

        risk_score += 25

        factor = {"factor": "Port Delay", "category": "OPERATIONAL", "level": "HIGH", "impact": 25, "reason": "Expected port delay is significant."}
        risk_factors.append(factor)
        risk_categories.append("OPERATIONAL")

    elif port_delay_days >= 2:

        risk_score += 15

        factor = {"factor": "Port Delay", "category": "OPERATIONAL", "level": "MEDIUM", "impact": 15, "reason": "Moderate port delay may affect the charter."}
        risk_factors.append(factor)
        risk_categories.append("OPERATIONAL")

    # ============================================================
    # 3. VESSEL AVAILABILITY RISK
    # ============================================================

    availability = vessel_availability.strip().upper()

    if availability == "LOW":

        risk_score += 20

        factor = {"factor": "Vessel Availability", "category": "VESSEL", "level": "HIGH", "impact": 20, "reason": "Suitable vessel availability is currently limited."}
        risk_factors.append(factor)
        risk_categories.append("VESSEL")

    elif availability == "MEDIUM":

        risk_score += 10

        factor = {"factor": "Vessel Availability", "category": "VESSEL", "level": "MEDIUM", "impact": 10, "reason": "Moderate vessel availability may limit chartering options."}
        risk_factors.append(factor)
        risk_categories.append("VESSEL")

    elif availability == "HIGH":

        factor = {"factor": "Vessel Availability", "category": "VESSEL", "level": "LOW", "impact": 0, "reason": "Suitable vessel availability is currently high."}
        risk_factors.append(factor)
        risk_categories.append("VESSEL")

    else:

        risk_score += 20

        factor = {"factor": "Vessel Availability", "category": "VESSEL", "level": "HIGH", "impact": 20, "reason": "Vessel availability information is unavailable or invalid."}
        risk_factors.append(factor)
        risk_categories.append("VESSEL")

    # ============================================================
    # 4. CONTRACT FLEXIBILITY RISK
    # ============================================================

    flexibility = contract_flexibility.strip().upper()

    if flexibility == "FIXED":

        risk_score += 10

        factor = {"factor": "Contract Flexibility", "category": "COMMERCIAL", "level": "MEDIUM", "impact": 10, "reason": "Fixed contracts provide less flexibility if market conditions change."}
        risk_factors.append(factor)
        risk_categories.append("COMMERCIAL")

    # ============================================================
    # FINAL RISK LEVEL
    # ============================================================

    if risk_score >= 60:

        risk_level = "HIGH"

    elif risk_score >= 30:

        risk_level = "MEDIUM"

    else:

        risk_level = "LOW"

    # ============================================================
    # RESPONSE
    # ============================================================

    return {

        "route": route,

        "cargo_quantity_tonnes": cargo_quantity,

        "risk_score": min(risk_score, 100),

        "risk_level": risk_level,

        "risk_categories": sorted(set(risk_categories)),

        "risk_factors": risk_factors,

        "risk_summary": {
            "market": sum(f["impact"] for f in risk_factors if f["category"] == "MARKET"),
            "operational": sum(f["impact"] for f in risk_factors if f["category"] == "OPERATIONAL"),
            "vessel": sum(f["impact"] for f in risk_factors if f["category"] == "VESSEL"),
            "commercial": sum(f["impact"] for f in risk_factors if f["category"] == "COMMERCIAL")
        },

        "forecast_confidence": forecast["confidence"],

        "model_status": "RULE_BASED",

        "note": (
            "Risk assessment is currently rule-based and should be "
            "validated with historical operational data before production use."
        )
    }
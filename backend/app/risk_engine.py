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

    # ============================================================
    # 1. FREIGHT RISK
    # ============================================================

    if forecast["confidence"] == "LOW":

        risk_score += 25

        risk_factors.append({
            "factor": "Freight Forecast",
            "level": "MEDIUM",
            "reason": "Historical freight data is limited."
        })

    if forecast["trend"] == "RISING":

        risk_score += 20

        risk_factors.append({
            "factor": "Freight Trend",
            "level": "HIGH",
            "reason": "Freight rates are showing a rising trend."
        })

    # ============================================================
    # 2. PORT DELAY RISK
    # ============================================================

    if port_delay_days >= 5:

        risk_score += 25

        risk_factors.append({
            "factor": "Port Delay",
            "level": "HIGH",
            "reason": "Expected port delay is significant."
        })

    elif port_delay_days >= 2:

        risk_score += 15

        risk_factors.append({
            "factor": "Port Delay",
            "level": "MEDIUM",
            "reason": "Moderate port delay may affect the charter."
        })

    # ============================================================
    # 3. VESSEL AVAILABILITY RISK
    # ============================================================

    availability = vessel_availability.strip().upper()

    if availability == "LOW":

        risk_score += 20

        risk_factors.append({
            "factor": "Vessel Availability",
            "level": "HIGH",
            "reason": "Suitable vessel availability is currently limited."
        })

    elif availability == "MEDIUM":

        risk_score += 10

        risk_factors.append({
            "factor": "Vessel Availability",
            "level": "MEDIUM",
            "reason": "Moderate vessel availability may limit chartering options."
        })

    elif availability == "HIGH":

        risk_factors.append({
            "factor": "Vessel Availability",
            "level": "LOW",
            "reason": "Suitable vessel availability is currently high."
        })

    else:

        risk_score += 20

        risk_factors.append({
            "factor": "Vessel Availability",
            "level": "HIGH",
            "reason": "Vessel availability information is unavailable or invalid."
        })

    # ============================================================
    # 4. CONTRACT FLEXIBILITY RISK
    # ============================================================

    flexibility = contract_flexibility.strip().upper()

    if flexibility == "FIXED":

        risk_score += 10

        risk_factors.append({
            "factor": "Contract Flexibility",
            "level": "MEDIUM",
            "reason": (
                "Fixed contracts provide less flexibility "
                "if market conditions change."
            )
        })

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

        "risk_factors": risk_factors,

        "forecast_confidence": forecast["confidence"],

        "model_status": "RULE_BASED",

        "note": (
            "Risk assessment is currently rule-based and should be "
            "validated with historical operational data before production use."
        )
    }
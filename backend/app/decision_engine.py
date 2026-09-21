from app.forecast_engine import generate_forecast
from app.feasibility_engine import find_feasible_vessels
from app.cost_engine import calculate_cost
from app.risk_engine import calculate_risk


def generate_decision(
    route: str,
    cargo_quantity: float,
    origin: str,
    destination: str,
    fuel_cost: float = 0.0,
    port_cost: float = 0.0,
    idle_cost: float = 0.0,
    risk_cost: float = 0.0,
    port_delay_days: float = 0.0,
    vessel_availability: str = "AVAILABLE",
    contract_flexibility: str = "FLEXIBLE"
):

    # ========================================================
    # 1. FREIGHT FORECAST
    # ========================================================

    forecast = generate_forecast(route)

    # ========================================================
    # 2. VESSEL FEASIBILITY
    # ========================================================

    feasibility = find_feasible_vessels(
        cargo_quantity=cargo_quantity,
        origin=origin,
        destination=destination
    )

    feasible_vessels = [
        vessel
        for vessel in feasibility["vessels"]
        if vessel.get("status") == "FEASIBLE"
    ]

    # ========================================================
    # 3. COST
    # ========================================================

    cost = calculate_cost(
        route=route,
        cargo_quantity=cargo_quantity,
        fuel_cost=fuel_cost,
        port_cost=port_cost,
        idle_cost=idle_cost,
        risk_cost=risk_cost
    )

    # ========================================================
    # 4. RISK
    # ========================================================

    risk = calculate_risk(
        route=route,
        cargo_quantity=cargo_quantity,
        port_delay_days=port_delay_days,
        vessel_availability=vessel_availability,
        contract_flexibility=contract_flexibility
    )

    risk_level = risk["risk_level"]
    trend = forecast["trend"]

    # ========================================================
    # 5. DECISION LOGIC
    # ========================================================

    reasons = []

    # No feasible vessel
    if len(feasible_vessels) == 0:

        decision = "AVOID"

        reasons.append(
            "No feasible vessel was found for the selected "
            "cargo and route constraints."
        )

    # High risk
    elif risk_level == "HIGH":

        decision = "WAIT"

        reasons.append(
            "Current operational and market risk is high."
        )

    # Rising freight market
    elif trend == "RISING":

        decision = "BOOK"

        reasons.append(
            "Freight rates are showing a rising trend, "
            "so delaying the charter may increase cost."
        )

    # Falling freight market
    elif trend == "FALLING":

        decision = "WAIT"

        reasons.append(
            "Freight rates are showing a falling trend, "
            "so waiting may provide a better rate."
        )

    # Stable market
    else:

        decision = "BOOK"

        reasons.append(
            "Market conditions are relatively stable and "
            "feasible vessel options are available."
        )

    # ========================================================
    # 6. ADDITIONAL REASONS
    # ========================================================

    if risk_level == "MEDIUM":

        reasons.append(
            "Moderate risk should be considered before "
            "final charter approval."
        )

    if len(feasible_vessels) > 0:

        reasons.append(
            f"{len(feasible_vessels)} feasible vessel option(s) "
            "are available based on current constraints."
        )

    # ========================================================
    # 7. CONFIDENCE
    # ========================================================

    if forecast["confidence"] == "HIGH":

        decision_confidence = "HIGH"

    elif forecast["confidence"] == "MEDIUM":

        decision_confidence = "MEDIUM"

    else:

        decision_confidence = "LOW"

    # ========================================================
    # 8. FINAL RESPONSE
    # ========================================================

    return {

        "decision": decision,

        "decision_confidence": decision_confidence,

        "route": route,

        "origin": origin,

        "destination": destination,

        "cargo_quantity_tonnes": cargo_quantity,

        "forecast": {

            "forecast_rate": forecast["forecast_freight_rate"],

            "trend": forecast["trend"],

            "confidence": forecast["confidence"],

            "unit": forecast["unit"]

        },

        "feasibility": {

            "origin": feasibility["origin"],

            "destination": feasibility["destination"],

            "feasible_vessel_count": len(feasible_vessels),

            "total_vessels_checked": feasibility["total_vessels_checked"],

            "vessels": feasible_vessels

        },

        "cost": {

            "total_expected_cost": cost["total_expected_cost"],

            "expected_cost_per_tonne": cost["expected_cost_per_tonne"],

            "currency": cost["currency"]

        },

        "risk": {

            "risk_score": risk["risk_score"],

            "risk_level": risk["risk_level"],

            "risk_factors": risk["risk_factors"]

        },

        "reasons": reasons,

        "model_status": "RULE_BASED_DECISION",

        "note": (

            "Decision is generated using forecast, vessel feasibility, "

            "expected cost and risk indicators. Final commercial approval "

            "should remain with the procurement team."

        )

    }
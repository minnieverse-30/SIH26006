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
    cost_efficiency = cost["cost_efficiency_score"]

    # ========================================================
    # 5. EXPLAINABLE DECISION SCORE
    # ========================================================

    # The decision remains rule-based, but now combines multiple
    # independently explainable signals instead of relying on trend alone.
    # Score is directional: higher means stronger case to book now.
    decision_score = 50
    decision_factors = []

    if len(feasible_vessels) == 0:
        decision_score = 0
        decision_factors.append({
            "factor": "Vessel feasibility",
            "impact": -50,
            "reason": "No vessel satisfies the current cargo and route constraints."
        })
    else:
        decision_factors.append({
            "factor": "Vessel feasibility",
            "impact": 15,
            "reason": f"{len(feasible_vessels)} feasible vessel option(s) are available."
        })

    if cost_efficiency >= 85:
        decision_score += 10
        decision_factors.append({
            "factor": "Cost efficiency", "impact": 10,
            "reason": "Expected cost has relatively low non-freight exposure."
        })
    elif cost_efficiency < 70:
        decision_score -= 10
        decision_factors.append({
            "factor": "Cost efficiency", "impact": -10,
            "reason": "Additional operational and risk costs create higher cost exposure."
        })
    else:
        decision_factors.append({
            "factor": "Cost efficiency", "impact": 0,
            "reason": "Cost exposure is within the moderate range."
        })

    if risk_level == "HIGH":
        decision_score -= 30
        decision_factors.append({
            "factor": "Operational risk",
            "impact": -30,
            "reason": "Current risk level is high."
        })
    elif risk_level == "MEDIUM":
        decision_score -= 15
        decision_factors.append({
            "factor": "Operational risk",
            "impact": -15,
            "reason": "Current risk level is medium."
        })
    else:
        decision_score += 10
        decision_factors.append({
            "factor": "Operational risk",
            "impact": 10,
            "reason": "Current risk level is low."
        })

    if trend == "RISING":
        decision_score += 25
        decision_factors.append({
            "factor": "Freight trend",
            "impact": 25,
            "reason": "Freight rates are rising, increasing the potential cost of delay."
        })
    elif trend == "FALLING":
        decision_score -= 20
        decision_factors.append({
            "factor": "Freight trend",
            "impact": -20,
            "reason": "Freight rates are falling, so waiting may provide a lower rate."
        })
    elif trend == "STABLE":
        decision_factors.append({
            "factor": "Freight trend",
            "impact": 0,
            "reason": "Freight rates are relatively stable."
        })
    else:
        decision_score -= 10
        decision_factors.append({
            "factor": "Freight trend",
            "impact": -10,
            "reason": "There is insufficient historical data to establish a reliable trend."
        })

    if forecast["confidence"] == "HIGH":
        decision_score += 10
    elif forecast["confidence"] == "LOW":
        decision_score -= 10

    decision_factors.append({
        "factor": "Forecast confidence",
        "impact": 10 if forecast["confidence"] == "HIGH" else (-10 if forecast["confidence"] == "LOW" else 0),
        "reason": f'Forecast confidence is {forecast["confidence"].lower()}.'
    })

    decision_score = max(0, min(100, decision_score))

    if len(feasible_vessels) == 0:
        decision = "AVOID"
    elif decision_score >= 65:
        decision = "BOOK"
    elif decision_score <= 40:
        decision = "WAIT"
    else:
        decision = "WAIT"

    reasons = [factor["reason"] for factor in decision_factors]

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

    # Decision confidence reflects both forecast confidence and how clearly
    # the combined score separates the recommendation from the middle range.
    score_margin = abs(decision_score - 50)

    if forecast["confidence"] == "HIGH" and score_margin >= 20:
        decision_confidence = "HIGH"
    elif forecast["confidence"] == "LOW" or score_margin < 10:
        decision_confidence = "LOW"
    else:
        decision_confidence = "MEDIUM"

    # ========================================================
    # 8. FINAL RESPONSE
    # ========================================================

    return {

        "decision": decision,

        "decision_confidence": decision_confidence,\n\n        "decision_score": decision_score,\n\n        "decision_factors": decision_factors,

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

            "expected_cost_per_tonne": cost["expected_cost_per_tonne"],\n\n            "breakdown": cost["cost_breakdown"],

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
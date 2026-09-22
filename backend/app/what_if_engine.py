from app.forecast_engine import generate_forecast
from app.cost_engine import calculate_cost
from app.risk_engine import calculate_risk


def run_what_if(
    route: str,
    cargo_quantity: float,
    freight_change_percent: float = 0.0,
    fuel_change_percent: float = 0.0,
    fuel_cost: float = 0.0,
    port_delay_days: float = 0.0,
    vessel_availability: str = "AVAILABLE",
    contract_flexibility: str = "FLEXIBLE"
):
    if cargo_quantity <= 0:
        raise ValueError("Cargo quantity must be greater than zero.")
    if fuel_cost < 0:
        raise ValueError("Fuel cost cannot be negative.")

    # ========================================================
    # 1. BASE FORECAST
    # ========================================================

    forecast = generate_forecast(route)

    base_freight_rate = forecast["forecast_freight_rate"]

    # ========================================================
    # 2. WHAT-IF FREIGHT RATE
    # ========================================================

    scenario_freight_rate = (
        base_freight_rate
        * (1 + freight_change_percent / 100)
    )

    # ========================================================
    # 3. BASE COST
    # ========================================================

    base_cost = calculate_cost(
        route=route,
        cargo_quantity=cargo_quantity,
        fuel_cost=fuel_cost
    )

    base_total_cost = base_cost["total_expected_cost"]

    # ========================================================
    # 4. SCENARIO FREIGHT COST
    # ========================================================

    base_freight_cost = (
        base_freight_rate * cargo_quantity
    )

    scenario_freight_cost = (
        scenario_freight_rate * cargo_quantity
    )

    # Difference caused by freight change
    freight_cost_difference = (
        scenario_freight_cost - base_freight_cost
    )

    # ========================================================
    # 5. FUEL IMPACT
    # ========================================================

    base_fuel_cost = float(fuel_cost)

    scenario_fuel_cost = (
        base_fuel_cost
        * (1 + fuel_change_percent / 100)
    )

    fuel_cost_difference = (
        scenario_fuel_cost - base_fuel_cost
    )

    # ========================================================
    # 6. SCENARIO TOTAL COST
    # ========================================================

    scenario_total_cost = (
        base_total_cost
        + freight_cost_difference
        + fuel_cost_difference
    )

    scenario_cost_per_tonne = (
        scenario_total_cost / cargo_quantity
    )

    # ========================================================
    # 7. RISK
    # ========================================================

    risk = calculate_risk(
        route=route,
        cargo_quantity=cargo_quantity,
        port_delay_days=port_delay_days,
        vessel_availability=vessel_availability,
        contract_flexibility=contract_flexibility
    )

    # ========================================================
    # 8. SCENARIO DECISION
    # ========================================================

    if risk["risk_level"] == "HIGH":
        decision = "AVOID"

    elif freight_change_percent >= 10:
        decision = "BOOK"

    elif freight_change_percent <= -10:
        decision = "WAIT"

    elif port_delay_days >= 5:
        decision = "WAIT"

    else:
        decision = "BOOK"

    # ========================================================
    # 9. EXPLANATION
    # ========================================================

    explanation = []

    if freight_change_percent > 0:
        explanation.append(
            f"Freight rate increased by "
            f"{freight_change_percent}%."
        )

    elif freight_change_percent < 0:
        explanation.append(
            f"Freight rate decreased by "
            f"{abs(freight_change_percent)}%."
        )

    if fuel_change_percent != 0:
        explanation.append(
            f"Fuel cost changed by "
            f"{fuel_change_percent}%."
        )

    if port_delay_days > 0:
        explanation.append(
            f"Expected port delay is "
            f"{port_delay_days} day(s)."
        )

    if not explanation:
        explanation.append(
            "No major scenario changes were applied."
        )

    # ========================================================
    # 10. RETURN RESULT
    # ========================================================

    return {
        "route": route,
        "cargo_quantity_tonnes": cargo_quantity,

        "base_scenario": {
            "freight_rate": round(base_freight_rate, 2),
            "total_expected_cost": round(base_total_cost, 2),
            "cost_per_tonne": round(
                base_total_cost / cargo_quantity, 2
            )
        },

        "what_if_scenario": {
            "freight_rate": round(
                scenario_freight_rate, 2
            ),
            "total_expected_cost": round(
                scenario_total_cost, 2
            ),
            "cost_per_tonne": round(
                scenario_cost_per_tonne, 2
            ),
            "freight_change_percent": freight_change_percent,
            "fuel_change_percent": fuel_change_percent,
            "port_delay_days": port_delay_days
        },

        "impact": {
            "freight_cost_difference": round(
                freight_cost_difference, 2
            ),
            "fuel_cost_difference": round(
                fuel_cost_difference, 2
            ),
            "total_cost_difference": round(
                scenario_total_cost - base_total_cost, 2
            )
        },

        "risk": {
            "risk_score": risk["risk_score"],
            "risk_level": risk["risk_level"]
        },

        "decision": decision,

        "explanation": explanation,

        "model_status": "RULE_BASED_SCENARIO",

        "note": (
            "What-if results are scenario estimates based on "
            "current baseline assumptions."
        )
    }
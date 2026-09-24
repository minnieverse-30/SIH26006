from app.forecast_engine import generate_forecast


# ============================================================
# COST ENGINE
# ============================================================

def calculate_cost(
    route: str,
    cargo_quantity: float,
    fuel_cost: float = 0.0,
    port_cost: float = 0.0,
    idle_cost: float = 0.0,
    risk_cost: float = 0.0
):
    """
    Calculate total expected chartering cost.

    Freight cost:
        freight rate ($/tonne) * cargo quantity (tonnes)

    Other costs are supplied by the user/system and are
    added to the expected freight cost.
    """

    if cargo_quantity <= 0:
        raise ValueError(
            "Cargo quantity must be greater than zero."
        )

    if fuel_cost < 0:
        raise ValueError(
            "Fuel cost cannot be negative."
        )

    if port_cost < 0:
        raise ValueError(
            "Port cost cannot be negative."
        )

    if idle_cost < 0:
        raise ValueError(
            "Idle cost cannot be negative."
        )

    if risk_cost < 0:
        raise ValueError(
            "Risk cost cannot be negative."
        )

    # --------------------------------------------------------
    # Get freight forecast
    # --------------------------------------------------------

    forecast = generate_forecast(route)

    forecast_rate = forecast["forecast_freight_rate"]

    # --------------------------------------------------------
    # Freight cost
    # --------------------------------------------------------

    freight_cost = (
        forecast_rate * cargo_quantity
    )

    # --------------------------------------------------------
    # Total cost
    # --------------------------------------------------------

    total_cost = (
        freight_cost
        + fuel_cost
        + port_cost
        + idle_cost
        + risk_cost
    )

    # --------------------------------------------------------
    # Cost per tonne
    # --------------------------------------------------------

    cost_per_tonne = (
        total_cost / cargo_quantity
    )

    additional_cost = fuel_cost + port_cost + idle_cost + risk_cost
    freight_share = (freight_cost / total_cost * 100) if total_cost else 0.0
    additional_share = (additional_cost / total_cost * 100) if total_cost else 0.0
    cost_efficiency_score = max(0.0, min(100.0, 100.0 - additional_share))

    cost_drivers = []
    cost_drivers.append({
        "factor": "Freight exposure",
        "level": "HIGH" if freight_share >= 80 else "MEDIUM",
        "reason": f"Freight represents {freight_share:.1f}% of expected cost."
    })
    for label, value in ((
        ("Fuel cost", fuel_cost), ("Port cost", port_cost),
        ("Idle cost", idle_cost), ("Risk cost", risk_cost)
    )):
        if value > 0:
            share = value / total_cost * 100 if total_cost else 0
            cost_drivers.append({
                "factor": label,
                "level": "HIGH" if share >= 15 else ("MEDIUM" if share >= 5 else "LOW"),
                "reason": f"{label} contributes {share:.1f}% of expected cost."
            })

    return {
        "route": route,

        "cargo_quantity_tonnes": cargo_quantity,

        "forecast_freight_rate": round(
            forecast_rate,
            2
        ),

        "unit": "$/tonne",

        "cost_breakdown": {
            "freight_cost": round(
                freight_cost,
                2
            ),

            "fuel_cost": round(
                fuel_cost,
                2
            ),

            "port_cost": round(
                port_cost,
                2
            ),

            "idle_cost": round(
                idle_cost,
                2
            ),

            "risk_cost": round(
                risk_cost,
                2
            )
        },

        "total_expected_cost": round(
            total_cost,
            2
        ),

        "expected_cost_per_tonne": round(
            cost_per_tonne,
            2
        ),

        "cost_efficiency_score": round(cost_efficiency_score, 1),

        "cost_shares": {
            "freight_percent": round(freight_share, 1),
            "additional_percent": round(additional_share, 1)
        },

        "cost_drivers": cost_drivers,

        "currency": "USD",

        "forecast_confidence": forecast[
            "confidence"
        ],

        "model_status": "BASELINE"
    }
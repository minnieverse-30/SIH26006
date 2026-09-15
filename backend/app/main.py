from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Analysis

from fastapi.middleware.cors import CORSMiddleware

from app.feasibility_engine import find_feasible_vessels

from app.forecast_engine import generate_forecast

from app.cost_engine import calculate_cost

from app.risk_engine import calculate_risk

from app.decision_engine import generate_decision

from app.what_if_engine import run_what_if

from app.vessel_tracking_engine import (

    generate_vessel_positions,

    get_vessel_position

)

# ============================================================

# APP

# ============================================================

app = FastAPI(

    title="SAIL-FORGE API",

    description=(

        "AI-Powered Freight Forecasting & "

        "Vessel Chartering Decision Support System"

    ),

    version="1.0.0",

)

# ============================================================

# CORS

# ============================================================

app.add_middleware(

    CORSMiddleware,

    allow_origins=[

        "http://localhost:5173"

    ],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"],

)

# ============================================================

# ROOT

# ============================================================

@app.get("/")

def root():

    return {

        "message": "SAIL-FORGE API is running",

        "status": "success"

    }

# ============================================================

# HEALTH CHECK

# ============================================================

@app.get("/health")

def health_check():

    return {

        "status": "healthy",

        "service": "SAIL-FORGE Backend"

    }

# ============================================================

# FREIGHT FORECAST

# ============================================================

@app.get("/api/forecast")

def freight_forecast(route: str):

    try:

        result = generate_forecast(route)

        return {

            "status": "success",

            "data": result

        }

    except ValueError as error:

        raise HTTPException(

            status_code=404,

            detail=str(error)

        )

    except Exception:

        raise HTTPException(

            status_code=500,

            detail="Unable to generate freight forecast."

        )

# ============================================================

# VESSEL FEASIBILITY

# ============================================================

@app.get("/api/vessels/feasibility")

def vessel_feasibility(

    cargo_quantity: float,

    origin: str,

    destination: str

):

    try:

        result = find_feasible_vessels(

            cargo_quantity=cargo_quantity,

            origin=origin,

            destination=destination

        )

        return {

            "status": "success",

            "data": result

        }

    except ValueError as error:

        raise HTTPException(

            status_code=400,

            detail=str(error)

        )

    except Exception:

        raise HTTPException(

            status_code=500,

            detail="Unable to evaluate vessel feasibility."

        )

# ============================================================

# COST ESTIMATION

# ============================================================

@app.get("/api/cost")

def cost_estimation(

    route: str,

    cargo_quantity: float,

    fuel_cost: float = 0.0,

    port_cost: float = 0.0,

    idle_cost: float = 0.0,

    risk_cost: float = 0.0

):

    try:

        result = calculate_cost(

            route=route,

            cargo_quantity=cargo_quantity,

            fuel_cost=fuel_cost,

            port_cost=port_cost,

            idle_cost=idle_cost,

            risk_cost=risk_cost

        )

        return {

            "status": "success",

            "data": result

        }

    except ValueError as error:

        raise HTTPException(

            status_code=400,

            detail=str(error)

        )

    except Exception:

        raise HTTPException(

            status_code=500,

            detail="Unable to calculate expected cost."

        )

# ============================================================

# RISK ASSESSMENT

# ============================================================

@app.get("/api/risk")

def risk_assessment(

    route: str,

    cargo_quantity: float,

    port_delay_days: float = 0.0,

    vessel_availability: str = "AVAILABLE",

    contract_flexibility: str = "FLEXIBLE"

):

    try:

        result = calculate_risk(

            route=route,

            cargo_quantity=cargo_quantity,

            port_delay_days=port_delay_days,

            vessel_availability=vessel_availability,

            contract_flexibility=contract_flexibility

        )

        return {

            "status": "success",

            "data": result

        }

    except ValueError as error:

        raise HTTPException(

            status_code=400,

            detail=str(error)

        )

    except Exception:

        raise HTTPException(

            status_code=500,

            detail="Unable to calculate risk assessment."

        )

    # ============================================================

# DECISION SUPPORT

# ============================================================

@app.get("/api/decision")

def decision_support(

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

    try:

        result = generate_decision(

            route=route,

            cargo_quantity=cargo_quantity,

            origin=origin,

            destination=destination,

            fuel_cost=fuel_cost,

            port_cost=port_cost,

            idle_cost=idle_cost,

            risk_cost=risk_cost,

            port_delay_days=port_delay_days,

            vessel_availability=vessel_availability,

            contract_flexibility=contract_flexibility

        )

        return {

            "status": "success",

            "data": result

        }

    except ValueError as error:

        raise HTTPException(

            status_code=400,

            detail=str(error)

        )

    except Exception as error:

        print("DECISION ERROR:", repr(error))

        raise HTTPException(

            status_code=500,

            detail=str(error)

        )

# ============================================================

# WHAT-IF ANALYSIS

# ============================================================

@app.get("/api/what-if")

def what_if_analysis(

    route: str,

    cargo_quantity: float,

    freight_change_percent: float = 0.0,

    fuel_change_percent: float = 0.0,

    port_delay_days: float = 0.0,

    vessel_availability: str = "AVAILABLE",

    contract_flexibility: str = "FLEXIBLE"

):

    try:

        result = run_what_if(

            route=route,

            cargo_quantity=cargo_quantity,

            freight_change_percent=freight_change_percent,

            fuel_change_percent=fuel_change_percent,

            port_delay_days=port_delay_days,

            vessel_availability=vessel_availability,

            contract_flexibility=contract_flexibility

        )

        return {

            "status": "success",

            "data": result

        }

    except ValueError as error:

        raise HTTPException(

            status_code=400,

            detail=str(error)

        )

    except Exception:

        raise HTTPException(

            status_code=500,

            detail="Unable to run what-if analysis."

        )

# ============================================================

# VESSEL TRACKING

# ============================================================

@app.get("/api/vessels/tracking")

def vessel_tracking():

    try:

        result = generate_vessel_positions()

        return {

            "status": "success",

            "data": result

        }

    except Exception:

        raise HTTPException(

            status_code=500,

            detail="Unable to retrieve vessel tracking data."

        )

# ============================================================

# SINGLE VESSEL POSITION

# ============================================================

@app.get("/api/vessels/{vessel_id}/position")

def vessel_position(vessel_id: str):

    try:

        result = get_vessel_position(vessel_id)

        return {

            "status": "success",

            "data": result

        }

    except ValueError as error:

        raise HTTPException(

            status_code=404,

            detail=str(error)

        )

    except Exception:

        raise HTTPException(

            status_code=500,

            detail="Unable to retrieve vessel position."

        )
  # ============================================================
# SAVE ANALYSIS TO DATABASE
# ============================================================

@app.post("/api/analyses")
def create_analysis(
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
    contract_flexibility: str = "FLEXIBLE",
    db: Session = Depends(get_db)
):
    try:
        result = generate_decision(
            route=route,
            cargo_quantity=cargo_quantity,
            origin=origin,
            destination=destination,
            fuel_cost=fuel_cost,
            port_cost=port_cost,
            idle_cost=idle_cost,
            risk_cost=risk_cost,
            port_delay_days=port_delay_days,
            vessel_availability=vessel_availability,
            contract_flexibility=contract_flexibility
        )

        analysis = Analysis(
            route=route,
            origin=origin,
            destination=destination,
            cargo_quantity=cargo_quantity,

            fuel_cost=fuel_cost,
            port_cost=port_cost,
            idle_cost=idle_cost,
            risk_cost=risk_cost,

            port_delay_days=port_delay_days,
            vessel_availability=vessel_availability,
            contract_flexibility=contract_flexibility,

            decision=result["decision"],
            decision_confidence=result["decision_confidence"],

            forecast_rate=result["forecast"]["forecast_rate"],
            forecast_trend=result["forecast"]["trend"],

            total_expected_cost=result["cost"]["total_expected_cost"],
            expected_cost_per_tonne=result["cost"]["expected_cost_per_tonne"],

            risk_score=result["risk"]["risk_score"],
            risk_level=result["risk"]["risk_level"]
        )

        db.add(analysis)
        db.commit()
        db.refresh(analysis)

        return {
            "status": "success",
            "message": "Analysis saved successfully.",
            "analysis_id": analysis.id,
            "data": result
        }

    except ValueError as error:
        db.rollback()

        raise HTTPException(
            status_code=400,
            detail=str(error)
        )

    except Exception as error:
        db.rollback()

        print("DATABASE ERROR:", repr(error))

        raise HTTPException(
            status_code=500,
            detail="Unable to save analysis."
        )


# ============================================================
# GET SAVED ANALYSIS FROM DATABASE
# ============================================================

@app.get("/api/analyses/{analysis_id}")
def get_analysis(
    analysis_id: int,
    db: Session = Depends(get_db)
):
    analysis = (
        db.query(Analysis)
        .filter(Analysis.id == analysis_id)
        .first()
    )

    if not analysis:
        raise HTTPException(
            status_code=404,
            detail="Analysis not found."
        )

    return {
        "status": "success",

        "data": {
            "id": analysis.id,

            "route": analysis.route,
            "origin": analysis.origin,
            "destination": analysis.destination,

            "cargo_quantity": analysis.cargo_quantity,

            "fuel_cost": analysis.fuel_cost,
            "port_cost": analysis.port_cost,
            "idle_cost": analysis.idle_cost,
            "risk_cost": analysis.risk_cost,

            "port_delay_days": analysis.port_delay_days,

            "vessel_availability": analysis.vessel_availability,
            "contract_flexibility": analysis.contract_flexibility,

            "decision": analysis.decision,
            "decision_confidence": analysis.decision_confidence,

            "forecast_rate": analysis.forecast_rate,
            "forecast_trend": analysis.forecast_trend,

            "total_expected_cost": analysis.total_expected_cost,
            "expected_cost_per_tonne": analysis.expected_cost_per_tonne,

            "risk_score": analysis.risk_score,
            "risk_level": analysis.risk_level,

            "created_at": analysis.created_at
        }
    }
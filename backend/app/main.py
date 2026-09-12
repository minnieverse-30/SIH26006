from fastapi import FastAPI, HTTPException

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
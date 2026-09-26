from sqlalchemy import Column, Integer, String, Float, Date, DateTime, Text
from sqlalchemy.sql import func

from app.database import Base


class Analysis(Base):
    __tablename__ = "analyses"

    id = Column(Integer, primary_key=True, index=True)

    route = Column(String(50), nullable=False)
    origin = Column(String(100), nullable=False)
    destination = Column(String(100), nullable=False)

    cargo_quantity = Column(Float, nullable=False)

    fuel_cost = Column(Float, default=0)
    port_cost = Column(Float, default=0)
    idle_cost = Column(Float, default=0)
    risk_cost = Column(Float, default=0)

    port_delay_days = Column(Float, default=0)
    vessel_availability = Column(String(30))
    contract_flexibility = Column(String(30))

    decision = Column(String(20))
    decision_confidence = Column(String(20))

    forecast_rate = Column(Float)
    forecast_trend = Column(String(30))

    total_expected_cost = Column(Float)
    expected_cost_per_tonne = Column(Float)

    risk_score = Column(Float)
    risk_level = Column(String(20))

    created_at = Column(DateTime(timezone=True), server_default=func.now())


class PoolShipment(Base):
    __tablename__ = "pool_shipments"

    id = Column(Integer, primary_key=True, index=True)
    lot_name = Column(String(100), nullable=False)
    route = Column(String(50), nullable=False, index=True)
    origin = Column(String(100), nullable=False)
    destination = Column(String(100), nullable=False)
    cargo_type = Column(String(60), nullable=False)
    cargo_quantity = Column(Float, nullable=False)
    load_date = Column(Date, nullable=False, index=True)
    pool_week = Column(Date, nullable=False, index=True)
    status = Column(String(20), nullable=False, default="OPEN", index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


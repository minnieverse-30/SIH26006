import json
from pathlib import Path
from datetime import datetime, timezone


PROJECT_ROOT = Path(__file__).resolve().parents[1]

VESSEL_FILE = PROJECT_ROOT / "data" / "master" / "vessels.json"


def load_vessels():
    if not VESSEL_FILE.exists():
        raise FileNotFoundError(
            f"Vessel master data not found: {VESSEL_FILE}"
        )

    with open(VESSEL_FILE, "r", encoding="utf-8") as file:
        return json.load(file)


def generate_vessel_positions():

    vessels = load_vessels()

    # Prototype positions
    # These will later be replaced by real AIS data.

    positions = {
        "VES-001": {
            "latitude": -20.25,
            "longitude": 148.20,
            "speed_knots": 13.4,
            "heading": 245,
            "destination": "Qingdao",
            "eta": "2026-09-18T14:00:00Z"
        },

        "VES-002": {
            "latitude": -12.45,
            "longitude": 116.80,
            "speed_knots": 11.8,
            "heading": 315,
            "destination": "Rizhao",
            "eta": "2026-09-20T09:30:00Z"
        },

        "VES-003": {
            "latitude": 5.20,
            "longitude": 105.40,
            "speed_knots": 12.6,
            "heading": 70,
            "destination": "Vizag",
            "eta": "2026-09-16T18:00:00Z"
        },

        "VES-004": {
            "latitude": 8.15,
            "longitude": 108.70,
            "speed_knots": 10.9,
            "heading": 85,
            "destination": "North China",
            "eta": "2026-09-22T11:00:00Z"
        }
    }

    result = []

    for vessel in vessels:

        vessel_id = vessel["vessel_id"]

        position = positions.get(
            vessel_id,
            {
                "latitude": 0,
                "longitude": 0,
                "speed_knots": 0,
                "heading": 0,
                "destination": "Unknown",
                "eta": None
            }
        )

        result.append({
            "vessel_id": vessel_id,
            "name": vessel["name"],
            "vessel_type": vessel["vessel_type"],
            "status": vessel["status"],

            "position": {
                "latitude": position["latitude"],
                "longitude": position["longitude"]
            },

            "speed_knots": position["speed_knots"],
            "heading": position["heading"],
            "destination": position["destination"],
            "eta": position["eta"],

            "last_updated": datetime.now(
                timezone.utc
            ).isoformat(),

            "data_source": "SIMULATED_AIS"
        })

    return result


def get_vessel_position(vessel_id: str):

    vessels = generate_vessel_positions()

    for vessel in vessels:

        if vessel["vessel_id"].lower() == vessel_id.lower():
            return vessel

    raise ValueError(
        f"Vessel not found: {vessel_id}"
    )
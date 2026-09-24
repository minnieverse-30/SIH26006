import json
from pathlib import Path


# ============================================================
# PATHS
# ============================================================

PROJECT_ROOT = Path(__file__).resolve().parents[1]

VESSEL_FILE = (
    PROJECT_ROOT
    / "data"
    / "master"
    / "vessels.json"
)

PORT_FILE = (
    PROJECT_ROOT
    / "data"
    / "master"
    / "ports.json"
)


# ============================================================
# LOAD MASTER DATA
# ============================================================

def load_json(file_path):

    if not file_path.exists():
        raise FileNotFoundError(
            f"Master data not found: {file_path}"
        )

    with open(
        file_path,
        "r",
        encoding="utf-8"
    ) as file:

        return json.load(file)


def load_vessels():
    return load_json(VESSEL_FILE)


def load_ports():
    return load_json(PORT_FILE)


# ============================================================
# FIND DESTINATION PORT
# ============================================================

def find_port(ports, port_name):

    for port in ports:

        if port["name"].strip().lower() == port_name.strip().lower():
            return port

    return None


# ============================================================
# VESSEL CHECK
# ============================================================

def check_vessel(
    vessel,
    cargo_quantity,
    destination_port
):

    reasons = []

    # A compatibility score ranks vessels that already pass the hard
    # constraints. It is intentionally explainable and is not an ML score.
    capacity_ratio = cargo_quantity / vessel["capacity_tonnes"]
    capacity_score = max(0, min(100, (1 - capacity_ratio) * 100))

    draft_margin = destination_port["max_draft_m"] - vessel["draft_m"]
    loa_margin = destination_port["max_loa_m"] - vessel["loa_m"]
    beam_margin = destination_port["max_beam_m"] - vessel["beam_m"]

    # Normalize physical margins against practical reference ranges so
    # one dimension does not dominate the score.
    draft_score = max(0, min(100, (draft_margin / 2.0) * 100))
    loa_score = max(0, min(100, (loa_margin / 30.0) * 100))
    beam_score = max(0, min(100, (beam_margin / 5.0) * 100))

    type_score = 100 if vessel["vessel_type"] in destination_port["supported_vessel_types"] else 0
    availability_score = 100 if vessel["status"].strip().upper() == "AVAILABLE" else 0

    compatibility_score = round(
        0.30 * capacity_score
        + 0.20 * draft_score
        + 0.15 * loa_score
        + 0.10 * beam_score
        + 0.15 * type_score
        + 0.10 * availability_score,
        1
    )

    # --------------------------------------------------------
    # CAPACITY
    # --------------------------------------------------------

    capacity_ok = (
        vessel["capacity_tonnes"] >= cargo_quantity
    )

    if not capacity_ok:

        reasons.append(
            "Vessel capacity is insufficient "
            "for the requested cargo quantity."
        )

    # --------------------------------------------------------
    # DESTINATION DRAFT
    # --------------------------------------------------------

    destination_draft_ok = (
        vessel["draft_m"] <= destination_port["max_draft_m"]
    )

    if not destination_draft_ok:

        reasons.append(
            f"Vessel draft exceeds the limit "
            f"at {destination_port['name']}."
        )

    # --------------------------------------------------------
    # DESTINATION LOA
    # --------------------------------------------------------

    destination_loa_ok = (
        vessel["loa_m"] <= destination_port["max_loa_m"]
    )

    if not destination_loa_ok:

        reasons.append(
            f"Vessel LOA exceeds the limit "
            f"at {destination_port['name']}."
        )

    # --------------------------------------------------------
    # DESTINATION BEAM
    # --------------------------------------------------------

    destination_beam_ok = (
        vessel["beam_m"] <= destination_port["max_beam_m"]
    )

    if not destination_beam_ok:

        reasons.append(
            f"Vessel beam exceeds the limit "
            f"at {destination_port['name']}."
        )

    # --------------------------------------------------------
    # VESSEL TYPE
    # --------------------------------------------------------

    vessel_type_destination_ok = (
        vessel["vessel_type"]
        in destination_port["supported_vessel_types"]
    )

    if not vessel_type_destination_ok:

        reasons.append(
            f"{vessel['vessel_type']} vessels "
            f"are not supported at {destination_port['name']}."
        )

    # --------------------------------------------------------
    # AVAILABILITY
    # --------------------------------------------------------

    status_ok = (
        vessel["status"].strip().upper() == "AVAILABLE"
    )

    if not status_ok:

        reasons.append(
            "Vessel is currently unavailable."
        )

    # --------------------------------------------------------
    # FINAL FEASIBILITY
    # --------------------------------------------------------

    feasible = (
        capacity_ok
        and destination_draft_ok
        and destination_loa_ok
        and destination_beam_ok
        and vessel_type_destination_ok
        and status_ok
    )

    return {

        "vessel_id": vessel["vessel_id"],

        "vessel_name": vessel["name"],

        "vessel_type": vessel["vessel_type"],

        "capacity_tonnes": vessel["capacity_tonnes"],

        "compatibility_score": compatibility_score,

        "score_breakdown": {
            "capacity": round(capacity_score, 1),
            "draft_margin": round(draft_score, 1),
            "loa_margin": round(loa_score, 1),
            "beam_margin": round(beam_score, 1),
            "vessel_type": type_score,
            "availability": availability_score
        },

        "status": (
            "FEASIBLE"
            if feasible
            else "NOT_FEASIBLE"
        ),

        "checks": {

            "capacity": capacity_ok,

            "destination_draft": destination_draft_ok,

            "destination_loa": destination_loa_ok,

            "destination_beam": destination_beam_ok,

            "destination_vessel_type":
                vessel_type_destination_ok,

            "availability": status_ok

        },

        "reasons": reasons

    }


# ============================================================
# MAIN FEASIBILITY FUNCTION
# ============================================================

def find_feasible_vessels(
    cargo_quantity,
    origin,
    destination
):

    if cargo_quantity <= 0:

        raise ValueError(
            "Cargo quantity must be greater than zero."
        )

    vessels = load_vessels()

    ports = load_ports()

    # --------------------------------------------------------
    # IMPORTANT:
    # Origin is an overseas loading port.
    # Current port master contains Indian destination ports.
    # Therefore we validate only the destination here.
    # --------------------------------------------------------

    destination_port = find_port(
        ports,
        destination
    )

    if destination_port is None:

        raise ValueError(
            f"Destination port not found: {destination}"
        )

    results = []

    for vessel in vessels:

        result = check_vessel(
            vessel,
            cargo_quantity,
            destination_port
        )

        results.append(result)

    feasible_vessels = [
        result
        for result in results
        if result["status"] == "FEASIBLE"
    ]

    # Highest compatibility first; non-feasible vessels remain available
    # for transparent audit of failed constraints.
    feasible_vessels.sort(
        key=lambda vessel: vessel["compatibility_score"],
        reverse=True
    )

    results.sort(
        key=lambda vessel: (
            vessel["status"] == "FEASIBLE",
            vessel["compatibility_score"]
        ),
        reverse=True
    )

    return {

        "origin": origin,

        "origin_type": "OVERSEAS_LOADING_PORT",

        "destination": destination_port["name"],

        "destination_type": "INDIAN_DISCHARGE_PORT",

        "cargo_quantity_tonnes": cargo_quantity,

        "feasible_count": len(
            feasible_vessels
        ),

        "total_vessels_checked": len(
            results
        ),

        "vessels": results

    }
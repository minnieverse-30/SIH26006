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
# FIND PORT
# ============================================================

def find_port(ports, port_name):

    for port in ports:

        if (
            port["name"].lower()
            == port_name.lower()
        ):
            return port

    return None


# ============================================================
# VESSEL CHECK
# ============================================================

def check_vessel(
    vessel,
    cargo_quantity,
    origin_port,
    destination_port
):

    reasons = []

    capacity_ok = (
        vessel["capacity_tonnes"]
        >= cargo_quantity
    )

    if not capacity_ok:

        reasons.append(
            "Vessel capacity is insufficient "
            "for the requested cargo quantity."
        )

    origin_draft_ok = (
        vessel["draft_m"]
        <= origin_port["max_draft_m"]
    )

    destination_draft_ok = (
        vessel["draft_m"]
        <= destination_port["max_draft_m"]
    )

    if not origin_draft_ok:

        reasons.append(
            f"Vessel draft exceeds the limit "
            f"at {origin_port['name']}."
        )

    if not destination_draft_ok:

        reasons.append(
            f"Vessel draft exceeds the limit "
            f"at {destination_port['name']}."
        )

    origin_loa_ok = (
        vessel["loa_m"]
        <= origin_port["max_loa_m"]
    )

    destination_loa_ok = (
        vessel["loa_m"]
        <= destination_port["max_loa_m"]
    )

    if not origin_loa_ok:

        reasons.append(
            f"Vessel LOA exceeds the limit "
            f"at {origin_port['name']}."
        )

    if not destination_loa_ok:

        reasons.append(
            f"Vessel LOA exceeds the limit "
            f"at {destination_port['name']}."
        )

    origin_beam_ok = (
        vessel["beam_m"]
        <= origin_port["max_beam_m"]
    )

    destination_beam_ok = (
        vessel["beam_m"]
        <= destination_port["max_beam_m"]
    )

    if not origin_beam_ok:

        reasons.append(
            f"Vessel beam exceeds the limit "
            f"at {origin_port['name']}."
        )

    if not destination_beam_ok:

        reasons.append(
            f"Vessel beam exceeds the limit "
            f"at {destination_port['name']}."
        )

    vessel_type_origin_ok = (
        vessel["vessel_type"]
        in origin_port["supported_vessel_types"]
    )

    vessel_type_destination_ok = (
        vessel["vessel_type"]
        in destination_port["supported_vessel_types"]
    )

    if not vessel_type_origin_ok:

        reasons.append(
            f"{vessel['vessel_type']} vessels "
            f"are not supported at {origin_port['name']}."
        )

    if not vessel_type_destination_ok:

        reasons.append(
            f"{vessel['vessel_type']} vessels "
            f"are not supported at {destination_port['name']}."
        )

    status_ok = (
        vessel["status"] == "AVAILABLE"
    )

    if not status_ok:

        reasons.append(
            "Vessel is currently unavailable."
        )

    feasible = (
        capacity_ok
        and origin_draft_ok
        and destination_draft_ok
        and origin_loa_ok
        and destination_loa_ok
        and origin_beam_ok
        and destination_beam_ok
        and vessel_type_origin_ok
        and vessel_type_destination_ok
        and status_ok
    )

    return {
        "vessel_id": vessel["vessel_id"],
        "vessel_name": vessel["name"],
        "vessel_type": vessel["vessel_type"],
        "capacity_tonnes": vessel["capacity_tonnes"],
        "status": (
            "FEASIBLE"
            if feasible
            else "NOT_FEASIBLE"
        ),
        "checks": {
            "capacity": capacity_ok,
            "origin_draft": origin_draft_ok,
            "destination_draft": destination_draft_ok,
            "origin_loa": origin_loa_ok,
            "destination_loa": destination_loa_ok,
            "origin_beam": origin_beam_ok,
            "destination_beam": destination_beam_ok,
            "origin_vessel_type": vessel_type_origin_ok,
            "destination_vessel_type": vessel_type_destination_ok,
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

    origin_port = find_port(
        ports,
        origin
    )

    destination_port = find_port(
        ports,
        destination
    )

    if origin_port is None:

        raise ValueError(
            f"Origin port not found: {origin}"
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
            origin_port,
            destination_port
        )

        results.append(result)

    feasible_vessels = [
        result
        for result in results
        if result["status"] == "FEASIBLE"
    ]

    return {
        "origin": origin_port["name"],
        "destination": destination_port["name"],
        "cargo_quantity_tonnes": cargo_quantity,

        "feasible_count": len(
            feasible_vessels
        ),

        "total_vessels_checked": len(
            results
        ),

        "vessels": results
    }
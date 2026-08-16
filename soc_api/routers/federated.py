from fastapi import APIRouter
from datetime import datetime, timedelta, timezone

router = APIRouter(prefix="/api/v1/federated", tags=["federated"])


@router.get("/status")
async def get_federated_status():
    now = datetime.now(timezone.utc)
    iso = lambda dt: dt.isoformat()
    sites = [
        {"site_id": "SOC-NYC", "name": "New York City", "status": "online", "last_sync": iso(now - timedelta(minutes=4)), "devices_shared": 120, "threats_cross": 3},
        {"site_id": "SOC-LON", "name": "London", "status": "online", "last_sync": iso(now - timedelta(minutes=9)), "devices_shared": 95, "threats_cross": 7},
        {"site_id": "SOC-TOK", "name": "Tokyo", "status": "degraded", "last_sync": iso(now - timedelta(minutes=31)), "devices_shared": 78, "threats_cross": 2},
        {"site_id": "SOC-SYD", "name": "Sydney", "status": "online", "last_sync": iso(now - timedelta(minutes=2)), "devices_shared": 54, "threats_cross": 1},
        {"site_id": "SOC-SAO", "name": "Sao Paulo", "status": "online", "last_sync": iso(now - timedelta(minutes=14)), "devices_shared": 42, "threats_cross": 4},
    ]
    return {
        "sites": sites,
        "current_round": 47,
        "global_model_version": "global-v47",
        "last_aggregation": iso(now - timedelta(minutes=5)),
        "next_aggregation": iso(now + timedelta(minutes=60)),
        "participating_zones": 5,
    }

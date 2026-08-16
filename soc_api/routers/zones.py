from fastapi import APIRouter
from ..db.database import get_db
from ..db.models import DeviceProfileDB
from .devices import device_view, incident_metrics_map

router = APIRouter(prefix="/api/v1/zones", tags=["zones"])

def get_device_count_by_zone(db, zone_id, metrics):
    devices = db.query(DeviceProfileDB).filter(DeviceProfileDB.zone_id == zone_id).all()
    views = [device_view(db, d, metrics) for d in devices]
    total = len(views)
    alert = sum(1 for v in views if v["status"] != "online")
    online = total - alert
    categories = {}
    for v in views:
        categories[v["category"]] = categories.get(v["category"], 0) + 1
    return {
        "zone_id": zone_id,
        "total_devices": total,
        "devices_online": online,
        "devices_with_alerts": alert,
        "categories": categories,
        "devices": [{
            "device_id": v["device_id"],
            "category": v["category"],
            "protocol": v["protocol"],
            "alert_count_7d": v["alert_count_7d"],
            "status": v["status"],
        } for v in views],
    }

@router.get("/summary")
def zones_summary():
    with get_db() as db:
        zone_ids = [r[0] for r in db.query(DeviceProfileDB.zone_id).distinct().all()]
        metrics = incident_metrics_map(db)
        zones = [get_device_count_by_zone(db, z, metrics) for z in sorted(zone_ids)]
        return {"zones": zones}

@router.get("")
def list_zones():
    with get_db() as db:
        zone_ids = [r[0] for r in db.query(DeviceProfileDB.zone_id).distinct().all()]
        metrics = incident_metrics_map(db)
        zones = [get_device_count_by_zone(db, z, metrics) for z in sorted(zone_ids)]
        return {"total": len(zones), "results": zones}

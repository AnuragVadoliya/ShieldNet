from fastapi import APIRouter, HTTPException
from datetime import datetime, timedelta, timezone
from ..db.database import get_db
from ..db.models import DeviceProfileDB, Incident
from ..db.schemas import DeviceProfile

router = APIRouter(prefix="/api/v1/devices", tags=["devices"])


def _as_utc(dt):
    if dt is None:
        return None
    if dt.tzinfo is None:
        return dt.replace(tzinfo=timezone.utc)
    return dt.astimezone(timezone.utc)


def incident_metrics_map(db):
    """One query -> {(zone_id, category): [total_7d, active]} for every device."""
    cutoff = datetime.now(timezone.utc) - timedelta(days=7)
    metrics = {}
    for r in db.query(Incident).all():
        ts = _as_utc(r.detected_at)
        if ts is None or ts < cutoff:
            continue
        key = (r.zone_id, r.device_category)
        entry = metrics.setdefault(key, [0, 0])
        entry[0] += 1
        if r.status in ("ACTIVE", "REVIEW"):
            entry[1] += 1
    return metrics


def compute_status(alert_count_7d: int, active_incidents: int) -> str:
    if active_incidents >= 2:
        return "active_alerts"
    if active_incidents == 1:
        return "degraded"
    if alert_count_7d >= 10:
        return "quarantined"
    return "online"


def device_view(db, d, metrics=None):
    if metrics is None:
        metrics = incident_metrics_map(db)
    alert_count, active = metrics.get((d.zone_id, d.category), (0, 0))
    return {
        "device_id": d.device_id,
        "zone_id": d.zone_id,
        "category": d.category,
        "protocol": d.protocol,
        "ip_address": d.ip_address,
        "firmware_version": d.firmware_version,
        "alert_count_7d": alert_count,
        "last_active": d.last_active,
        "status": compute_status(alert_count, active),
    }


@router.get("")
def list_devices(zone: str = None, category: str = None):
    with get_db() as db:
        q = db.query(DeviceProfileDB)
        if zone:
            q = q.filter(DeviceProfileDB.zone_id == zone)
        if category:
            q = q.filter(DeviceProfileDB.category == category)
        rows = q.all()
        metrics = incident_metrics_map(db)
        results = [device_view(db, r, metrics) for r in rows]
        return {"total": len(results), "results": results}


@router.get("/{device_id}")
def get_device(device_id: str):
    with get_db() as db:
        row = db.query(DeviceProfileDB).filter(DeviceProfileDB.device_id == device_id).first()
        if not row:
            raise HTTPException(404, "Device not found")
        return device_view(db, row)

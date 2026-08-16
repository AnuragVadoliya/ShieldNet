from fastapi import APIRouter, HTTPException, Header, Depends, Request
from datetime import datetime, timezone
from ..db.database import get_db
from ..db.models import Incident
from ..db.schemas import IncidentCreate, VALID_ZONES, VALID_THREATS
from ..config import API_KEY
from ..rate_limiter import inject_rate_limiter
from ..ws_manager import ws_manager

REVIEW_THRESHOLD = 0.40
AUTO_CONTAIN_THRESHOLD = 0.70

router = APIRouter(prefix="/api/v1/incidents", tags=["incidents"])

PLAYBOOK_MAP = {
    "DDoS": "PLAYBOOK-DDOS-01",
    "Botnet": "PLAYBOOK-BOTNET-01",
    "Scanning": "PLAYBOOK-SCAN-01",
    "MitM": "PLAYBOOK-MITM-01",
    "Ransomware": "PLAYBOOK-RANSOMWARE-01",
    "Unauthorized Access": "PLAYBOOK-UNAUTHORIZED-01",
}

ACTIONS_MAP = {
    "PLAYBOOK-DDOS-01": [
        {"action": "BLOCK_IP", "target": "192.168.1.100", "status": "completed", "duration_ms": 1459},
        {"action": "RATE_LIMIT", "target": "traffic_sensor", "status": "completed", "duration_ms": 320},
    ],
    "PLAYBOOK-BOTNET-01": [
        {"action": "QUARANTINE_DEVICE", "target": "DEV-1042", "status": "completed", "duration_ms": 2031},
        {"action": "BLOCK_C2", "target": "5.6.7.8:443", "status": "completed", "duration_ms": 480},
    ],
    "PLAYBOOK-SCAN-01": [
        {"action": "BLOCK_SOURCE_IP", "target": "scanner-ip", "status": "completed", "duration_ms": 400},
        {"action": "CLOSE_PORTS", "target": "targeted-ports", "status": "completed", "duration_ms": 300},
        {"action": "UPDATE_FIREWALL", "target": "ingress-rules", "status": "completed", "duration_ms": 600},
        {"action": "NOTIFY_SOC", "target": "soc-team", "status": "completed", "duration_ms": 200},
    ],
    "PLAYBOOK-MITM-01": [
        {"action": "BLOCK_IP", "target": "10.0.0.50", "status": "completed", "duration_ms": 1120},
        {"action": "FORCE_REKEY", "target": "gateway", "status": "completed", "duration_ms": 890},
    ],
    "PLAYBOOK-RANSOMWARE-01": [
        {"action": "QUARANTINE_DEVICE", "target": "gateway-01", "status": "completed", "duration_ms": 3100},
        {"action": "BLOCK_IP", "target": "malicious-c2.com", "status": "completed", "duration_ms": 520},
        {"action": "NOTIFY_SOC", "target": "soc-team", "status": "completed", "duration_ms": 200},
    ],
}

DEFAULT_PLAYBOOK = "PLAYBOOK-SCAN-01"
DEFAULT_ACTIONS = ACTIONS_MAP[DEFAULT_PLAYBOOK]


def verify_api_key(authorization: str = Header(None)):
    if not API_KEY:
        return
    if authorization != f"Bearer {API_KEY}":
        raise HTTPException(401, "Invalid API key")


@router.get("", summary="List incidents", description="Returns paginated list of incidents with optional filters for zone, status, and threat_class")
def list_incidents(zone_id: str = None, status: str = None, threat_class: str = None, limit: int = 50, offset: int = 0):
    with get_db() as db:
        q = db.query(Incident)
        if zone_id:
            q = q.filter(Incident.zone_id == zone_id)
        if status:
            q = q.filter(Incident.status == status)
        if threat_class:
            q = q.filter(Incident.threat_class == threat_class)
        q = q.order_by(Incident.detected_at.desc()).offset(offset).limit(limit)
        rows = q.all()
        total = db.query(Incident).count()
        return {"total": total, "page": offset // limit + 1 if limit else 1, "results": [
            {
                "id": str(r.id),
                "incident_ref": r.incident_ref,
                "zone_id": r.zone_id,
                "device_category": r.device_category,
                "threat_class": r.threat_class,
                "confidence_score": r.confidence_score,
                "status": r.status,
                "detected_at": r.detected_at.isoformat() if r.detected_at else None,
                "contained_at": r.contained_at.isoformat() if r.contained_at else None,
                "resolved_at": r.resolved_at.isoformat() if r.resolved_at else None,
                "playbook_id": r.playbook_id,
                "actions_taken": r.actions_taken,
                "created_at": r.created_at.isoformat() if r.created_at else None,
                "updated_at": r.updated_at.isoformat() if r.updated_at else None,
            } for r in rows
        ]}


@router.get("/{incident_id}", summary="Get incident detail", description="Returns full incident record including actions_taken")
def get_incident(incident_id: str):
    with get_db() as db:
        r = db.query(Incident).filter(Incident.incident_ref == incident_id).first()
        if not r:
            raise HTTPException(404, "Incident not found")
        return {
            "id": str(r.id),
            "incident_ref": r.incident_ref,
            "zone_id": r.zone_id,
            "device_category": r.device_category,
            "threat_class": r.threat_class,
            "confidence_score": r.confidence_score,
            "status": r.status,
            "detected_at": r.detected_at.isoformat() if r.detected_at else None,
            "contained_at": r.contained_at.isoformat() if r.contained_at else None,
            "resolved_at": r.resolved_at.isoformat() if r.resolved_at else None,
            "playbook_id": r.playbook_id,
            "actions_taken": r.actions_taken,
            "created_at": r.created_at.isoformat() if r.created_at else None,
            "updated_at": r.updated_at.isoformat() if r.updated_at else None,
        }


@router.post("/inject", summary="Inject a threat", description="Creates a new incident. AIRO auto-contains at confidence >= 0.70; 0.40-0.69 is escalated for analyst review.")
async def inject_incident(payload: IncidentCreate, request: Request, _auth=Depends(verify_api_key)):
    client_ip = request.client.host if request.client else "unknown"
    if not inject_rate_limiter.is_allowed(client_ip):
        raise HTTPException(429, "Rate limit exceeded")

    if not payload.incident_ref.strip():
        raise HTTPException(422, "incident_ref must not be empty")

    with get_db() as db:
        now = datetime.now(timezone.utc)

        incident = Incident(
            incident_ref=payload.incident_ref,
            detected_at=payload.detected_at or now,
            zone_id=payload.zone_id,
            device_category=payload.device_category,
            threat_class=payload.threat_class,
            confidence_score=payload.confidence_score,
            score_lstm=payload.score_lstm,
            score_isolation_forest=payload.score_isolation_forest,
            score_autoencoder=payload.score_autoencoder,
            status=payload.status,
            playbook_id=payload.playbook_id,
            actions_taken=payload.actions_taken,
        )

        # Decision thresholds (ARCHITECTURE.md):
        #   >= 0.70  THREAT_MEDIUM/HIGH -> AIRO auto-contains
        #   0.40-0.69 SUSPICIOUS        -> escalated for analyst review
        #   < 0.40   NORMAL             -> tracked as ACTIVE (monitoring only)
        if payload.confidence_score >= AUTO_CONTAIN_THRESHOLD:
            incident.status = "CONTAINED"
            pb = PLAYBOOK_MAP.get(payload.threat_class, DEFAULT_PLAYBOOK)
            incident.playbook_id = pb
            incident.actions_taken = ACTIONS_MAP.get(pb, DEFAULT_ACTIONS)
            incident.contained_at = now
        elif payload.confidence_score >= REVIEW_THRESHOLD:
            incident.status = "REVIEW"
        else:
            incident.status = "ACTIVE"

        db.add(incident)
        db.commit()
        db.refresh(incident)

        broadcast_data = {
            "incident_ref": incident.incident_ref,
            "zone_id": incident.zone_id,
            "device_category": incident.device_category,
            "threat_class": incident.threat_class,
            "confidence_score": incident.confidence_score,
            "status": incident.status,
            "detected_at": incident.detected_at.isoformat() if incident.detected_at else None,
        }

    await ws_manager.broadcast_threat(broadcast_data)

    return {
        "id": str(incident.id),
        "incident_ref": incident.incident_ref,
        "status": incident.status,
        "playbook_id": incident.playbook_id,
        "actions_taken": incident.actions_taken,
        "contained_at": incident.contained_at.isoformat() if incident.contained_at else None,
    }


@router.get("/{incident_id}/export", status_code=501, summary="Export incident report",
            description="Not yet implemented — returns 501")
def export_incident(incident_id: str, format: str = "pdf"):
    raise HTTPException(501, "Export not yet implemented")

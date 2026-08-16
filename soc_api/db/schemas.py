from pydantic import BaseModel, field_validator
from typing import Optional
from datetime import datetime, timezone

VALID_ZONES = {"ZONE-01", "ZONE-02", "ZONE-03", "ZONE-04", "ZONE-05"}
VALID_THREATS = {"DDoS", "Botnet", "Scanning", "MitM", "Ransomware", "Unauthorized Access"}


class IncidentBase(BaseModel):
    incident_ref: str
    zone_id: str
    device_category: str
    threat_class: str
    confidence_score: float
    status: str = "ACTIVE"


class IncidentCreate(IncidentBase):
    detected_at: Optional[datetime] = None
    score_lstm: Optional[float] = None
    score_isolation_forest: Optional[float] = None
    score_autoencoder: Optional[float] = None
    playbook_id: Optional[str] = None
    actions_taken: Optional[list] = None

    @field_validator("zone_id")
    @classmethod
    def check_zone(cls, v: str) -> str:
        if v not in VALID_ZONES:
            raise ValueError(f"zone_id must be one of: {', '.join(sorted(VALID_ZONES))}")
        return v

    @field_validator("threat_class")
    @classmethod
    def check_threat(cls, v: str) -> str:
        if v not in VALID_THREATS:
            raise ValueError(f"threat_class must be one of: {', '.join(sorted(VALID_THREATS))}")
        return v

    @field_validator("confidence_score")
    @classmethod
    def check_confidence(cls, v: float) -> float:
        if not (0 <= v <= 1):
            raise ValueError("confidence_score must be between 0 and 1")
        return v


class DeviceProfile(BaseModel):
    device_id: str
    zone_id: str
    category: str
    protocol: str
    ip_address: str
    firmware_version: str
    alert_count_7d: int
    last_active: str
    status: str = "online"

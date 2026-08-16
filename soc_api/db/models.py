from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, Text, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func
import uuid

Base = declarative_base()


class Incident(Base):
    __tablename__ = "incidents"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    incident_ref = Column(String(30), unique=True, nullable=False)
    detected_at = Column(DateTime(timezone=True), nullable=False)
    contained_at = Column(DateTime(timezone=True), nullable=True)
    resolved_at = Column(DateTime(timezone=True), nullable=True)
    containment_time_ms = Column(Integer, nullable=True)
    zone_id = Column(String(20), nullable=False)
    device_category = Column(String(30), nullable=False)
    threat_class = Column(String(30), nullable=False)
    confidence_score = Column(Float, nullable=False)
    score_lstm = Column(Float, nullable=True)
    score_isolation_forest = Column(Float, nullable=True)
    score_autoencoder = Column(Float, nullable=True)
    playbook_id = Column(String(50), nullable=True)
    actions_taken = Column(JSON, nullable=True)
    status = Column(String(20), nullable=False, default="ACTIVE")
    false_positive = Column(Boolean, default=False)
    operator_id = Column(String(50), nullable=True)
    operator_notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


class DeviceProfileDB(Base):
    __tablename__ = "device_profiles"

    id = Column(Integer, primary_key=True, autoincrement=True)
    device_id = Column(String, unique=True, nullable=False)
    zone_id = Column(String, nullable=False)
    category = Column(String, nullable=False)
    protocol = Column(String, nullable=False)
    ip_address = Column(String, nullable=False)
    firmware_version = Column(String, nullable=False)
    alert_count_7d = Column(Integer, default=0)
    last_active = Column(String, default="")




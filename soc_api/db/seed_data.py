from datetime import datetime, timezone

from .models import DeviceProfileDB

def _ts(hours_ago: int = 0) -> str:
    return datetime.now(timezone.utc).isoformat(timespec="seconds")

DEVICES = [
    {"device_id":"DEV-001","zone_id":"ZONE-01","category":"camera","protocol":"ONVIF","ip_address":"10.1.1.10","firmware_version":"v2.1.4","alert_count_7d":0,"last_active":_ts(1)},
    {"device_id":"DEV-002","zone_id":"ZONE-01","category":"camera","protocol":"ONVIF","ip_address":"10.1.1.11","firmware_version":"v2.1.4","alert_count_7d":1,"last_active":_ts(2)},
    {"device_id":"DEV-003","zone_id":"ZONE-01","category":"camera","protocol":"ONVIF","ip_address":"10.1.1.12","firmware_version":"v2.1.4","alert_count_7d":0,"last_active":_ts(3)},
    {"device_id":"DEV-004","zone_id":"ZONE-01","category":"camera","protocol":"ONVIF","ip_address":"10.1.1.13","firmware_version":"v2.1.4","alert_count_7d":3,"last_active":_ts(0)},
    {"device_id":"DEV-005","zone_id":"ZONE-01","category":"camera","protocol":"ONVIF","ip_address":"10.1.1.14","firmware_version":"v2.1.4","alert_count_7d":0,"last_active":_ts(4)},
    {"device_id":"DEV-006","zone_id":"ZONE-01","category":"traffic_sensor","protocol":"MQTT","ip_address":"10.1.1.20","firmware_version":"v1.3.8","alert_count_7d":0,"last_active":_ts(1)},
    {"device_id":"DEV-007","zone_id":"ZONE-01","category":"traffic_sensor","protocol":"MQTT","ip_address":"10.1.1.21","firmware_version":"v1.3.8","alert_count_7d":5,"last_active":_ts(0)},
    {"device_id":"DEV-008","zone_id":"ZONE-01","category":"traffic_sensor","protocol":"MQTT","ip_address":"10.1.1.22","firmware_version":"v1.3.8","alert_count_7d":0,"last_active":_ts(2)},
    {"device_id":"DEV-009","zone_id":"ZONE-01","category":"gateway","protocol":"CoAP","ip_address":"10.1.1.1","firmware_version":"v3.0.2","alert_count_7d":0,"last_active":_ts(0)},
    {"device_id":"DEV-010","zone_id":"ZONE-01","category":"gateway","protocol":"CoAP","ip_address":"10.1.1.2","firmware_version":"v3.0.2","alert_count_7d":0,"last_active":_ts(0)},
    {"device_id":"DEV-011","zone_id":"ZONE-01","category":"thermostat","protocol":"Zigbee","ip_address":"10.1.2.10","firmware_version":"v1.0.5","alert_count_7d":0,"last_active":_ts(5)},
    {"device_id":"DEV-012","zone_id":"ZONE-01","category":"thermostat","protocol":"Zigbee","ip_address":"10.1.2.11","firmware_version":"v1.0.5","alert_count_7d":0,"last_active":_ts(5)},
    {"device_id":"DEV-013","zone_id":"ZONE-01","category":"thermostat","protocol":"Zigbee","ip_address":"10.1.2.12","firmware_version":"v1.0.5","alert_count_7d":0,"last_active":_ts(6)},
    {"device_id":"DEV-014","zone_id":"ZONE-01","category":"motion_sensor","protocol":"Zigbee","ip_address":"10.1.3.10","firmware_version":"v2.0.1","alert_count_7d":1,"last_active":_ts(1)},
    {"device_id":"DEV-015","zone_id":"ZONE-01","category":"motion_sensor","protocol":"Zigbee","ip_address":"10.1.3.11","firmware_version":"v2.0.1","alert_count_7d":0,"last_active":_ts(3)},
    {"device_id":"DEV-016","zone_id":"ZONE-01","category":"door_lock","protocol":"Zigbee","ip_address":"10.1.3.20","firmware_version":"v1.2.3","alert_count_7d":0,"last_active":_ts(2)},
    {"device_id":"DEV-017","zone_id":"ZONE-01","category":"door_lock","protocol":"Zigbee","ip_address":"10.1.3.21","firmware_version":"v1.2.3","alert_count_7d":0,"last_active":_ts(2)},
    {"device_id":"DEV-018","zone_id":"ZONE-01","category":"smoke_detector","protocol":"LoRaWAN","ip_address":"10.1.4.10","firmware_version":"v1.1.0","alert_count_7d":0,"last_active":_ts(4)},
    {"device_id":"DEV-019","zone_id":"ZONE-01","category":"smoke_detector","protocol":"LoRaWAN","ip_address":"10.1.4.11","firmware_version":"v1.1.0","alert_count_7d":0,"last_active":_ts(4)},
    {"device_id":"DEV-101","zone_id":"ZONE-02","category":"camera","protocol":"ONVIF","ip_address":"10.2.1.10","firmware_version":"v2.1.4","alert_count_7d":2,"last_active":_ts(0)},
    {"device_id":"DEV-102","zone_id":"ZONE-02","category":"camera","protocol":"ONVIF","ip_address":"10.2.1.11","firmware_version":"v2.1.4","alert_count_7d":0,"last_active":_ts(2)},
    {"device_id":"DEV-103","zone_id":"ZONE-02","category":"camera","protocol":"ONVIF","ip_address":"10.2.1.12","firmware_version":"v2.1.4","alert_count_7d":0,"last_active":_ts(3)},
    {"device_id":"DEV-104","zone_id":"ZONE-02","category":"camera","protocol":"ONVIF","ip_address":"10.2.1.13","firmware_version":"v2.1.4","alert_count_7d":0,"last_active":_ts(4)},
    {"device_id":"DEV-105","zone_id":"ZONE-02","category":"camera","protocol":"ONVIF","ip_address":"10.2.1.14","firmware_version":"v2.1.4","alert_count_7d":0,"last_active":_ts(5)},
    {"device_id":"DEV-106","zone_id":"ZONE-02","category":"traffic_sensor","protocol":"MQTT","ip_address":"10.2.1.20","firmware_version":"v1.3.8","alert_count_7d":0,"last_active":_ts(1)},
    {"device_id":"DEV-107","zone_id":"ZONE-02","category":"traffic_sensor","protocol":"MQTT","ip_address":"10.2.1.21","firmware_version":"v1.3.8","alert_count_7d":4,"last_active":_ts(0)},
    {"device_id":"DEV-108","zone_id":"ZONE-02","category":"traffic_sensor","protocol":"MQTT","ip_address":"10.2.1.22","firmware_version":"v1.3.8","alert_count_7d":0,"last_active":_ts(2)},
    {"device_id":"DEV-109","zone_id":"ZONE-02","category":"gateway","protocol":"CoAP","ip_address":"10.2.1.1","firmware_version":"v3.0.2","alert_count_7d":0,"last_active":_ts(0)},
    {"device_id":"DEV-110","zone_id":"ZONE-02","category":"gateway","protocol":"CoAP","ip_address":"10.2.1.2","firmware_version":"v3.0.2","alert_count_7d":0,"last_active":_ts(0)},
    {"device_id":"DEV-111","zone_id":"ZONE-02","category":"thermostat","protocol":"Zigbee","ip_address":"10.2.2.10","firmware_version":"v1.0.5","alert_count_7d":0,"last_active":_ts(5)},
    {"device_id":"DEV-112","zone_id":"ZONE-02","category":"thermostat","protocol":"Zigbee","ip_address":"10.2.2.11","firmware_version":"v1.0.5","alert_count_7d":0,"last_active":_ts(6)},
    {"device_id":"DEV-113","zone_id":"ZONE-02","category":"motion_sensor","protocol":"Zigbee","ip_address":"10.2.3.10","firmware_version":"v2.0.1","alert_count_7d":1,"last_active":_ts(1)},
    {"device_id":"DEV-114","zone_id":"ZONE-02","category":"door_lock","protocol":"Zigbee","ip_address":"10.2.3.20","firmware_version":"v1.2.3","alert_count_7d":0,"last_active":_ts(3)},
    {"device_id":"DEV-201","zone_id":"ZONE-03","category":"camera","protocol":"ONVIF","ip_address":"10.3.1.10","firmware_version":"v2.1.4","alert_count_7d":0,"last_active":_ts(2)},
    {"device_id":"DEV-202","zone_id":"ZONE-03","category":"camera","protocol":"ONVIF","ip_address":"10.3.1.11","firmware_version":"v2.1.4","alert_count_7d":0,"last_active":_ts(3)},
    {"device_id":"DEV-203","zone_id":"ZONE-03","category":"camera","protocol":"ONVIF","ip_address":"10.3.1.12","firmware_version":"v2.1.4","alert_count_7d":0,"last_active":_ts(4)},
    {"device_id":"DEV-204","zone_id":"ZONE-03","category":"camera","protocol":"ONVIF","ip_address":"10.3.1.13","firmware_version":"v2.1.4","alert_count_7d":1,"last_active":_ts(1)},
    {"device_id":"DEV-205","zone_id":"ZONE-03","category":"gateway","protocol":"CoAP","ip_address":"10.3.1.1","firmware_version":"v3.0.2","alert_count_7d":0,"last_active":_ts(0)},
    {"device_id":"DEV-206","zone_id":"ZONE-03","category":"gateway","protocol":"CoAP","ip_address":"10.3.1.2","firmware_version":"v3.0.2","alert_count_7d":0,"last_active":_ts(0)},
    {"device_id":"DEV-207","zone_id":"ZONE-03","category":"traffic_sensor","protocol":"MQTT","ip_address":"10.3.1.20","firmware_version":"v1.3.8","alert_count_7d":0,"last_active":_ts(2)},
    {"device_id":"DEV-208","zone_id":"ZONE-03","category":"traffic_sensor","protocol":"MQTT","ip_address":"10.3.1.21","firmware_version":"v1.3.8","alert_count_7d":0,"last_active":_ts(3)},
    {"device_id":"DEV-209","zone_id":"ZONE-03","category":"thermostat","protocol":"Zigbee","ip_address":"10.3.2.10","firmware_version":"v1.0.5","alert_count_7d":0,"last_active":_ts(5)},
    {"device_id":"DEV-210","zone_id":"ZONE-03","category":"thermostat","protocol":"Zigbee","ip_address":"10.3.2.11","firmware_version":"v1.0.5","alert_count_7d":0,"last_active":_ts(6)},
    {"device_id":"DEV-211","zone_id":"ZONE-03","category":"smoke_detector","protocol":"LoRaWAN","ip_address":"10.3.4.10","firmware_version":"v1.1.0","alert_count_7d":0,"last_active":_ts(4)},
    {"device_id":"DEV-301","zone_id":"ZONE-04","category":"camera","protocol":"ONVIF","ip_address":"10.4.1.10","firmware_version":"v2.1.4","alert_count_7d":0,"last_active":_ts(1)},
    {"device_id":"DEV-302","zone_id":"ZONE-04","category":"camera","protocol":"ONVIF","ip_address":"10.4.1.11","firmware_version":"v2.1.4","alert_count_7d":0,"last_active":_ts(2)},
    {"device_id":"DEV-303","zone_id":"ZONE-04","category":"camera","protocol":"ONVIF","ip_address":"10.4.1.12","firmware_version":"v2.1.4","alert_count_7d":8,"last_active":_ts(0)},
    {"device_id":"DEV-304","zone_id":"ZONE-04","category":"camera","protocol":"ONVIF","ip_address":"10.4.1.13","firmware_version":"v2.1.4","alert_count_7d":0,"last_active":_ts(3)},
    {"device_id":"DEV-305","zone_id":"ZONE-04","category":"camera","protocol":"ONVIF","ip_address":"10.4.1.14","firmware_version":"v2.1.4","alert_count_7d":0,"last_active":_ts(4)},
    {"device_id":"DEV-306","zone_id":"ZONE-04","category":"traffic_sensor","protocol":"MQTT","ip_address":"10.4.1.20","firmware_version":"v1.3.8","alert_count_7d":0,"last_active":_ts(2)},
    {"device_id":"DEV-307","zone_id":"ZONE-04","category":"traffic_sensor","protocol":"MQTT","ip_address":"10.4.1.21","firmware_version":"v1.3.8","alert_count_7d":0,"last_active":_ts(2)},
    {"device_id":"DEV-308","zone_id":"ZONE-04","category":"traffic_sensor","protocol":"MQTT","ip_address":"10.4.1.22","firmware_version":"v1.3.8","alert_count_7d":6,"last_active":_ts(0)},
    {"device_id":"DEV-309","zone_id":"ZONE-04","category":"gateway","protocol":"CoAP","ip_address":"10.4.1.1","firmware_version":"v3.0.2","alert_count_7d":0,"last_active":_ts(0)},
    {"device_id":"DEV-310","zone_id":"ZONE-04","category":"gateway","protocol":"CoAP","ip_address":"10.4.1.2","firmware_version":"v3.0.2","alert_count_7d":0,"last_active":_ts(0)},
    {"device_id":"DEV-311","zone_id":"ZONE-04","category":"thermostat","protocol":"Zigbee","ip_address":"10.4.2.10","firmware_version":"v1.0.5","alert_count_7d":0,"last_active":_ts(5)},
    {"device_id":"DEV-312","zone_id":"ZONE-04","category":"thermostat","protocol":"Zigbee","ip_address":"10.4.2.11","firmware_version":"v1.0.5","alert_count_7d":0,"last_active":_ts(6)},
    {"device_id":"DEV-313","zone_id":"ZONE-04","category":"motion_sensor","protocol":"Zigbee","ip_address":"10.4.3.10","firmware_version":"v2.0.1","alert_count_7d":1,"last_active":_ts(1)},
    {"device_id":"DEV-314","zone_id":"ZONE-04","category":"motion_sensor","protocol":"Zigbee","ip_address":"10.4.3.11","firmware_version":"v2.0.1","alert_count_7d":0,"last_active":_ts(3)},
    {"device_id":"DEV-315","zone_id":"ZONE-04","category":"door_lock","protocol":"Zigbee","ip_address":"10.4.3.20","firmware_version":"v1.2.3","alert_count_7d":0,"last_active":_ts(2)},
    {"device_id":"DEV-316","zone_id":"ZONE-04","category":"door_lock","protocol":"Zigbee","ip_address":"10.4.3.21","firmware_version":"v1.2.3","alert_count_7d":0,"last_active":_ts(2)},
    {"device_id":"DEV-317","zone_id":"ZONE-04","category":"smoke_detector","protocol":"LoRaWAN","ip_address":"10.4.4.10","firmware_version":"v1.1.0","alert_count_7d":0,"last_active":_ts(4)},
    {"device_id":"DEV-401","zone_id":"ZONE-05","category":"camera","protocol":"ONVIF","ip_address":"10.5.1.10","firmware_version":"v2.1.4","alert_count_7d":0,"last_active":_ts(2)},
    {"device_id":"DEV-402","zone_id":"ZONE-05","category":"camera","protocol":"ONVIF","ip_address":"10.5.1.11","firmware_version":"v2.1.4","alert_count_7d":0,"last_active":_ts(3)},
    {"device_id":"DEV-403","zone_id":"ZONE-05","category":"camera","protocol":"ONVIF","ip_address":"10.5.1.12","firmware_version":"v2.1.4","alert_count_7d":2,"last_active":_ts(0)},
    {"device_id":"DEV-404","zone_id":"ZONE-05","category":"gateway","protocol":"CoAP","ip_address":"10.5.1.1","firmware_version":"v3.0.2","alert_count_7d":0,"last_active":_ts(0)},
    {"device_id":"DEV-405","zone_id":"ZONE-05","category":"gateway","protocol":"CoAP","ip_address":"10.5.1.2","firmware_version":"v3.0.2","alert_count_7d":0,"last_active":_ts(0)},
    {"device_id":"DEV-406","zone_id":"ZONE-05","category":"traffic_sensor","protocol":"MQTT","ip_address":"10.5.1.20","firmware_version":"v1.3.8","alert_count_7d":0,"last_active":_ts(2)},
    {"device_id":"DEV-407","zone_id":"ZONE-05","category":"thermostat","protocol":"Zigbee","ip_address":"10.5.2.10","firmware_version":"v1.0.5","alert_count_7d":0,"last_active":_ts(5)},
    {"device_id":"DEV-408","zone_id":"ZONE-05","category":"motion_sensor","protocol":"Zigbee","ip_address":"10.5.3.10","firmware_version":"v2.0.1","alert_count_7d":1,"last_active":_ts(1)},
    {"device_id":"DEV-409","zone_id":"ZONE-05","category":"door_lock","protocol":"Zigbee","ip_address":"10.5.3.20","firmware_version":"v1.2.3","alert_count_7d":0,"last_active":_ts(3)},
]


def seed_devices():
    from .database import get_db
    with get_db() as db:
        existing = db.query(DeviceProfileDB).count()
        if existing > 0:
            return
        for d in DEVICES:
            db.add(DeviceProfileDB(**d))
        db.commit()

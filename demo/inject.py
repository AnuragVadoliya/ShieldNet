"""ShieldNet threat injection script for live demos."""
import argparse
import json
import time
import urllib.request
import urllib.error
import random
from datetime import datetime, timezone

API = "http://localhost:8080/api/v1/incidents/inject"

ATTACKS = {
    "ddos": {
        "threat_class": "DDoS",
        "zone_id": "ZONE-04",
        "device_category": "traffic_sensor",
        "confidence_score": 0.923,
        "score_lstm": 0.94,
        "score_isolation_forest": 0.91,
        "score_autoencoder": 0.89,
    },
    "botnet": {
        "threat_class": "Botnet",
        "zone_id": "ZONE-04",
        "device_category": "camera",
        "confidence_score": 0.887,
        "score_lstm": 0.92,
        "score_isolation_forest": 0.85,
        "score_autoencoder": 0.88,
    },
    "scanning": {
        "threat_class": "Scanning",
        "zone_id": "ZONE-02",
        "device_category": "camera",
        "confidence_score": 0.451,
        "score_lstm": 0.48,
        "score_isolation_forest": 0.55,
        "score_autoencoder": 0.38,
    },
    "mitm": {
        "threat_class": "MitM",
        "zone_id": "ZONE-05",
        "device_category": "gateway",
        "confidence_score": 0.782,
        "score_lstm": 0.81,
        "score_isolation_forest": 0.74,
        "score_autoencoder": 0.79,
    },
    "ransomware": {
        "threat_class": "Ransomware",
        "zone_id": "ZONE-03",
        "device_category": "gateway",
        "confidence_score": 0.961,
        "score_lstm": 0.97,
        "score_isolation_forest": 0.95,
        "score_autoencoder": 0.94,
    },
}

SCENARIOS = {
    "escalation": [
        (0, "scanning", "Low confidence scan detected"),
        (5, "scanning", "Scan intensity increasing"),
        (10, "ddos", "DDoS flood begins!"),
        (15, "botnet", "Botnet C2 channel established"),
        (20, "ransomware", "Ransomware detected! Critical!"),
    ],
    "multi_zone": [
        (0, "scanning", "ZONE-02 scanning detected"),
        (1, "ddos", "ZONE-04 under DDoS"),
        (2, "botnet", "ZONE-04 botnet beacon"),
        (3, "mitm", "ZONE-05 MitM active"),
        (4, "ransomware", "ZONE-03 ransomware outbreak"),
    ],
    "ddos_wave": [
        (0, "ddos", "Wave 1: volumetric flood"),
        (8, "ddos", "Wave 2: protocol attack"),
        (16, "ddos", "Wave 3: application layer"),
    ],
}

def inject(name, attack_data, api_key=None, count=1):
    headers = {"Content-Type": "application/json"}
    if api_key:
        headers["Authorization"] = f"Bearer {api_key}"

    results = []
    for i in range(count):
        ref = f"INC-DEMO-{datetime.now(timezone.utc).strftime('%H%M%S')}-{i}"
        payload = {**attack_data, "incident_ref": ref,
                   "detected_at": datetime.now(timezone.utc).isoformat(),
                   "status": "ACTIVE", "playbook_id": None, "actions_taken": []}
        req = urllib.request.Request(API, data=json.dumps(payload).encode(), headers=headers, method="POST")
        try:
            resp = urllib.request.urlopen(req)
            result = json.loads(resp.read())
            results.append((ref, result["status"], result["playbook_id"]))
        except urllib.error.HTTPError as e:
            results.append((ref, f"ERROR {e.code}", e.read().decode()[:100]))
    return results

def main():
    parser = argparse.ArgumentParser(description="ShieldNet threat injection demo")
    parser.add_argument("--attack", choices=["ddos", "botnet", "scanning", "mitm", "ransomware", "all"],
                        help="Attack type to inject (all = 1 of each)")
    parser.add_argument("--scenario", choices=list(SCENARIOS.keys()),
                        help="Pre-defined multi-attack scenario")
    parser.add_argument("--count", type=int, default=1, help="Number of attacks (for --attack only)")
    parser.add_argument("--interval", type=float, default=2.9, help="Seconds between scenario steps")
    parser.add_argument("--api-key", type=str, default=None, help="API key for authentication")
    args = parser.parse_args()

    if args.scenario:
        steps = SCENARIOS[args.scenario]
        print(f"\n{'='*50}\n  Scenario: {args.scenario}\n{'='*50}\n")
        for delay, attack_name, label in steps:
            print(f"  [{delay:2d}s] {label}")
            results = inject(attack_name, ATTACKS[attack_name], api_key=args.api_key)
            for ref, status, pb in results:
                print(f"         -> {ref} (status={status}, playbook={pb})")
            if delay < steps[-1][0]:
                wait = min(args.interval, steps[steps.index((delay, attack_name, label)) + 1][0] - delay)
                print(f"  Waiting {wait:.1f}s...")
                time.sleep(wait)
        total = steps[-1][0] + 1
        print(f"\n  Scenario complete in {total}s\n")
        return

    if args.attack == "all":
        for name, data in ATTACKS.items():
            results = inject(name, data, api_key=args.api_key, count=args.count)
            for ref, status, pb in results:
                print(f"[+] {name.upper()} #{args.count} injected - {ref} ({status})")
    elif args.attack:
        results = inject(args.attack, ATTACKS[args.attack], api_key=args.api_key, count=args.count)
        for ref, status, pb in results:
            print(f"[+] {args.attack.upper()} #{args.count} injected - {ref} ({status})")

if __name__ == "__main__":
    main()

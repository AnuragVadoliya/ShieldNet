# ShieldNet Architecture

## Overview

ShieldNet is a three-tier intelligent cyber attack detection and response system designed for smart city IoT infrastructure. It provides autonomous threat detection, containment, and recovery while preserving data privacy through edge-first processing.

## Three-Tier Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      TIER 3: SOC LAYER                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌───────────────┐    │
│  │ SOC API  │  │ Dashboard│  │   FL     │  │  PostgreSQL   │    │
│  │ :8080    │  │ :5173    │  │  Server  │  │  + Redis      │    │
│  └────┬─────┘  └──────────┘  └────┬─────┘  └───────────────┘    │
│       │                            │                            │
├───────┴────────────────────────────┴───────────────────────────-┤
│                      TIER 2: EDGE GATEWAY                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌───────────────┐    │
│  │ Features │  │Inference │  │   AIRO   │  │  Agent API    │    │
│  │ Extractor│  │ Ensemble │  │  Engine  │  │  :8000        │    │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └───────┬───────┘    │
│       │             │              │                 │          │
├───────┴─────────────┴──────────────┴─────────────────┴────────-─┤
│                      TIER 1: IOT DEVICE LAYER                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌───────────────┐    │
│  │  MQTT    │  │   CoAP   │  │  Zigbee  │  │   LoRaWAN     │    │ 
│  │ Devices  │  │  Devices │  │  Devices │  │   Devices     │    │
│  └──────────┘  └──────────┘  └──────────┘  └───────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow

### Detection Pipeline
```
IoT Device → Raw Message → Feature Extractor (47 features)
  → LSTM (60-step seq) + Isolation Forest + Conv1D Autoencoder
  → Ensemble Fusion (0.40/0.30/0.30 weighting)
  → Threshold Classification (NORMAL/SUSPICIOUS/THREAT)
  → AIRO Engine (if threat detected)
  → SOC Notification (anonymized, via gRPC)
```

### Federated Learning Flow
```
Edge Nodes (local training) → Gradient with DP noise
  → FL Server (FedAvg aggregation)
  → Global Model Distribution → Edge Nodes
```

## Inference Ensemble

| Model | Weight | Architecture | Purpose |
|---|---|---|---|
| LSTM | 0.40 | 128→64→32→16→1 (60×47 input) | Temporal anomaly detection |
| Isolation Forest | 0.30 | 200 estimators, per-device | Statistical outlier detection |
| Conv1D Autoencoder | 0.30 | Conv1D encoder-decoder | Reconstruction-based anomaly |

## Decision Thresholds

| Score Range | Classification | Action |
|---|---|---|
| < 0.40 | NORMAL | None |
| 0.40 – 0.69 | SUSPICIOUS | Log, increase monitoring |
| 0.70 – 0.84 | THREAT_MEDIUM | Auto-contain after 5s confirmation window |
| ≥ 0.85 | THREAT_HIGH | Immediate auto-containment |

## AIRO Playbooks

| Threat | Playbook | Actions | Target Containment |
|---|---|---|---|
| DDoS | DDoS_RESPONSE_v2 | Rate limit, quarantine, reroute, notify | < 2s |
| Botnet | BOTNET_RESPONSE_v1 | Sandbox, revoke tokens, ACL block, notify | < 2s |
| Unauthorized | UNAUTHORIZED_v1 | Force reauth, TLS rotation, notify | < 1s |
| MitM | MITM_RESPONSE_v1 | TLS rotation, cert pinning, session invalidate, notify | < 2s |
| Ransomware | RANSOMWARE_v1 | Quarantine, block outbound, sandbox, notify | < 1s |

## Feature Extraction (47 Features)

| ID | Feature | Description |
|---|---|---|
| F01 | msg_count_1min | Messages in last 60s |
| F02 | msg_rate_5min_avg | Avg msgs/min over 5min |
| F03 | msg_rate_1hr_avg | Avg msgs/6min over 1hr |
| F04 | msg_rate_24hr_avg | Avg msgs/60min over 24hr |
| F05 | burst_ratio | 1min / 5min rate ratio |
| ... | ... | ... |
| F47 | final_score | 0.40*F01 + 0.30*F02 + 0.30*F03 |

## Differential Privacy

- Epsilon (ε): 1.0
- Delta (δ): 1e-5
- Clip norm: 1.0
- Mechanism: Gradient perturbation with Gaussian noise
- Budget tracking per zone via ModelRegistry

## Services

### Edge (docker-compose.yml)
| Service | Port | Description |
|---|---|---|
| mosquitto | 1883 | MQTT broker (TLS 1.3) |
| kafka | 9092 | Message bus |
| influxdb | 8086 | Time-series metrics |
| inference | 50051 | gRPC inference service |
| features | 50052 | gRPC feature extraction |
| airo | 50053 | gRPC AIRO engine |
| fl-client | — | FL training client |
| agent-api | 8000 | Edge REST API |
| zeek | — | Network monitoring |

### SOC (docker-compose.soc.yml)
| Service | Port | Description |
|---|---|---|
| postgres | 5432 | Primary database |
| redis | 6379 | Cache + pub/sub |
| elasticsearch | 9200 | Log storage |
| soc-api | 8080 | SOC REST API + WebSocket |
| fl-server | — | FL aggregation server |
| grafana | 3000 | Dashboards |
| prometheus | 9090 | Metrics collection |

## Color Scheme

| Role | Color | Hex |
|---|---|---|
| Primary Dark | Teal 900 | #004D40 |
| Primary Medium | Teal 800 | #00695C |
| Primary Light | Teal 600 | #00897B |
| Accent Dark | Amber 800 | #FF8F00 |
| Accent Light | Amber 700 | #FFA000 |
| Alert | Red | #C62828 |
| Success | Green | #2E7D32 |
| Warning | Orange | #E65100 |

## Security

- TLS 1.3 for all MQTT connections
- JWT authentication on Edge Agent API
- HTTP Bearer scheme on all protected endpoints
- Differential privacy on all gradient uploads
- Raw device data never leaves edge zone
- Anonymized device IDs (hash-based)

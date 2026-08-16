import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { Card, CardHeader } from '../components/Card';
import { Button } from '../components/Button';
import { StatusBadge, ThreatBadge } from '../components/Badge';
import { SkeletonCard } from '../components/Skeleton';
import { theme } from '../styles/theme';
import { formatDate, timeAgo, formatPercent } from '../utils/format';

interface DeviceDetailData {
  device_id: string;
  zone_id: string;
  category: string;
  protocol: string;
  ip_address: string;
  firmware_version: string;
  alert_count_7d: number;
  last_active: string;
  status: string;
}

interface ZoneIncident {
  incident_ref: string;
  threat_class: string;
  confidence_score: number;
  status: string;
  detected_at: string | null;
}

const CATEGORY_ICONS: Record<string, string> = {
  IoT_Sensor: 'sensors', Gateway: 'router', Camera: 'videocam', HVAC: 'thermostat',
  PLC: 'settings_ethernet', Patch_Sensor: 'plumbing', Default: 'devices',
};

export const DeviceDetail: React.FC = () => {
  const { deviceId } = useParams<{ deviceId: string }>();
  const navigate = useNavigate();
  const [device, setDevice] = useState<DeviceDetailData | null>(null);
  const [incidents, setIncidents] = useState<ZoneIncident[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!deviceId) { setLoading(false); return; }
    setLoading(true);
    Promise.all([
      fetch('/api/v1/devices/' + deviceId).then(r => r.json()),
      fetch('/api/v1/incidents').then(r => r.json()),
    ])
      .then(([dev, inc]) => {
        if (dev.error) { setDevice(null); }
        else {
          setDevice(dev);
          if (inc.results) {
            setIncidents(inc.results.filter((i: any) => i.zone_id === dev.zone_id).slice(0, 10));
          }
        }
      })
      .catch(() => setDevice(null))
      .finally(() => setLoading(false));
  }, [deviceId]);

  if (loading) {
    return (
      <div>
        <SkeletonCard lines={3} avatar />
        <div style={{ marginTop: theme.spacing.lg, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: theme.spacing.md }}>
          {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} lines={2} />)}
        </div>
      </div>
    );
  }

  if (!device) {
    return (
      <div>
        <PageHeader title="Device Not Found" subtitle="This device does not exist in the monitored estate" icon="devices_other" />
        <Button variant="tonal" onClick={() => navigate('/devices')}>Back to Devices</Button>
      </div>
    );
  }

  const icon = CATEGORY_ICONS[device.category] || CATEGORY_ICONS.Default;
  const alertPct = Math.min(100, (device.alert_count_7d / 14) * 100);

  return (
    <div>
      <Button variant="text" icon={<span style={{ fontFamily: '"Material Symbols Outlined"', fontSize: '20px' }}>arrow_back</span>} onClick={() => navigate(-1)} style={{ marginBottom: theme.spacing.md }}>
        Back
      </Button>

      <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.lg, marginBottom: theme.spacing.xl }}>
        <div style={{
          width: 72, height: 72, borderRadius: theme.borderRadius.lg,
          background: `${theme.colors.primary}18`, color: theme.colors.primary,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <span style={{ fontFamily: '"Material Symbols Outlined"', fontSize: '40px' }}>{icon}</span>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1 style={{ fontSize: '24px', fontWeight: 500, color: theme.colors.onSurface, margin: 0 }}>{device.device_id}</h1>
          <div style={{ fontSize: '14px', color: theme.colors.onSurfaceVariant, marginTop: '4px' }}>
            {device.zone_id} · {device.category.replace('_', ' ')}
          </div>
        </div>
        <StatusBadge status={device.status} variant="filled" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: theme.spacing.md, marginBottom: theme.spacing.xl }}>
        <DetailCard label="Protocol" value={device.protocol} icon="swap_calls" />
        <DetailCard label="IP Address" value={device.ip_address} icon="dns" mono />
        <DetailCard label="Firmware" value={device.firmware_version} icon="system_update" />
        <DetailCard label="Last Active" value={timeAgo(device.last_active)} icon="schedule" />
      </div>

      <Card style={{ marginBottom: theme.spacing.xl }}>
        <CardHeader title="Alert Activity" subtitle="Alerts recorded over the last 7 days" avatar={<span style={{ fontFamily: '"Material Symbols Outlined"', fontSize: '28px', color: theme.colors.success }}>monitoring</span>} />
        <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.lg }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: theme.spacing.sm }}>
              <span style={{ fontSize: '13px', color: theme.colors.onSurfaceVariant }}>Alert load (7d)</span>
              <span style={{ fontSize: '15px', fontWeight: 600, color: device.alert_count_7d >= 5 ? theme.colors.error : device.alert_count_7d >= 2 ? theme.colors.warning : theme.colors.success }}>{device.alert_count_7d} alerts</span>
            </div>
            <div style={{ height: 10, borderRadius: 5, background: theme.colors.surfaceContainer }}>
              <div style={{ height: '100%', borderRadius: 5, width: `${alertPct}%`, background: device.alert_count_7d >= 5 ? theme.colors.error : device.alert_count_7d >= 2 ? theme.colors.warning : theme.colors.success, transition: `width ${theme.transitions.standard}` }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', fontSize: '10px', color: theme.colors.onSurfaceVariant }}>
              <span>0</span><span>7</span><span>14</span>
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader title="Recent Zone Incidents" subtitle={`Latest incidents detected in ${device.zone_id}`} />
        {incidents.length === 0 ? (
          <div style={{ padding: '32px', textAlign: 'center', color: theme.colors.onSurfaceVariant, fontSize: '14px' }}>
            No recent incidents in this zone.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${theme.colors.outlineVariant}`, background: theme.colors.surfaceContainer }}>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', color: theme.colors.onSurfaceVariant, fontWeight: 500 }}>Reference</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', color: theme.colors.onSurfaceVariant, fontWeight: 500 }}>Threat</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', color: theme.colors.onSurfaceVariant, fontWeight: 500 }}>Confidence</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', color: theme.colors.onSurfaceVariant, fontWeight: 500 }}>Status</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', color: theme.colors.onSurfaceVariant, fontWeight: 500 }}>Detected</th>
                </tr>
              </thead>
              <tbody>
                {incidents.map(inc => (
                  <tr key={inc.incident_ref} style={{ borderBottom: `1px solid ${theme.colors.outlineVariant}`, cursor: 'pointer', transition: `background ${theme.transitions.fast}` }}
                    onClick={() => navigate('/threats/' + inc.incident_ref)}
                    onMouseEnter={(e) => e.currentTarget.style.background = theme.colors.surfaceContainer}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding: '12px 16px', fontFamily: theme.typography.fontFamilyMono, fontSize: '12px', color: theme.colors.primary, fontWeight: 500 }}>{inc.incident_ref}</td>
                    <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}><ThreatBadge threatClass={inc.threat_class} confidence={inc.confidence_score} size="small" /></td>
                    <td style={{ padding: '12px 16px', fontWeight: 600, color: inc.confidence_score >= 0.7 ? theme.colors.error : inc.confidence_score >= 0.4 ? theme.colors.warning : theme.colors.success }}>{formatPercent(inc.confidence_score)}</td>
                    <td style={{ padding: '12px 16px' }}><StatusBadge status={inc.status} size="small" /></td>
                    <td style={{ padding: '12px 16px', color: theme.colors.onSurfaceVariant, fontSize: '12px' }}>{inc.detected_at ? formatDate(inc.detected_at) : 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

const DetailCard: React.FC<{ label: string; value: string; icon: string; mono?: boolean }> = ({ label, value, icon, mono }) => (
  <div style={{ background: theme.colors.surface, borderRadius: theme.borderRadius.lg, padding: theme.spacing.lg, boxShadow: theme.elevation.level1 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm, marginBottom: theme.spacing.sm }}>
      <span style={{ fontFamily: '"Material Symbols Outlined"', fontSize: '20px', color: theme.colors.primary }}>{icon}</span>
      <span style={{ fontSize: '11px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px', color: theme.colors.onSurfaceVariant }}>{label}</span>
    </div>
    <div style={{ fontSize: '15px', fontWeight: 600, color: theme.colors.onSurface, ...(mono ? { fontFamily: theme.typography.fontFamilyMono, fontSize: '13px' } : {}) }}>{value}</div>
  </div>
);
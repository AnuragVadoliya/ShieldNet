import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, SectionTitle } from '../components/PageHeader';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { StatusBadge } from '../components/Badge';
import { SkeletonCard } from '../components/Skeleton';
import { theme } from '../styles/theme';

interface ZoneDevice {
  device_id: string;
  category: string;
  protocol: string;
  alert_count_7d: number;
}

interface ZoneSummary {
  zone_id: string;
  total_devices: number;
  devices_online: number;
  devices_with_alerts: number;
  categories: Record<string, number>;
  devices: ZoneDevice[];
}

const LEVEL_STYLE = (alerts: number, total: number): { color: string; label: string } => {
  const ratio = total > 0 ? alerts / total : 0;
  if (alerts === 0) return { color: theme.colors.success, label: 'Healthy' };
  if (ratio < 0.3) return { color: theme.colors.warning, label: 'Elevated' };
  return { color: theme.colors.error, label: 'Critical' };
};

const CATEGORY_COLORS: Record<string, string> = {
  IoT_Sensor: theme.colors.info,
  Gateway: theme.colors.primary,
  Camera: theme.colors.tertiary,
  HVAC: theme.colors.success,
  PLC: theme.colors.secondary,
  Patch_Sensor: theme.colors.warning,
  Default: theme.colors.onSurfaceVariant,
};

export const Zones: React.FC = () => {
  const navigate = useNavigate();
  const [zones, setZones] = useState<ZoneSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<ZoneSummary | null>(null);

  useEffect(() => {
    fetch('/api/v1/zones/summary')
      .then(r => r.json())
      .then(d => setZones(d.zones || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const totalDevices = useMemo(() => zones.reduce((s, z) => s + z.total_devices, 0), [zones]);
  const totalWithAlerts = useMemo(() => zones.reduce((s, z) => s + z.devices_with_alerts, 0), [zones]);

  const maxDevices = useMemo(() => Math.max(1, ...zones.map(z => z.total_devices)), [zones]);

  return (
    <div>
      <PageHeader
        title="Zones"
        subtitle={`${zones.length} network segments · ${totalDevices} devices · ${totalWithAlerts} with alerts`}
        icon="map"
      />

      <div style={{ gridColumn: '1 / -1', marginBottom: theme.spacing.xl }}>
        <Card>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: theme.spacing.lg }}>
            {loading
              ? Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} lines={3} />)
              : zones.map(z => {
                  const level = LEVEL_STYLE(z.devices_with_alerts, z.total_devices);
                  const ratio = Math.min(1, z.total_devices / maxDevices);
                  return (
                    <div key={z.zone_id} onClick={() => setSelected(z)} style={{ cursor: 'pointer' }}>
                      <div style={{
                        height: 140, borderRadius: theme.borderRadius.lg, padding: theme.spacing.md,
                        background: `linear-gradient(160deg, ${level.color} 0%, ${level.color}CC 100%)`,
                        color: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                        boxShadow: theme.elevation.level2, transition: `transform ${theme.transitions.fast}, box-shadow ${theme.transitions.fast}`,
                        position: 'relative', overflow: 'hidden',
                      }}
                        onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.boxShadow = theme.elevation.level3; }}
                        onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = theme.elevation.level2; }}
                      >
                        <div style={{ position: 'absolute', bottom: -30, right: -30, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.15)' }} />
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '18px', fontWeight: 600 }}>{z.zone_id}</span>
                          <span style={{ fontSize: '11px', background: 'rgba(255,255,255,0.25)', padding: '2px 8px', borderRadius: '10px', fontWeight: 500 }}>{level.label}</span>
                        </div>
                        <div>
                          <div style={{ fontSize: '32px', fontWeight: 500, lineHeight: 1.1 }}>{z.total_devices}</div>
                          <div style={{ fontSize: '12px', opacity: 0.9 }}>devices</div>
                        </div>
                        <div style={{ display: 'flex', gap: theme.spacing.md, fontSize: '12px', opacity: 0.95 }}>
                          <span>{z.devices_online} online</span>
                          <span>{z.devices_with_alerts} alerting</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
          </div>
        </Card>
      </div>

      {selected && (
        <Card>
          <SectionTitle
            title={selected.zone_id}
            subtitle={`${selected.total_devices} devices · click a device for details`}
            icon="location_on"
            action={<Button variant="text" size="small" onClick={() => setSelected(null)}>Close</Button>}
          />
          <div style={{ display: 'flex', gap: theme.spacing.sm, marginBottom: theme.spacing.lg, flexWrap: 'wrap' }}>
            {Object.entries(selected.categories).map(([cat, count]) => (
              <span key={cat} style={{
                padding: '6px 12px', borderRadius: theme.borderRadius.full,
                background: `${(CATEGORY_COLORS[cat] || CATEGORY_COLORS.Default)}18`,
                color: CATEGORY_COLORS[cat] || CATEGORY_COLORS.Default,
                fontSize: '12px', fontWeight: 500,
              }}>
                {cat.replace('_', ' ')} · {count}
              </span>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: theme.spacing.sm }}>
            {selected.devices.map(d => (
              <div
                key={d.device_id}
                onClick={() => navigate('/device/' + d.device_id)}
                style={{
                  padding: theme.spacing.md, borderRadius: theme.borderRadius.md,
                  border: `1px solid ${theme.colors.outlineVariant}`, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: theme.spacing.sm,
                  transition: `background ${theme.transitions.fast}`,
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = theme.colors.surfaceContainer}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <span style={{
                  width: 36, height: 36, borderRadius: '8px', flexShrink: 0,
                  background: `${(CATEGORY_COLORS[d.category] || CATEGORY_COLORS.Default)}18`,
                  color: CATEGORY_COLORS[d.category] || CATEGORY_COLORS.Default,
                  fontSize: '20px', fontFamily: '"Material Symbols Outlined"', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>devices</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '13px', fontWeight: 500, color: theme.colors.onSurface, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{d.device_id}</div>
                  <div style={{ fontSize: '11px', color: theme.colors.onSurfaceVariant }}>{d.category.replace('_', ' ')}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: d.alert_count_7d >= 5 ? theme.colors.error : d.alert_count_7d >= 2 ? theme.colors.warning : theme.colors.success }}>{d.alert_count_7d}</div>
                  <div style={{ fontSize: '10px', color: theme.colors.onSurfaceVariant }}>alerts</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

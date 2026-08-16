import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { Card } from '../components/Card';
import { TextField } from '../components/Form';
import { StatusBadge } from '../components/Badge';
import { SkeletonCard } from '../components/Skeleton';
import { theme } from '../styles/theme';
import { timeAgo } from '../utils/format';

interface Device {
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

const CATEGORY_ICONS: Record<string, string> = {
  IoT_Sensor: 'sensors',
  Gateway: 'router',
  Camera: 'videocam',
  HVAC: 'thermostat',
  PLC: 'settings_ethernet',
  Patch_Sensor: 'plumbing',
  Default: 'devices',
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

export const Devices: React.FC = () => {
  const navigate = useNavigate();
  const [devices, setDevices] = useState<Device[]>([]);
  const [search, setSearch] = useState('');
  const [zone, setZone] = useState('all');
  const [status, setStatus] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/v1/devices')
      .then(r => r.json())
      .then(d => setDevices(d.results || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const zones = useMemo(() => [...new Set(devices.map(d => d.zone_id))].sort(), [devices]);
  const statuses = useMemo(() => [...new Set(devices.map(d => d.status))].sort(), [devices]);

  const counts = useMemo(() => {
    const c = { online: 0, degraded: 0, active_alerts: 0, quarantined: 0 };
    devices.forEach(d => { if (c[d.status as keyof typeof c] !== undefined) c[d.status as keyof typeof c]++; });
    return c;
  }, [devices]);

  const filtered = devices.filter(d =>
    (zone === 'all' || d.zone_id === zone) &&
    (status === 'all' || d.status === status) &&
    (search === '' ||
      d.device_id.toLowerCase().includes(search.toLowerCase()) ||
      d.zone_id.toLowerCase().includes(search.toLowerCase()) ||
      d.category.toLowerCase().includes(search.toLowerCase()) ||
      d.ip_address.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div>
      <PageHeader
        title="Devices"
        subtitle={`${devices.length} endpoints monitored across the network`}
        icon="devices"
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: theme.spacing.md, marginBottom: theme.spacing.xl }}>
        <SummaryTile label="Total" value={devices.length} color={theme.colors.primary} />
        <SummaryTile label="Online" value={counts.online} color={theme.colors.success} />
        <SummaryTile label="Degraded" value={counts.degraded} color={theme.colors.warning} />
        <SummaryTile label="Active Alerts" value={counts.active_alerts} color={theme.colors.tertiary} />
        <SummaryTile label="Quarantined" value={counts.quarantined} color={theme.colors.error} />
      </div>

      <Card>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: theme.spacing.md, marginBottom: theme.spacing.lg }}>
          <TextField
            label="Search"
            placeholder="Device ID, zone, category, IP..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            leadingIcon={<span style={{ fontFamily: '"Material Symbols Outlined"', fontSize: '20px' }}>search</span>}
          />
          <FilterSelect label="Zone" value={zone} onChange={v => setZone(v)} options={[{ value: 'all', label: 'All Zones' }, ...zones.map(z => ({ value: z, label: z }))]} />
          <FilterSelect label="Status" value={status} onChange={v => setStatus(v)} options={[{ value: 'all', label: 'All Statuses' }, ...statuses.map(s => ({ value: s, label: s }))]} />
        </div>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: theme.spacing.md }}>
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} lines={3} avatar />)}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: theme.spacing.md }}>
            {filtered.map(d => {
              const icon = CATEGORY_ICONS[d.category] || CATEGORY_ICONS.Default;
              const color = CATEGORY_COLORS[d.category] || CATEGORY_COLORS.Default;
              const alertPct = Math.min(100, (d.alert_count_7d / 14) * 100);
              return (
                <Card
                  key={d.device_id}
                  hoverable
                  onClick={() => navigate('/device/' + d.device_id)}
                  padding="medium"
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.md, marginBottom: theme.spacing.md }}>
                    <div style={{ width: 44, height: 44, borderRadius: theme.borderRadius.md, background: `${color}18`, color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span style={{ fontSize: '24px', lineHeight: 1, fontFamily: '"Material Symbols Outlined"' }}>{icon}</span>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: theme.colors.onSurface, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{d.device_id}</div>
                      <div style={{ fontSize: '12px', color: theme.colors.onSurfaceVariant }}>{d.category.replace('_', ' ')}</div>
                    </div>
                    <StatusBadge status={d.status} size="small" />
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm, marginBottom: '4px' }}>
                    <span style={{ fontSize: '18px', fontFamily: '"Material Symbols Outlined"', color: theme.colors.primary }}>map</span>
                    <span style={{ fontSize: '12px', color: theme.colors.onSurfaceVariant }}>{d.zone_id}</span>
                    <span style={{ flex: 1 }} />
                    <span style={{ fontSize: '12px', color: theme.colors.onSurfaceVariant }}>{timeAgo(d.last_active)}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm, marginBottom: theme.spacing.md }}>
                    <span style={{ fontSize: '18px', fontFamily: '"Material Symbols Outlined"', color: theme.colors.onSurfaceVariant }}>dns</span>
                    <span style={{ fontFamily: theme.typography.fontFamilyMono, fontSize: '12px', color: theme.colors.onSurfaceVariant }}>{d.ip_address}</span>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '11px', color: theme.colors.onSurfaceVariant, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Alert Activity (7d)</span>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: d.alert_count_7d >= 5 ? theme.colors.error : d.alert_count_7d >= 2 ? theme.colors.warning : theme.colors.success }}>{d.alert_count_7d}</span>
                    </div>
                    <div style={{ height: 6, borderRadius: 3, background: theme.colors.surfaceContainer }}>
                      <div style={{ height: '100%', borderRadius: 3, width: `${alertPct}%`, background: d.alert_count_7d >= 5 ? theme.colors.error : d.alert_count_7d >= 2 ? theme.colors.warning : theme.colors.success, transition: `width ${theme.transitions.standard}` }} />
                    </div>
                  </div>
                </Card>
              );
            })}
            {filtered.length === 0 && (
              <div style={{ gridColumn: '1 / -1', padding: '48px', textAlign: 'center', color: theme.colors.onSurfaceVariant }}>
                No devices match the current filters
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};

const FilterSelect: React.FC<{ label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }> = ({ label, value, onChange, options }) => (
  <div>
    <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: theme.colors.onSurfaceVariant, marginBottom: '6px' }}>{label}</label>
    <select value={value} onChange={e => onChange(e.target.value)} style={{
      width: '100%', padding: '12px 40px 12px 12px', fontSize: '14px', fontFamily: theme.typography.fontFamily,
      color: theme.colors.onSurface, background: theme.colors.surface, border: `1px solid ${theme.colors.outlineVariant}`,
      borderRadius: theme.borderRadius.sm, outline: 'none', cursor: 'pointer', appearance: 'none',
    }}>
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  </div>
);

const SummaryTile: React.FC<{ label: string; value: number; color: string }> = ({ label, value, color }) => (
  <div style={{ background: theme.colors.surface, borderRadius: theme.borderRadius.lg, padding: theme.spacing.md, boxShadow: theme.elevation.level1, borderTop: `3px solid ${color}` }}>
    <div style={{ fontSize: '12px', color: theme.colors.onSurfaceVariant, fontWeight: 500 }}>{label}</div>
    <div style={{ fontSize: '28px', fontWeight: 500, color, lineHeight: 1.1, marginTop: '4px' }}>{value}</div>
  </div>
);
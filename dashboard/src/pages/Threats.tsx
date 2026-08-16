import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { Card, CardHeader } from '../components/Card';
import { TextField } from '../components/Form';
import { StatusBadge, ThreatBadge } from '../components/Badge';
import { SkeletonTable } from '../components/Skeleton';
import { theme } from '../styles/theme';
import { useIncidents } from '../hooks/useIncidents';
import { formatPercent, timeAgo } from '../utils/format';

type SortKey = 'detected_at' | 'confidence_score' | 'incident_ref';

export const Threats: React.FC = () => {
  const navigate = useNavigate();
  const { incidents, loading } = useIncidents({ limit: '200' });

  const [zone, setZone] = useState('all');
  const [status, setStatus] = useState('all');
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('detected_at');
  const [sortDir, setSortDir] = useState<1 | -1>(-1);

  const zones = useMemo(() => [...new Set(incidents.map(i => i.zone_id))].sort(), [incidents]);
  const statuses = useMemo(() => [...new Set(incidents.map(i => i.status))].sort(), [incidents]);

  const filtered = useMemo(() => {
    let list = incidents.filter(i =>
      (zone === 'all' || i.zone_id === zone) &&
      (status === 'all' || i.status === status) &&
      (search === '' || i.incident_ref.toLowerCase().includes(search.toLowerCase()) || i.device_category.toLowerCase().includes(search.toLowerCase()) || i.threat_class.toLowerCase().includes(search.toLowerCase()))
    );
    list.sort((a, b) => {
      const av = a[sortKey] ?? '';
      const bv = b[sortKey] ?? '';
      if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * sortDir;
      return String(av).localeCompare(String(bv)) * sortDir;
    });
    return list;
  }, [incidents, zone, status, search, sortKey, sortDir]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === 1 ? -1 : 1);
    else { setSortKey(key); setSortDir(key === 'incident_ref' ? 1 : -1); }
  };

  const sortIndicator = (key: SortKey) =>
    sortKey === key ? (sortDir === 1 ? ' ↑' : ' ↓') : '';

  const counts = useMemo(() => ({
    active: incidents.filter(i => i.status === 'ACTIVE').length,
    review: incidents.filter(i => i.status === 'REVIEW').length,
    contained: incidents.filter(i => i.status === 'CONTAINED').length,
  }), [incidents]);

  return (
    <div>
      <PageHeader
        title="Threat Intelligence"
        subtitle={`${incidents.length} incidents across ${zones.length} zones`}
        icon="warning"
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: theme.spacing.md, marginBottom: theme.spacing.xl }}>
        <SummaryTile label="Active" value={counts.active} color={theme.colors.error} />
        <SummaryTile label="Under Review" value={counts.review} color={theme.colors.warning} />
        <SummaryTile label="Contained" value={counts.contained} color={theme.colors.success} />
        <SummaryTile label="Total" value={incidents.length} color={theme.colors.primary} />
      </div>

      <Card padding="medium">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: theme.spacing.md, marginBottom: theme.spacing.md }}>
          <TextField
            label="Search"
            placeholder="Ref, device, or threat type..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            leadingIcon={<span style={{ fontSize: '20px', fontFamily: '"Material Symbols Outlined"' }}>search</span>}
          />
          <Select label="Zone" value={zone} onChange={e => setZone(e.target.value)} options={[{ value: 'all', label: 'All Zones' }, ...zones.map(z => ({ value: z, label: z }))]} />
          <Select label="Status" value={status} onChange={e => setStatus(e.target.value)} options={[{ value: 'all', label: 'All Statuses' }, ...statuses.map(s => ({ value: s, label: s }))]} />
        </div>

        {loading ? (
          <SkeletonTable rows={8} cols={6} />
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${theme.colors.outlineVariant}`, background: theme.colors.surfaceContainer }}>
                  {[
                    { label: 'Incident', key: 'incident_ref' as SortKey, align: 'left' as const },
                    { label: 'Zone', key: null, align: 'left' as const },
                    { label: 'Device', key: null, align: 'left' as const },
                    { label: 'Threat', key: null, align: 'left' as const },
                    { label: 'Confidence', key: null, align: 'left' as const },
                    { label: 'Status', key: null, align: 'left' as const },
                    { label: 'Detected', key: 'detected_at' as SortKey, align: 'left' as const },
                  ].map((col, idx) => (
                    <th
                      key={idx}
                      onClick={col.key ? () => toggleSort(col.key!) : undefined}
                      style={{
                        padding: '12px 16px', textAlign: col.align, fontWeight: 500,
                        color: theme.colors.onSurfaceVariant, fontSize: '11px',
                        textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap',
                        cursor: col.key ? 'pointer' : 'default', userSelect: 'none',
                      }}
                    >
                      {col.label + (col.key ? sortIndicator(col.key) : '')}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(t => (
                  <tr
                    key={t.id}
                    onClick={() => navigate('/threats/' + t.incident_ref)}
                    style={{ borderBottom: `1px solid ${theme.colors.outlineVariant}`, cursor: 'pointer', transition: `background ${theme.transitions.fast}` }}
                    onMouseEnter={(e) => e.currentTarget.style.background = theme.colors.surfaceContainer}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '12px 16px', fontFamily: theme.typography.fontFamilyMono, fontSize: '12px', color: theme.colors.primary, fontWeight: 500, whiteSpace: 'nowrap' }}>{t.incident_ref}</td>
                    <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                      <span style={{ padding: '2px 8px', borderRadius: theme.borderRadius.sm, background: theme.colors.surfaceContainerHigh, fontSize: '11px', fontWeight: 500, color: theme.colors.onSurfaceVariant }}>{t.zone_id}</span>
                    </td>
                    <td style={{ padding: '12px 16px', color: theme.colors.onSurfaceVariant, whiteSpace: 'nowrap' }}>{t.device_category}</td>
                    <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}><ThreatBadge threatClass={t.threat_class} confidence={t.confidence_score} size="small" /></td>
                    <td style={{ padding: '12px 16px', whiteSpace: 'nowrap', fontWeight: 500, color: t.confidence_score >= 0.7 ? theme.colors.error : t.confidence_score >= 0.4 ? theme.colors.warning : theme.colors.success }}>
                      {formatPercent(t.confidence_score)}
                    </td>
                    <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}><StatusBadge status={t.status} size="small" /></td>
                    <td style={{ padding: '12px 16px', color: theme.colors.onSurfaceVariant, whiteSpace: 'nowrap', fontSize: '12px' }}>{timeAgo(t.detected_at)}</td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={7} style={{ padding: '48px 16px', textAlign: 'center', color: theme.colors.onSurfaceVariant }}>No threats match the current filters</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

const Select: React.FC<{ label: string; value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; options: { value: string; label: string }[] }> = ({ label, value, onChange, options }) => (
  <div>
    <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: theme.colors.onSurfaceVariant, marginBottom: '6px' }}>{label}</label>
    <select value={value} onChange={onChange} style={{
      width: '100%', padding: '12px 40px 12px 12px', fontSize: '14px', fontFamily: theme.typography.fontFamily,
      color: theme.colors.onSurface, background: theme.colors.surface, border: `1px solid ${theme.colors.outlineVariant}`,
      borderRadius: theme.borderRadius.sm, outline: 'none', cursor: 'pointer', appearance: 'none',
    }}>
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  </div>
);

const SummaryTile: React.FC<{ label: string; value: number; color: string }> = ({ label, value, color }) => (
  <div style={{ background: theme.colors.surface, borderRadius: theme.borderRadius.lg, padding: theme.spacing.md, boxShadow: theme.elevation.level1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
    <span style={{ fontSize: '12px', color: theme.colors.onSurfaceVariant, fontWeight: 500 }}>{label}</span>
    <span style={{ fontSize: '28px', fontWeight: 500, color, lineHeight: 1.1 }}>{value}</span>
  </div>
);
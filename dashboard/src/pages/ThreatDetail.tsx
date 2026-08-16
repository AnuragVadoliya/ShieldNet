import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { Card, CardHeader } from '../components/Card';
import { Button } from '../components/Button';
import { StatusBadge, Badge } from '../components/Badge';
import { SkeletonCard } from '../components/Skeleton';
import { theme } from '../styles/theme';
import { formatPercent, formatDate } from '../utils/format';

interface Action {
  action: string;
  target?: string;
  status?: string;
  duration_ms?: number;
}

interface IncidentDetail {
  id: string;
  incident_ref: string;
  zone_id: string;
  device_category: string;
  threat_class: string;
  confidence_score: number;
  status: string;
  detected_at: string | null;
  contained_at: string | null;
  resolved_at: string | null;
  playbook_id: string | null;
  actions_taken: Action[];
  created_at?: string | null;
  updated_at?: string | null;
}

export const ThreatDetail: React.FC = () => {
  const { incidentRef } = useParams<{ incidentRef: string }>();
  const navigate = useNavigate();
  const [incident, setIncident] = useState<IncidentDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!incidentRef) { setLoading(false); return; }
    setLoading(true);
    fetch('/api/v1/incidents/' + incidentRef)
      .then(r => r.json())
      .then(data => setIncident(data.error ? null : data))
      .catch(() => setIncident(null))
      .finally(() => setLoading(false));
  }, [incidentRef]);

  if (loading) {
    return (
      <div>
        <SkeletonCard lines={4} avatar />
        <div style={{ marginTop: theme.spacing.lg, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: theme.spacing.md }}>
          {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} lines={3} />)}
        </div>
      </div>
    );
  }

  if (!incident) {
    return (
      <div>
        <PageHeader title="Incident Not Found" subtitle="This incident reference does not exist in the SOC database" icon="search_off" />
        <Button variant="tonal" onClick={() => navigate('/threats')}>Back to Threats</Button>
      </div>
    );
  }

  const confColor = incident.confidence_score >= 0.7 ? theme.colors.error : incident.confidence_score >= 0.4 ? theme.colors.warning : theme.colors.success;

  return (
    <div>
      <Button variant="text" icon={<span style={{ fontFamily: '"Material Symbols Outlined"', fontSize: '20px' }}>arrow_back</span>} onClick={() => navigate('/threats')} style={{ marginBottom: theme.spacing.md }}>
        Back to Threats
      </Button>

      <PageHeader
        title={incident.incident_ref}
        subtitle="Incident detail · detection, containment, and response timeline"
        icon="warning"
        actions={<StatusBadge status={incident.status} variant="filled" />}
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: theme.spacing.md, marginBottom: theme.spacing.xl }}>
        <DetailCard label="Threat Class" value={incident.threat_class} icon="bug_report" />
        <DetailCard label="Zone" value={incident.zone_id} icon="map" />
        <DetailCard label="Device Category" value={incident.device_category} icon="devices" />
        <DetailCard label="Playbook" value={incident.playbook_id || 'None assigned'} icon="menu_book" />
      </div>

      <Card>
        <CardHeader title="Confidence & Timing" subtitle="Ensemble detection score and incident lifecycle" avatar={<span style={{ fontFamily: '"Material Symbols Outlined"', fontSize: '22px', color: theme.colors.primary }}>schedule</span>} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: theme.spacing.lg, marginBottom: theme.spacing.lg }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: theme.spacing.sm }}>
              <span style={{ fontSize: '13px', color: theme.colors.onSurfaceVariant, fontWeight: 500 }}>Ensemble Confidence</span>
              <span style={{ fontSize: '13px', fontWeight: 600, color: confColor }}>{formatPercent(incident.confidence_score, 1)}</span>
            </div>
            <div style={{ height: 12, borderRadius: 6, background: theme.colors.surfaceContainer, position: 'relative' }}>
              <div style={{ position: 'absolute', left: `${Math.min(100, incident.confidence_score * 100)}%`, top: -3, width: 2, height: 18, background: theme.colors.outline }} />
              <div style={{ height: '100%', borderRadius: 6, width: `${Math.min(100, incident.confidence_score * 100)}%`, background: confColor, transition: `width ${theme.transitions.standard}` }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
              <span style={{ fontSize: '10px', color: theme.colors.onSurfaceVariant }}>0%</span>
              <span style={{ fontSize: '10px', color: theme.colors.onSurfaceVariant }}>AIRO threshold 40%</span>
              <span style={{ fontSize: '10px', color: theme.colors.onSurfaceVariant }}>100%</span>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.sm }}>
            <TimelineRow label="Detected" value={formatDate(incident.detected_at)} icon="sensors" color={theme.colors.info} />
            <TimelineRow label="Contained" value={incident.contained_at ? formatDate(incident.contained_at) : 'Pending'} icon="shield" color={theme.colors.success} />
            <TimelineRow label="Resolved" value={incident.resolved_at ? formatDate(incident.resolved_at) : 'Pending'} icon="check_circle" color={theme.colors.secondary} />
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader
          title="Response Actions"
          subtitle={`${(incident.actions_taken || []).length} playbook actions executed`}
          avatar={<span style={{ fontFamily: '"Material Symbols Outlined"', fontSize: '28px', color: theme.colors.tertiary }}>bolt</span>}
        />
        {(!incident.actions_taken || incident.actions_taken.length === 0) ? (
          <div style={{ padding: '32px', textAlign: 'center', color: theme.colors.onSurfaceVariant, fontSize: '14px' }}>
            No response actions were recorded for this incident.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${theme.colors.outlineVariant}`, background: theme.colors.surfaceContainer }}>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', color: theme.colors.onSurfaceVariant, fontWeight: 500 }}>Action</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', color: theme.colors.onSurfaceVariant, fontWeight: 500 }}>Target</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', color: theme.colors.onSurfaceVariant, fontWeight: 500 }}>Status</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', color: theme.colors.onSurfaceVariant, fontWeight: 500 }}>Duration</th>
                </tr>
              </thead>
              <tbody>
                {(incident.actions_taken || []).map((a, i) => (
                  <tr key={i} style={{ borderBottom: `1px solid ${theme.colors.outlineVariant}` }}>
                    <td style={{ padding: '12px 16px', fontWeight: 500, color: theme.colors.onSurface, whiteSpace: 'nowrap' }}>
                      <span style={{ fontFamily: theme.typography.fontFamilyMono, fontSize: '12px', background: theme.colors.surfaceContainer, padding: '2px 8px', borderRadius: theme.borderRadius.sm }}>{a.action}</span>
                    </td>
                    <td style={{ padding: '12px 16px', fontFamily: theme.typography.fontFamilyMono, fontSize: '12px', color: theme.colors.onSurfaceVariant }}>{a.target || '-'}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <Badge variant="dot" color={(a.status === 'completed' ? 'success' : a.status === 'failed' ? 'error' : 'warning')} size="small">{a.status || 'pending'}</Badge>
                    </td>
                    <td style={{ padding: '12px 16px', color: theme.colors.onSurfaceVariant, fontSize: '12px' }}>{a.duration_ms ? a.duration_ms + 'ms' : '-'}</td>
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

const DetailCard: React.FC<{ label: string; value: string; icon: string }> = ({ label, value, icon }) => (
  <div style={{ background: theme.colors.surface, borderRadius: theme.borderRadius.lg, padding: theme.spacing.lg, boxShadow: theme.elevation.level1 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm, marginBottom: theme.spacing.sm }}>
      <span style={{ fontFamily: '"Material Symbols Outlined"', fontSize: '20px', color: theme.colors.primary }}>{icon}</span>
      <span style={{ fontSize: '11px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px', color: theme.colors.onSurfaceVariant }}>{label}</span>
    </div>
    <div style={{ fontSize: '15px', fontWeight: 600, color: theme.colors.onSurface }}>{value}</div>
  </div>
);

const TimelineRow: React.FC<{ label: string; value: string; icon: string; color: string }> = ({ label, value, icon, color }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm, padding: theme.spacing.sm, borderRadius: theme.borderRadius.md, background: theme.colors.surfaceContainer }}>
    <span style={{ fontFamily: '"Material Symbols Outlined"', fontSize: '20px', color }}>{icon}</span>
    <span style={{ fontSize: '12px', color: theme.colors.onSurfaceVariant, flexShrink: 0 }}>{label}</span>
    <span style={{ flex: 1 }} />
    <span style={{ fontSize: '13px', fontWeight: 500, color: theme.colors.onSurface }}>{value}</span>
  </div>
);
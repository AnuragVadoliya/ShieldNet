import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, StatCard } from '../components/PageHeader';
import { Card, CardHeader } from '../components/Card';
import { IncidentTable } from '../components/tables/IncidentTable';
import { Button } from '../components/Button';
import { StatusBadge, ThreatBadge, Badge } from '../components/Badge';
import { theme } from '../styles/theme';
import { useIncidents, Incident } from '../hooks/useIncidents';
import { timeAgo } from '../utils/format';
import { EmptyState } from '../components/PageHeader';
import { SkeletonTable } from '../components/Skeleton';

interface LiveThreat {
  incident_ref: string;
  zone_id: string;
  threat_class: string;
  confidence_score: number;
  status: string;
  detected_at?: string;
}

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { incidents, loading, reload } = useIncidents({ limit: '200' });
  const [deviceStats, setDeviceStats] = useState<{ total: number; withAlerts: number }>({ total: 0, withAlerts: 0 });
  const [live, setLive] = useState<LiveThreat[]>([]);
  const [wsState, setWsState] = useState<'connecting' | 'open' | 'closed'>('connecting');
  const [autoRefresh, setAutoRefresh] = useState(true);

  const loadDevices = useCallback(() => {
    fetch('/api/v1/devices')
      .then(r => r.json())
      .then(d => {
        const results = Array.isArray(d.results) ? d.results : [];
        const withAlerts = results.filter((x: any) => x.status !== 'online').length;
        setDeviceStats({ total: d.total || results.length, withAlerts });
      })
      .catch(() => {});
  }, []);

  useEffect(() => { loadDevices(); }, [loadDevices]);

  useEffect(() => {
    if (!autoRefresh) return;
    const id = setInterval(() => { reload(); loadDevices(); }, 10000);
    return () => clearInterval(id);
  }, [autoRefresh, reload, loadDevices]);

  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const ws = new WebSocket(`${protocol}//${window.location.host}/ws/alerts`);
    ws.onopen = () => setWsState('open');
    ws.onclose = () => setWsState('closed');
    ws.onerror = () => ws.close();
    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.event === 'NEW_THREAT' && msg.data) {
          setLive(prev => [msg.data, ...prev].slice(0, 30));
        }
      } catch (e) { /* ignore */ }
    };
    return () => ws.close();
  }, []);

  const todayStr = new Date().toISOString().slice(0, 10);
  const threatsToday = incidents.filter(i => i.detected_at && i.detected_at.slice(0, 10) === todayStr).length;
  const activeThreats = incidents.filter(i => i.status === 'ACTIVE' || i.status === 'REVIEW').length;
  const underReview = incidents.filter(i => i.status === 'REVIEW').length;
  const contained = incidents.filter(i => i.status === 'CONTAINED').length;

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Real-time operational overview of the federated security estate"
        icon="dashboard"
        actions={
          <Button
            variant="tonal"
            icon={<span style={{ fontFamily: '"Material Symbols Outlined"', fontSize: '20px' }}>autorenew</span>}
            onClick={() => setAutoRefresh(v => !v)}
          >
            {autoRefresh ? 'Auto-refresh on' : 'Auto-refresh off'}
          </Button>
        }
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: theme.spacing.md, marginBottom: theme.spacing.xl }}>
        <StatCard label="Threats Today" value={threatsToday} icon="today" color={theme.colors.error} subtitle="Detected in last 24h" />
        <StatCard label="Active Threats" value={activeThreats} icon="priority_high" color={theme.colors.warning} subtitle="ACTIVE or REVIEW" />
        <StatCard label="Contained" value={contained} icon="shield" color={theme.colors.success} subtitle="Auto-contained by AIRO" />
        <StatCard label="Under Review" value={underReview} icon="rate_review" color={theme.colors.info} subtitle="Awaiting analyst decision" />
        <StatCard label="Devices Monitored" value={deviceStats.total} icon="devices" color={theme.colors.primary} subtitle="Across all zones" />
        <StatCard label="Devices Alerting" value={deviceStats.withAlerts} icon="warning" color={theme.colors.warning} subtitle="Non-online devices" />
        <StatCard label="Live Feed" value={wsState === 'open' ? 'Live' : 'Off'} icon="sensors" color={theme.colors.info} subtitle={wsState} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: theme.spacing.lg, alignItems: 'start' }}>
        <Card>
          <CardHeader
            title="Recent Incidents"
            subtitle="Latest detected and contained threats across zones"
            action={
              <Button variant="text" size="small" onClick={() => navigate('/threats')}>View all</Button>
            }
          />
          {loading ? <SkeletonTable rows={5} cols={5} /> : <IncidentTable incidents={incidents.slice(0, 8)} />}
        </Card>

        <Card>
          <CardHeader
            title="Live Threat Feed"
            subtitle={wsState === 'open' ? 'WebSocket connected' : 'WebSocket disconnected'}
            action={<Badge variant="dot" color={wsState === 'open' ? 'success' : 'error'}>Live</Badge>}
          />
          {live.length === 0 ? (
            <EmptyState
              icon="sensors_off"
              title="No live activity"
              description="Inject threats with the demo script to see real-time detections appear here."
            />
          ) : (
            <div style={{ maxHeight: '440px', overflow: 'auto' }}>
              {live.map((t, i) => (
                <div
                  key={t.incident_ref + '-' + i}
                  onClick={() => navigate('/threats/' + t.incident_ref)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: theme.spacing.sm,
                    padding: '12px', borderRadius: theme.borderRadius.md,
                    cursor: 'pointer', marginBottom: '4px',
                    borderLeft: `3px solid ${theme.colors.threat.high}`,
                    background: theme.colors.surfaceContainer,
                    transition: `background ${theme.transitions.fast}`,
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = theme.colors.surfaceContainerHigh}
                  onMouseLeave={(e) => e.currentTarget.style.background = theme.colors.surfaceContainer}
                >
                  <span style={{
                    width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                    background: theme.colors.threat.high, animation: 'pulse 1.5s infinite',
                  }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '13px', fontWeight: 500, color: theme.colors.onSurface, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {t.threat_class || 'Threat'}
                      <span style={{ color: theme.colors.onSurfaceVariant, fontWeight: 400 }}> in {t.zone_id}</span>
                    </div>
                    <div style={{ fontSize: '11px', color: theme.colors.onSurfaceVariant, marginTop: 2 }}>
                      {t.detected_at ? timeAgo(t.detected_at) : 'just now'}
                    </div>
                  </div>
                  <StatusBadge status={(t.status || 'ACTIVE').toLowerCase()} size="small" />
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
import React, { useEffect, useState } from 'react';
import { PageHeader, StatCard, SectionTitle } from '../components/PageHeader';
import { Card, CardHeader } from '../components/Card';
import { Badge } from '../components/Badge';
import { SkeletonCard } from '../components/Skeleton';
import { theme } from '../styles/theme';
import { timeAgo } from '../utils/format';

interface FederatedSite {
  site_id: string;
  name: string;
  status: string;
  last_sync: string;
  devices_shared: number;
  threats_cross: number;
}

interface FederatedStatus {
  sites: FederatedSite[];
  current_round: number;
  global_model_version: string;
  last_aggregation: string;
  next_aggregation: string;
  participating_zones: number;
}

export const Federated: React.FC = () => {
  const [data, setData] = useState<FederatedStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/v1/federated/status')
      .then(r => r.json())
      .then(d => setData(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const statusColor = (s: string) =>
    s === 'online' ? theme.colors.success : s === 'degraded' ? theme.colors.warning : theme.colors.error;
  const statusKey = (s: string): 'success' | 'warning' | 'error' =>
    s === 'online' ? 'success' : s === 'degraded' ? 'warning' : 'error';

  return (
    <div>
      <PageHeader
        title="Federated SOC"
        subtitle="Collaborative detection across globally distributed network operations centers"
        icon="hub"
      />

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: theme.spacing.md }}>
          {Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} lines={3} />)}
        </div>
      ) : data ? (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: theme.spacing.md, marginBottom: theme.spacing.xl }}>
            <StatCard label="Participating Zones" value={data.participating_zones} icon="hub" color={theme.colors.primary} />
            <StatCard label="Current FL Round" value={data.current_round} icon="cycle" color={theme.colors.info} />
            <StatCard label="Global Model" value={data.global_model_version} icon="memory" color={theme.colors.secondary} />
            <StatCard label="Next Aggregation" value={data.next_aggregation ? timeAgo(data.next_aggregation) : 'N/A'} icon="schedule" color={theme.colors.warning} />
          </div>

          <Card>
            <CardHeader
              title="Connected Sites"
              subtitle={`${data.sites.length} network centers sharing threat intelligence`}
            />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: theme.spacing.md }}>
              {data.sites.map(s => (
                <div
                  key={s.site_id}
                  style={{
                    padding: theme.spacing.lg, borderRadius: theme.borderRadius.lg,
                    border: `1px solid ${theme.colors.outlineVariant}`,
                    borderTop: `3px solid ${statusColor(s.status)}`,
                    transition: `box-shadow ${theme.transitions.fast}`,
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.boxShadow = theme.elevation.level2}
                  onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing.md }}>
                    <div>
                      <div style={{ fontSize: '16px', fontWeight: 600, color: theme.colors.onSurface }}>{s.name}</div>
                      <div style={{ fontSize: '12px', color: theme.colors.onSurfaceVariant, fontFamily: theme.typography.fontFamilyMono }}>{s.site_id}</div>
                    </div>
                    <Badge variant="dot" color={statusKey(s.status)} dotColor={statusColor(s.status)}>{s.status}</Badge>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: theme.spacing.md, marginBottom: theme.spacing.md }}>
                    <div style={{ background: theme.colors.surfaceContainer, borderRadius: theme.borderRadius.md, padding: theme.spacing.md }}>
                      <div style={{ fontSize: '24px', fontWeight: 600, color: theme.colors.onSurface }}>{s.devices_shared}</div>
                      <div style={{ fontSize: '11px', color: theme.colors.onSurfaceVariant }}>devices shared</div>
                    </div>
                    <div style={{ background: theme.colors.surfaceContainer, borderRadius: theme.borderRadius.md, padding: theme.spacing.md }}>
                      <div style={{ fontSize: '24px', fontWeight: 600, color: theme.colors.error }}>{s.threats_cross}</div>
                      <div style={{ fontSize: '11px', color: theme.colors.onSurfaceVariant }}>cross-site threats</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm, fontSize: '12px', color: theme.colors.onSurfaceVariant }}>
                    <span style={{ fontFamily: '"Material Symbols Outlined"', fontSize: '16px' }}>sync</span>
                    Last sync {timeAgo(s.last_sync)}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </>
      ) : null}
    </div>
  );
};
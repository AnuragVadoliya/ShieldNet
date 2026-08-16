import React from 'react';
import { useNavigate } from 'react-router-dom';
import { theme } from '../../styles/theme';
import { StatusBadge, ThreatBadge } from '../Badge';
import { timeAgo } from '../../utils/format';

export interface IncidentRow {
  id: string;
  incident_ref: string;
  zone_id: string;
  device_category: string;
  threat_class: string;
  confidence_score: number;
  status: string;
  detected_at: string | null;
  playbook_id?: string | null;
}

interface IncidentTableProps {
  incidents: IncidentRow[];
  onRowClick?: (ref: string) => void;
  showZone?: boolean;
  showDevice?: boolean;
  compact?: boolean;
}

export const IncidentTable: React.FC<IncidentTableProps> = ({
  incidents,
  onRowClick,
  showZone = true,
  showDevice = true,
  compact = false,
}) => {
  const navigate = useNavigate();
  const go = (ref: string) => { if (onRowClick) onRowClick(ref); else navigate('/threats/' + ref); };

  const cellPad = compact ? '10px 12px' : '12px 16px';

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
        <thead>
          <tr style={{ borderBottom: `1px solid ${theme.colors.outlineVariant}`, background: theme.colors.surfaceContainer }}>
            <th style={{ padding: cellPad, textAlign: 'left', fontWeight: 500, color: theme.colors.onSurfaceVariant, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Incident</th>
            {showZone && <th style={{ padding: cellPad, textAlign: 'left', fontWeight: 500, color: theme.colors.onSurfaceVariant, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Zone</th>}
            {showDevice && <th style={{ padding: cellPad, textAlign: 'left', fontWeight: 500, color: theme.colors.onSurfaceVariant, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Device</th>}
            <th style={{ padding: cellPad, textAlign: 'left', fontWeight: 500, color: theme.colors.onSurfaceVariant, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Threat</th>
            <th style={{ padding: cellPad, textAlign: 'left', fontWeight: 500, color: theme.colors.onSurfaceVariant, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Status</th>
            <th style={{ padding: cellPad, textAlign: 'left', fontWeight: 500, color: theme.colors.onSurfaceVariant, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Detected</th>
          </tr>
        </thead>
        <tbody>
          {incidents.map(inc => (
            <tr
              key={inc.id}
              onClick={() => go(inc.incident_ref)}
              style={{
                borderBottom: `1px solid ${theme.colors.outlineVariant}`,
                cursor: 'pointer',
                transition: `background ${theme.transitions.fast}`,
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = theme.colors.surfaceContainer}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <td style={{ padding: cellPad, fontFamily: theme.typography.fontFamilyMono, fontSize: '12px', color: theme.colors.primary, fontWeight: 500, whiteSpace: 'nowrap' }}>
                {inc.incident_ref}
              </td>
              {showZone && (
                <td style={{ padding: cellPad, whiteSpace: 'nowrap' }}>
                  <span style={{
                    padding: '2px 8px', borderRadius: theme.borderRadius.sm, background: theme.colors.surfaceContainerHigh,
                    fontSize: '11px', fontWeight: 500, color: theme.colors.onSurfaceVariant,
                  }}>
                    {inc.zone_id}
                  </span>
                </td>
              )}
              {showDevice && (
                <td style={{ padding: cellPad, color: theme.colors.onSurfaceVariant, whiteSpace: 'nowrap' }}>{inc.device_category}</td>
              )}
              <td style={{ padding: cellPad, whiteSpace: 'nowrap' }}>
                <ThreatBadge threatClass={inc.threat_class} confidence={inc.confidence_score} size="small" />
              </td>
              <td style={{ padding: cellPad, whiteSpace: 'nowrap' }}>
                <StatusBadge status={inc.status.toLowerCase()} size="small" />
              </td>
              <td style={{ padding: cellPad, color: theme.colors.onSurfaceVariant, whiteSpace: 'nowrap', fontSize: '12px' }}>
                {timeAgo(inc.detected_at)}
              </td>
            </tr>
          ))}
          {incidents.length === 0 && (
            <tr>
              <td colSpan={6} style={{ padding: '48px 16px', textAlign: 'center', color: theme.colors.onSurfaceVariant, fontSize: '14px' }}>
                No incidents found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
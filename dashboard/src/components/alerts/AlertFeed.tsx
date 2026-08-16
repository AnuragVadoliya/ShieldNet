import React, { useEffect, useRef, useState } from 'react';

interface Alert {
  incident_id: string;
  timestamp_detected: string;
  zone_id: string;
  device_category: string;
  threat_class: string;
  score_ensemble: number;
  decision: string;
  status: string;
}

const DECISION_COLORS: Record<string, string> = {
  THREAT_HIGH:   '#C62828',
  THREAT_MEDIUM: '#E65100',
  SUSPICIOUS:    '#F9A825',
  NORMAL:        '#2E7D32',
};

const STATUS_COLORS: Record<string, {bg: string; fg: string}> = {
  CONTAINED:  {bg: '#E8F5E9', fg: '#2E7D32'},
  ACTIVE:     {bg: '#FFEBEE', fg: '#C62828'},
  REVIEW:     {bg: '#FFF8E1', fg: '#F57F17'},
};

export const AlertFeed: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [userScrolled, setUserScrolled] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const userScrolledRef = useRef(false);

  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host;
    const ws = new WebSocket(protocol + '//' + host + '/ws/alerts');
    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.event === 'NEW_THREAT') {
          setAlerts(prev => [msg.data, ...prev].slice(0, 100));
          if (!userScrolledRef.current && containerRef.current) {
            containerRef.current.scrollTop = 0;
          }
        }
      } catch (e) { console.warn('WS parse error', e); }
    };
    return () => ws.close();
  }, []);

  return (
    <div style={{ height: '400px', overflowY: 'auto', position: 'relative', background: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.12)' }}
         ref={containerRef}
         onScroll={e => { const scrolled = (e.target as HTMLDivElement).scrollTop > 20; userScrolledRef.current = scrolled; setUserScrolled(scrolled); }}>
      {userScrolled && (
        <div style={{
          position: 'sticky', top: 0, background: '#FF8F00',
          color: 'white', textAlign: 'center', padding: '4px',
          fontSize: '11px', fontWeight: 500, cursor: 'pointer', zIndex: 10,
        }}
          onClick={() => { userScrolledRef.current = false; setUserScrolled(false); if (containerRef.current) containerRef.current.scrollTop = 0; }}>
          New alerts below - click to scroll to top
        </div>
      )}
      {alerts.length === 0 && (
        <div style={{ padding: '60px 20px', textAlign: 'center', color: '#9E9E9E', fontSize: '14px' }}>
          No live threats. Inject threats to see them here in real-time.
        </div>
      )}
      {alerts.map((alert, i) => (
        <div key={alert.incident_id + '-' + i} style={{
          padding: '12px 16px', borderBottom: '1px solid #F5F5F5',
          display: 'flex', alignItems: 'flex-start', gap: '10px',
        }}>
          <span style={{
            width: '8px', height: '8px', borderRadius: '50%', flexShrink: 0, marginTop: '5px',
            background: DECISION_COLORS[alert.decision] || '#9E9E9E',
          }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '13px', fontWeight: 500, color: '#212121' }}>
              {alert.threat_class}
              <span style={{ fontWeight: 400, color: '#9E9E9E', marginLeft: '6px' }}>
                in {alert.zone_id}
              </span>
            </div>
            <div style={{ fontSize: '11px', color: '#9E9E9E', marginTop: '2px' }}>
              {alert.device_category} &middot; {(alert.score_ensemble * 100).toFixed(0)}% confidence
            </div>
          </div>
          <span style={{
            padding: '2px 8px', borderRadius: '10px', fontSize: '10px', fontWeight: 500, flexShrink: 0,
            background: (STATUS_COLORS[alert.status] || {bg: '#F5F5F5', fg: '#757575'}).bg,
            color: (STATUS_COLORS[alert.status] || {bg: '#F5F5F5', fg: '#757575'}).fg,
          }}>
            {alert.status}
          </span>
        </div>
      ))}
    </div>
  );
};

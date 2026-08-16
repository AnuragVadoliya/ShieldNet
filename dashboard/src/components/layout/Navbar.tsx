import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { theme } from '../../styles/theme';
import { useToast } from '../Toast';
import { NAV_ITEMS } from './Sidebar';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();
  const [clock, setClock] = useState(new Date());
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [alertCount, setAlertCount] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    // Fetch active incident count for notification badge
    fetch('/api/v1/incidents?status=ACTIVE')
      .then(r => r.json())
      .then(d => setAlertCount(d.total ?? 0))
      .catch(() => {});
    const t = setInterval(() => {
      fetch('/api/v1/incidents?status=ACTIVE')
        .then(r => r.json())
        .then(d => setAlertCount(d.total ?? 0))
        .catch(() => {});
    }, 30000);
    return () => clearInterval(t);
  }, []);

  const currentPage = NAV_ITEMS.find(i => location.pathname === i.path || location.pathname.startsWith(i.path + '/'))?.label || 'Dashboard';

  const notifications = [
    { icon: 'warning', color: theme.colors.error, title: 'Critical threat detected', desc: 'Ransomware attempt in ZONE-03', time: '2 min ago' },
    { icon: 'shield', color: theme.colors.success, title: 'AIRO auto-contained', desc: 'DDoS attack neutralized in ZONE-04', time: '5 min ago' },
    { icon: 'hub', color: theme.colors.info, title: 'FL round complete', desc: 'Global model v47 aggregated from 5 zones', time: '12 min ago' },
  ];

  return (
    <header style={{
      height: '64px',
      background: theme.colors.surface,
      borderBottom: `1px solid ${theme.colors.outlineVariant}`,
      display: 'flex',
      alignItems: 'center',
      padding: '0 24px',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1200,
      boxShadow: '0 1px 0 rgba(0,0,0,0.04)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm, cursor: 'pointer' }} onClick={() => navigate('/')}>
        <div style={{
          width: 40,
          height: 40,
          borderRadius: theme.borderRadius.md,
          background: theme.colors.primary,
          color: theme.colors.onPrimary,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <span style={{ fontSize: '24px', lineHeight: 1, fontFamily: '"Material Symbols Outlined"' }}>shield</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '20px', fontWeight: 500, color: theme.colors.onSurface, lineHeight: 1.1, letterSpacing: '0.15px' }}>ShieldNet</span>
          <span style={{ fontSize: '11px', color: theme.colors.onSurfaceVariant, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
            Federated SOC Central
          </span>
        </div>
      </div>

      <div style={{ flex: 1 }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.xs, marginRight: theme.spacing.md }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: theme.spacing.sm,
          padding: '6px 16px',
          borderRadius: theme.borderRadius.full,
          background: theme.colors.surfaceContainer,
          fontSize: '13px',
          color: theme.colors.onSurfaceVariant,
        }}>
          <span style={{ fontSize: '18px', lineHeight: 1, fontFamily: '"Material Symbols Outlined"', color: theme.colors.primary }}>monitoring</span>
          <span style={{ fontFamily: theme.typography.fontFamilyMono, fontSize: '13px', color: theme.colors.onSurface }}>
            {clock.toLocaleTimeString('en-US', { hour12: false })}
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.xs }}>
        <button
          onClick={() => setNotificationsOpen(o => !o)}
          style={{
            position: 'relative',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            width: 44,
            height: 44,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: theme.colors.onSurfaceVariant,
            transition: `background ${theme.transitions.fast}`,
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = theme.colors.surfaceContainer}
          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
        >
          <span style={{ fontSize: '24px', lineHeight: 1, fontFamily: '"Material Symbols Outlined"' }}>notifications</span>
          {alertCount > 0 && (
            <span style={{
              position: 'absolute',
              top: 6,
              right: 6,
              minWidth: '18px',
              height: '18px',
              borderRadius: '9px',
              background: theme.colors.error,
              color: theme.colors.onError,
              fontSize: '10px',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 4px',
            }}>
              {alertCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setShowSettings(true)}
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            width: 44,
            height: 44,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: theme.colors.onSurfaceVariant,
            transition: `background ${theme.transitions.fast}`,
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = theme.colors.surfaceContainer}
          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
        >
          <span style={{ fontSize: '24px', lineHeight: 1, fontFamily: '"Material Symbols Outlined"' }}>settings</span>
        </button>

        <div style={{ width: 1, height: 32, background: theme.colors.outlineVariant, margin: '0 8px' }} />

        <div style={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          background: theme.colors.secondaryContainer,
          color: theme.colors.onSecondaryContainer,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 500,
          fontSize: '16px',
          cursor: 'pointer',
        }}
          onClick={() => showToast({ type: 'info', title: 'Signed in as SOC Analyst' })}
        >
          MS
        </div>
      </div>

      {notificationsOpen && (
        <div style={{
          position: 'absolute',
          top: '64px',
          right: '16px',
          width: '360px',
          maxHeight: '480px',
          overflow: 'auto',
          background: theme.colors.surface,
          borderRadius: theme.borderRadius.lg,
          boxShadow: theme.elevation.level3,
          padding: theme.spacing.sm,
          zIndex: 1300,
          animation: 'fadeIn 0.2s cubic-bezier(0.2, 0, 0.38, 0.9)',
        }}>
          <div style={{ padding: '8px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '14px', fontWeight: 500, color: theme.colors.onSurface }}>Notifications</span>
            <button
              onClick={() => setNotificationsOpen(false)}
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: theme.colors.onSurfaceVariant }}
            >
              <span style={{ fontSize: '20px', lineHeight: 1, fontFamily: '"Material Symbols Outlined"' }}>close</span>
            </button>
          </div>
          {notifications.map((n, i) => (
            <div key={i} style={{ display: 'flex', gap: theme.spacing.sm, padding: '10px 16px', borderRadius: theme.borderRadius.sm, cursor: 'pointer', transition: `background ${theme.transitions.fast}` }}
              onMouseEnter={(e) => e.currentTarget.style.background = theme.colors.surfaceContainer}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: n.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: '20px', lineHeight: 1, fontFamily: '"Material Symbols Outlined"', color: n.color }}>{n.icon}</span>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '13px', fontWeight: 500, color: theme.colors.onSurface }}>{n.title}</div>
                <div style={{ fontSize: '12px', color: theme.colors.onSurfaceVariant, marginTop: '1px' }}>{n.desc}</div>
                <div style={{ fontSize: '11px', color: theme.colors.onSurfaceVariant + '88', marginTop: '2px' }}>{n.time}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showSettings && (
        <div style={{
          position: 'absolute',
          top: '64px',
          right: '16px',
          width: '320px',
          background: theme.colors.surface,
          borderRadius: theme.borderRadius.lg,
          boxShadow: theme.elevation.level3,
          padding: theme.spacing.lg,
          zIndex: 1300,
          animation: 'fadeIn 0.2s cubic-bezier(0.2, 0, 0.38, 0.9)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing.md }}>
            <span style={{ fontSize: '14px', fontWeight: 500, color: theme.colors.onSurface }}>Quick Settings</span>
            <button
              onClick={() => setShowSettings(false)}
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: theme.colors.onSurfaceVariant }}
            >
              <span style={{ fontSize: '20px', lineHeight: 1, fontFamily: '"Material Symbols Outlined"' }}>close</span>
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.md }}>
            <button
              onClick={() => { navigate('/settings'); setShowSettings(false); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: theme.spacing.sm,
                padding: '10px 12px',
                borderRadius: theme.borderRadius.sm,
                border: 'none',
                background: theme.colors.surfaceContainer,
                color: theme.colors.onSurface,
                fontSize: '13px',
                fontWeight: 500,
                cursor: 'pointer',
                transition: `background ${theme.transitions.fast}`,
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = theme.colors.surfaceContainerHigh}
              onMouseLeave={(e) => e.currentTarget.style.background = theme.colors.surfaceContainer}
            >
              <span style={{ fontSize: '20px', lineHeight: 1, fontFamily: '"Material Symbols Outlined"', color: theme.colors.primary }}>tune</span>
              Full System Settings
            </button>
            <button
              onClick={() => { showToast({ type: 'success', title: 'System healthy', message: 'All services operational' }); setShowSettings(false); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: theme.spacing.sm,
                padding: '10px 12px',
                borderRadius: theme.borderRadius.sm,
                border: 'none',
                background: theme.colors.surfaceContainer,
                color: theme.colors.onSurface,
                fontSize: '13px',
                fontWeight: 500,
                cursor: 'pointer',
                transition: `background ${theme.transitions.fast}`,
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = theme.colors.surfaceContainerHigh}
              onMouseLeave={(e) => e.currentTarget.style.background = theme.colors.surfaceContainer}
            >
              <span style={{ fontSize: '20px', lineHeight: 1, fontFamily: '"Material Symbols Outlined"', color: theme.colors.success }}>check_circle</span>
              Run Health Check
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
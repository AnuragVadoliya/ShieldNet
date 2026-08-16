import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { theme } from '../../styles/theme';

export interface NavItem {
  path: string;
  label: string;
  icon: string;
  badge?: number;
}

export const NAV_ITEMS: NavItem[] = [
  { path: '/', label: 'Dashboard', icon: 'dashboard' },
  { path: '/threats', label: 'Threats', icon: 'warning' },
  { path: '/devices', label: 'Devices', icon: 'devices' },
  { path: '/zones', label: 'Zones', icon: 'map' },
  { path: '/federated', label: 'Federated', icon: 'hub' },
];

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(true);
  const [hovered, setHovered] = useState(false);
  const isExpanded = !collapsed || hovered;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'b' && e.ctrlKey) {
        e.preventDefault();
        setCollapsed(c => !c);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const isActive = (path: string) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  return (
    <nav
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: isExpanded ? '240px' : '72px',
        height: 'calc(100vh - 64px)',
        position: 'fixed',
        left: 0,
        top: '64px',
        zIndex: 1100,
        background: theme.colors.surface,
        borderRight: `1px solid ${theme.colors.outlineVariant}`,
        display: 'flex',
        flexDirection: 'column',
        paddingTop: theme.spacing.sm,
        transition: `width ${theme.transitions.standard}`,
        overflow: 'hidden',
      }}
    >
      <div style={{ padding: isExpanded ? '8px 16px' : '8px 12px', display: 'flex', alignItems: 'center', justifyContent: isExpanded ? 'space-between' : 'center', marginBottom: theme.spacing.sm }}>
        {isExpanded && (
          <div style={{ fontSize: '12px', fontWeight: 500, color: theme.colors.onSurfaceVariant, letterSpacing: '1px', textTransform: 'uppercase' }}>
            Operations
          </div>
        )}
        <button
          onClick={() => setCollapsed(c => !c)}
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: theme.colors.onSurfaceVariant,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 36,
            height: 36,
            borderRadius: '50%',
            transition: `background ${theme.transitions.fast}`,
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = theme.colors.surfaceContainer}
          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          title={isExpanded ? 'Collapse (Ctrl+B)' : 'Expand (Ctrl+B)'}
        >
          <span style={{ fontSize: '20px', lineHeight: 1, fontFamily: '"Material Symbols Outlined"' }}>
            {isExpanded ? 'menu_open' : 'menu'}
          </span>
        </button>
      </div>

      <div style={{ flex: 1, overflow: 'auto' }}>
        {NAV_ITEMS.map(item => {
          const active = isActive(item.path);
          return (
            <div
              key={item.path}
              onClick={() => navigate(item.path)}
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                gap: theme.spacing.md,
                padding: isExpanded ? '12px 16px' : '12px 18px',
                margin: '2px 8px',
                borderRadius: theme.borderRadius.md,
                cursor: 'pointer',
                background: active ? theme.colors.secondaryContainer : 'transparent',
                color: active ? theme.colors.onSecondaryContainer : theme.colors.onSurfaceVariant,
                transition: `background ${theme.transitions.fast}, color ${theme.transitions.fast}`,
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => !active && (e.currentTarget.style.background = theme.colors.surfaceContainer)}
              onMouseLeave={(e) => !active && (e.currentTarget.style.background = 'transparent')}
            >
              {active && (
                <span style={{
                  position: 'absolute',
                  left: -8,
                  top: '20%',
                  bottom: '20%',
                  width: 4,
                  borderRadius: '0 4px 4px 0',
                  background: theme.colors.secondary,
                }} />
              )}
              <span style={{ fontSize: '22px', lineHeight: 1, fontFamily: '"Material Symbols Outlined"', flexShrink: 0 }}>
                {item.icon}
              </span>
              {isExpanded && <span style={{ fontSize: '14px', fontWeight: active ? 500 : 400 }}>{item.label}</span>}
              {isExpanded && item.badge ? (
                <span style={{
                  marginLeft: 'auto',
                  background: theme.colors.error,
                  color: theme.colors.onError,
                  fontSize: '11px',
                  fontWeight: 500,
                  borderRadius: '10px',
                  minWidth: '20px',
                  height: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0 6px',
                }}>
                  {item.badge}
                </span>
              ) : null}
            </div>
          );
        })}
      </div>

      <div style={{ padding: isExpanded ? '12px 16px' : '12px', borderTop: `1px solid ${theme.colors.outlineVariant}` }}>
        {isExpanded && (
          <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm }}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: theme.colors.primary,
              color: theme.colors.onPrimary,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 500,
              fontSize: '16px',
              flexShrink: 0,
            }}>
              MS
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '13px', fontWeight: 500, color: theme.colors.onSurface, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>SOC Analyst</div>
              <div style={{ fontSize: '11px', color: theme.colors.onSurfaceVariant, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>mihir.panara@shieldnet.io</div>
            </div>
          </div>
        )}
        {!isExpanded && (
          <div style={{
            width: 40,
            height: 40,
            margin: '0 auto',
            borderRadius: '50%',
            background: theme.colors.primary,
            color: theme.colors.onPrimary,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 500,
            fontSize: '16px',
          }}>
            MS
          </div>
        )}
      </div>
    </nav>
  );
};
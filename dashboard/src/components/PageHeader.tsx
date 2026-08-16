import React from 'react';
import { theme } from '../styles/theme';

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: string;
  actions?: React.ReactNode;
  breadcrumb?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, icon, actions, breadcrumb }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: theme.spacing.xl, flexWrap: 'wrap', gap: theme.spacing.md }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.md }}>
      {icon && (
        <div style={{
          width: 56,
          height: 56,
          borderRadius: theme.borderRadius.lg,
          background: theme.colors.primaryContainer,
          color: theme.colors.primary,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          <span style={{ fontSize: '32px', lineHeight: 1, fontFamily: '"Material Symbols Outlined"' }}>{icon}</span>
        </div>
      )}
      <div>
        {breadcrumb && (
          <div style={{ fontSize: '12px', color: theme.colors.onSurfaceVariant, marginBottom: '2px' }}>{breadcrumb}</div>
        )}
        <h1 style={{ fontSize: '28px', fontWeight: 500, color: theme.colors.onSurface, margin: 0, lineHeight: '36px', letterSpacing: '0px' }}>{title}</h1>
        {subtitle && (
          <p style={{ fontSize: '14px', color: theme.colors.onSurfaceVariant, margin: '4px 0 0', lineHeight: '20px' }}>{subtitle}</p>
        )}
      </div>
    </div>
    {actions && <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm, flexShrink: 0 }}>{actions}</div>}
  </div>
);

export interface SectionTitleProps {
  title: string;
  subtitle?: string;
  icon?: string;
  action?: React.ReactNode;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({ title, subtitle, icon, action }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: theme.spacing.md }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm }}>
      {icon && (
        <span style={{ fontSize: '20px', lineHeight: 1, fontFamily: '"Material Symbols Outlined"', color: theme.colors.primary }}>
          {icon}
        </span>
      )}
      <div>
        <h2 style={{ fontSize: '16px', fontWeight: 500, color: theme.colors.onSurface, margin: 0, lineHeight: '24px' }}>{title}</h2>
        {subtitle && <div style={{ fontSize: '12px', color: theme.colors.onSurfaceVariant }}>{subtitle}</div>}
      </div>
    </div>
    {action && <div>{action}</div>}
  </div>
);

export const EmptyState: React.FC<{
  icon?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}> = ({ icon = 'inbox', title, description, action }) => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xxl,
    textAlign: 'center',
    background: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    boxShadow: theme.elevation.level1,
  }}>
    <div style={{
      width: 72,
      height: 72,
      borderRadius: '50%',
      background: theme.colors.surfaceContainer,
      color: theme.colors.onSurfaceVariant,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: theme.spacing.lg,
    }}>
      <span style={{ fontSize: '40px', lineHeight: 1, fontFamily: '"Material Symbols Outlined"' }}>{icon}</span>
    </div>
    <h3 style={{ fontSize: '16px', fontWeight: 500, color: theme.colors.onSurface, margin: '0 0 4px' }}>{title}</h3>
    {description && <p style={{ fontSize: '13px', color: theme.colors.onSurfaceVariant, margin: '0 0 16px', maxWidth: '400px', lineHeight: '20px' }}>{description}</p>}
    {action}
  </div>
);

export const ErrorState: React.FC<{
  title?: string;
  message?: string;
  onRetry?: () => void;
}> = ({ title = 'Something went wrong', message, onRetry }) => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xxl,
    textAlign: 'center',
    background: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    boxShadow: theme.elevation.level1,
  }}>
    <div style={{
      width: 72,
      height: 72,
      borderRadius: '50%',
      background: theme.colors.errorContainer,
      color: theme.colors.error,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: theme.spacing.lg,
    }}>
      <span style={{ fontSize: '40px', lineHeight: 1, fontFamily: '"Material Symbols Outlined"' }}>error</span>
    </div>
    <h3 style={{ fontSize: '16px', fontWeight: 500, color: theme.colors.onSurface, margin: '0 0 4px' }}>{title}</h3>
    {message && <p style={{ fontSize: '13px', color: theme.colors.onSurfaceVariant, margin: '0 0 16px', maxWidth: '400px' }}>{message}</p>}
    {onRetry && (
      <button
        onClick={onRetry}
        style={{
          background: theme.colors.primary,
          color: theme.colors.onPrimary,
          border: 'none',
          padding: '10px 24px',
          borderRadius: theme.borderRadius.full,
          fontSize: '14px',
          fontWeight: 500,
          cursor: 'pointer',
          transition: `box-shadow ${theme.transitions.fast}`,
        }}
        onMouseEnter={(e) => e.currentTarget.style.boxShadow = theme.elevation.level2}
        onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
      >
        Retry
      </button>
    )}
  </div>
);

export const StatCard: React.FC<{
  label: string;
  value: string | number;
  icon: string;
  color?: string;
  trend?: number;
  trendLabel?: string;
  subtitle?: string;
  onClick?: () => void;
}> = ({ label, value, icon, color = theme.colors.primary, trend, trendLabel, subtitle, onClick }) => {
  const trendPositive = (trend ?? 0) >= 0;
  return (
    <div
      onClick={onClick}
      style={{
        background: theme.colors.surface,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.lg,
        boxShadow: theme.elevation.level1,
        position: 'relative',
        overflow: 'hidden',
        cursor: onClick ? 'pointer' : 'default',
        transition: `box-shadow ${theme.transitions.standard}, transform ${theme.transitions.fast}`,
      }}
      onMouseEnter={(e) => { e.currentTarget.style.boxShadow = theme.elevation.level2; }}
      onMouseLeave={(e) => { e.currentTarget.style.boxShadow = theme.elevation.level1; }}
    >
      <div style={{
        position: 'absolute',
        top: -24,
        right: -24,
        width: 96,
        height: 96,
        borderRadius: '50%',
        background: `${color}10`,
      }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm, marginBottom: theme.spacing.md }}>
        <div style={{
          width: 40,
          height: 40,
          borderRadius: theme.borderRadius.md,
          background: `${color}18`,
          color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          <span style={{ fontSize: '22px', lineHeight: 1, fontFamily: '"Material Symbols Outlined"' }}>{icon}</span>
        </div>
        <span style={{ fontSize: '13px', fontWeight: 500, color: theme.colors.onSurfaceVariant }}>{label}</span>
      </div>
      <div style={{ fontSize: '32px', fontWeight: 500, color: theme.colors.onSurface, lineHeight: 1.1 }}>{value}</div>
      {subtitle && <div style={{ fontSize: '12px', color: theme.colors.onSurfaceVariant, marginTop: theme.spacing.xs }}>{subtitle}</div>}
      {(trend !== undefined || trendLabel) && (
        <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.xs, marginTop: theme.spacing.sm, fontSize: '12px' }}>
          {trend !== undefined && (
            <span style={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              color: trendPositive ? theme.colors.success : theme.colors.error,
              fontWeight: 500,
            }}>
              <span style={{ fontSize: '14px', lineHeight: 1, fontFamily: '"Material Symbols Outlined"' }}>
                {trendPositive ? 'trending_up' : 'trending_down'}
              </span>
              {Math.abs(trend)}%
            </span>
          )}
          {trendLabel && <span style={{ color: theme.colors.onSurfaceVariant }}>{trendLabel}</span>}
        </div>
      )}
    </div>
  );
};

export const Tooltip: React.FC<{ content: string; children: React.ReactNode }> = ({ content, children }) => {
  const [visible, setVisible] = React.useState(false);
  const [pos, setPos] = React.useState({ x: 0, y: 0 });

  return (
    <div
      style={{ display: 'inline-block', position: 'relative' }}
      onMouseEnter={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setPos({ x: rect.left + rect.width / 2, y: rect.top });
        setVisible(true);
      }}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        <div style={{
          position: 'fixed',
          top: pos.y - 8,
          left: pos.x,
          transform: 'translate(-50%, -100%)',
          background: theme.colors.inverseSurface,
          color: theme.colors.inverseOnSurface,
          padding: '6px 10px',
          borderRadius: theme.borderRadius.sm,
          fontSize: '12px',
          fontWeight: 400,
          zIndex: theme.zIndex.tooltip,
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          boxShadow: theme.elevation.level2,
        }}>
          {content}
        </div>
      )}
    </div>
  );
};

export const Divider: React.FC<{ vertical?: boolean; spacing?: 'small' | 'medium' | 'large' }> = ({ vertical = false, spacing = 'small' }) => (
  <div style={vertical ? {
    width: 1,
    height: '100%',
    background: theme.colors.outlineVariant,
    margin: `0 ${theme.spacing.md}`,
    alignSelf: 'stretch',
  } : {
    height: 1,
    background: theme.colors.outlineVariant,
    margin: `${vertical ? 0 : spacing === 'large' ? theme.spacing.lg : spacing === 'medium' ? theme.spacing.md : theme.spacing.sm} 0`,
    width: '100%',
  }} />
);
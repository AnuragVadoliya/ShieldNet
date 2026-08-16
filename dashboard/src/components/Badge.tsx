import React, { HTMLAttributes } from 'react';
import { theme } from '../styles/theme';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'filled' | 'outlined' | 'tonal' | 'dot';
  size?: 'small' | 'medium' | 'large';
  color?: 'primary' | 'secondary' | 'tertiary' | 'error' | 'success' | 'warning' | 'info' | 'default';
  dotColor?: string;
  removable?: boolean;
  onRemove?: () => void;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'filled',
  size = 'medium',
  color = 'default',
  dotColor,
  removable = false,
  onRemove,
  className,
  style,
  ...props
}) => {
  const sizeStyles: Record<string, React.CSSProperties> = {
    small: { padding: '2px 8px', fontSize: '11px', height: '20px', borderRadius: '10px', gap: '4px' },
    medium: { padding: '4px 10px', fontSize: '12px', height: '24px', borderRadius: '12px', gap: '6px' },
    large: { padding: '6px 14px', fontSize: '13px', height: '30px', borderRadius: '15px', gap: '8px' },
  };

  const colorMap: Record<string, { bg: string; fg: string; border: string }> = {
    primary: { bg: theme.colors.primaryContainer, fg: theme.colors.onPrimaryContainer, border: theme.colors.primary },
    secondary: { bg: theme.colors.secondaryContainer, fg: theme.colors.onSecondaryContainer, border: theme.colors.secondary },
    tertiary: { bg: theme.colors.tertiaryContainer, fg: theme.colors.onTertiaryContainer, border: theme.colors.tertiary },
    error: { bg: theme.colors.errorContainer, fg: theme.colors.onErrorContainer, border: theme.colors.error },
    success: { bg: theme.colors.successContainer, fg: theme.colors.onSuccessContainer, border: theme.colors.success },
    warning: { bg: theme.colors.warningContainer, fg: theme.colors.onWarningContainer, border: theme.colors.warning },
    info: { bg: theme.colors.infoContainer, fg: theme.colors.onInfoContainer, border: theme.colors.info },
    default: { bg: theme.colors.surfaceContainerHigh, fg: theme.colors.onSurfaceVariant, border: theme.colors.outlineVariant },
  };

  const { bg, fg, border } = colorMap[color] || colorMap.default;

  const baseStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 500,
    fontFamily: theme.typography.fontFamily,
    whiteSpace: 'nowrap',
    lineHeight: 1,
    ...sizeStyles[size],
    ...style,
  };

  const variantStyles: Record<string, React.CSSProperties> = {
    filled: { background: bg, color: fg, border: 'none' },
    tonal: { background: bg + 'CC', color: fg, border: 'none' },
    outlined: { background: 'transparent', color: fg, border: `1px solid ${border}` },
    dot: {
      background: 'transparent',
      color: fg,
      border: 'none',
      paddingLeft: '8px',
      paddingRight: '8px',
    },
  };

  if (variant === 'dot') {
    const dotSize = size === 'small' ? '6px' : size === 'medium' ? '8px' : '10px';
    return (
      <span style={{ ...baseStyle, ...variantStyles[variant], ...props, display: 'inline-flex', alignItems: 'center', gap: '6px' }} className={className}>
        <span style={{ width: dotSize, height: dotSize, borderRadius: '50%', backgroundColor: dotColor || border, flexShrink: 0 }} />
        {children}
      </span>
    );
  }

  return (
    <span style={{ ...baseStyle, ...variantStyles[variant], ...props }} className={className}>
      {children}
      {removable && onRemove && (
        <button
          onClick={(e) => { e.stopPropagation(); onRemove(); }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '16px',
            height: '16px',
            border: 'none',
            background: 'transparent',
            color: fg,
            borderRadius: '50%',
            cursor: 'pointer',
            marginLeft: '4px',
            padding: 0,
            opacity: 0.7,
            transition: `opacity ${theme.transitions.fast}`,
          }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '0.7'}
        >
          <span style={{ fontSize: '14px', lineHeight: 1, fontFamily: '"Material Symbols Outlined"' }}>close</span>
        </button>
      )}
    </span>
  );
};

export interface StatusBadgeProps {
  status: string;
  size?: 'small' | 'medium';
  variant?: 'filled' | 'outlined' | 'tonal' | 'dot';
}

const statusConfig: Record<string, { color: BadgeProps['color']; label: string }> = {
  online: { color: 'success', label: 'Online' },
  degraded: { color: 'warning', label: 'Degraded' },
  active_alerts: { color: 'error', label: 'Active Alerts' },
  quarantined: { color: 'error', label: 'Quarantined' },
  contained: { color: 'success', label: 'Contained' },
  active: { color: 'error', label: 'Active' },
  review: { color: 'warning', label: 'Under Review' },
  normal: { color: 'success', label: 'Normal' },
  suspicious: { color: 'warning', label: 'Suspicious' },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'medium',
  variant = 'filled',
}) => {
  const normalized = status.toLowerCase();
  const config = statusConfig[normalized] || { color: 'default', label: normalized };

  return <Badge variant={variant} size={size} color={config.color}>{config.label}</Badge>;
};

export interface ThreatBadgeProps {
  threatClass: string;
  confidence?: number;
  size?: 'small' | 'medium';
}

const threatColors: Record<string, keyof typeof theme.colors.threat> = {
  'DDoS': 'critical',
  'Botnet': 'high',
  'Ransomware': 'critical',
  'MitM': 'high',
  'Scanning': 'medium',
  'Unauthorized Access': 'medium',
};

export const ThreatBadge: React.FC<ThreatBadgeProps> = ({
  threatClass,
  confidence,
  size = 'medium',
}) => {
  const colorKey = threatColors[threatClass] || 'info';
  const color = theme.colors.threat[colorKey] || theme.colors.info;
  const colorMapKey = colorKey === 'critical' ? 'error' : colorKey === 'high' ? 'error' : colorKey === 'medium' ? 'warning' : colorKey === 'low' ? 'success' : 'info';

  return (
    <Badge variant="dot" size={size} color={colorMapKey as any} dotColor={color}>
      {threatClass}
      {confidence !== undefined && (
        <span style={{ marginLeft: '8px', fontSize: size === 'small' ? '10px' : '11px', opacity: 0.8 }}>
          {(confidence * 100).toFixed(0)}%
        </span>
      )}
    </Badge>
  );
};

export interface DecisionBadgeProps {
  decision: string;
  size?: 'small' | 'medium';
}

const decisionColors: Record<string, keyof typeof theme.colors.decision> = {
  THREAT_HIGH: 'THREAT_HIGH',
  THREAT_MEDIUM: 'THREAT_MEDIUM',
  SUSPICIOUS: 'SUSPICIOUS',
  NORMAL: 'NORMAL',
};

export const DecisionBadge: React.FC<DecisionBadgeProps> = ({ decision, size = 'medium' }) => {
  const colorKey = decisionColors[decision] || 'NORMAL';
  const color = theme.colors.decision[colorKey] || theme.colors.decision.NORMAL;
  const colorMapKey = colorKey === 'THREAT_HIGH' ? 'error' : colorKey === 'THREAT_MEDIUM' ? 'error' : colorKey === 'SUSPICIOUS' ? 'warning' : 'success';

  return <Badge variant="dot" size={size} color={colorMapKey as any} dotColor={color}>{decision.replace('_', ' ')}</Badge>;
};
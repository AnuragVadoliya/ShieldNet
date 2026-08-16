import React, { forwardRef, HTMLAttributes } from 'react';
import { theme } from '../styles/theme';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'elevated' | 'outlined' | 'filled';
  padding?: 'none' | 'small' | 'medium' | 'large';
  hoverable?: boolean;
  selected?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      children,
      variant = 'elevated',
      padding = 'medium',
      hoverable = false,
      selected = false,
      className,
      style,
      onClick,
      ...props
    },
    ref
  ) => {
    const paddingMap = {
      none: 0,
      small: theme.spacing.sm,
      medium: theme.spacing.md,
      large: theme.spacing.lg,
    };

    const variantStyles: Record<string, React.CSSProperties> = {
      elevated: {
        background: theme.colors.surface,
        boxShadow: theme.elevation.level1,
        border: 'none',
      },
      outlined: {
        background: theme.colors.surface,
        boxShadow: 'none',
        border: `1px solid ${theme.colors.outlineVariant}`,
      },
      filled: {
        background: theme.colors.surfaceContainer,
        boxShadow: 'none',
        border: 'none',
      },
    };

    const combinedStyle: React.CSSProperties = {
      borderRadius: theme.borderRadius.lg,
      padding: paddingMap[padding],
      transition: `box-shadow ${theme.transitions.standard}, transform ${theme.transitions.fast}, border-color ${theme.transitions.fast}`,
      ...variantStyles[variant],
      ...style,
    };

    if (hoverable || onClick) {
      combinedStyle.cursor = 'pointer';
    }

    if (selected) {
      combinedStyle.border = `2px solid ${theme.colors.primary}`;
      combinedStyle.boxShadow = theme.elevation.level2;
    }

    return (
      <div
        ref={ref}
        className={className}
        style={combinedStyle}
        onClick={onClick}
        onMouseEnter={hoverable ? (e) => { e.currentTarget.style.boxShadow = theme.elevation.level2; e.currentTarget.style.transform = 'translateY(-2px)'; } : undefined}
        onMouseLeave={hoverable ? (e) => { e.currentTarget.style.boxShadow = variantStyles[variant]?.boxShadow ?? 'none'; e.currentTarget.style.transform = 'translateY(0)'; } : undefined}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  avatar?: React.ReactNode;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ title, subtitle, action, avatar, children, ...props }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: theme.spacing.md, marginBottom: theme.spacing.md, ...props }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.md, flex: 1, minWidth: 0 }}>
      {avatar && <div style={{ flexShrink: 0 }}>{avatar}</div>}
      <div style={{ minWidth: 0 }}>
        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 500, color: theme.colors.onSurface, lineHeight: '28px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title}</h3>
        {subtitle && <p style={{ margin: '2px 0 0', fontSize: '13px', color: theme.colors.onSurfaceVariant, lineHeight: '20px' }}>{subtitle}</p>}
      </div>
    </div>
    {action && <div style={{ flexShrink: 0 }}>{action}</div>}
    {children}
  </div>
);

export interface CardContentProps extends HTMLAttributes<HTMLDivElement> {}

export const CardContent: React.FC<CardContentProps> = ({ children, ...props }) => (
  <div style={{ ...props }}>{children}</div>
);

export interface CardActionsProps extends HTMLAttributes<HTMLDivElement> {
  align?: 'start' | 'center' | 'end';
}

export const CardActions: React.FC<CardActionsProps> = ({ children, align = 'end', ...props }) => (
  <div style={{ display: 'flex', justifyContent: align, gap: theme.spacing.sm, paddingTop: theme.spacing.sm, ...props }}>{children}</div>
);
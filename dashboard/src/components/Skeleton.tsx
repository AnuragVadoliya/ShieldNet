import React, { CSSProperties } from 'react';
import { theme } from '../styles/theme';

export interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  variant?: 'text' | 'circular' | 'rectangular';
  style?: CSSProperties;
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = '16px',
  borderRadius = theme.borderRadius.md,
  variant = 'rectangular',
  style,
  className,
}) => {
  const radius = variant === 'circular' ? '50%' : variant === 'text' ? theme.borderRadius.full : borderRadius;

  return (
    <div
      className={className}
      style={{
        width,
        height,
        borderRadius: radius,
        background: `linear-gradient(90deg, ${theme.colors.surfaceContainer} 25%, ${theme.colors.surfaceContainerHigh} 50%, ${theme.colors.surfaceContainer} 75%)`,
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite',
        ...style,
      }}
    />
  );
};

export const SkeletonCard: React.FC<{ lines?: number; avatar?: boolean; action?: boolean }> = ({
  lines = 3,
  avatar = false,
  action = false,
}) => (
  <div style={{ background: theme.colors.surface, borderRadius: theme.borderRadius.lg, padding: theme.spacing.lg, boxShadow: theme.elevation.level1 }}>
    <div style={{ display: 'flex', gap: theme.spacing.md, marginBottom: theme.spacing.lg }}>
      {avatar && <Skeleton width={48} height={48} variant="circular" />}
      <div style={{ flex: 1 }}>
        <Skeleton width="60%" height="20px" variant="text" style={{ marginBottom: theme.spacing.xs }} />
        <Skeleton width="40%" height="14px" variant="text" />
      </div>
    </div>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton key={i} width={i === lines - 1 ? '60%' : '100%'} height="14px" variant="text" style={{ marginBottom: theme.spacing.sm }} />
    ))}
    {action && (
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: theme.spacing.sm, marginTop: theme.spacing.lg }}>
        <Skeleton width="100px" height="40px" borderRadius={theme.borderRadius.full} />
        <Skeleton width="100px" height="40px" borderRadius={theme.borderRadius.full} />
      </div>
    )}
  </div>
);

export const SkeletonTable: React.FC<{ rows?: number; cols?: number }> = ({ rows = 5, cols = 5 }) => (
  <div style={{ background: theme.colors.surface, borderRadius: theme.borderRadius.lg, overflow: 'hidden', boxShadow: theme.elevation.level1 }}>
    <div style={{ background: theme.colors.surfaceContainer, padding: theme.spacing.md }}>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: theme.spacing.md }}>
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} width="60%" height="12px" variant="text" />
        ))}
      </div>
    </div>
    {Array.from({ length: rows }).map((_, row) => (
      <div key={row} style={{ borderTop: `1px solid ${theme.colors.outlineVariant}`, padding: theme.spacing.md }}>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: theme.spacing.md }}>
          {Array.from({ length: cols }).map((_, i) => (
            <Skeleton key={i} width="80%" height="14px" variant="text" />
          ))}
        </div>
      </div>
    ))}
  </div>
);

export const SkeletonChart: React.FC<{ height?: number }> = ({ height = 300 }) => (
  <div style={{ background: theme.colors.surface, borderRadius: theme.borderRadius.lg, padding: theme.spacing.lg, boxShadow: theme.elevation.level1, height }}>
    <Skeleton width="150px" height="24px" variant="text" style={{ marginBottom: theme.spacing.lg }} />
    <Skeleton width="100%" height={`calc(100% - 40px)`} borderRadius={theme.borderRadius.md} />
  </div>
);
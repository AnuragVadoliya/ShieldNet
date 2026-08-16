import React, { forwardRef, ButtonHTMLAttributes } from 'react';
import { theme } from '../styles/theme';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'filled' | 'outlined' | 'text' | 'tonal';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'start' | 'end';
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'filled',
      size = 'medium',
      loading = false,
      disabled,
      icon,
      iconPosition = 'start',
      fullWidth = false,
      className,
      style,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    const baseStyles: React.CSSProperties = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing.sm,
      border: 'none',
      borderRadius: theme.borderRadius.full,
      fontFamily: theme.typography.fontFamily,
      fontWeight: 500,
      cursor: isDisabled ? 'not-allowed' : 'pointer',
      opacity: isDisabled ? 0.6 : 1,
      transition: `all ${theme.transitions.fast}`,
      width: fullWidth ? '100%' : 'auto',
      whiteSpace: 'nowrap',
      userSelect: 'none',
      ...style,
    };

    const sizeStyles: Record<string, React.CSSProperties> = {
      small: { padding: '6px 16px', fontSize: '13px', height: '36px', gap: '6px' },
      medium: { padding: '10px 24px', fontSize: '14px', height: '44px', gap: '8px' },
      large: { padding: '12px 32px', fontSize: '15px', height: '52px', gap: '10px' },
    };

    const variantStyles: Record<string, React.CSSProperties> = {
      filled: {
        background: theme.colors.primary,
        color: theme.colors.onPrimary,
        boxShadow: theme.elevation.level1,
      },
      tonal: {
        background: theme.colors.primaryContainer,
        color: theme.colors.onPrimaryContainer,
        boxShadow: 'none',
      },
      outlined: {
        background: 'transparent',
        color: theme.colors.primary,
        border: `1px solid ${theme.colors.primary}`,
        boxShadow: 'none',
      },
      text: {
        background: 'transparent',
        color: theme.colors.primary,
        boxShadow: 'none',
      },
    };

    const hoverStyles: Record<string, React.CSSProperties> = {
      filled: { boxShadow: theme.elevation.level2 },
      tonal: { background: theme.colors.primaryContainer + 'DD' },
      outlined: { background: theme.colors.primaryContainer },
      text: { background: theme.colors.primaryContainer },
    };

    const combinedStyle = {
      ...baseStyles,
      ...sizeStyles[size],
      ...variantStyles[variant],
    } as React.CSSProperties;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        style={combinedStyle}
        onMouseEnter={!isDisabled ? (e) => { e.currentTarget.style.boxShadow = hoverStyles[variant]?.boxShadow ?? 'none'; if (typeof hoverStyles[variant]?.background === 'string') e.currentTarget.style.background = hoverStyles[variant].background as string; } : undefined}
        onMouseLeave={!isDisabled ? (e) => { e.currentTarget.style.boxShadow = variantStyles[variant]?.boxShadow ?? 'none'; if (typeof variantStyles[variant]?.background === 'string') e.currentTarget.style.background = variantStyles[variant].background as string; } : undefined}
        {...props}
      >
        {loading && (
          <>
            <span
              style={{
                width: '16px',
                height: '16px',
                border: '2px solid currentColor',
                borderRightColor: 'transparent',
                borderRadius: '50%',
                animation: 'spin 0.6s linear infinite',
                flexShrink: 0,
              }}
            />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </>
        )}
        {!loading && icon && iconPosition === 'start' && <span style={{ display: 'flex' }}>{icon}</span>}
        <span>{children}</span>
        {!loading && icon && iconPosition === 'end' && <span style={{ display: 'flex' }}>{icon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'small' | 'medium' | 'large';
  variant?: 'filled' | 'outlined' | 'text' | 'tonal';
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ children, size = 'medium', variant = 'text', ...props }, ref) => {
    const sizeMap = { small: 32, medium: 40, large: 48 };
    const sizePx = sizeMap[size];

    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        style={{
          padding: 0,
          width: sizePx,
          height: sizePx,
          borderRadius: theme.borderRadius.full,
          ...props.style,
        }}
        {...props}
      >
        {children}
      </Button>
    );
  }
);

IconButton.displayName = 'IconButton';

export interface FabProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'small' | 'medium' | 'large';
  extended?: boolean;
  icon?: React.ReactNode;
}

export const Fab = forwardRef<HTMLButtonElement, FabProps>(
  ({ children, size = 'medium', extended = false, icon, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        variant="filled"
        size={size}
        icon={icon}
        iconPosition="start"
        style={{
          padding: extended ? '0 24px' : 0,
          borderRadius: extended ? theme.borderRadius.full : '50%',
          minWidth: extended ? 'auto' : 'unset',
          ...props.style,
        }}
        {...props}
      >
        {children}
      </Button>
    );
  }
);

Fab.displayName = 'Fab';
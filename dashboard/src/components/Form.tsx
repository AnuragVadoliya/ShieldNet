import React, { forwardRef, InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';
import { theme } from '../styles/theme';

export interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  fullWidth?: boolean;
  variant?: 'filled' | 'outlined';
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  (
    {
      label,
      error,
      helperText,
      leadingIcon,
      trailingIcon,
      fullWidth = true,
      variant = 'outlined',
      className,
      style,
      onFocus,
      onBlur,
      ...props
    },
    ref
  ) => {
    const [focused, setFocused] = React.useState(false);
    const hasError = Boolean(error);

    const baseStyle: React.CSSProperties = {
      width: fullWidth ? '100%' : 'auto',
      padding: variant === 'filled' ? '24px 16px 8px' : '14px 16px',
      fontSize: '14px',
      fontFamily: theme.typography.fontFamily,
      color: theme.colors.onSurface,
      background: variant === 'filled' ? theme.colors.surfaceContainer : theme.colors.surface,
      border: hasError
        ? `2px solid ${theme.colors.error}`
        : focused
          ? `2px solid ${theme.colors.primary}`
          : `1px solid ${theme.colors.outlineVariant}`,
      borderRadius: theme.borderRadius.sm,
      outline: 'none',
      transition: `border-color ${theme.transitions.fast}, box-shadow ${theme.transitions.fast}`,
      boxShadow: focused && !hasError ? `0 0 0 4px ${theme.colors.primary}22` : 'none',
      boxSizing: 'border-box',
      ...(leadingIcon ? { paddingLeft: '40px' } : {}),
      ...(trailingIcon ? { paddingRight: '40px' } : {}),
      ...style,
    };

    return (
      <div style={{ width: fullWidth ? '100%' : 'auto', marginBottom: helperText || error ? theme.spacing.sm : 0 }}>
        {label && (
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: hasError ? theme.colors.error : theme.colors.onSurfaceVariant, marginBottom: '6px' }}>
            {label}
          </label>
        )}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          {leadingIcon && (
            <span style={{ position: 'absolute', left: '12px', display: 'flex', color: focused ? theme.colors.primary : theme.colors.onSurfaceVariant, fontSize: '20px', pointerEvents: 'none' }}>
              {leadingIcon}
            </span>
          )}
          <input
            ref={ref}
            style={baseStyle}
            onFocus={(e) => { setFocused(true); onFocus?.(e); }}
            onBlur={(e) => { setFocused(false); onBlur?.(e); }}
            {...props}
          />
          {trailingIcon && (
            <span style={{ position: 'absolute', right: '12px', display: 'flex', color: theme.colors.onSurfaceVariant, fontSize: '20px', cursor: 'pointer' }}>
              {trailingIcon}
            </span>
          )}
        </div>
        {(helperText || error) && (
          <div style={{ fontSize: '12px', marginTop: '4px', color: hasError ? theme.colors.error : theme.colors.onSurfaceVariant }}>
            {error || helperText}
          </div>
        )}
      </div>
    );
  }
);

TextField.displayName = 'TextField';

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  options: { value: string; label: string }[];
  leadingIcon?: React.ReactNode;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      helperText,
      fullWidth = true,
      options,
      leadingIcon,
      className,
      style,
      ...props
    },
    ref
  ) => {
    const hasError = Boolean(error);

    const baseStyle: React.CSSProperties = {
      width: fullWidth ? '100%' : 'auto',
      padding: '12px 40px 12px 12px',
      fontSize: '14px',
      fontFamily: theme.typography.fontFamily,
      color: theme.colors.onSurface,
      background: theme.colors.surface,
      border: hasError ? `2px solid ${theme.colors.error}` : `1px solid ${theme.colors.outlineVariant}`,
      borderRadius: theme.borderRadius.sm,
      outline: 'none',
      cursor: 'pointer',
      appearance: 'none',
      transition: `border-color ${theme.transitions.fast}`,
      ...(leadingIcon ? { paddingLeft: '40px' } : {}),
      ...style,
    };

    return (
      <div style={{ width: fullWidth ? '100%' : 'auto' }}>
        {label && (
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: theme.colors.onSurfaceVariant, marginBottom: '6px' }}>{label}</label>
        )}
        <div style={{ position: 'relative' }}>
          {leadingIcon && (
            <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', display: 'flex', color: theme.colors.onSurfaceVariant, fontSize: '20px', pointerEvents: 'none' }}>{leadingIcon}</span>
          )}
          <select ref={ref} style={baseStyle} {...props}>
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <span
            style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              display: 'flex',
              color: theme.colors.onSurfaceVariant,
              fontSize: '20px',
              pointerEvents: 'none',
            }}
          >
            <span style={{ fontSize: '20px', lineHeight: 1, fontFamily: '"Material Symbols Outlined"' }}>arrow_drop_down</span>
          </span>
        </div>
        {(helperText || error) && (
          <div style={{ fontSize: '12px', marginTop: '4px', color: hasError ? theme.colors.error : theme.colors.onSurfaceVariant }}>
            {error || helperText}
          </div>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, error, helperText, fullWidth = true, className, style, ...props }, ref) => {
    return (
      <div style={{ width: fullWidth ? '100%' : 'auto' }}>
        {label && (
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: theme.colors.onSurfaceVariant, marginBottom: '6px' }}>{label}</label>
        )}
        <textarea
          ref={ref}
          style={{
            width: '100%',
            padding: '12px 16px',
            fontSize: '14px',
            fontFamily: theme.typography.fontFamily,
            color: theme.colors.onSurface,
            background: theme.colors.surface,
            border: error ? `2px solid ${theme.colors.error}` : `1px solid ${theme.colors.outlineVariant}`,
            borderRadius: theme.borderRadius.sm,
            outline: 'none',
            resize: 'vertical',
            minHeight: '80px',
            boxSizing: 'border-box',
            ...style,
          }}
          {...props}
        />
        {(helperText || error) && (
          <div style={{ fontSize: '12px', marginTop: '4px', color: error ? theme.colors.error : theme.colors.onSurfaceVariant }}>
            {error || helperText}
          </div>
        )}
      </div>
    );
  }
);

TextArea.displayName = 'TextArea';

export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label?: string;
  description?: string;
  checked?: boolean;
  size?: 'small' | 'medium';
}

export const Switch: React.FC<SwitchProps> = ({
  label,
  description,
  checked = false,
  size = 'medium',
  disabled = false,
  onChange,
  ...props
}) => {
  const trackWidth = size === 'small' ? 36 : 52;
  const trackHeight = size === 'small' ? 20 : 32;
  const thumbSize = size === 'small' ? 14 : 24;
  const translateX = trackWidth - thumbSize - 4;

  return (
    <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: theme.spacing.md, cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.5 : 1 }}>
      {(label || description) && (
        <div style={{ flex: 1 }}>
          {label && <div style={{ fontSize: '14px', fontWeight: 500, color: theme.colors.onSurface }}>{label}</div>}
          {description && <div style={{ fontSize: '12px', color: theme.colors.onSurfaceVariant, marginTop: '2px' }}>{description}</div>}
        </div>
      )}
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={onChange}
        style={{ display: 'none' }}
        {...props}
      />
      <div
        style={{
          width: trackWidth,
          height: trackHeight,
          borderRadius: trackHeight / 2,
          background: checked ? theme.colors.primary : theme.colors.surfaceContainerHighest,
          position: 'relative',
          transition: `background ${theme.transitions.fast}`,
          flexShrink: 0,
          boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.12)',
        }}
      >
        <div
          style={{
            width: thumbSize,
            height: thumbSize,
            borderRadius: '50%',
            background: checked ? theme.colors.onPrimary : theme.colors.surface,
            position: 'absolute',
            top: (trackHeight - thumbSize) / 2,
            left: checked ? translateX : 2,
            transition: `left ${theme.transitions.fast}, background ${theme.transitions.fast}`,
            boxShadow: theme.elevation.level1,
          }}
        />
      </div>
    </label>
  );
};

export interface ChipProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  selected?: boolean;
  icon?: React.ReactNode;
  removable?: boolean;
  onRemove?: () => void;
  onClick?: () => void;
}

export const Chip: React.FC<ChipProps> = ({
  label,
  selected = false,
  icon,
  removable = false,
  onRemove,
  onClick,
  ...props
}) => (
  <div
    onClick={onClick}
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      padding: '8px 16px',
      borderRadius: theme.borderRadius.full,
      fontSize: '13px',
      fontWeight: 500,
      cursor: onClick ? 'pointer' : 'default',
      userSelect: 'none',
      background: selected ? theme.colors.secondaryContainer : theme.colors.surface,
      color: selected ? theme.colors.onSecondaryContainer : theme.colors.onSurfaceVariant,
      border: `1px solid ${selected ? 'transparent' : theme.colors.outlineVariant}`,
      transition: `all ${theme.transitions.fast}`,
      ...props,
    }}
    onMouseEnter={(e) => !selected && (e.currentTarget.style.background = theme.colors.surfaceContainer)}
    onMouseLeave={(e) => !selected && (e.currentTarget.style.background = theme.colors.surface)}
  >
    {icon && <span style={{ fontSize: '18px', display: 'flex' }}>{icon}</span>}
    {label}
    {removable && onRemove && (
      <button
        onClick={(e) => { e.stopPropagation(); onRemove(); }}
        style={{ display: 'flex', background: 'transparent', border: 'none', cursor: 'pointer', color: 'inherit', padding: 0, fontSize: '16px', opacity: 0.7 }}
      >
        <span style={{ fontSize: '16px', lineHeight: 1, fontFamily: '"Material Symbols Outlined"' }}>close</span>
      </button>
    )}
  </div>
);
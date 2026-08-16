import React, { useEffect, useRef, ReactNode, forwardRef } from 'react';
import { createPortal } from 'react-dom';
import { theme } from '../styles/theme';
import { Button } from './Button';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  size?: 'small' | 'medium' | 'large' | 'full';
  hideCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
}

const sizeStyles: Record<string, React.CSSProperties> = {
  small: { maxWidth: '440px' },
  medium: { maxWidth: '600px' },
  large: { maxWidth: '800px' },
  full: { maxWidth: 'calc(100vw - 48px)', width: '100%' },
};

export const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  title,
  description,
  children,
  size = 'medium',
  hideCloseButton = false,
  closeOnOverlayClick = true,
  closeOnEscape = true,
}) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (open) {
      previousActiveElement.current = document.activeElement as HTMLElement;
      document.body.style.overflow = 'hidden';
      contentRef.current?.focus();
    } else {
      document.body.style.overflow = '';
      previousActiveElement.current?.focus();
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === 'Escape' && closeOnEscape) onClose();
      if (e.key === 'Tab') {
        const focusable = contentRef.current?.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusable?.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault(); last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault(); first.focus();
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, closeOnEscape, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      ref={overlayRef}
      style={{
        position: 'fixed',
        inset: 0,
        background: theme.colors.scrim + '80',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: theme.spacing.md,
        zIndex: theme.zIndex.modal,
        animation: 'fadeIn 0.2s cubic-bezier(0.2, 0, 0.38, 0.9)',
        backdropFilter: 'blur(2px)',
      }}
      onClick={closeOnOverlayClick ? onClose : undefined}
      role="presentation"
    >
      <div
        ref={contentRef}
        tabIndex={-1}
        style={{
          ...sizeStyles[size],
          width: '100%',
          maxHeight: 'calc(100vh - 48px)',
          background: theme.colors.surface,
          borderRadius: theme.borderRadius.xl,
          boxShadow: theme.elevation.level4,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'slideUp 0.25s cubic-bezier(0.2, 0, 0.38, 0.9)',
          outline: 'none',
        }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        aria-describedby={description ? 'modal-description' : undefined}
      >
        {(title || !hideCloseButton) && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: theme.spacing.lg, borderBottom: `1px solid ${theme.colors.outlineVariant}` }}>
            <div>
              {title && <h2 id="modal-title" style={{ margin: 0, fontSize: '20px', fontWeight: 500, color: theme.colors.onSurface }}>{title}</h2>}
              {description && <p id="modal-description" style={{ margin: '4px 0 0', fontSize: '13px', color: theme.colors.onSurfaceVariant }}>{description}</p>}
            </div>
            {!hideCloseButton && (
              <IconButton onClick={onClose} size="small" aria-label="Close">
                <span style={{ fontSize: '24px', lineHeight: 1, fontFamily: '"Material Symbols Outlined"' }}>close</span>
              </IconButton>
            )}
          </div>
        )}

        <div style={{ flex: 1, overflow: 'auto', padding: theme.spacing.lg }}>
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'small' | 'medium' | 'large';
  children: ReactNode;
}

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ children, size = 'medium', ...props }, ref) => {
    const sizeMap: Record<string, number> = { small: 32, medium: 40, large: 48 };
    const sizePx = sizeMap[size];
    return (
      <button
        ref={ref}
        style={{
          padding: 0,
          width: sizePx,
          height: sizePx,
          borderRadius: '50%',
          border: 'none',
          background: 'transparent',
          color: theme.colors.onSurfaceVariant,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: `background ${theme.transitions.fast}`,
          ...props.style,
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = theme.colors.surfaceContainer}
        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
        {...props}
      >
        {children}
      </button>
    );
  }
);

IconButton.displayName = 'IconButton';

export interface AlertDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'destructive' | 'primary';
  loading?: boolean;
}

export const AlertDialog: React.FC<AlertDialogProps> = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'primary',
  loading = false,
}) => (
  <Modal open={open} onClose={onClose} size="small" title={title}>
    <p style={{ margin: 0, fontSize: '14px', color: theme.colors.onSurfaceVariant, lineHeight: '22px' }}>{message}</p>
    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: theme.spacing.sm, marginTop: theme.spacing.xl }}>
      <Button variant="text" onClick={onClose} disabled={loading}>{cancelText}</Button>
      <Button variant={variant === 'destructive' ? 'filled' : 'filled'} style={{ background: variant === 'destructive' ? theme.colors.error : undefined }} onClick={onConfirm} loading={loading}>{confirmText}</Button>
    </div>
  </Modal>
);

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  position?: 'left' | 'right';
  size?: 'small' | 'medium' | 'large';
}

const drawerSizeStyles: Record<string, React.CSSProperties> = {
  small: { width: '320px', maxWidth: '80vw' },
  medium: { width: '480px', maxWidth: '85vw' },
  large: { width: '640px', maxWidth: '90vw' },
};

export const Drawer: React.FC<DrawerProps> = ({
  open,
  onClose,
  children,
  title,
  position = 'right',
  size = 'medium',
}) => {
  if (!open) return null;

  return createPortal(
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: theme.colors.scrim + '60',
        display: 'flex',
        justifyContent: position === 'left' ? 'flex-start' : 'flex-end',
        zIndex: theme.zIndex.drawer,
        padding: 0,
        animation: 'fadeIn 0.2s cubic-bezier(0.2, 0, 0.38, 0.9)',
      }}
      onClick={onClose}
    >
      <div
        style={{
          ...drawerSizeStyles[size],
          height: '100%',
          background: theme.colors.surface,
          boxShadow: theme.elevation.level4,
          display: 'flex',
          flexDirection: 'column',
          animation: `slideIn${position === 'left' ? 'Left' : 'Right'} 0.3s cubic-bezier(0.2, 0, 0.38, 0.9)`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: theme.spacing.lg, borderBottom: `1px solid ${theme.colors.outlineVariant}` }}>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 500, color: theme.colors.onSurface }}>{title}</h2>
            <IconButton onClick={onClose} size="small" aria-label="Close">
              <span style={{ fontSize: '24px', lineHeight: 1, fontFamily: '"Material Symbols Outlined"' }}>close</span>
            </IconButton>
          </div>
        )}

        <div style={{ flex: 1, overflow: 'auto', padding: theme.spacing.lg }}>{children}</div>
      </div>
    </div>,
    document.body
  );
};
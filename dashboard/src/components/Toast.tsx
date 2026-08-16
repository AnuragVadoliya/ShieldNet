import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { theme } from '../styles/theme';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  action?: { label: string; onClick: () => void };
}

interface ToastContextType {
  toasts: Toast[];
  showToast: (toast: Omit<Toast, 'id'>) => string;
  hideToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).slice(2, 9);
    const newToast = { ...toast, id };
    setToasts(prev => [...prev, newToast]);

    if (toast.duration !== 0) {
      setTimeout(() => hideToast(id), toast.duration ?? 5000);
    }
    return id;
  }, []);

  const hideToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, showToast, hideToast }}>
      {children}
      <ToastContainer toasts={toasts} onClose={hideToast} />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};

const iconMap = {
  success: 'check_circle',
  error: 'error',
  warning: 'warning',
  info: 'info',
};

const colorMap = {
  success: theme.colors.success,
  error: theme.colors.error,
  warning: theme.colors.warning,
  info: theme.colors.info,
};

const bgColorMap = {
  success: theme.colors.successContainer,
  error: theme.colors.errorContainer,
  warning: theme.colors.warningContainer,
  info: theme.colors.infoContainer,
};

const ToastContainer: React.FC<{ toasts: Toast[]; onClose: (id: string) => void }> = ({ toasts, onClose }) => (
  <div
    style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      zIndex: theme.zIndex.snackbar,
      pointerEvents: 'none',
      maxWidth: '400px',
    }}
  >
    {toasts.map(toast => (
      <ToastItem key={toast.id} toast={toast} onClose={onClose} />
    ))}
  </div>
);

const ToastItem: React.FC<{ toast: Toast; onClose: (id: string) => void }> = ({ toast, onClose }) => {
  const bgColor = bgColorMap[toast.type];
  const iconColor = colorMap[toast.type];

  return (
    <div
      style={{
        pointerEvents: 'auto',
        background: bgColor,
        borderLeft: `4px solid ${iconColor}`,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.md,
        boxShadow: theme.elevation.level3,
        display: 'flex',
        gap: theme.spacing.sm,
        animation: 'toastIn 0.3s cubic-bezier(0.2, 0, 0.38, 0.9)',
      }}
    >
      <span
        style={{
          fontSize: '24px',
          lineHeight: 1,
          fontFamily: '"Material Symbols Outlined"',
          color: iconColor,
          flexShrink: 0,
          marginTop: '2px',
        }}
      >
        {iconMap[toast.type]}
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 500, fontSize: '14px', color: theme.colors.onSurface }}>{toast.title}</div>
        {toast.message && (
          <div style={{ fontSize: '13px', color: theme.colors.onSurfaceVariant, marginTop: '2px' }}>{toast.message}</div>
        )}
      </div>
      {toast.action && (
        <button
          onClick={toast.action.onClick}
          style={{
            background: 'transparent',
            border: 'none',
            color: iconColor,
            fontWeight: 500,
            fontSize: '13px',
            cursor: 'pointer',
            padding: '4px 8px',
            borderRadius: theme.borderRadius.sm,
            textTransform: 'uppercase',
          }}
        >
          {toast.action.label}
        </button>
      )}
      <button
        onClick={() => onClose(toast.id)}
        style={{
          background: 'transparent',
          border: 'none',
          color: theme.colors.onSurfaceVariant,
          cursor: 'pointer',
          padding: '4px',
          borderRadius: theme.borderRadius.sm,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span style={{ fontSize: '20px', lineHeight: 1, fontFamily: '"Material Symbols Outlined"' }}>close</span>
      </button>
    </div>
  );
};
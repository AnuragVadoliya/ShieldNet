export const theme = {
  colors: {
    primary: '#1565C0',
    primaryLight: '#5E92F3',
    primaryDark: '#003C8F',
    primaryContainer: '#E3F2FD',
    onPrimary: '#FFFFFF',
    onPrimaryContainer: '#001D3D',

    secondary: '#00695C',
    secondaryLight: '#4DB6AC',
    secondaryDark: '#003D39',
    secondaryContainer: '#E0F2F1',
    onSecondary: '#FFFFFF',
    onSecondaryContainer: '#001F1C',

    tertiary: '#C62828',
    tertiaryLight: '#EF5350',
    tertiaryDark: '#8E0000',
    tertiaryContainer: '#FDEDEA',
    onTertiary: '#FFFFFF',
    onTertiaryContainer: '#3B0000',

    error: '#C62828',
    errorContainer: '#FDEDEA',
    onError: '#FFFFFF',
    onErrorContainer: '#3B0000',

    success: '#2E7D32',
    successContainer: '#E8F5E9',
    onSuccess: '#FFFFFF',
    onSuccessContainer: '#1B5E20',

    warning: '#F57F17',
    warningContainer: '#FFF8E1',
    onWarning: '#000000',
    onWarningContainer: '#3E2723',

    info: '#0288D1',
    infoContainer: '#E1F5FE',
    onInfo: '#FFFFFF',
    onInfoContainer: '#002C3E',

    surface: '#FFFFFF',
    surfaceVariant: '#F5F5F5',
    surfaceContainer: '#F0F0F0',
    surfaceContainerHigh: '#E8E8E8',
    surfaceContainerHighest: '#E0E0E0',
    onSurface: '#1C1B1F',
    onSurfaceVariant: '#49454F',

    outline: '#79747E',
    outlineVariant: '#CAC4D0',
    inverseSurface: '#313033',
    inverseOnSurface: '#F4EFF4',
    inversePrimary: '#90CAF9',

    shadow: '#000000',
    scrim: '#000000',

    background: '#F8F9FA',
    onBackground: '#1C1B1F',

    threat: {
      critical: '#C62828',
      high: '#E65100',
      medium: '#F57F17',
      low: '#2E7D32',
      info: '#0288D1',
    },

    status: {
      online: '#2E7D32',
      degraded: '#F57F17',
      active_alerts: '#E65100',
      quarantined: '#C62828',
      contained: '#2E7D32',
      active: '#C62828',
      review: '#F57F17',
      normal: '#2E7D32',
      suspicious: '#F57F17',
    },

    decision: {
      THREAT_HIGH: '#C62828',
      THREAT_MEDIUM: '#E65100',
      SUSPICIOUS: '#F57F17',
      NORMAL: '#2E7D32',
    },
  },

  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
  },

  borderRadius: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    full: '9999px',
  },

  elevation: {
    level0: 'none',
    level1: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)',
    level2: '0 4px 8px rgba(0,0,0,0.10), 0 2px 4px rgba(0,0,0,0.06)',
    level3: '0 12px 24px rgba(0,0,0,0.12), 0 4px 8px rgba(0,0,0,0.08)',
    level4: '0 20px 40px rgba(0,0,0,0.15), 0 8px 16px rgba(0,0,0,0.10)',
  },

  typography: {
    fontFamily: "'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    fontFamilyMono: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",

    displayLarge: { fontSize: '57px', fontWeight: 400, lineHeight: '64px', letterSpacing: '-0.25px' },
    displayMedium: { fontSize: '45px', fontWeight: 400, lineHeight: '52px', letterSpacing: '0px' },
    displaySmall: { fontSize: '36px', fontWeight: 400, lineHeight: '44px', letterSpacing: '0px' },

    headlineLarge: { fontSize: '32px', fontWeight: 500, lineHeight: '40px', letterSpacing: '0px' },
    headlineMedium: { fontSize: '28px', fontWeight: 500, lineHeight: '36px', letterSpacing: '0px' },
    headlineSmall: { fontSize: '24px', fontWeight: 500, lineHeight: '32px', letterSpacing: '0px' },

    titleLarge: { fontSize: '22px', fontWeight: 500, lineHeight: '28px', letterSpacing: '0px' },
    titleMedium: { fontSize: '16px', fontWeight: 500, lineHeight: '24px', letterSpacing: '0.15px' },
    titleSmall: { fontSize: '14px', fontWeight: 500, lineHeight: '20px', letterSpacing: '0.1px' },

    labelLarge: { fontSize: '14px', fontWeight: 500, lineHeight: '20px', letterSpacing: '0.1px' },
    labelMedium: { fontSize: '12px', fontWeight: 500, lineHeight: '16px', letterSpacing: '0.5px' },
    labelSmall: { fontSize: '11px', fontWeight: 500, lineHeight: '16px', letterSpacing: '0.5px' },

    bodyLarge: { fontSize: '16px', fontWeight: 400, lineHeight: '24px', letterSpacing: '0.15px' },
    bodyMedium: { fontSize: '14px', fontWeight: 400, lineHeight: '20px', letterSpacing: '0.25px' },
    bodySmall: { fontSize: '12px', fontWeight: 400, lineHeight: '16px', letterSpacing: '0.4px' },

    caption: { fontSize: '11px', fontWeight: 400, lineHeight: '16px', letterSpacing: '0.4px' },
    overline: { fontSize: '10px', fontWeight: 400, lineHeight: '16px', letterSpacing: '1.5px', textTransform: 'uppercase' },
  },

  transitions: {
    fast: '150ms cubic-bezier(0.2, 0, 0.38, 0.9)',
    standard: '250ms cubic-bezier(0.2, 0, 0.38, 0.9)',
    slow: '350ms cubic-bezier(0.2, 0, 0.38, 0.9)',
  },

  breakpoints: {
    xs: '0px',
    sm: '600px',
    md: '900px',
    lg: '1200px',
    xl: '1536px',
  },

  zIndex: {
    drawer: 1200,
    modal: 1300,
    snackbar: 1400,
    tooltip: 1500,
  },
};

export type Theme = typeof theme;

export const cssVars = `
  :root {
    --color-primary: ${theme.colors.primary};
    --color-primary-light: ${theme.colors.primaryLight};
    --color-primary-dark: ${theme.colors.primaryDark};
    --color-primary-container: ${theme.colors.primaryContainer};
    --color-on-primary: ${theme.colors.onPrimary};
    --color-on-primary-container: ${theme.colors.onPrimaryContainer};

    --color-secondary: ${theme.colors.secondary};
    --color-secondary-container: ${theme.colors.secondaryContainer};
    --color-on-secondary: ${theme.colors.onSecondary};
    --color-on-secondary-container: ${theme.colors.onSecondaryContainer};

    --color-tertiary: ${theme.colors.tertiary};
    --color-tertiary-container: ${theme.colors.tertiaryContainer};
    --color-on-tertiary: ${theme.colors.onTertiary};
    --color-on-tertiary-container: ${theme.colors.onTertiaryContainer};

    --color-error: ${theme.colors.error};
    --color-error-container: ${theme.colors.errorContainer};
    --color-on-error: ${theme.colors.onError};
    --color-on-error-container: ${theme.colors.onErrorContainer};

    --color-success: ${theme.colors.success};
    --color-success-container: ${theme.colors.successContainer};
    --color-on-success: ${theme.colors.onSuccess};
    --color-on-success-container: ${theme.colors.onSuccessContainer};

    --color-warning: ${theme.colors.warning};
    --color-warning-container: ${theme.colors.warningContainer};
    --color-on-warning: ${theme.colors.onWarning};
    --color-on-warning-container: ${theme.colors.onWarningContainer};

    --color-surface: ${theme.colors.surface};
    --color-surface-variant: ${theme.colors.surfaceVariant};
    --color-surface-container: ${theme.colors.surfaceContainer};
    --color-on-surface: ${theme.colors.onSurface};
    --color-on-surface-variant: ${theme.colors.onSurfaceVariant};

    --color-outline: ${theme.colors.outline};
    --color-outline-variant: ${theme.colors.outlineVariant};

    --color-background: ${theme.colors.background};
    --color-on-background: ${theme.colors.onBackground};

    --elevation-1: ${theme.elevation.level1};
    --elevation-2: ${theme.elevation.level2};
    --elevation-3: ${theme.elevation.level3};
    --elevation-4: ${theme.elevation.level4};

    --radius-xs: ${theme.borderRadius.xs};
    --radius-sm: ${theme.borderRadius.sm};
    --radius-md: ${theme.borderRadius.md};
    --radius-lg: ${theme.borderRadius.lg};
    --radius-xl: ${theme.borderRadius.xl};
    --radius-full: ${theme.borderRadius.full};

    --font-family: ${theme.typography.fontFamily};
    --font-family-mono: ${theme.typography.fontFamilyMono};

    --spacing-xs: ${theme.spacing.xs};
    --spacing-sm: ${theme.spacing.sm};
    --spacing-md: ${theme.spacing.md};
    --spacing-lg: ${theme.spacing.lg};
    --spacing-xl: ${theme.spacing.xl};
    --spacing-xxl: ${theme.spacing.xxl};
  }
`;
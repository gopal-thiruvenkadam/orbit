import { createTheme, alpha } from '@mui/material/styles';

// Premium Color Palette
const colors = {
  primary: {
    main: '#6366F1', // Indigo 500
    light: '#818CF8', // Indigo 400
    dark: '#4F46E5', // Indigo 600
    contrastText: '#FFFFFF',
  },
  secondary: {
    main: '#EC4899', // Pink 500
    light: '#F472B6', // Pink 400
    dark: '#DB2777', // Pink 600
    contrastText: '#FFFFFF',
  },
  success: {
    main: '#10B981', // Emerald 500
    light: '#34D399', // Emerald 400
    dark: '#059669', // Emerald 600
  },
  warning: {
    main: '#F59E0B', // Amber 500
    light: '#FBBF24', // Amber 400
    dark: '#D97706', // Amber 600
  },
  error: {
    main: '#EF4444', // Red 500
    light: '#F87171', // Red 400
    dark: '#DC2626', // Red 600
  },
  info: {
    main: '#3B82F6', // Blue 500
    light: '#60A5FA', // Blue 400
    dark: '#2563EB', // Blue 600
  },
  grey: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
  background: {
    default: '#F3F4F6', // Cool Gray 100
    paper: '#FFFFFF',
  },
  text: {
    primary: '#111827', // Cool Gray 900
    secondary: '#6B7280', // Cool Gray 500
  },
};

// Define the main theme for the application
export const theme = createTheme({
  palette: {
    primary: colors.primary,
    secondary: colors.secondary,
    error: colors.error,
    warning: colors.warning,
    info: colors.info,
    success: colors.success,
    background: colors.background,
    text: colors.text,
    grey: colors.grey,
  },
  shape: {
    borderRadius: 16,
  },
  typography: {
    fontFamily: '"Inter", "system-ui", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 800,
      fontSize: '2.25rem',
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
      color: colors.text.primary,
    },
    h2: {
      fontWeight: 700,
      fontSize: '1.875rem',
      lineHeight: 1.3,
      letterSpacing: '-0.01em',
      color: colors.text.primary,
    },
    h3: {
      fontWeight: 700,
      fontSize: '1.5rem',
      lineHeight: 1.4,
      color: colors.text.primary,
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.4,
      color: colors.text.primary,
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.125rem',
      lineHeight: 1.5,
      color: colors.text.primary,
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
      lineHeight: 1.5,
      color: colors.text.primary,
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: 1.5,
      color: colors.text.secondary,
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 500,
      lineHeight: 1.57,
      color: colors.text.secondary,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
      color: colors.text.primary,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.57,
      color: colors.text.secondary,
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
      fontSize: '0.875rem',
    },
    caption: {
      fontSize: '0.75rem',
      lineHeight: 1.66,
      color: colors.text.secondary,
    },
    overline: {
      fontSize: '0.75rem',
      fontWeight: 600,
      textTransform: 'uppercase',
      lineHeight: 2.66,
      color: colors.text.secondary,
    },
  },
  shadows: [
    'none',
    '0px 1px 2px rgba(0, 0, 0, 0.06), 0px 1px 3px rgba(0, 0, 0, 0.1)', // 1 (sm)
    '0px 2px 4px rgba(0, 0, 0, 0.06), 0px 4px 6px rgba(0, 0, 0, 0.1)', // 2 (md)
    '0px 4px 6px rgba(0, 0, 0, 0.05), 0px 10px 15px rgba(0, 0, 0, 0.1)', // 3 (lg)
    '0px 10px 15px rgba(0, 0, 0, 0.04), 0px 20px 25px rgba(0, 0, 0, 0.1)', // 4 (xl)
    '0px 25px 50px rgba(0, 0, 0, 0.25)', // 5 (2xl)
    ...Array(19).fill('none'), // Fill the rest to satisfy MUI types
  ] as any,
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: colors.background.default,
          scrollbarColor: '#6b6b6b #2b2b2b',
          '&::-webkit-scrollbar, & *::-webkit-scrollbar': {
            backgroundColor: 'transparent',
            width: '8px',
            height: '8px',
          },
          '&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb': {
            borderRadius: 8,
            backgroundColor: '#d1d5db',
            minHeight: 24,
            border: '2px solid transparent',
            backgroundClip: 'content-box',
          },
          '&::-webkit-scrollbar-thumb:focus, & *::-webkit-scrollbar-thumb:focus': {
            backgroundColor: '#9ca3af',
          },
          '&::-webkit-scrollbar-thumb:active, & *::-webkit-scrollbar-thumb:active': {
            backgroundColor: '#9ca3af',
          },
          '&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover': {
            backgroundColor: '#9ca3af',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '8px 16px',
          transition: 'all 0.2s ease-in-out',
        },
        contained: {
          boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -1px rgba(0, 0, 0, 0.06)',
          },
        },
        outlined: {
          borderWidth: '1.5px',
          '&:hover': {
            borderWidth: '1.5px',
            backgroundColor: alpha(colors.primary.main, 0.04),
          },
        },
        text: {
          '&:hover': {
            backgroundColor: alpha(colors.primary.main, 0.04),
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1), 0px 1px 2px rgba(0, 0, 0, 0.06)',
          border: '1px solid rgba(229, 231, 235, 0.5)',
          backgroundImage: 'none',
          transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -2px rgba(0, 0, 0, 0.05)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
        elevation1: {
          boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1), 0px 1px 2px rgba(0, 0, 0, 0.06)',
        },
        rounded: {
          borderRadius: 16,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          borderRadius: 8,
        },
        filled: {
          border: '1px solid transparent',
        },
        outlined: {
          borderWidth: '1.5px',
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          height: 8,
          backgroundColor: alpha(colors.primary.main, 0.12),
        },
        bar: {
          borderRadius: 4,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: alpha('#FFFFFF', 0.8),
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(229, 231, 235, 0.5)',
          boxShadow: 'none',
          color: colors.text.primary,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#FFFFFF',
          borderRight: '1px solid rgba(229, 231, 235, 0.5)',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          margin: '4px 8px',
          padding: '10px 16px',
          '&.Mui-selected': {
            backgroundColor: alpha(colors.primary.main, 0.1),
            color: colors.primary.main,
            '&:hover': {
              backgroundColor: alpha(colors.primary.main, 0.15),
            },
            '& .MuiListItemIcon-root': {
              color: colors.primary.main,
            },
          },
          '&:hover': {
            backgroundColor: alpha(colors.grey[500], 0.08),
          },
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          minWidth: 40,
          color: colors.text.secondary,
        },
      },
    },
  },
});


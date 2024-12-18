/**
 * Material-UI Theme Configuration
 * 
 * Customizes the application's visual appearance
 * Features:
 * - Custom color palette
 * - Typography settings
 * - Component overrides
 * - RTL support
 * - Responsive breakpoints
 * - Custom shadows
 * - Transitions
 */

import { createTheme } from '@mui/material/styles';
import { heIL } from '@mui/material/locale';

// Custom color palette
const palette = {
  primary: {
    main: '#2196f3',
    light: '#64b5f6',
    dark: '#1976d2',
    contrastText: '#ffffff'
  },
  secondary: {
    main: '#f50057',
    light: '#ff4081',
    dark: '#c51162',
    contrastText: '#ffffff'
  },
  error: {
    main: '#f44336',
    light: '#e57373',
    dark: '#d32f2f'
  },
  warning: {
    main: '#ff9800',
    light: '#ffb74d',
    dark: '#f57c00'
  },
  info: {
    main: '#2196f3',
    light: '#64b5f6',
    dark: '#1976d2'
  },
  success: {
    main: '#4caf50',
    light: '#81c784',
    dark: '#388e3c'
  },
  background: {
    default: '#f5f5f5',
    paper: '#ffffff'
  }
};

// Typography configuration
const typography = {
  fontFamily: [
    'Rubik',
    'Assistant',
    'Arial',
    'sans-serif'
  ].join(','),
  h1: {
    fontSize: '2.5rem',
    fontWeight: 500
  },
  h2: {
    fontSize: '2rem',
    fontWeight: 500
  },
  h3: {
    fontSize: '1.75rem',
    fontWeight: 500
  },
  h4: {
    fontSize: '1.5rem',
    fontWeight: 500
  },
  h5: {
    fontSize: '1.25rem',
    fontWeight: 500
  },
  h6: {
    fontSize: '1rem',
    fontWeight: 500
  },
  body1: {
    fontSize: '1rem',
    lineHeight: 1.5
  },
  body2: {
    fontSize: '0.875rem',
    lineHeight: 1.43
  }
};

// Component overrides
const components = {
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        textTransform: 'none',
        fontWeight: 500
      }
    }
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: 12,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }
    }
  },
  MuiTextField: {
    styleOverrides: {
      root: {
        '& .MuiOutlinedInput-root': {
          borderRadius: 8
        }
      }
    }
  }
};

// Create and export theme
export const theme = createTheme(
  {
    direction: 'rtl',
    palette,
    typography,
    components,
    shape: {
      borderRadius: 8
    }
  },
  heIL // Hebrew locale
); 
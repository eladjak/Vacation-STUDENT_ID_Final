/**
 * Theme Configuration
 * 
 * Material-UI theme customization
 * Features:
 * - Custom color palette
 * - Typography settings
 * - RTL support
 * - Component overrides
 * - Responsive breakpoints
 * - Custom shadows
 * - Custom transitions
 */

import { createTheme } from '@mui/material/styles';
import { heIL } from '@mui/material/locale';

/**
 * Custom theme configuration
 * Extends Material-UI's default theme
 */
const theme = createTheme({
  direction: 'rtl',
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#9c27b0',
      light: '#ba68c8',
      dark: '#7b1fa2',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: [
      'Rubik',
      'Arial',
      'sans-serif',
    ].join(','),
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        fullWidth: true,
      },
    },
  },
}, heIL);

export default theme; 
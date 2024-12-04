import { createTheme } from '@mui/material/styles';
import { heIL } from '@mui/material/locale';

declare module '@mui/material/styles' {
  interface Theme {
    customTransitions: {
      smooth: string;
      hover: string;
    };
  }
  interface ThemeOptions {
    customTransitions?: {
      smooth?: string;
      hover?: string;
    };
  }
}

export const theme = createTheme({
  direction: 'rtl',
  customTransitions: {
    smooth: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    hover: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '*': {
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }
      }
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          left: 'auto',
          right: 0
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-2px)'
          }
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
          }
        }
      }
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'scale(1.1)'
          }
        }
      }
    }
  },
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
      contrastText: '#fff'
    },
    secondary: {
      main: '#9c27b0',
      light: '#ba68c8',
      dark: '#7b1fa2',
      contrastText: '#fff'
    },
    background: {
      default: '#f5f5f5',
      paper: '#fff'
    }
  },
  typography: {
    fontFamily: [
      'Rubik',
      'Arial',
      'sans-serif'
    ].join(','),
    h1: {
      fontWeight: 700
    },
    h2: {
      fontWeight: 600
    },
    h3: {
      fontWeight: 600
    },
    h4: {
      fontWeight: 600
    },
    h5: {
      fontWeight: 500
    },
    h6: {
      fontWeight: 500
    }
  }
}, heIL); 
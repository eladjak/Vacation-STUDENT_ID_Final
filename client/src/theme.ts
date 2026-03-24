/**
 * Material-UI Theme Configuration — Dark Mode
 *
 * Dark glassmorphism theme with purple/cyan accents.
 * Inspired by the portfolio at fullstack-eladjak.co.il
 */

import { createTheme } from '@mui/material/styles';
import { heIL } from '@mui/material/locale';

// Custom color palette — dark mode
const palette = {
  mode: 'dark' as const,
  primary: {
    main: '#a855f7',      // vivid purple
    light: '#c084fc',
    dark: '#7c3aed',
    contrastText: '#ffffff'
  },
  secondary: {
    main: '#22d3ee',      // cyan
    light: '#67e8f9',
    dark: '#0891b2',
    contrastText: '#0a0a1a'
  },
  error: {
    main: '#f87171',
    light: '#fca5a5',
    dark: '#dc2626'
  },
  warning: {
    main: '#fbbf24',
    light: '#fcd34d',
    dark: '#d97706'
  },
  info: {
    main: '#38bdf8',
    light: '#7dd3fc',
    dark: '#0284c7'
  },
  success: {
    main: '#34d399',
    light: '#6ee7b7',
    dark: '#059669'
  },
  background: {
    default: '#05080f',   // near-black blue-tinted
    paper: '#0d1117'      // dark card background
  },
  text: {
    primary: '#f1f5f9',
    secondary: '#94a3b8'
  },
  divider: 'rgba(168, 85, 247, 0.15)'
};

// Typography configuration
const typography = {
  fontFamily: [
    'Rubik',
    'Assistant',
    'Arial',
    'sans-serif'
  ].join(','),
  h1: { fontSize: '2.5rem', fontWeight: 600 },
  h2: { fontSize: '2rem', fontWeight: 600 },
  h3: { fontSize: '1.75rem', fontWeight: 600 },
  h4: { fontSize: '1.5rem', fontWeight: 600 },
  h5: { fontSize: '1.25rem', fontWeight: 500 },
  h6: { fontSize: '1rem', fontWeight: 500 },
  body1: { fontSize: '1rem', lineHeight: 1.6 },
  body2: { fontSize: '0.875rem', lineHeight: 1.5 }
};

// Component overrides — glassmorphism style
const components = {
  MuiCssBaseline: {
    styleOverrides: {
      body: {
        background: 'linear-gradient(135deg, #05080f 0%, #0a0d1a 50%, #070b16 100%)',
        minHeight: '100vh',
        scrollbarColor: '#a855f7 #0d1117',
        '&::-webkit-scrollbar': { width: '6px' },
        '&::-webkit-scrollbar-track': { background: '#0d1117' },
        '&::-webkit-scrollbar-thumb': {
          background: 'linear-gradient(180deg, #a855f7, #22d3ee)',
          borderRadius: '3px'
        }
      }
    }
  },
  MuiAppBar: {
    styleOverrides: {
      root: {
        background: 'rgba(5, 8, 15, 0.85) !important',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(168, 85, 247, 0.2)',
        boxShadow: '0 4px 30px rgba(0,0,0,0.4)',
        color: '#f1f5f9'
      }
    }
  },
  MuiCard: {
    styleOverrides: {
      root: {
        background: 'rgba(13, 17, 23, 0.8)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(168, 85, 247, 0.12)',
        borderRadius: '16px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)',
        transition: 'all 0.25s ease',
        '&:hover': {
          border: '1px solid rgba(168, 85, 247, 0.4)',
          boxShadow: '0 12px 48px rgba(168, 85, 247, 0.15), 0 8px 32px rgba(0,0,0,0.6)',
          transform: 'translateY(-2px)'
        }
      }
    }
  },
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: '10px',
        textTransform: 'none' as const,
        fontWeight: 600,
        transition: 'all 0.2s ease'
      },
      contained: {
        background: 'linear-gradient(135deg, #a855f7, #7c3aed)',
        boxShadow: '0 4px 15px rgba(168, 85, 247, 0.35)',
        '&:hover': {
          background: 'linear-gradient(135deg, #c084fc, #a855f7)',
          boxShadow: '0 6px 20px rgba(168, 85, 247, 0.5)',
          transform: 'translateY(-1px)'
        }
      },
      outlined: {
        borderColor: 'rgba(168, 85, 247, 0.5)',
        color: '#a855f7',
        '&:hover': {
          borderColor: '#a855f7',
          background: 'rgba(168, 85, 247, 0.08)'
        }
      }
    }
  },
  MuiTextField: {
    styleOverrides: {
      root: {
        '& .MuiOutlinedInput-root': {
          borderRadius: '10px',
          background: 'rgba(255,255,255,0.03)',
          '& fieldset': { borderColor: 'rgba(168, 85, 247, 0.25)' },
          '&:hover fieldset': { borderColor: 'rgba(168, 85, 247, 0.5)' },
          '&.Mui-focused fieldset': { borderColor: '#a855f7' }
        },
        '& .MuiInputLabel-root': { color: '#94a3b8' },
        '& .MuiInputLabel-root.Mui-focused': { color: '#a855f7' }
      }
    }
  },
  MuiPaper: {
    styleOverrides: {
      root: {
        background: 'rgba(13, 17, 23, 0.9)',
        backgroundImage: 'none',
        border: '1px solid rgba(168, 85, 247, 0.1)'
      }
    }
  },
  MuiDialog: {
    styleOverrides: {
      paper: {
        background: 'rgba(13, 17, 23, 0.97)',
        border: '1px solid rgba(168, 85, 247, 0.2)',
        backdropFilter: 'blur(20px)',
        borderRadius: '16px'
      }
    }
  },
  MuiDrawer: {
    styleOverrides: {
      paper: {
        background: 'rgba(5, 8, 15, 0.97)',
        borderLeft: '1px solid rgba(168, 85, 247, 0.2)'
      }
    }
  },
  MuiChip: {
    styleOverrides: {
      root: {
        background: 'rgba(168, 85, 247, 0.15)',
        border: '1px solid rgba(168, 85, 247, 0.3)',
        color: '#c084fc'
      }
    }
  },
  MuiIconButton: {
    styleOverrides: {
      root: {
        '&:hover': {
          background: 'rgba(168, 85, 247, 0.12)'
        }
      }
    }
  },
  MuiListItem: {
    styleOverrides: {
      root: {
        borderRadius: '8px',
        '&:hover': {
          background: 'rgba(168, 85, 247, 0.08)'
        },
        '&.Mui-selected': {
          background: 'rgba(168, 85, 247, 0.15)',
          '&:hover': {
            background: 'rgba(168, 85, 247, 0.2)'
          }
        }
      }
    }
  },
  MuiAvatar: {
    styleOverrides: {
      root: {
        background: 'linear-gradient(135deg, #a855f7, #22d3ee)'
      }
    }
  },
  MuiDivider: {
    styleOverrides: {
      root: {
        borderColor: 'rgba(168, 85, 247, 0.12)'
      }
    }
  },
  MuiTooltip: {
    styleOverrides: {
      tooltip: {
        background: 'rgba(13, 17, 23, 0.95)',
        border: '1px solid rgba(168, 85, 247, 0.3)',
        backdropFilter: 'blur(10px)',
        color: '#f1f5f9',
        fontSize: '0.8rem'
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
    shape: { borderRadius: 10 }
  },
  heIL // Hebrew locale
);

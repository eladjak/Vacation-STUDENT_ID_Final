import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  direction: 'rtl',
  typography: {
    fontFamily: [
      'Rubik',
      'Arial',
      'sans-serif',
    ].join(','),
  },
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          direction: 'rtl',
        },
      },
    },
  },
}); 
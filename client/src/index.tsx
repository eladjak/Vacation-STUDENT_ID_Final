/**
 * Application Entry Point
 * 
 * Main entry point for the React application
 * Features:
 * - React 18 with Strict Mode
 * - Redux store provider
 * - Material-UI theme provider
 * - RTL support
 * - Global styles
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import RTL from './components/RTL';
import { store } from './store';
import { theme } from './theme';
import App from './App';
import './index.css';

// Create root element and render application
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <RTL>
          <CssBaseline />
          <App />
        </RTL>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
); 
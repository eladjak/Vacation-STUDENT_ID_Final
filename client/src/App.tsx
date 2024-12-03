import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate
} from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { he } from 'date-fns/locale';
import CssBaseline from '@mui/material/CssBaseline';
import { store } from './store';
import { theme } from './theme';
import Layout from './components/layout/Layout';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import VacationList from './components/vacations/VacationList';
import AddVacation from './components/admin/AddVacation';
import EditVacation from './components/admin/EditVacation';
import VacationStats from './components/admin/VacationStats';
import PrivateRoute from './components/layout/PrivateRoute';
import AdminRoute from './components/layout/AdminRoute';
import { restoreAuth } from './store/slices/authSlice';

function App() {
  useEffect(() => {
    store.dispatch(restoreAuth());
  }, []);

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={he}>
          <CssBaseline />
          <Router>
            <Layout>
              <Routes>
                {/* Public routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/vacations" element={
                  <PrivateRoute>
                    <VacationList />
                  </PrivateRoute>
                } />
                <Route path="/admin/add-vacation" element={
                  <AdminRoute>
                    <AddVacation />
                  </AdminRoute>
                } />
                <Route path="/admin/edit-vacation/:id" element={
                  <AdminRoute>
                    <EditVacation />
                  </AdminRoute>
                } />
                <Route path="/admin/stats" element={
                  <AdminRoute>
                    <VacationStats />
                  </AdminRoute>
                } />
                <Route path="/" element={<Navigate to="/vacations" replace />} />
              </Routes>
            </Layout>
          </Router>
        </LocalizationProvider>
      </ThemeProvider>
    </Provider>
  );
}

export default App; 
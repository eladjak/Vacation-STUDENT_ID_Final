import React, { useEffect } from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  Outlet,
  useLocation
} from 'react-router-dom';
import { useSelector } from 'react-redux';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { he } from 'date-fns/locale';
import { store } from './store';
import Layout from './components/layout/Layout';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import VacationList from './components/vacations/VacationList';
import AddVacation from './components/admin/AddVacation';
import EditVacation from './components/admin/EditVacation';
import VacationStats from './components/admin/VacationStats';
import { restoreAuth } from './store/slices/authSlice';
import { RootState } from './store';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const location = useLocation();

  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

const AppLayout: React.FC = () => {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};

const AppRoutes = () => {
  const location = useLocation();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  // אם המשתמש מאומת ומנסה לגשת לדף הלוגין, נעביר אותו לדף הראשי
  if (isAuthenticated && location.pathname === '/login') {
    return <Navigate to="/vacations" replace />;
  }

  return <Outlet />;
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppRoutes />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            index: true,
            element: <Navigate to="/vacations" replace />
          },
          {
            path: 'login',
            element: <Login />
          },
          {
            path: 'register',
            element: <Register />
          },
          {
            path: 'vacations',
            element: <PrivateRoute><VacationList /></PrivateRoute>
          },
          {
            path: 'admin',
            children: [
              {
                path: 'add-vacation',
                element: <AdminRoute><AddVacation /></AdminRoute>
              },
              {
                path: 'edit-vacation/:id',
                element: <AdminRoute><EditVacation /></AdminRoute>
              },
              {
                path: 'stats',
                element: <AdminRoute><VacationStats /></AdminRoute>
              }
            ]
          }
        ]
      }
    ]
  }
]);

function App() {
  useEffect(() => {
    store.dispatch(restoreAuth());
  }, []);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={he}>
      <RouterProvider router={router} />
    </LocalizationProvider>
  );
}

export default App; 
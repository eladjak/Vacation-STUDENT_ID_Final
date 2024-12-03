import React from 'react';
import { Container, Box, Alert, Snackbar } from '@mui/material';
import { useAppSelector } from '../../hooks/redux';
import Navbar from './Navbar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { error: authError } = useAppSelector(state => state.auth);
  const { error: vacationsError } = useAppSelector(state => state.vacations);

  const error = authError || vacationsError;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Container component="main" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
        {children}
      </Container>
      <Snackbar 
        open={!!error} 
        autoHideDuration={6000} 
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Layout; 
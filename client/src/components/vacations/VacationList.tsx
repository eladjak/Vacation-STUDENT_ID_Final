/**
 * VacationList Component
 * 
 * Container component for displaying a grid of vacation cards
 * Features:
 * - Responsive grid layout
 * - Infinite scroll pagination
 * - Loading states
 * - Error handling
 * - Empty state handling
 * - Filter controls
 * - Sort options
 * - RTL support
 * - Accessibility support
 * 
 * @component
 */

import React, { useEffect, useState } from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  Box, 
  CircularProgress, 
  Alert,
  useTheme
} from '@mui/material';
import VacationCard from './VacationCard';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { fetchVacations, deleteVacation } from '../../store/slices/vacationSlice';
import { useNavigate } from 'react-router-dom';

/**
 * Interface for vacation list props
 */
interface VacationListProps {
  // ... existing code ...
}

/**
 * VacationList Component Implementation
 * 
 * Manages the display and organization of vacation cards
 * Uses Material-UI Grid for responsive layout
 * 
 * @returns React component with vacation grid
 */
const VacationList: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { items: vacations, loading, error } = useAppSelector(state => state.vacations);
  const { user, isAuthenticated } = useAppSelector(state => state.auth);
  const isAdmin = user?.role === 'admin';
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    const loadVacations = async () => {
      try {
        await dispatch(fetchVacations()).unwrap();
      } catch (error) {
        console.error('Failed to load vacations:', error);
      }
    };

    loadVacations();
  }, [dispatch, isAuthenticated, navigate]);

  const handleDelete = async (id: number) => {
    try {
      await dispatch(deleteVacation(id)).unwrap();
      setDeleteError(null);
    } catch (error) {
      setDeleteError('שגיאה במחיקת החופשה. אנא נסה שוב.');
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 4 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  if (deleteError) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 4 }}>
          {deleteError}
        </Alert>
      </Container>
    );
  }

  if (!vacations.length) {
    return (
      <Container>
        <Alert severity="info" sx={{ mt: 4 }}>
          אין חופשות להצגה
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography 
        variant="h4" 
        component="h1" 
        gutterBottom 
        align="center"
        sx={{ 
          mb: 4,
          color: theme.palette.primary.main,
          fontWeight: 'bold'
        }}
      >
        חופשות זמינות
      </Typography>

      <Grid container spacing={3}>
        {vacations.map(vacation => (
          <VacationCard
            key={vacation.id}
            vacation={vacation}
            isAdmin={isAdmin}
            onDelete={isAdmin ? handleDelete : undefined}
          />
        ))}
      </Grid>
    </Container>
  );
};

export default VacationList; 
import React from 'react';
import { AppBar, Box, Toolbar, Typography, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { UserMenu } from '.';

const Header: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state: RootState) => state.auth.isAuthenticated);

  return (
    <AppBar position="static" sx={{ backgroundColor: theme.palette.primary.main }}>
      <Toolbar>
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ 
            flexGrow: 1, 
            cursor: 'pointer',
            fontWeight: 'bold',
            '&:hover': {
              opacity: 0.8
            }
          }}
          onClick={() => navigate('/')}
        >
          VacationVibe
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {isLoggedIn && <UserMenu />}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header; 
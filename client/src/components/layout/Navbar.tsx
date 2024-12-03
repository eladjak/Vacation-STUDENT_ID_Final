import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Container,
  useTheme,
  Tooltip,
  Avatar,
  Menu,
  MenuItem,
  Divider
} from '@mui/material';
import {
  Logout as LogoutIcon,
  Person as PersonIcon,
  AddCircle as AddIcon,
  BarChart as StatsIcon,
  Home as HomeIcon
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { logout } from '../../store/slices/authSlice';

const Navbar: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector(state => state.auth);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <AppBar 
      position="static" 
      sx={{ 
        backgroundColor: 'white',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      }}
    >
      <Container maxWidth="lg">
        <Toolbar sx={{ justifyContent: 'space-between', padding: '0.5rem 0' }}>
          {/* Logo/Brand */}
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              color: theme.palette.primary.main,
              textDecoration: 'none',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            <HomeIcon />
            מערכת ניהול חופשות
          </Typography>

          {/* Navigation Links */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {isAuthenticated ? (
              <>
                {/* Admin Links */}
                {user?.role === 'admin' && (
                  <>
                    <Button
                      component={RouterLink}
                      to="/admin/add-vacation"
                      startIcon={<AddIcon />}
                      sx={{
                        color: theme.palette.text.primary,
                        '&:hover': {
                          backgroundColor: 'rgba(0,0,0,0.04)'
                        }
                      }}
                    >
                      הוספת חופשה
                    </Button>
                    <Button
                      component={RouterLink}
                      to="/admin/stats"
                      startIcon={<StatsIcon />}
                      sx={{
                        color: theme.palette.text.primary,
                        '&:hover': {
                          backgroundColor: 'rgba(0,0,0,0.04)'
                        }
                      }}
                    >
                      סטטיסטיקות
                    </Button>
                  </>
                )}

                {/* User Menu */}
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Tooltip title="הגדרות משתמש">
                    <IconButton
                      onClick={handleMenu}
                      sx={{
                        padding: 1,
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: '8px',
                        '&:hover': {
                          backgroundColor: 'rgba(0,0,0,0.04)'
                        }
                      }}
                    >
                      <Avatar 
                        sx={{ 
                          width: 32, 
                          height: 32,
                          backgroundColor: theme.palette.primary.main
                        }}
                      >
                        <PersonIcon />
                      </Avatar>
                    </IconButton>
                  </Tooltip>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                    sx={{
                      '& .MuiPaper-root': {
                        borderRadius: '8px',
                        minWidth: '200px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                      }
                    }}
                  >
                    <MenuItem 
                      onClick={handleClose}
                      sx={{ 
                        py: 1,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                      }}
                    >
                      <PersonIcon fontSize="small" />
                      <Typography>{user?.email}</Typography>
                    </MenuItem>
                    <Divider />
                    <MenuItem 
                      onClick={handleLogout}
                      sx={{ 
                        py: 1,
                        color: theme.palette.error.main,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                      }}
                    >
                      <LogoutIcon fontSize="small" />
                      <Typography>התנתק</Typography>
                    </MenuItem>
                  </Menu>
                </Box>
              </>
            ) : (
              <>
                <Button
                  component={RouterLink}
                  to="/login"
                  variant="outlined"
                  sx={{
                    borderRadius: '8px',
                    textTransform: 'none',
                    minWidth: '100px'
                  }}
                >
                  התחברות
                </Button>
                <Button
                  component={RouterLink}
                  to="/register"
                  variant="contained"
                  sx={{
                    borderRadius: '8px',
                    textTransform: 'none',
                    minWidth: '100px'
                  }}
                >
                  הרשמה
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar; 
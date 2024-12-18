/**
 * Navigation Bar Component
 * 
 * Main navigation component with responsive design and role-based menu items
 * Features:
 * - Responsive layout (mobile/desktop)
 * - Role-based navigation items
 * - User authentication status handling
 * - Mobile drawer menu
 * - Animated logo
 * - Active route highlighting
 * 
 * @component
 */

import React, { useState } from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  Tooltip,
  MenuItem,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  Dashboard as DashboardIcon,
  Add as AddIcon,
  BarChart as StatsIcon,
  Logout as LogoutIcon,
  Login as LoginIcon,
  PersonAdd as RegisterIcon,
  FlightTakeoff as FlightIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { logout } from '../../store/slices/authSlice';

/**
 * Navbar Component
 * 
 * Main navigation component that adapts to screen size and user role
 * 
 * @returns React component
 */
const Navbar: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector(state => state.auth);

  /**
   * Opens the user menu
   * @param event - Mouse event from clicking the user avatar
   */
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  /**
   * Closes the user menu
   */
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  /**
   * Handles user logout
   * - Dispatches logout action
   * - Closes user menu
   * - Navigates to login page
   */
  const handleLogout = () => {
    dispatch(logout());
    handleCloseUserMenu();
    navigate('/login');
  };

  /**
   * Handles navigation to different routes
   * @param path - Target route path
   */
  const handleNavigate = (path: string) => {
    navigate(path);
    handleCloseUserMenu();
    setMobileMenuOpen(false);
  };

  /**
   * Checks if the given path matches current route
   * @param path - Route path to check
   * @returns boolean indicating if route is active
   */
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <AppBar 
      position="sticky" 
      sx={{ 
        bgcolor: theme.palette.background.default,
        boxShadow: 1,
        borderBottom: `1px solid ${theme.palette.divider}`
      }}
    >
      {/* Main container with max width */}
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Logo and brand section */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexGrow: 1,
              gap: 1
            }}
          >
            {/* Animated flight icon */}
            <FlightIcon 
              sx={{ 
                color: theme.palette.primary.main,
                fontSize: { xs: '1.5rem', md: '2rem' },
                animation: 'float 3s ease-in-out infinite'
              }} 
            />
            {/* Brand name */}
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{
                color: theme.palette.primary.main,
                fontWeight: 'bold',
                fontSize: { xs: '1.2rem', md: '1.5rem' }
              }}
            >
              VacationVibe
            </Typography>
          </Box>

          {/* Responsive navigation section */}
          {isMobile ? (
            // Mobile menu button
            <IconButton
              size="large"
              aria-label="menu"
              onClick={() => setMobileMenuOpen(true)}
              sx={{ color: theme.palette.text.primary }}
            >
              <MenuIcon />
            </IconButton>
          ) : (
            // Desktop navigation buttons
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              {isAuthenticated ? (
                <>
                  {/* Admin-only buttons */}
                  {user?.role === 'admin' && (
                    <>
                      <Button
                        onClick={() => handleNavigate('/admin/add-vacation')}
                        startIcon={<AddIcon />}
                        variant={isActive('/admin/add-vacation') ? 'contained' : 'text'}
                        color="primary"
                        sx={{
                          '& .MuiButton-startIcon': {
                            marginLeft: 1,
                            marginRight: -0.5
                          }
                        }}
                      >
                        Add Vacation
                      </Button>
                      <Button
                        onClick={() => handleNavigate('/admin/stats')}
                        startIcon={<StatsIcon />}
                        variant={isActive('/admin/stats') ? 'contained' : 'text'}
                        color="primary"
                        sx={{
                          '& .MuiButton-startIcon': {
                            marginLeft: 1,
                            marginRight: -0.5
                          }
                        }}
                      >
                        Statistics
                      </Button>
                    </>
                  )}
                  {/* Vacations button for all authenticated users */}
                  <Button
                    onClick={() => handleNavigate('/vacations')}
                    startIcon={<DashboardIcon />}
                    variant={isActive('/vacations') ? 'contained' : 'text'}
                    color="primary"
                    sx={{
                      '& .MuiButton-startIcon': {
                        marginLeft: 1,
                        marginRight: -0.5
                      }
                    }}
                  >
                    Vacations
                  </Button>
                  {/* User menu section */}
                  <Box sx={{ ml: 2 }}>
                    <Tooltip title="User settings">
                      <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                        <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                          {user?.firstName?.[0]?.toUpperCase()}
                        </Avatar>
                      </IconButton>
                    </Tooltip>
                    <Menu
                      sx={{ mt: '45px' }}
                      id="menu-appbar"
                      anchorEl={anchorElUser}
                      anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'left'
                      }}
                      keepMounted
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left'
                      }}
                      open={Boolean(anchorElUser)}
                      onClose={handleCloseUserMenu}
                    >
                      <MenuItem onClick={handleLogout}>
                        <ListItemIcon>
                          <LogoutIcon fontSize="small" />
                        </ListItemIcon>
                        <Typography textAlign="center">Logout</Typography>
                      </MenuItem>
                    </Menu>
                  </Box>
                </>
              ) : (
                // Authentication buttons for non-authenticated users
                <>
                  <Button
                    onClick={() => handleNavigate('/login')}
                    startIcon={<LoginIcon />}
                    variant={isActive('/login') ? 'contained' : 'text'}
                    color="primary"
                    sx={{
                      '& .MuiButton-startIcon': {
                        marginLeft: 1,
                        marginRight: -0.5
                      }
                    }}
                  >
                    Login
                  </Button>
                  <Button
                    onClick={() => handleNavigate('/register')}
                    startIcon={<RegisterIcon />}
                    variant={isActive('/register') ? 'contained' : 'text'}
                    color="primary"
                    sx={{
                      '& .MuiButton-startIcon': {
                        marginLeft: 1,
                        marginRight: -0.5
                      }
                    }}
                  >
                    Register
                  </Button>
                </>
              )}
            </Box>
          )}
        </Toolbar>
      </Container>

      {/* Mobile drawer menu */}
      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        PaperProps={{
          sx: {
            width: '80%',
            maxWidth: 300,
            bgcolor: theme.palette.background.default
          }
        }}
      >
        {/* Close button */}
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <IconButton onClick={() => setMobileMenuOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider />
        {/* Mobile menu items */}
        <List>
          {isAuthenticated ? (
            <>
              {/* Admin-only menu items */}
              {user?.role === 'admin' && (
                <>
                  <ListItem 
                    button 
                    onClick={() => handleNavigate('/admin/add-vacation')}
                    selected={isActive('/admin/add-vacation')}
                  >
                    <ListItemIcon>
                      <AddIcon />
                    </ListItemIcon>
                    <ListItemText primary="Add Vacation" />
                  </ListItem>
                  <ListItem 
                    button 
                    onClick={() => handleNavigate('/admin/stats')}
                    selected={isActive('/admin/stats')}
                  >
                    <ListItemIcon>
                      <StatsIcon />
                    </ListItemIcon>
                    <ListItemText primary="Statistics" />
                  </ListItem>
                </>
              )}
              {/* Common user menu items */}
              <ListItem 
                button 
                onClick={() => handleNavigate('/vacations')}
                selected={isActive('/vacations')}
              >
                <ListItemIcon>
                  <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Vacations" />
              </ListItem>
              <Divider />
              <ListItem button onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItem>
            </>
          ) : (
            // Authentication menu items
            <>
              <ListItem 
                button 
                onClick={() => handleNavigate('/login')}
                selected={isActive('/login')}
              >
                <ListItemIcon>
                  <LoginIcon />
                </ListItemIcon>
                <ListItemText primary="Login" />
              </ListItem>
              <ListItem 
                button 
                onClick={() => handleNavigate('/register')}
                selected={isActive('/register')}
              >
                <ListItemIcon>
                  <RegisterIcon />
                </ListItemIcon>
                <ListItemText primary="Register" />
              </ListItem>
            </>
          )}
        </List>
      </Drawer>

      {/* Animation keyframes for logo */}
      <style>
        {`
          @keyframes float {
            0% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-5px);
            }
            100% {
              transform: translateY(0px);
            }
          }
        `}
      </style>
    </AppBar>
  );
};

export default Navbar; 
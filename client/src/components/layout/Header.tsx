/**
 * Header Component
 * 
 * Main application header with navigation and user menu
 * Features:
 * - Responsive design
 * - User menu
 * - Navigation links
 * - Logo
 * - Mobile menu toggle
 */

import React from 'react';
import { AppBar, Toolbar, IconButton, Typography, Box } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import UserMenu from './UserMenu';
import { useAppDispatch } from '../../hooks/redux';
import { toggleSidebar } from '../../store/slices/uiSlice';
import { headerStyle, toolbarStyle, logoStyle, menuButtonStyle } from '../../styles/layout';

const Header: React.FC = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();

  // Handle sidebar toggle
  const handleSidebarToggle = () => {
    dispatch(toggleSidebar());
  };

  return (
    <AppBar position="fixed" sx={headerStyle}>
      <Toolbar sx={toolbarStyle}>
        {/* Menu toggle button */}
        <IconButton
          color="inherit"
          aria-label="פתח תפריט"
          edge="start"
          onClick={handleSidebarToggle}
          sx={menuButtonStyle}
        >
          <MenuIcon />
        </IconButton>

        {/* Logo */}
        <Typography variant="h6" component="div" sx={logoStyle}>
          VacationVibe
        </Typography>

        {/* User menu */}
        <Box sx={{ marginRight: 'auto' }}>
          <UserMenu />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header; 
/**
 * User Menu Component
 * 
 * Displays navigation options and actions for the logged-in user
 * Features:
 * - Dropdown menu with user options
 * - Avatar with user's first name initial
 * - Profile navigation
 * - Admin panel access (admin only)
 * - Logout button
 * 
 * @component
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  IconButton, 
  Menu, 
  MenuItem, 
  ListItemIcon, 
  ListItemText,
  Avatar
} from '@mui/material';
import { 
  Logout as LogoutIcon,
  Person as PersonIcon,
  AdminPanelSettings as AdminIcon
} from '@mui/icons-material';
import { logout } from '../../store/slices/authSlice';
import { RootState } from '../../store';

/**
 * Props interface for UserMenu component
 */
export interface UserMenuProps {}

/**
 * UserMenu Component
 * 
 * Displays user menu with navigation options and actions
 * 
 * @returns React component
 */
const UserMenu: React.FC<UserMenuProps> = () => {
  // State for managing menu anchor element
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  /**
   * Opens the menu
   * @param event - Mouse event from clicking the avatar
   */
  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  /**
   * Closes the menu
   */
  const handleClose = () => {
    setAnchorEl(null);
  };

  /**
   * Handles user logout
   * - Dispatches logout action
   * - Closes menu
   * - Navigates to login page
   */
  const handleLogout = () => {
    dispatch(logout());
    handleClose();
    navigate('/login');
  };

  /**
   * Navigates to user profile page
   */
  const handleProfile = () => {
    handleClose();
    navigate('/profile');
  };

  /**
   * Navigates to admin dashboard
   */
  const handleAdmin = () => {
    handleClose();
    navigate('/admin');
  };

  return (
    <>
      <IconButton
        size="large"
        aria-label="account of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={handleMenu}
        color="inherit"
      >
        <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
          {user?.firstName?.charAt(0) || 'U'}
        </Avatar>
      </IconButton>
      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleProfile}>
          <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>פרופיל</ListItemText>
        </MenuItem>
        {user?.role === 'admin' && (
          <MenuItem onClick={handleAdmin}>
            <ListItemIcon>
              <AdminIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>ניהול</ListItemText>
          </MenuItem>
        )}
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>התנתק</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

export default UserMenu; 
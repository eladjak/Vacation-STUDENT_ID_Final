/**
 * Main Layout Components
 * 
 * Contains the main layout structure and footer component
 * Features:
 * - Responsive layout
 * - Error handling with snackbar
 * - Sticky footer
 * - Social media links
 * - Contact information
 */

import React from 'react';
import { Container, Box, Alert, Snackbar, Paper, Typography, IconButton, useTheme } from '@mui/material';
import { useAppSelector } from '../../hooks/redux';
import Navbar from './Navbar';
import { GitHub, LinkedIn, Email, Phone, Code } from '@mui/icons-material';

/**
 * Footer Component
 * 
 * Displays copyright information and social media links
 * Features:
 * - Responsive design
 * - Animated social icons
 * - Contact links
 * - Project repository link
 * 
 * @returns React component
 */
const Footer: React.FC = () => {
  const theme = useTheme();

  return (
    <Paper 
      component="footer" 
      square 
      variant="outlined"
      sx={{
        mt: 'auto',
        py: { xs: 2, sm: 3 },
        bgcolor: theme.palette.background.default,
        borderTop: `1px solid ${theme.palette.divider}`,
        borderBottom: 'none',
        borderLeft: 'none',
        borderRight: 'none'
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: { xs: 2, sm: 3 }
          }}
        >
          {/* Copyright text */}
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ 
              textAlign: { xs: 'center', sm: 'right' },
              order: { xs: 2, sm: 1 },
              fontSize: { xs: '0.875rem', sm: '1rem' }
            }}
          >
            © {new Date().getFullYear()} Built by Elad Yaakobovitch
          </Typography>
          
          {/* Social media links */}
          <Box 
            sx={{ 
              display: 'flex', 
              gap: { xs: 3, sm: 2 },
              order: { xs: 1, sm: 2 },
              flexWrap: 'wrap',
              justifyContent: 'center'
            }}
          >
            {/* GitHub link */}
            <IconButton
              href="https://github.com/eladjak"
              target="_blank"
              rel="noopener noreferrer"
              size={theme.breakpoints.down('sm') ? 'small' : 'medium'}
              sx={{
                color: theme.palette.text.secondary,
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  color: theme.palette.primary.main,
                  transform: 'translateY(-3px) scale(1.1)'
                }
              }}
            >
              <GitHub />
            </IconButton>
            {/* LinkedIn link */}
            <IconButton
              href="https://linkedin.com/in/eladyaakobovitchcodingdeveloper"
              target="_blank"
              rel="noopener noreferrer"
              size={theme.breakpoints.down('sm') ? 'small' : 'medium'}
              sx={{
                color: theme.palette.text.secondary,
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  color: theme.palette.primary.main,
                  transform: 'translateY(-3px) scale(1.1)'
                }
              }}
            >
              <LinkedIn />
            </IconButton>
            {/* Email link */}
            <IconButton
              href="mailto:eladhiteclearning@gmail.com"
              size={theme.breakpoints.down('sm') ? 'small' : 'medium'}
              sx={{
                color: theme.palette.text.secondary,
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  color: theme.palette.primary.main,
                  transform: 'translateY(-3px) scale(1.1)'
                }
              }}
            >
              <Email />
            </IconButton>
            {/* Phone link */}
            <IconButton
              href="tel:+972525427474"
              size={theme.breakpoints.down('sm') ? 'small' : 'medium'}
              sx={{
                color: theme.palette.text.secondary,
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  color: theme.palette.primary.main,
                  transform: 'translateY(-3px) scale(1.1)'
                }
              }}
            >
              <Phone />
            </IconButton>
            {/* Project repository link */}
            <IconButton
              href="https://github.com/eladjak/vacation-student-id-final"
              target="_blank"
              rel="noopener noreferrer"
              size={theme.breakpoints.down('sm') ? 'small' : 'medium'}
              sx={{
                color: theme.palette.text.secondary,
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  color: theme.palette.primary.main,
                  transform: 'translateY(-3px) scale(1.1)'
                }
              }}
            >
              <Code />
            </IconButton>
          </Box>
        </Box>
      </Container>
    </Paper>
  );
};

/**
 * Layout Component
 * 
 * Main layout wrapper for the application
 * Features:
 * - Responsive container
 * - Navigation bar
 * - Error snackbar
 * - Footer
 * 
 * @param props.children - Child components to render in the layout
 * @returns React component
 */
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Get error states from Redux store
  const { error: authError } = useAppSelector(state => state.auth);
  const { error: vacationsError } = useAppSelector(state => state.vacations);

  const error = authError || vacationsError;

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh',
      bgcolor: theme => theme.palette.background.default
    }}>
      <Navbar />
      {/* Main content container */}
      <Container component="main" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
        {children}
      </Container>
      <Footer />
      {/* Error snackbar */}
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
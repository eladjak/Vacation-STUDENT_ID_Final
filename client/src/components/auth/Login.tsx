/**
 * Login Component
 * 
 * A comprehensive login form component with validation and error handling
 * Features:
 * - Email and password validation
 * - Show/hide password toggle
 * - Error messages in Hebrew
 * - Loading state indication
 * - Responsive design
 * - Automatic navigation after successful login
 * - Form field tooltips
 * - RTL support
 * 
 * @component
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Container,
  Alert,
  CircularProgress,
  IconButton,
  InputAdornment,
  Tooltip,
} from '@mui/material';
import { Visibility, VisibilityOff, Info } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { loginStart, loginSuccess, loginFailure } from '../../store/slices/authSlice';
import { authService } from '../../services/auth.service';

/**
 * Validation schema for login form
 * Validates:
 * - Email format
 * - Password minimum length (6 characters)
 */
const validationSchema = yup.object({
  email: yup
    .string()
    .email('כתובת אימייל לא תקינה')
    .required('שדה חובה'),
  password: yup
    .string()
    .min(6, 'הסיסמה חייבת להכיל לפחות 6 תווים')
    .required('שדה חובה'),
});

/**
 * Interface for login form values
 */
interface LoginFormValues {
  email: string;
  password: string;
}

/**
 * Initial form values
 */
const initialValues: LoginFormValues = {
  email: '',
  password: '',
};

/**
 * Login Component Implementation
 * 
 * Handles user authentication through a form interface
 * Uses Material-UI components for styling and Redux for state management
 * 
 * @returns React component with login form
 */
const Login: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector(state => state.auth);
  const [values, setValues] = useState<LoginFormValues>(initialValues);
  const [errors, setErrors] = useState<Partial<LoginFormValues>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/vacations');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: undefined }));
    setErrorMessage(null);
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await validationSchema.validate(values, { abortEarly: false });
      
      dispatch(loginStart());
      console.log('Attempting login with:', { email: values.email, password: '********' });
      
      const response = await authService.login(values);
      console.log('Login successful');
      
      dispatch(loginSuccess(response));
      // הניווט יתבצע דרך ה-useEffect
    } catch (error) {
      console.error('Login error:', error);

      if (error instanceof yup.ValidationError) {
        const validationErrors: Partial<LoginFormValues> = {};
        error.inner.forEach(err => {
          if (err.path) {
            validationErrors[err.path as keyof LoginFormValues] = err.message;
          }
        });
        setErrors(validationErrors);
      } else {
        const message = error instanceof Error ? error.message : 'שגיאה בהתחברות';
        setErrorMessage(message === 'Invalid credentials' ? 'שם משתמש או סיסמה שגויים' : message);
        dispatch(loginFailure(message));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isAuthenticated) {
    return null;
  }

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            width: '100%',
            borderRadius: 2,
            backgroundColor: 'background.paper',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Typography 
            component="h1" 
            variant="h4" 
            align="center" 
            gutterBottom
            sx={{ 
              fontWeight: 'bold',
              color: 'primary.main',
              mb: 3
            }}
          >
            התחברות למערכת
          </Typography>

          {errorMessage && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 2,
                '& .MuiAlert-message': {
                  width: '100%',
                  textAlign: 'center'
                }
              }}
            >
              {errorMessage}
            </Alert>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <TextField
              fullWidth
              id="email"
              name="email"
              label="אימייל"
              value={values.email}
              onChange={handleChange}
              error={Boolean(errors.email)}
              helperText={errors.email}
              margin="normal"
              autoComplete="email"
              autoFocus
              disabled={isSubmitting}
              dir="rtl"
              InputProps={{
                sx: { 
                  borderRadius: 1,
                  backgroundColor: 'background.paper',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(0, 0, 0, 0.23)',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(0, 0, 0, 0.87)',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'primary.main',
                  }
                },
                endAdornment: (
                  <InputAdornment position="end">
                    <Tooltip title="הזן את כתובת האימייל שלך">
                      <Info color="action" fontSize="small" />
                    </Tooltip>
                  </InputAdornment>
                )
              }}
              InputLabelProps={{
                sx: {
                  right: 14,
                  left: 'auto',
                  transformOrigin: 'right',
                  '&.MuiInputLabel-shrink': {
                    transform: 'translate(0, -9px) scale(0.75)',
                  }
                }
              }}
            />
            <TextField
              fullWidth
              id="password"
              name="password"
              label="סיסמה"
              type={showPassword ? 'text' : 'password'}
              value={values.password}
              onChange={handleChange}
              error={Boolean(errors.password)}
              helperText={errors.password}
              margin="normal"
              autoComplete="current-password"
              disabled={isSubmitting}
              dir="rtl"
              InputProps={{
                sx: { 
                  borderRadius: 1,
                  backgroundColor: 'background.paper',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(0, 0, 0, 0.23)',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(0, 0, 0, 0.87)',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'primary.main',
                  }
                },
                startAdornment: (
                  <InputAdornment position="start">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="start"
                      sx={{
                        color: 'action.active',
                        '&:hover': {
                          color: 'primary.main',
                        }
                      }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <Tooltip title="הסיסמה היא: 123456">
                      <Info color="action" fontSize="small" />
                    </Tooltip>
                  </InputAdornment>
                )
              }}
              InputLabelProps={{
                sx: {
                  right: 14,
                  left: 'auto',
                  transformOrigin: 'right',
                  '&.MuiInputLabel-shrink': {
                    transform: 'translate(0, -9px) scale(0.75)',
                  }
                }
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isSubmitting}
              sx={{ 
                mt: 3, 
                mb: 2,
                height: 48,
                borderRadius: 1,
                fontSize: '1.1rem',
                fontWeight: 'bold',
                '&:hover': {
                  transform: 'translateY(-1px)',
                  boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)',
                },
                '&:active': {
                  transform: 'translateY(0)',
                },
              }}
            >
              {isSubmitting ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'התחבר'
              )}
            </Button>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login; 
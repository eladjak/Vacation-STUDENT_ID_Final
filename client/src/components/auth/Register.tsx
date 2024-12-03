import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, FormikHelpers } from 'formik';
import * as yup from 'yup';
import { useAppDispatch } from '../../hooks/redux';
import { Box, Button, TextField, Typography, Paper, Container } from '@mui/material';
import axios from 'axios';
import { loginSuccess } from '../../store/slices/authSlice';

const validationSchema = yup.object({
  firstName: yup
    .string()
    .required('שדה חובה'),
  lastName: yup
    .string()
    .required('שדה חובה'),
  email: yup
    .string()
    .email('כתובת אימייל לא תקינה')
    .required('שדה חובה'),
  password: yup
    .string()
    .min(6, 'הסיסמה חייבת להכיל לפחות 6 תווים')
    .required('שדה חובה'),
});

interface RegisterFormValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

const initialValues: RegisterFormValues = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
};

const Register: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (
    values: RegisterFormValues,
    { setSubmitting }: FormikHelpers<RegisterFormValues>
  ) => {
    try {
      const response = await axios.post('http://localhost:3001/api/v1/auth/register', values);
      dispatch(loginSuccess(response.data));
      navigate('/');
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setSubmitting(false);
    }
  };

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
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Typography component="h1" variant="h5" align="center" gutterBottom>
            הרשמה
          </Typography>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
              <Form>
                <TextField
                  fullWidth
                  id="firstName"
                  name="firstName"
                  label="שם פרטי"
                  value={values.firstName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.firstName && Boolean(errors.firstName)}
                  helperText={touched.firstName && errors.firstName}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  id="lastName"
                  name="lastName"
                  label="שם משפחה"
                  value={values.lastName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.lastName && Boolean(errors.lastName)}
                  helperText={touched.lastName && errors.lastName}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  id="email"
                  name="email"
                  label="אימייל"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.email && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  id="password"
                  name="password"
                  label="סיסמה"
                  type="password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.password && Boolean(errors.password)}
                  helperText={touched.password && errors.password}
                  margin="normal"
                />
                <Button
                  color="primary"
                  variant="contained"
                  fullWidth
                  type="submit"
                  disabled={isSubmitting}
                  sx={{ mt: 3, mb: 2 }}
                >
                  הירשם
                </Button>
              </Form>
            )}
          </Formik>
        </Paper>
      </Box>
    </Container>
  );
};

export default Register; 
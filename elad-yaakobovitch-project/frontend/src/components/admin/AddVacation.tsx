import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Alert,
  Paper,
  Input,
  FormHelperText
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAppDispatch } from '../../hooks/redux';
import { createVacation } from '../../store/slices/vacationSlice';

interface VacationFormValues {
  destination: string;
  description: string;
  startDate: Date | null;
  endDate: Date | null;
  price: string;
  image: File | null;
}

const validationSchema = Yup.object({
  destination: Yup.string().required('יש להזין יעד'),
  description: Yup.string().required('יש להזין תיאור'),
  startDate: Yup.date().required('יש להזין תאריך התחלה'),
  endDate: Yup.date()
    .required('יש להזין תאריך סיום')
    .min(Yup.ref('startDate'), 'תאריך הסיום חייב להיות אחרי תאריך ההתחלה'),
  price: Yup.string()
    .required('יש להזין מחיר')
    .matches(/^\d+$/, 'המחיר חייב להיות מספר חיובי'),
  image: Yup.mixed()
    .required('יש לבחור תמונה')
    .test('fileFormat', 'פורמט קובץ לא נתמך. יש להשתמש בתמונות מסוג JPG, PNG או GIF', (value: any) => {
      if (!value) return true;
      const supportedFormats = ['image/jpeg', 'image/png', 'image/gif'];
      return value instanceof File && supportedFormats.includes(value.type);
    })
    .test('fileSize', 'גודל הקובץ חייב להיות עד 5MB', (value: any) => {
      if (!value) return true;
      return value instanceof File && value.size <= 5 * 1024 * 1024; // 5MB
    }),
});

const AddVacation: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const formik = useFormik<VacationFormValues>({
    initialValues: {
      destination: '',
      description: '',
      startDate: null,
      endDate: null,
      price: '',
      image: null,
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setError(null);
        const formData = new FormData();
        formData.append('destination', values.destination);
        formData.append('description', values.description);
        if (values.startDate) {
          formData.append('startDate', values.startDate.toISOString());
        }
        if (values.endDate) {
          formData.append('endDate', values.endDate.toISOString());
        }
        formData.append('price', values.price);
        if (values.image) {
          formData.append('image', values.image);
        }

        await dispatch(createVacation(formData)).unwrap();
        navigate('/');
      } catch (err) {
        console.error('Error creating vacation:', err);
        setError(err instanceof Error ? err.message : 'שגיאה בהוספת החופשה');
      }
    },
  });

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    if (file) {
      formik.setFieldValue('image', file);
      
      // Create image preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h5" component="h1" gutterBottom align="center">
          הוספת חופשה חדשה
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={formik.handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              id="destination"
              name="destination"
              label="יעד"
              value={formik.values.destination}
              onChange={formik.handleChange}
              error={formik.touched.destination && Boolean(formik.errors.destination)}
              helperText={formik.touched.destination && formik.errors.destination}
            />

            <TextField
              fullWidth
              id="description"
              name="description"
              label="תיאור"
              multiline
              rows={4}
              value={formik.values.description}
              onChange={formik.handleChange}
              error={formik.touched.description && Boolean(formik.errors.description)}
              helperText={formik.touched.description && formik.errors.description}
            />

            <DatePicker
              label="תאריך התחלה"
              value={formik.values.startDate}
              onChange={(value) => formik.setFieldValue('startDate', value)}
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: formik.touched.startDate && Boolean(formik.errors.startDate),
                  helperText: formik.touched.startDate && formik.errors.startDate as string,
                },
              }}
            />

            <DatePicker
              label="תאריך סיום"
              value={formik.values.endDate}
              onChange={(value) => formik.setFieldValue('endDate', value)}
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: formik.touched.endDate && Boolean(formik.errors.endDate),
                  helperText: formik.touched.endDate && formik.errors.endDate as string,
                },
              }}
            />

            <TextField
              fullWidth
              id="price"
              name="price"
              label="מחיר"
              type="number"
              value={formik.values.price}
              onChange={formik.handleChange}
              error={formik.touched.price && Boolean(formik.errors.price)}
              helperText={formik.touched.price && formik.errors.price}
              InputProps={{
                startAdornment: '₪',
              }}
            />

            <Box>
              <Input
                type="file"
                id="image"
                name="image"
                onChange={handleImageChange}
                sx={{ display: 'none' }}
                inputProps={{
                  accept: 'image/jpeg,image/png,image/gif',
                }}
              />
              <Button
                variant="outlined"
                component="label"
                htmlFor="image"
                fullWidth
              >
                בחר תמונה
              </Button>
              <FormHelperText error={formik.touched.image && Boolean(formik.errors.image)}>
                {formik.touched.image && formik.errors.image as string}
              </FormHelperText>
              <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                פורמטים נתמכים: JPG, PNG, GIF. גודל מקסימלי: 5MB
              </Typography>
            </Box>

            {imagePreview && (
              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <img
                  src={imagePreview}
                  alt="תצוגה מקדימה"
                  style={{ maxWidth: '100%', maxHeight: '200px' }}
                />
              </Box>
            )}

            <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={formik.isSubmitting}
              >
                הוסף חופשה
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                fullWidth
                onClick={() => navigate('/')}
              >
                ביטול
              </Button>
            </Box>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default AddVacation;
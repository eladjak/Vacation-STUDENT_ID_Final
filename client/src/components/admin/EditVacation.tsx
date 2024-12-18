/**
 * EditVacation Component
 * 
 * Admin component for editing existing vacation packages
 * Features:
 * - Pre-filled form with existing vacation data
 * - Image upload with preview and current image display
 * - Date range selection with validation
 * - Price input with validation
 * - Rich text description editor
 * - Form validation
 * - Error handling
 * - Loading state indication
 * - Responsive design
 * - RTL support
 * - Optimistic updates
 * 
 * @component
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useParams, useBlocker } from 'react-router-dom';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Card,
  CardMedia,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Paper,
  Alert,
  CircularProgress
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { he } from 'date-fns/locale';
import { 
  addDays, 
  differenceInDays, 
  isBefore, 
  startOfDay,
} from 'date-fns';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { vacationService } from '../../services/vacation.service';
import { Vacation, VacationFormValues, BlockerFunction } from '../../types';

const MIN_VACATION_DAYS = 2;
const MAX_VACATION_DAYS = 30;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

/**
 * Interface for vacation form values in edit mode
 */
interface EditVacationFormValues {
  destination: string;
  description: string;
  startDate: Date | null;
  endDate: Date | null;
  price: number;
  image: File | null;
}

/**
 * Validation schema for vacation editing
 * Validates:
 * - Required destination
 * - Required description
 * - Valid date range
 * - Positive price value
 * - Optional image upload with size and format restrictions
 */
const validationSchema = yup.object({
  destination: yup
    .string()
    .required('שדה חובה')
    .min(2, 'יעד חייב להכיל לפחות 2 תווים')
    .max(100, 'יעד לא יכול להכיל יותר מ-100 תווים'),
  description: yup
    .string()
    .required('שדה חובה')
    .min(10, 'תיאור חייב להכיל לפחות 10 תווים')
    .max(1000, 'תיאור לא יכול להכיל יותר מ-1000 תווים'),
  startDate: yup
    .date()
    .required('שדה חובה')
    .min(startOfDay(new Date()), 'תאריך התחלה חייב להיות בעתיד')
    .test('not-too-far', 'תאריך התחלה לא יכול להית יותר משנה מהיום',
      value => !value || isBefore(value, addDays(new Date(), 365))),
  endDate: yup
    .date()
    .required('שדה חובה')
    .min(
      yup.ref('startDate'),
      'תאריך סיום חייב להיות אחרי תאריך התחלה'
    )
    .test('duration', 'משך החופשה חייב להיות בין 2 ל-30 ימים', function(value) {
      const { startDate } = this.parent;
      if (!startDate || !value) return true;
      const duration = differenceInDays(value, startDate);
      return duration >= MIN_VACATION_DAYS && duration <= MAX_VACATION_DAYS;
    }),
  price: yup
    .number()
    .required('שדה חובה')
    .min(0, 'מחיר לא יכול להיות שלילי')
    .max(50000, 'מחיר לא יכול לעלות על 50,000'),
  image: yup
    .mixed<File>()
    .nullable()
    .test('fileSize', 'גודל הקובץ חייב להיות עד 5MB', (value?: File | null) => 
      !value || value.size <= MAX_FILE_SIZE
    )
    .test('fileType', 'רק קבצי תמונה מותרים', (value?: File | null) =>
      !value || ['image/jpeg', 'image/png', 'image/gif'].includes(value.type)
    )
});

const AUTOSAVE_DELAY = 3000; // 3 seconds

const RequiredLabel: React.FC<{ text: string }> = ({ text }) => (
  <Box component="span" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
    {text}
    <Box component="span" sx={{ color: 'error.main', ml: 0.5 }}>*</Box>
  </Box>
);

/**
 * EditVacation Component Implementation
 * 
 * Provides an interface for administrators to modify existing vacation packages
 * Uses Material-UI components for styling and form management
 * 
 * @returns React component with vacation editing form
 */
const EditVacation: React.FC = (): React.ReactElement => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [originalVacation, setOriginalVacation] = useState<Vacation | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);
  const [nextLocation, setNextLocation] = useState<string | null>(null);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout>();
  const lastAutoSaveRef = useRef<number>(0);
  const [initialFormValues, setInitialFormValues] = useState<EditVacationFormValues>({
    destination: '',
    description: '',
    startDate: null,
    endDate: null,
    price: 0,
    image: null
  });

  const handleError = useCallback((error: unknown): void => {
    console.error('Error:', error);
    if (error instanceof Error) {
      if (error.message.includes('Network Error')) {
        setError('שגיאת תקשורת. אנא בדוק את החיבור לאינטרנט.');
      } else if (error.message.includes('401')) {
        setError('אין הרשאה. אנא התחבר מחדש.');
        navigate('/login');
      } else if (error.message.includes('413')) {
        setError('הקובץ גדול מדי. אנא בחר קובץ קטן יותר.');
      } else if (error.message.includes('404')) {
        setError('החופשה לא נמצאה.');
        navigate('/vacations');
      } else {
        setError(error.message);
      }
    } else {
      setError('שגיאה לא צפויה. אנא נסה שוב.');
    }
  }, [navigate]);

  const handleSubmit = useCallback(async (values: EditVacationFormValues, formikHelpers: FormikHelpers<EditVacationFormValues>): Promise<void> => {
    try {
      setSubmitting(true);
      setError(null);

      if (!id) {
        setError('מזהה חופשה חסר');
        return;
      }

      const formData = new FormData();
      formData.append('destination', values.destination);
      formData.append('description', values.description);
      formData.append('startDate', values.startDate?.toISOString().split('T')[0] || '');
      formData.append('endDate', values.endDate?.toISOString().split('T')[0] || '');
      formData.append('price', values.price.toString());

      if (values.image) {
        formData.append('image', values.image);
      }

      await vacationService.update(Number(id), formData);
      setError(null);
      setLastSaved(new Date());
      
      if (!isAutoSaving) {
        navigate('/vacations');
      }
    } catch (error) {
      handleError(error);
    } finally {
      setSubmitting(false);
      setIsAutoSaving(false);
    }
  }, [id, navigate, isAutoSaving, handleError]);

  const formik = useFormik<EditVacationFormValues>({
    initialValues: initialFormValues,
    validationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true
  });

  useEffect(() => {
    const loadVacation = async (): Promise<void> => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);
        const vacation = await vacationService.getById(Number(id));
        
        if (!vacation) {
          setError('החופשה לא נמצאה');
          navigate('/admin/vacations');
          return;
        }
        
        setOriginalVacation(vacation);
        
        setInitialFormValues({
          destination: vacation.destination,
          description: vacation.description,
          startDate: new Date(vacation.startDate),
          endDate: new Date(vacation.endDate),
          price: vacation.price,
          image: null
        });

        if (vacation.imageUrl) {
          setImagePreview(vacation.imageUrl);
        }
      } catch (error) {
        handleError(error);
      } finally {
        setLoading(false);
      }
    };

    loadVacation();
  }, [id, navigate, handleError]);

  useEffect(() => {
    const handleAutoSave = (): void => {
      if (formik.dirty && !submitting && formik.isValid) {
        const now = Date.now();
        if (now - lastAutoSaveRef.current >= AUTOSAVE_DELAY) {
          if (autoSaveTimeoutRef.current) {
            clearTimeout(autoSaveTimeoutRef.current);
          }
          
          autoSaveTimeoutRef.current = setTimeout(() => {
            setIsAutoSaving(true);
            formik.submitForm();
          }, AUTOSAVE_DELAY);
        }
      }
    };

    handleAutoSave();

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [formik, submitting]);

  const handleBeforeUnload = useCallback((e: BeforeUnloadEvent): void => {
    if (formik.dirty && !submitting) {
      e.preventDefault();
      e.returnValue = '';
    }
  }, [formik, submitting]);

  useEffect(() => {
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [handleBeforeUnload]);

  const blocker = useBlocker(
    useCallback(
      ({ currentLocation, nextLocation }: BlockerFunction): boolean => {
        return formik.dirty && !submitting;
      },
      [formik.dirty, submitting]
    )
  );

  useEffect(() => {
    if (blocker.state === 'blocked') {
      setShowLeaveDialog(true);
      setNextLocation(blocker.location?.pathname || null);
    }
  }, [blocker]);

  const handleLeave = (): void => {
    setShowLeaveDialog(false);
    if (nextLocation) {
      navigate(nextLocation);
    }
  };

  const handleStay = (): void => {
    setShowLeaveDialog(false);
    setNextLocation(null);
  };

  const handleReset = (): void => {
    if (originalVacation) {
      formik.resetForm({
        values: {
          destination: originalVacation.destination,
          description: originalVacation.description,
          startDate: new Date(originalVacation.startDate),
          endDate: new Date(originalVacation.endDate),
          price: originalVacation.price,
          image: null
        }
      });
      setShowResetDialog(false);
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0] || null;
    formik.setFieldValue('image', file);
    
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Box display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" component="h1">
            עריכת חופשה
          </Typography>
          {lastSaved && (
            <Typography variant="body2" color="text.secondary">
              נשמר לאחרונה: {new Date(lastSaved).toLocaleTimeString()}
            </Typography>
          )}
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={formik.handleSubmit}>
          <Box sx={{ mb: 3 }}>
            <RequiredLabel text="יעד" />
            <TextField
              fullWidth
              name="destination"
              value={formik.values.destination}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.destination && Boolean(formik.errors.destination)}
              helperText={formik.touched.destination && formik.errors.destination}
              placeholder="לדוגמה: אילת, ישראל"
            />
          </Box>

          <Box sx={{ mb: 3 }}>
            <RequiredLabel text="תיאור" />
            <TextField
              fullWidth
              multiline
              rows={4}
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.description && Boolean(formik.errors.description)}
              helperText={formik.touched.description && formik.errors.description}
              placeholder="תאר את החופשה..."
            />
          </Box>

          <Box sx={{ mb: 3 }}>
            <RequiredLabel text="תאריך התחלה" />
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={he}>
              <DatePicker
                value={formik.values.startDate}
                onChange={(date) => formik.setFieldValue('startDate', date)}
                format="dd/MM/yyyy"
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: formik.touched.startDate && Boolean(formik.errors.startDate),
                    helperText: formik.touched.startDate && (formik.errors.startDate as string)
                  }
                }}
              />
            </LocalizationProvider>
          </Box>

          <Box sx={{ mb: 3 }}>
            <RequiredLabel text="תאריך סיום" />
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={he}>
              <DatePicker
                value={formik.values.endDate}
                onChange={(date) => formik.setFieldValue('endDate', date)}
                format="dd/MM/yyyy"
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: formik.touched.endDate && Boolean(formik.errors.endDate),
                    helperText: formik.touched.endDate && (formik.errors.endDate as string)
                  }
                }}
              />
            </LocalizationProvider>
          </Box>

          <Box sx={{ mb: 3 }}>
            <RequiredLabel text="מחיר" />
            <TextField
              fullWidth
              type="number"
              name="price"
              value={formik.values.price}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.price && Boolean(formik.errors.price)}
              helperText={formik.touched.price && formik.errors.price}
              inputProps={{ step: '0.01' }}
            />
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              תמונה
            </Typography>
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="image-file"
              type="file"
              onChange={handleImageChange}
            />
            <label htmlFor="image-file">
              <Button variant="contained" component="span">
                בחר תמונה
              </Button>
            </label>
            {formik.errors.image && (
              <Typography color="error" variant="caption" display="block" sx={{ mt: 1 }}>
                {formik.errors.image}
              </Typography>
            )}
            {imagePreview && (
              <Box sx={{ mt: 2 }}>
                <Card>
                  <CardMedia
                    component="img"
                    image={imagePreview}
                    alt="תצוגה מקדימה"
                    sx={{ height: 200, objectFit: 'cover' }}
                  />
                </Card>
              </Box>
            )}
          </Box>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button
              type="button"
              color="inherit"
              onClick={() => setShowResetDialog(true)}
              startIcon={<RestartAltIcon />}
            >
              אפס שינויים
            </Button>
            <Button
              type="button"
              color="inherit"
              onClick={() => navigate('/vacations')}
              startIcon={<CancelIcon />}
            >
              ביטול
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={!formik.dirty || !formik.isValid || submitting}
              startIcon={<SaveIcon />}
            >
              שמור
            </Button>
          </Box>
        </form>

        {submitting && <LinearProgress sx={{ mt: 2 }} />}

        <Dialog open={showLeaveDialog} onClose={handleStay}>
          <DialogTitle>עזיבת העמוד</DialogTitle>
          <DialogContent>
            <DialogContentText>
              יש לך שינויים שלא נשמרו. האם אתה בטוח שברצונך לעזוב?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleStay}>הישאר</Button>
            <Button onClick={handleLeave} color="error">
              עזוב
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={showResetDialog} onClose={() => setShowResetDialog(false)}>
          <DialogTitle>אפס שינויים?</DialogTitle>
          <DialogContent>
            <Typography>
              האם אתה בטוח שברצונך לאפס את כל השינויים שביצעת?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowResetDialog(false)}>ביטול</Button>
            <Button onClick={handleReset} color="error">
              אפס שינויים
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Container>
  );
};

export default EditVacation; 
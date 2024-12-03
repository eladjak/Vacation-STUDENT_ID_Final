import React, { useEffect, useCallback, useState, useRef } from 'react';
import { useNavigate, useParams, useBlocker } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Container,
  CircularProgress,
  Alert,
  Snackbar,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardMedia,
  Fade,
  Grow,
  Tooltip,
  IconButton,
  Badge,
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
  isSameDay 
} from 'date-fns';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { vacationService } from '../../services/vacation.service';
import { Vacation } from '../../types';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif'];
const MIN_VACATION_DAYS = 1;
const MAX_VACATION_DAYS = 30;
const AUTOSAVE_DELAY = 3000; // 3 seconds

const RequiredLabel: React.FC<{ text: string }> = ({ text }) => (
  <Box component="span" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
    {text}
    <Box component="span" sx={{ color: 'error.main', ml: 0.5 }}>*</Box>
  </Box>
);

const validationSchema = yup.object({
  destination: yup
    .string()
    .required('שדה חובה')
    .min(2, 'היעד חייב להכיל לפחות 2 תווים')
    .max(100, 'היעד חייב להכיל פחות מ-100 תווים')
    .matches(/^[\u0590-\u05FF\s0-9,.'-]+$/, 'יש להזין טקסט בעברית בלבד'),
  description: yup
    .string()
    .required('שדה חובה')
    .min(10, 'התיאור חייב להכיל לפחות 10 תווים')
    .max(1000, 'התיאור חייב להכיל פחות מ-1000 תווים')
    .matches(/^[\u0590-\u05FF\s0-9,.'-]+$/, 'יש להזין טקסט בעברית בלבד'),
  startDate: yup
    .date()
    .required('שדה חובה')
    .min(startOfDay(new Date()), 'תאריך התחלה חייב להיות בעתיד')
    .test('not-too-far', 'תאריך התחלה לא יכול להיות יותר משנה מהיום', 
      value => !value || isBefore(value, addDays(new Date(), 365))),
  endDate: yup
    .date()
    .required('שדה חובה')
    .min(yup.ref('startDate'), 'תאריך סיום חייב להיות אחרי תאריך התחלה')
    .test('valid-duration', 
      `משך החופשה חייב להיות בין ${MIN_VACATION_DAYS} ל-${MAX_VACATION_DAYS} ימים`,
      function(value) {
        const { startDate } = this.parent;
        if (!startDate || !value) return true;
        const duration = differenceInDays(value, startDate);
        return duration >= MIN_VACATION_DAYS && duration <= MAX_VACATION_DAYS;
      }),
  price: yup
    .number()
    .required('שדה חובה')
    .min(0, 'המחיר חייב להיות חיובי')
    .max(100000, 'המחיר חייב להיות פחות מ-100,000')
    .test('is-decimal', 'המחיר יכול לכלול עד 2 ספרות אחרי הנקודה', 
      value => !value || Number.isInteger(value * 100)),
  image: yup
    .mixed<File>()
    .nullable()
    .test('fileSize', 'גודל הקובץ חייב להיות פחות מ-5MB', (value: File | null | undefined) => {
      if (!value) return true;
      return value.size <= MAX_FILE_SIZE;
    })
    .test('fileType', 'מותר להעלות רק תמונות מסוג JPEG, PNG או GIF', (value: File | null | undefined) => {
      if (!value) return true;
      return ALLOWED_IMAGE_TYPES.includes(value.type);
    })
});

interface VacationFormValues {
  destination: string;
  description: string;
  startDate: Date;
  endDate: Date;
  price: number;
  image: File | null;
}

const initialValues: VacationFormValues = {
  destination: '',
  description: '',
  startDate: new Date(),
  endDate: new Date(),
  price: 0,
  image: null,
};

const EditVacation: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [vacation, setVacation] = useState<Vacation | null>(null);
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [nextLocation, setNextLocation] = useState<string | null>(null);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout>();

  const handleError = useCallback((error: unknown) => {
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
        navigate('/admin/vacations');
      } else {
        setError(error.message);
      }
    } else {
      setError('שגיאה לא צפויה. אנא נסה שוב.');
    }
  }, [navigate]);

  const handleSubmit = useCallback(async (values: VacationFormValues, { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }) => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      const formData = new FormData();
      formData.append('destination', values.destination.trim());
      formData.append('description', values.description.trim());
      formData.append('startDate', values.startDate.toISOString());
      formData.append('endDate', values.endDate.toISOString());
      formData.append('price', values.price.toString());
      
      if (values.image) {
        formData.append('image', values.image);
      }

      await vacationService.update(Number(id), formData);
      setLastSaved(new Date());
      
      if (!isAutoSaving) {
        navigate('/admin/vacations', { 
          state: { message: 'החופשה עודכנה בהצלחה' }
        });
      }
    } catch (error) {
      handleError(error);
    } finally {
      setIsSubmitting(false);
      setSubmitting(false);
      setIsAutoSaving(false);
    }
  }, [id, navigate, isAutoSaving, handleError]);

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: handleSubmit
  });

  // Auto-save functionality
  useEffect(() => {
    if (formik.dirty && !isSubmitting) {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
      
      autoSaveTimeoutRef.current = setTimeout(() => {
        if (formik.dirty && formik.isValid) {
          setIsAutoSaving(true);
          formik.submitForm();
        }
      }, AUTOSAVE_DELAY);
    }

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [formik, isSubmitting]);

  const handleBeforeUnload = useCallback((e: BeforeUnloadEvent) => {
    if (formik.dirty && !formik.isSubmitting) {
      e.preventDefault();
      e.returnValue = '';
    }
  }, [formik.dirty, formik.isSubmitting]);

  useEffect(() => {
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [handleBeforeUnload]);

  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      formik.dirty &&
      !formik.isSubmitting &&
      currentLocation.pathname !== nextLocation.pathname
  );

  useEffect(() => {
    if (blocker.state === "blocked") {
      setShowLeaveDialog(true);
      setNextLocation(blocker.location?.pathname || null);
    }
  }, [blocker]);

  const handleConfirmNavigation = useCallback(() => {
    setShowLeaveDialog(false);
    if (blocker.state === "blocked" && nextLocation) {
      blocker.proceed?.();
    }
  }, [blocker, nextLocation]);

  const handleCancelNavigation = useCallback(() => {
    setShowLeaveDialog(false);
    setNextLocation(null);
    if (blocker.state === "blocked") {
      blocker.reset?.();
    }
  }, [blocker]);

  const setFieldValue = useCallback(
    (field: string, value: any) => {
      formik.setFieldValue(field, value);
    },
    [formik]
  );

  const fetchVacation = useCallback(async () => {
    if (!id) {
      navigate('/admin/vacations');
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      const fetchedVacation = await vacationService.getById(Number(id));
      setVacation(fetchedVacation);
      
      formik.setValues({
        destination: fetchedVacation.destination,
        description: fetchedVacation.description,
        startDate: new Date(fetchedVacation.startDate),
        endDate: new Date(fetchedVacation.endDate),
        price: fetchedVacation.price,
        image: null,
      });
    } catch (error) {
      console.error('Error fetching vacation:', error);
      setError('שגיאה בטעינת החופשה. אנא נסה לטעון מחדש.');
      navigate('/admin/vacations');
    } finally {
      setIsLoading(false);
    }
  }, [id, formik, navigate]);

  useEffect(() => {
    fetchVacation();
  }, [fetchVacation]);

  const handleImageChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.currentTarget.files && event.currentTarget.files[0]) {
      const file = event.currentTarget.files[0];
      if (file.size > MAX_FILE_SIZE) {
        setError('גודל הקובץ חייב להיות פחות מ-5MB');
        event.target.value = ''; // Reset file input
        return;
      }
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        setError('מותר להעלות רק תמונות מסוג JPEG, PNG או GIF');
        event.target.value = ''; // Reset file input
        return;
      }
      setFieldValue('image', file);
      
      // Create image preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, [setFieldValue, setError]);

  const handleStartDateChange = useCallback((date: Date | null) => {
    if (date) {
      setFieldValue('startDate', date);
    }
  }, [setFieldValue]);

  const handleEndDateChange = useCallback((date: Date | null) => {
    if (date) {
      setFieldValue('endDate', date);
    }
  }, [setFieldValue]);

  const handleCloseError = useCallback(() => {
    setError(null);
  }, []);

  const getChangedFields = useCallback(() => {
    if (!vacation) return [];
    const changes: string[] = [];
    
    if (formik.values.destination !== vacation.destination) changes.push('יעד');
    if (formik.values.description !== vacation.description) changes.push('תיאור');
    if (!isSameDay(formik.values.startDate, new Date(vacation.startDate))) changes.push('תאריך התחלה');
    if (!isSameDay(formik.values.endDate, new Date(vacation.endDate))) changes.push('תאריך סיום');
    if (formik.values.price !== vacation.price) changes.push('מחיר');
    if (formik.values.image) changes.push('תמונה');
    
    return changes;
  }, [formik.values, vacation]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault();
        if (!isSubmitting && formik.isValid && formik.dirty) {
          formik.submitForm();
        }
      } else if ((event.ctrlKey || event.metaKey) && event.key === 'z') {
        event.preventDefault();
        if (formik.dirty) {
          setShowResetDialog(true);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [formik, isSubmitting]);

  const handleReset = useCallback(() => {
    setShowResetDialog(false);
    formik.resetForm();
    setImagePreview(null);
  }, [formik]);

  const handleCancelReset = useCallback(() => {
    setShowResetDialog(false);
  }, []);

  if (isLoading) {
    return (
      <Container maxWidth="sm">
        <Fade in timeout={300}>
          <Box sx={{ mt: 4 }}>
            <LinearProgress />
            <Typography align="center" sx={{ mt: 2 }}>
              טוען נתוני חופשה...
            </Typography>
          </Box>
        </Fade>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Grow in timeout={500}>
        <Box sx={{ mt: 4 }}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5" component="h1">
                עריכת חופשה: {vacation?.destination}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                {formik.dirty && (
                  <>
                    <Tooltip title={`שמירה (Ctrl/⌘ + S)${lastSaved ? `\nנשמר לאחרונה: ${lastSaved.toLocaleTimeString()}` : ''}`}>
                      <span>
                        <IconButton
                          color="primary"
                          onClick={() => formik.submitForm()}
                          disabled={isSubmitting || !formik.isValid}
                          size="small"
                        >
                          <Badge 
                            color="success" 
                            variant="dot" 
                            invisible={!isAutoSaving}
                          >
                            <SaveIcon />
                          </Badge>
                        </IconButton>
                      </span>
                    </Tooltip>
                    <Tooltip title="ביטול שינויים (Ctrl/⌘ + Z)">
                      <IconButton
                        color="error"
                        onClick={() => setShowResetDialog(true)}
                        disabled={isSubmitting}
                        size="small"
                      >
                        <RestartAltIcon />
                      </IconButton>
                    </Tooltip>
                  </>
                )}
                <Tooltip title="חזרה לרשימת החופשות">
                  <IconButton
                    color="default"
                    onClick={handleCancelNavigation}
                    disabled={isSubmitting}
                    size="small"
                  >
                    <CancelIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
            
            {(imagePreview || vacation?.imageUrl) && (
              <Fade in timeout={300}>
                <Card sx={{ mb: 3, position: 'relative' }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={imagePreview || vacation?.imageUrl}
                    alt={formik.values.destination}
                    sx={{ objectFit: 'cover' }}
                  />
                  {formik.values.image && (
                    <Box 
                      sx={{ 
                        position: 'absolute', 
                        top: 8, 
                        right: 8, 
                        bgcolor: 'rgba(0, 0, 0, 0.6)',
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: 1,
                        fontSize: '0.875rem'
                      }}
                    >
                      תמונה חדשה
                    </Box>
                  )}
                </Card>
              </Fade>
            )}

            <form onSubmit={formik.handleSubmit}>
              <Box sx={{ mb: 2 }}>
                <RequiredLabel text="יעד" />
                <TextField
                  fullWidth
                  id="destination"
                  name="destination"
                  value={formik.values.destination}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.destination && Boolean(formik.errors.destination)}
                  helperText={formik.touched.destination && formik.errors.destination}
                  disabled={isSubmitting}
                />
              </Box>

              <Box sx={{ mb: 2 }}>
                <RequiredLabel text="תיאור" />
                <TextField
                  fullWidth
                  id="description"
                  name="description"
                  multiline
                  rows={4}
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.description && Boolean(formik.errors.description)}
                  helperText={formik.touched.description && formik.errors.description}
                  disabled={isSubmitting}
                />
              </Box>

              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={he}>
                <Box sx={{ mb: 2 }}>
                  <RequiredLabel text="תאריך התחלה" />
                  <DatePicker
                    value={formik.values.startDate}
                    onChange={handleStartDateChange}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: formik.touched.startDate && Boolean(formik.errors.startDate),
                        helperText: formik.touched.startDate && (formik.errors.startDate as string),
                        disabled: isSubmitting,
                      },
                    }}
                  />
                </Box>

                <Box sx={{ mb: 2 }}>
                  <RequiredLabel text="תאריך סיום" />
                  <DatePicker
                    value={formik.values.endDate}
                    onChange={handleEndDateChange}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: formik.touched.endDate && Boolean(formik.errors.endDate),
                        helperText: formik.touched.endDate && (formik.errors.endDate as string),
                        disabled: isSubmitting,
                      },
                    }}
                  />
                </Box>
              </LocalizationProvider>

              <Box sx={{ mb: 2 }}>
                <RequiredLabel text="מחיר" />
                <TextField
                  fullWidth
                  id="price"
                  name="price"
                  type="number"
                  value={formik.values.price}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.price && Boolean(formik.errors.price)}
                  helperText={formik.touched.price && formik.errors.price}
                  disabled={isSubmitting}
                  InputProps={{
                    inputProps: { min: 0, max: 100000 }
                  }}
                />
              </Box>

              <input
                accept="image/jpeg,image/png,image/gif"
                style={{ display: 'none' }}
                id="image"
                type="file"
                onChange={handleImageChange}
                disabled={isSubmitting}
              />
              <label htmlFor="image">
                <Button
                  variant="contained"
                  component="span"
                  fullWidth
                  sx={{ mt: 2, mb: 2 }}
                  disabled={isSubmitting}
                >
                  החלפת תמונה
                </Button>
              </label>

              {formik.values.image && (
                <Typography variant="body2" align="center" sx={{ mb: 2 }}>
                  נבחרה תמונה: {formik.values.image.name}
                </Typography>
              )}

              {formik.dirty && (
                <Box sx={{ mt: 2, mb: 2 }}>
                  <Alert severity="info" sx={{ mb: 2 }}>
                    <Typography variant="body2">
                      {lastSaved ? (
                        <Box component="span" sx={{ display: 'block', mb: 1 }}>
                          נשמר לאחרונה: {lastSaved.toLocaleTimeString()}
                          {isAutoSaving && ' (שומר...)'}
                        </Box>
                      ) : null}
                      קיצורי מקלדת זמינים:
                      <Box component="ul" sx={{ mt: 1, mb: 0 }}>
                        <li>Ctrl/⌘ + S: שמירת שינויים</li>
                        <li>Ctrl/⌘ + Z: ביטול כל השינויים</li>
                      </Box>
                    </Typography>
                  </Alert>
                  <Typography variant="body2" color="text.secondary">
                    שדות שהשתנו: {getChangedFields().join(', ')}
                  </Typography>
                </Box>
              )}

              <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                <Button
                  color="primary"
                  variant="contained"
                  fullWidth
                  type="submit"
                  disabled={isSubmitting || !formik.isValid || !formik.dirty}
                >
                  {isSubmitting ? <CircularProgress size={24} /> : 'שמירת שינויים'}
                </Button>
                <Button
                  color="secondary"
                  variant="outlined"
                  fullWidth
                  onClick={handleCancelNavigation}
                  disabled={isSubmitting}
                >
                  ביטול
                </Button>
              </Box>
            </form>
          </Paper>
        </Box>
      </Grow>

      <Dialog
        open={showLeaveDialog}
        onClose={handleCancelNavigation}
        TransitionComponent={Grow}
        aria-labelledby="leave-dialog-title"
      >
        <DialogTitle id="leave-dialog-title">
          יש לך שינויים שלא נשמרו
        </DialogTitle>
        <DialogContent>
          <Typography>
            האם אתה בטוח שברצונך לעזוב? כל השינויים שלא נשמרו יאבדו.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelNavigation}>
            ביטול
          </Button>
          <Button onClick={handleConfirmNavigation} color="error">
            עזוב בכל זאת
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={showResetDialog}
        onClose={handleCancelReset}
        TransitionComponent={Grow}
        aria-labelledby="reset-dialog-title"
      >
        <DialogTitle id="reset-dialog-title">
          ביטול כל השינויים
        </DialogTitle>
        <DialogContent>
          <Typography>
            האם אתה בטוח שברצונך לבטל את כל השינויים ולחזור למצב ההתחלתי?
          </Typography>
          <Typography variant="body2" color="error" sx={{ mt: 2 }}>
            פעולה זו אינה ניתנת לביטול.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelReset}>
            ביטול
          </Button>
          <Button onClick={handleReset} color="error">
            אפס טופס
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar 
        open={!!error} 
        autoHideDuration={6000} 
        onClose={handleCloseError}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        TransitionComponent={Fade}
      >
        <Alert 
          onClose={handleCloseError} 
          severity="error" 
          variant="filled"
          sx={{ width: '100%' }}
        >
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default EditVacation; 
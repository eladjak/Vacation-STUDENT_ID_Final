import { body, ValidationChain } from 'express-validator';

export const validateVacation: ValidationChain[] = [
  body('destination')
    .trim()
    .notEmpty()
    .withMessage('יעד החופשה הוא שדה חובה')
    .isLength({ min: 2, max: 100 })
    .withMessage('יעד החופשה חייב להיות בין 2 ל-100 תווים'),

  body('description')
    .trim()
    .notEmpty()
    .withMessage('תיאור החופשה הוא שדה חובה')
    .isLength({ min: 10, max: 1000 })
    .withMessage('תיאור החופשה חייב להיות בין 10 ל-1000 תווים'),

  body('startDate')
    .notEmpty()
    .withMessage('תאריך התחלה הוא שדה חובה')
    .isISO8601()
    .withMessage('תאריך התחלה לא תקין'),

  body('endDate')
    .notEmpty()
    .withMessage('תאריך סיום הוא שדה חובה')
    .isISO8601()
    .withMessage('תאריך סיום לא תקין')
    .custom((value, { req }) => {
      if (new Date(value) <= new Date(req.body.startDate)) {
        throw new Error('תאריך הסיום חייב להיות אחרי תאריך ההתחלה');
      }
      return true;
    }),

  body('price')
    .notEmpty()
    .withMessage('מחיר החופשה הוא שדה חובה')
    .isFloat({ min: 0 })
    .withMessage('מחיר החופשה חייב להיות מספר חיובי')
];

export const validateLogin: ValidationChain[] = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('כתובת אימייל היא שדה חובה')
    .isEmail()
    .withMessage('כתובת אימייל לא תקינה'),

  body('password')
    .trim()
    .notEmpty()
    .withMessage('סיסמה היא שדה חובה')
    .isLength({ min: 6 })
    .withMessage('הסיסמה חייבת להכיל לפחות 6 תווים')
];

export const validateRegister: ValidationChain[] = [
  ...validateLogin,
  body('firstName')
    .trim()
    .notEmpty()
    .withMessage('שם פרטי הוא שדה חובה')
    .isLength({ min: 2, max: 50 })
    .withMessage('שם פרטי חייב להיות בין 2 ל-50 תווים'),

  body('lastName')
    .trim()
    .notEmpty()
    .withMessage('שם משפחה הוא שדה חובה')
    .isLength({ min: 2, max: 50 })
    .withMessage('שם משפחה חייב להיות בין 2 ל-50 תווים')
];

export const validateUpdateProfile: ValidationChain[] = [
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  
  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
  
  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail()
];

export const validateChangePassword: ValidationChain[] = [
  body('currentPassword')
    .trim()
    .notEmpty()
    .withMessage('Current password is required'),
  
  body('newPassword')
    .trim()
    .notEmpty()
    .withMessage('New password is required')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long')
    .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/)
    .withMessage('New password must contain at least one letter and one number')
    .custom((value, { req }) => {
      if (value === req.body.currentPassword) {
        throw new Error('New password must be different from current password');
      }
      return true;
    })
]; 
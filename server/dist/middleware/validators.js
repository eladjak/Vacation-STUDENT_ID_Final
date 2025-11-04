"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateChangePassword = exports.validateUpdateProfile = exports.validateRegister = exports.validateLogin = exports.validateVacation = void 0;
const express_validator_1 = require("express-validator");
exports.validateVacation = [
    (0, express_validator_1.body)('destination')
        .trim()
        .notEmpty()
        .withMessage('יעד החופשה הוא שדה חובה')
        .isLength({ min: 2, max: 100 })
        .withMessage('יעד החופשה חייב להיות בין 2 ל-100 תווים'),
    (0, express_validator_1.body)('description')
        .trim()
        .notEmpty()
        .withMessage('תיאור החופשה הוא שדה חובה')
        .isLength({ min: 10, max: 1000 })
        .withMessage('תיאור החופשה חייב להיות בין 10 ל-1000 תווים'),
    (0, express_validator_1.body)('startDate')
        .notEmpty()
        .withMessage('תאריך התחלה הוא שדה חובה')
        .isISO8601()
        .withMessage('תאריך התחלה לא תקין'),
    (0, express_validator_1.body)('endDate')
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
    (0, express_validator_1.body)('price')
        .notEmpty()
        .withMessage('מחיר החופשה הוא שדה חובה')
        .isFloat({ min: 0 })
        .withMessage('מחיר החופשה חייב להיות מספר חיובי')
];
exports.validateLogin = [
    (0, express_validator_1.body)('email')
        .trim()
        .notEmpty()
        .withMessage('כתובת אימייל היא שדה חובה')
        .isEmail()
        .withMessage('כתובת אימייל לא תקינה'),
    (0, express_validator_1.body)('password')
        .trim()
        .notEmpty()
        .withMessage('סיסמה היא שדה חובה')
        .isLength({ min: 6 })
        .withMessage('הסיסמה חייבת להכיל לפחות 6 תווים')
];
exports.validateRegister = [
    ...exports.validateLogin,
    (0, express_validator_1.body)('firstName')
        .trim()
        .notEmpty()
        .withMessage('שם פרטי הוא שדה חובה')
        .isLength({ min: 2, max: 50 })
        .withMessage('שם פרטי חייב להיות בין 2 ל-50 תווים'),
    (0, express_validator_1.body)('lastName')
        .trim()
        .notEmpty()
        .withMessage('שם משפחה הוא שדה חובה')
        .isLength({ min: 2, max: 50 })
        .withMessage('שם משפחה חייב להיות בין 2 ל-50 תווים')
];
exports.validateUpdateProfile = [
    (0, express_validator_1.body)('firstName')
        .optional()
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('First name must be between 2 and 50 characters'),
    (0, express_validator_1.body)('lastName')
        .optional()
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Last name must be between 2 and 50 characters'),
    (0, express_validator_1.body)('email')
        .optional()
        .trim()
        .isEmail()
        .withMessage('Invalid email format')
        .normalizeEmail()
];
exports.validateChangePassword = [
    (0, express_validator_1.body)('currentPassword')
        .trim()
        .notEmpty()
        .withMessage('Current password is required'),
    (0, express_validator_1.body)('newPassword')
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
//# sourceMappingURL=validators.js.map
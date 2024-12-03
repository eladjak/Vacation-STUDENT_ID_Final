"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateChangePassword = exports.validateUpdateProfile = exports.validateVacation = exports.validateLogin = exports.validateRegister = void 0;
const express_validator_1 = require("express-validator");
exports.validateRegister = [
    (0, express_validator_1.body)('firstName')
        .trim()
        .notEmpty()
        .withMessage('First name is required')
        .isLength({ min: 2, max: 50 })
        .withMessage('First name must be between 2 and 50 characters'),
    (0, express_validator_1.body)('lastName')
        .trim()
        .notEmpty()
        .withMessage('Last name is required')
        .isLength({ min: 2, max: 50 })
        .withMessage('Last name must be between 2 and 50 characters'),
    (0, express_validator_1.body)('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Invalid email format')
        .normalizeEmail(),
    (0, express_validator_1.body)('password')
        .trim()
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
        .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/)
        .withMessage('Password must contain at least one letter and one number')
];
exports.validateLogin = [
    (0, express_validator_1.body)('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Invalid email format')
        .normalizeEmail(),
    (0, express_validator_1.body)('password')
        .trim()
        .notEmpty()
        .withMessage('Password is required')
];
exports.validateVacation = [
    (0, express_validator_1.body)('destination')
        .trim()
        .notEmpty()
        .withMessage('Destination is required')
        .isLength({ min: 2, max: 100 })
        .withMessage('Destination must be between 2 and 100 characters'),
    (0, express_validator_1.body)('description')
        .trim()
        .notEmpty()
        .withMessage('Description is required')
        .isLength({ min: 10, max: 1000 })
        .withMessage('Description must be between 10 and 1000 characters'),
    (0, express_validator_1.body)('startDate')
        .notEmpty()
        .withMessage('Start date is required')
        .isISO8601()
        .withMessage('Invalid date format')
        .custom((value, { req }) => {
        if (new Date(value) < new Date()) {
            throw new Error('Start date cannot be in the past');
        }
        return true;
    }),
    (0, express_validator_1.body)('endDate')
        .notEmpty()
        .withMessage('End date is required')
        .isISO8601()
        .withMessage('Invalid date format')
        .custom((value, { req }) => {
        if (new Date(value) <= new Date(req.body.startDate)) {
            throw new Error('End date must be after start date');
        }
        return true;
    }),
    (0, express_validator_1.body)('price')
        .notEmpty()
        .withMessage('Price is required')
        .isFloat({ min: 0 })
        .withMessage('Price must be a positive number')
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
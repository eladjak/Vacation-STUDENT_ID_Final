/**
 * Request Validation Middleware
 * 
 * Processes validation results from express-validator middleware.
 * Formats and returns validation errors in a consistent structure.
 * This middleware should be used after validation rules are applied.
 * 
 * Features:
 * - Standardized error response format
 * - Field-level error reporting
 * - Clear error messages
 * 
 * Usage:
 * router.post('/route', 
 *   [validateEmail, validatePassword], // validation rules
 *   validate, // this middleware
 *   controller.action
 * );
 */

import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationError } from 'express-validator';

/**
 * Validation Middleware Function
 * 
 * Checks for validation errors and formats them for response.
 * 
 * @param req - Express request object (with validation results)
 * @param res - Express response object
 * @param next - Express next function
 * 
 * @returns
 * - Calls next() if validation passes
 * - Returns 400 response with formatted errors if validation fails:
 *   {
 *     status: 'error',
 *     message: 'נתונים לא תקינים',
 *     errors: [{ field: string, message: string }]
 *   }
 */
export const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'error',
      message: 'נתונים לא תקינים',
      errors: errors.array().map((err: ValidationError) => ({
        field: err.type === 'field' ? err.path : '',
        message: err.msg
      }))
    });
  }
  next();
}; 
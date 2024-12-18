/**
 * Global Error Handling Middleware
 * 
 * Centralizes error handling for the entire application.
 * Processes various types of errors and returns standardized
 * error responses to the client.
 * 
 * Features:
 * - Standardized error response format
 * - Specific handling for common error types
 * - Detailed logging for debugging
 * - Hebrew error messages
 * - Type safety with CustomError interface
 */

import { Request, Response, NextFunction } from 'express';

/**
 * Custom Error Interface
 * 
 * Extends the standard Error interface with additional properties
 * needed for proper error handling and response formatting.
 */
interface CustomError extends Error {
  status?: number;    // HTTP status code
  code?: string;      // Error code (e.g., DB error codes)
}

/**
 * Error Handler Middleware Function
 * 
 * Processes all errors passed to next() throughout the application.
 * Determines appropriate status codes and messages based on error type.
 * 
 * @param err - Error object with optional custom properties
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 * 
 * Error Types Handled:
 * - Duplicate entries (ER_DUP_ENTRY)
 * - Validation errors
 * - File upload errors (Multer)
 * - JWT authentication errors
 * - Database query errors (TypeORM)
 * - Generic errors
 * 
 * Response Format:
 * {
 *   status: 'error',
 *   message: string,
 *   errors?: any    // Optional additional error details
 * }
 */
export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', err);

  // Set default error status and message
  const status = err.status || 500;
  const message = err.message || 'שגיאת שרת פנימית';

  // Handle database duplicate entry errors
  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(400).json({
      status: 'error',
      message: 'הערך כבר קיים במערכת'
    });
  }

  // Handle validation errors (e.g., from express-validator)
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      status: 'error',
      message: 'נתונים לא תקינים',
      errors: err.message
    });
  }

  // Handle file upload errors from Multer
  if (err.name === 'MulterError') {
    return res.status(400).json({
      status: 'error',
      message: 'שגיאה בהעלאת הקובץ'
    });
  }

  // Handle JWT authentication errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      status: 'error',
      message: 'טוקן לא תקין'
    });
  }

  // Handle database query errors
  if (err.name === 'QueryFailedError') {
    return res.status(400).json({
      status: 'error',
      message: 'שגיאה ששאילתת מסד הנתונים'
    });
  }

  // Return generic error response
  res.status(status).json({
    status: 'error',
    message
  });
}; 
import { Request, Response, NextFunction } from 'express';

interface CustomError extends Error {
  status?: number;
  code?: string;
}

export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', err);

  // Default error status and message
  const status = err.status || 500;
  const message = err.message || 'שגיאת שרת פנימית';

  // Handle specific error types
  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(400).json({
      status: 'error',
      message: 'הערך כבר קיים במערכת'
    });
  }

  // Handle validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      status: 'error',
      message: 'נתונים לא תקינים',
      errors: err.message
    });
  }

  // Handle file upload errors
  if (err.name === 'MulterError') {
    return res.status(400).json({
      status: 'error',
      message: 'שגיאה בהעלאת הקובץ'
    });
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      status: 'error',
      message: 'טוקן לא תקין'
    });
  }

  // Handle TypeORM errors
  if (err.name === 'QueryFailedError') {
    return res.status(400).json({
      status: 'error',
      message: 'שגיאה ששאילתת מסד הנתונים'
    });
  }

  // Send error response
  res.status(status).json({
    status: 'error',
    message
  });
}; 
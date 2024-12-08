import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationError } from 'express-validator';

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
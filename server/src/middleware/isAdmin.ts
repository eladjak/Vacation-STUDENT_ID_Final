import { Request, Response, NextFunction } from 'express';
import { AppError } from './errorHandler';
import { UserRole } from '../entities/User';

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return next(new AppError(401, 'Authentication required'));
  }

  if (req.user.role !== UserRole.ADMIN) {
    return next(new AppError(403, 'Admin access required'));
  }

  next();
}; 
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from './errorHandler';
import { UserService } from '../services/user.service';
import { logger } from '../utils/logger';

declare global {
  namespace Express {
    interface Request {
      user?: any;
      token?: string;
    }
  }
}

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      logger.error('No token provided');
      throw new AppError(401, 'Authentication required');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
    const userService = new UserService();
    
    try {
      const user = await userService.findById(decoded.id);
      req.user = user;
      req.token = token;
      next();
    } catch (error) {
      logger.error('User not found or invalid token');
      throw new AppError(401, 'Authentication failed');
    }
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else {
      logger.error('Auth middleware error:', error);
      next(new AppError(401, 'Authentication failed'));
    }
  }
}; 
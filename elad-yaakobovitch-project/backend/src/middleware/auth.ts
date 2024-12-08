import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../entities/user.entity';
import { AppDataSource } from '../config/data-source';

interface JwtPayload {
  userId: number;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get token from header
    const authHeader = req.header('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({
        status: 'error',
        message: 'אין הרשאה. נדרשת הזדהות.'
      });
    }

    const token = authHeader.replace('Bearer ', '');
    
    // Check if JWT_SECRET exists
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error('JWT_SECRET is not defined');
      return res.status(500).json({
        status: 'error',
        message: 'שגיאת הגדרות שרת'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, jwtSecret) as JwtPayload;
    console.log('Token verified:', { decoded });

    // Get user from database
    const userRepository = AppDataSource.getRepository(User);
    // Handle both token formats (id and userId)
    const userId = decoded.userId;

    if (!userId) {
      console.error('Invalid token payload:', decoded);
      return res.status(401).json({
        status: 'error',
        message: 'טוקן לא תקין'
      });
    }

    const user = await userRepository.findOne({ 
      where: { id: userId },
      select: ['id', 'email', 'firstName', 'lastName', 'role'] 
    });

    if (!user) {
      console.error('User not found for token:', { userId });
      return res.status(401).json({
        status: 'error',
        message: 'משתמש לא נמצא'
      });
    }

    // Add user to request
    req.user = user;
    console.log('Auth successful:', { userId: user.id, role: user.role });

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        status: 'error',
        message: 'טוקן לא תקין'
      });
    }
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        status: 'error',
        message: 'טוקן פג תוקף'
      });
    }
    res.status(401).json({
      status: 'error',
      message: 'שגיאת אימות'
    });
  }
}; 
/**
 * Authentication Middleware
 * 
 * Handles JWT-based authentication for protected routes.
 * Verifies the JWT token, retrieves the associated user,
 * and adds the user object to the request for downstream handlers.
 * 
 * Features:
 * - JWT token validation
 * - User retrieval and verification
 * - Detailed error handling
 * - Request augmentation with user data
 * - Comprehensive logging
 */

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../entities/user.entity';
import { AppDataSource } from '../config/data-source';

/**
 * JWT Payload Interface
 * Defines the structure of the decoded JWT token
 */
interface JwtPayload {
  userId: number;  // User's unique identifier
  role: string;    // User's role (user/admin)
}

/**
 * Express Request Type Extension
 * Adds user property to Express.Request for TypeScript support
 */
declare global {
  namespace Express {
    interface Request {
      user?: User;  // Authenticated user object
    }
  }
}

/**
 * Authentication Middleware Function
 * 
 * Processes incoming requests to verify authentication status.
 * 
 * Flow:
 * 1. Extracts JWT token from Authorization header
 * 2. Verifies token validity and expiration
 * 3. Retrieves associated user from database
 * 4. Attaches user to request object
 * 
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 * 
 * @returns
 * - Calls next() if authentication successful
 * - Returns error response if authentication fails
 * 
 * Error Cases:
 * - 401: Missing/invalid token, user not found
 * - 500: Server configuration issues
 */
export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Extract and validate Bearer token
    const authHeader = req.header('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({
        status: 'error',
        message: 'אין הרשאה. נדרשת הזדהות.'
      });
    }

    const token = authHeader.replace('Bearer ', '');
    
    // Verify JWT secret configuration
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error('JWT_SECRET is not defined');
      return res.status(500).json({
        status: 'error',
        message: 'שגיאת הגדרות שרת'
      });
    }

    // Verify and decode JWT token
    const decoded = jwt.verify(token, jwtSecret) as JwtPayload;
    console.log('Token verified:', { decoded });

    // Retrieve user from database
    const userRepository = AppDataSource.getRepository(User);
    const userId = decoded.userId;

    if (!userId) {
      console.error('Invalid token payload:', decoded);
      return res.status(401).json({
        status: 'error',
        message: 'טוקן לא תקין'
      });
    }

    // Find user and select specific fields
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

    // Attach user to request for downstream handlers
    req.user = user;
    console.log('Auth successful:', { userId: user.id, role: user.role });

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    
    // Handle specific JWT errors
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
    
    // Generic authentication error
    res.status(401).json({
      status: 'error',
      message: 'שגיאת אימות'
    });
  }
}; 
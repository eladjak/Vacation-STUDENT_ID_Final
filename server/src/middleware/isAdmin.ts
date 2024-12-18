/**
 * Admin Authorization Middleware
 * 
 * Verifies that the authenticated user has administrator privileges.
 * This middleware should be used after the auth middleware to protect
 * routes that require administrative access.
 * 
 * Features:
 * - Role-based access control
 * - Authentication verification
 * - Clear error messages
 * 
 * Usage:
 * router.post('/admin-only-route', auth, isAdmin, adminController.action);
 */

import { Request, Response, NextFunction } from 'express';

/**
 * Admin Check Middleware Function
 * 
 * Validates that the current user has admin role.
 * Assumes that the auth middleware has already run and attached user to request.
 * 
 * @param req - Express request object (with user property from auth middleware)
 * @param res - Express response object
 * @param next - Express next function
 * 
 * @returns
 * - Calls next() if user is admin
 * - Returns error response if:
 *   - User is not authenticated (401)
 *   - User is not an admin (403)
 */
export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  // Verify user is authenticated
  if (!req.user) {
    return res.status(401).json({
      status: 'error',
      message: 'אין הרשאה. נדרשת הזדהות.'
    });
  }

  // Verify user has admin role
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      status: 'error',
      message: 'אין הרשאות מנהל לביצוע פעולה זו.'
    });
  }

  next();
}; 
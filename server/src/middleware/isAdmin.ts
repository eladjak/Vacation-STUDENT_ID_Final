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

import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Request, Response } from 'express';
import { User } from '../entities/user.entity';

@Injectable()
export class IsAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user as User;

    if (!user) {
      throw new UnauthorizedException('User not authenticated');
    }

    if (!user.isAdmin()) {
      throw new UnauthorizedException('User is not an admin');
    }

    return true;
  }
}

// Export the old middleware for backward compatibility
export const isAdmin = (req: Request, res: Response, next: Function) => {
  const guard = new IsAdminGuard();
  try {
    const result = guard.canActivate({
      switchToHttp: () => ({
        getRequest: () => req
      })
    } as ExecutionContext);
    if (result) {
      next();
    }
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
}; 
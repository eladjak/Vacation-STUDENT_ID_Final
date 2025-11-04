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
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

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

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly jwtService: JwtService;
  
  constructor() {
    this.jwtService = new JwtService({
      secret: process.env.JWT_SECRET
    });
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);
    
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token);
      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOne({ where: { id: payload.sub } });
      
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      request.user = user;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
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
export const auth = async (req: Request, res: Response, next: Function) => {
  const guard = new AuthGuard();
  try {
    await guard.canActivate({
      switchToHttp: () => ({
        getRequest: () => req
      })
    } as ExecutionContext);
    next();
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
}; 
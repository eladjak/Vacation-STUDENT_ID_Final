/**
 * Authentication Routes
 * 
 * Defines all authentication-related routes including login,
 * registration, and current user information retrieval.
 * 
 * Base Path: /api/v1/auth
 * 
 * Features:
 * - User login
 * - User registration
 * - Current user info
 * - Input validation
 * - Error handling
 */

import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validateLogin, validateRegister } from '../middleware/validators';
import { validate } from '../middleware/validate';
import { asyncHandler } from '../middleware/asyncHandler';

const router = Router();
const authController = new AuthController();

/**
 * POST /api/v1/auth/login
 * 
 * User login endpoint.
 * Validates credentials and returns JWT token.
 * 
 * Body:
 * - email: User's email
 * - password: User's password
 * 
 * Returns:
 * - token: JWT authentication token
 * - user: User information
 */
router.post(
  '/login',
  validateLogin,
  validate,
  asyncHandler(authController.login)
);

/**
 * POST /api/v1/auth/register
 * 
 * New user registration endpoint.
 * Creates user account and returns JWT token.
 * 
 * Body:
 * - firstName: User's first name
 * - lastName: User's last name
 * - email: User's email
 * - password: User's password
 * 
 * Returns:
 * - token: JWT authentication token
 * - user: Created user information
 */
router.post(
  '/register',
  validateRegister,
  validate,
  asyncHandler(authController.register)
);

/**
 * GET /api/v1/auth/me
 * 
 * Current user information endpoint.
 * Requires valid JWT token in Authorization header.
 * 
 * Returns:
 * - user: Current user's information
 */
router.get(
  '/me',
  asyncHandler(authController.getCurrentUser)
);

export default router; 
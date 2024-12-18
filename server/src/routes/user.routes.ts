/**
 * User Management Routes
 * 
 * Defines all user-related routes including profile management,
 * password changes, and vacation following functionality.
 * 
 * Base Path: /api/v1/users
 * 
 * Features:
 * - Profile management
 * - Password changes
 * - Vacation following
 * - Authentication required
 * - Input validation
 */

import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { validateUpdateProfile, validateChangePassword } from '../middleware/validators';
import { validate } from '../middleware/validate';
import { asyncHandler } from '../middleware/asyncHandler';
import { auth } from '../middleware/auth';

const router = Router();
const userController = new UserController();

/**
 * GET /api/v1/users/profile
 * 
 * Get current user's profile information.
 * Requires authentication.
 * 
 * Returns:
 * - user: Complete user profile information
 */
router.get('/profile', auth, asyncHandler(userController.getProfile));

/**
 * PUT /api/v1/users/profile
 * 
 * Update current user's profile information.
 * Requires authentication.
 * 
 * Body (all fields optional):
 * - firstName: New first name
 * - lastName: New last name
 * - email: New email address
 * 
 * Returns:
 * - user: Updated user profile
 */
router.put(
  '/profile',
  auth,
  validateUpdateProfile,
  validate,
  asyncHandler(userController.updateProfile)
);

/**
 * PUT /api/v1/users/password
 * 
 * Change current user's password.
 * Requires authentication.
 * 
 * Body:
 * - currentPassword: Current password
 * - newPassword: New password
 * 
 * Returns:
 * - message: Success confirmation
 */
router.put(
  '/password',
  auth,
  validateChangePassword,
  validate,
  asyncHandler(userController.changePassword)
);

/**
 * GET /api/v1/users/vacations/followed
 * 
 * Get list of vacations followed by current user.
 * Requires authentication.
 * 
 * Returns:
 * - vacations: Array of followed vacation objects
 */
router.get('/vacations/followed', auth, asyncHandler(userController.getFollowedVacations));

export default router; 
/**
 * User Management Controller
 * 
 * Handles user-specific operations including profile management,
 * password changes, and vacation following functionality.
 * This controller focuses on authenticated user operations
 * and delegates business logic to the UserService.
 * 
 * Key Features:
 * - Profile management
 * - Password changes
 * - Followed vacations tracking
 * - Logging of user actions
 */

import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { logger } from '../utils/logger';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  /**
   * Get User Profile
   * 
   * Retrieves the complete profile information for the authenticated user.
   * 
   * @param req - Express request object (with user property from auth middleware)
   * @param res - Express response object
   * 
   * @returns
   * Success (200):
   * - Complete user profile object
   * 
   * Note: This endpoint requires authentication
   */
  getProfile = async (req: Request, res: Response) => {
    const user = await this.userService.findById(req.user!.id);
    logger.info(`Retrieved profile for user: ${user.id}`);
    res.json(user);
  };

  /**
   * Update User Profile
   * 
   * Updates the profile information for the authenticated user.
   * 
   * @param req - Express request object containing:
   *   - user: User object from auth middleware
   *   - body: Updated profile fields
   * 
   * @param res - Express response object
   * 
   * @returns
   * Success (200):
   * - Updated user profile object
   * 
   * Note: This endpoint requires authentication
   */
  updateProfile = async (req: Request, res: Response) => {
    const user = await this.userService.updateProfile(req.user!.id, req.body);
    logger.info(`Updated profile for user: ${user.id}`);
    res.json(user);
  };

  /**
   * Change User Password
   * 
   * Updates the password for the authenticated user.
   * Requires current password verification for security.
   * 
   * @param req - Express request object containing:
   *   - user: User object from auth middleware
   *   - body.currentPassword: Current user password
   *   - body.newPassword: New password to set
   * 
   * @param res - Express response object
   * 
   * @returns
   * Success (200):
   * - Success message
   * 
   * Note: This endpoint requires authentication
   */
  changePassword = async (req: Request, res: Response) => {
    const { currentPassword, newPassword } = req.body;
    await this.userService.changePassword(
      req.user!.id,
      currentPassword,
      newPassword
    );
    logger.info(`Changed password for user: ${req.user!.id}`);
    res.json({ message: 'Password changed successfully' });
  };

  /**
   * Get User's Followed Vacations
   * 
   * Retrieves all vacations that the authenticated user is following.
   * 
   * @param req - Express request object (with user property from auth middleware)
   * @param res - Express response object
   * 
   * @returns
   * Success (200):
   * - Array of vacation objects that the user follows
   * 
   * Note: This endpoint requires authentication
   */
  getFollowedVacations = async (req: Request, res: Response) => {
    const vacations = await this.userService.getFollowedVacations(req.user!.id);
    logger.info(`Retrieved followed vacations for user: ${req.user!.id}`);
    res.json(vacations);
  };
} 
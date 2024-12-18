/**
 * Vacation Management Routes
 * 
 * Defines all vacation-related routes including CRUD operations,
 * following functionality, and administrative features.
 * 
 * Base Path: /api/v1/vacations
 * 
 * Features:
 * - Vacation CRUD operations
 * - Follow/unfollow functionality
 * - Statistics and reporting
 * - Image upload handling
 * - Admin-only operations
 * - Input validation
 */

import { Router } from 'express';
import { VacationController } from '../controllers/vacation.controller';
import { validateVacation } from '../middleware/validators';
import { validate } from '../middleware/validate';
import { asyncHandler } from '../middleware/asyncHandler';
import { isAdmin } from '../middleware/isAdmin';
import { upload } from '../middleware/upload';

const router = Router();
const vacationController = new VacationController();

/**
 * GET /api/v1/vacations/stats/followers
 * 
 * Get follower statistics for all vacations.
 * Admin access only.
 * 
 * Returns:
 * - stats: Array of vacation statistics objects
 *   - destination: Vacation destination
 *   - followers: Number of followers
 */
router.get('/stats/followers', isAdmin, asyncHandler(vacationController.getFollowersStats));

/**
 * GET /api/v1/vacations/export/csv
 * 
 * Export vacation statistics to CSV file.
 * Admin access only.
 * 
 * Returns:
 * - file: CSV file download
 */
router.get('/export/csv', isAdmin, asyncHandler(vacationController.exportToCsv));

/**
 * GET /api/v1/vacations
 * 
 * Get all vacations with pagination and optional filters.
 * 
 * Query Parameters:
 * - page: Page number (default: 1)
 * - limit: Items per page (default: 10)
 * - followed: Show only followed vacations
 * - active: Show only active vacations
 * - upcoming: Show only future vacations
 * 
 * Returns:
 * - vacations: Array of vacation objects
 * - total: Total count of matching vacations
 */
router.get('/', asyncHandler(vacationController.getAll));

/**
 * POST /api/v1/vacations
 * 
 * Create new vacation.
 * Admin access only.
 * Supports image upload.
 * 
 * Body (multipart/form-data):
 * - destination: Vacation destination
 * - description: Vacation description
 * - startDate: Start date (ISO format)
 * - endDate: End date (ISO format)
 * - price: Price
 * - image: Vacation image file
 * 
 * Returns:
 * - vacation: Created vacation object
 */
router.post(
  '/',
  isAdmin,
  upload.single('image'),
  validateVacation,
  validate,
  asyncHandler(vacationController.create)
);

/**
 * GET /api/v1/vacations/:id
 * 
 * Get single vacation by ID.
 * 
 * Parameters:
 * - id: Vacation ID
 * 
 * Returns:
 * - vacation: Complete vacation object
 */
router.get('/:id', asyncHandler(vacationController.getOne));

/**
 * PUT /api/v1/vacations/:id
 * 
 * Update existing vacation.
 * Admin access only.
 * Supports image upload.
 * 
 * Parameters:
 * - id: Vacation ID
 * 
 * Body (multipart/form-data):
 * - destination: Updated destination
 * - description: Updated description
 * - startDate: Updated start date
 * - endDate: Updated end date
 * - price: Updated price
 * - image: New vacation image
 * 
 * Returns:
 * - vacation: Updated vacation object
 */
router.put(
  '/:id',
  isAdmin,
  upload.single('image'),
  validateVacation,
  validate,
  asyncHandler(vacationController.update)
);

/**
 * DELETE /api/v1/vacations/:id
 * 
 * Delete vacation.
 * Admin access only.
 * 
 * Parameters:
 * - id: Vacation ID
 * 
 * Returns:
 * - message: Success confirmation
 */
router.delete('/:id', isAdmin, asyncHandler(vacationController.delete));

/**
 * POST /api/v1/vacations/:id/follow
 * 
 * Follow a vacation.
 * Requires authentication.
 * 
 * Parameters:
 * - id: Vacation ID
 * 
 * Returns:
 * - message: Success confirmation
 */
router.post('/:id/follow', asyncHandler(vacationController.follow));

/**
 * DELETE /api/v1/vacations/:id/follow
 * 
 * Unfollow a vacation.
 * Requires authentication.
 * 
 * Parameters:
 * - id: Vacation ID
 * 
 * Returns:
 * - message: Success confirmation
 */
router.delete('/:id/follow', asyncHandler(vacationController.unfollow));

export default router; 
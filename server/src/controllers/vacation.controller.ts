/**
 * Vacation Management Controller
 * 
 * Handles all vacation-related operations including CRUD operations,
 * follow/unfollow functionality, and statistics generation.
 * This controller manages vacation listings, user interactions,
 * and administrative functions.
 * 
 * Key Features:
 * - Vacation CRUD operations
 * - Image upload and management
 * - Follow/unfollow functionality
 * - Statistics and reporting
 * - CSV export capabilities
 */

import { Request, Response } from 'express';
import { AppDataSource } from '../config/data-source';
import { Vacation } from '../entities/vacation.entity';
import { VacationFollow } from '../entities/vacation-follow.entity';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';

export class VacationController {
  private vacationRepository: Repository<Vacation>;
  private followRepository: Repository<VacationFollow>;

  constructor() {
    this.vacationRepository = AppDataSource.getRepository(Vacation);
    this.followRepository = AppDataSource.getRepository(VacationFollow);
  }

  /**
   * Retrieve All Vacations
   * 
   * Fetches all vacations with their follow status and follower count.
   * Results are customized for the requesting user, showing their personal follow status.
   * 
   * @param req - Express request object (with user property from auth middleware)
   * @param res - Express response object
   * 
   * @returns
   * Success (200):
   * - Array of vacation objects with:
   *   - Basic vacation details
   *   - Follow status for current user
   *   - Total follower count
   * 
   * Error (500):
   * - Database or server error
   */
  getAll = async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;

      // Query vacations with follow status and count
      const vacations = await this.vacationRepository
        .createQueryBuilder('vacation')
        .loadRelationCountAndMap(
          'vacation.followersCount',
          'vacation.follows'
        )
        .leftJoinAndSelect('vacation.follows', 'follow', 'follow.userId = :userId', { userId })
        .getMany();

      // Transform results to include follow status
      const vacationsWithFollowStatus = vacations.map(vacation => ({
        ...vacation,
        isFollowing: vacation.follows?.length > 0,
        followersCount: vacation.followersCount || 0
      }));

      res.json({
        status: 'success',
        data: {
          vacations: vacationsWithFollowStatus
        }
      });
    } catch (error) {
      console.error('Error fetching vacations:', error);
      res.status(500).json({
        status: 'error',
        message: 'שגיאה בטעינת החופשות'
      });
    }
  };

  /**
   * Retrieve Single Vacation
   * 
   * Fetches detailed information about a specific vacation,
   * including follow status for the requesting user.
   * 
   * @param req - Express request object containing:
   *   - params.id: Vacation ID
   *   - user: User object from auth middleware
   * 
   * @param res - Express response object
   * 
   * @returns
   * Success (200):
   * - Vacation object with follow status and count
   * 
   * Error cases:
   * - 404: Vacation not found
   * - 500: Server error
   */
  getOne = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      // Query specific vacation with follow information
      const vacation = await this.vacationRepository
        .createQueryBuilder('vacation')
        .loadRelationCountAndMap(
          'vacation.followersCount',
          'vacation.follows'
        )
        .leftJoinAndSelect('vacation.follows', 'follow', 'follow.userId = :userId', { userId })
        .where('vacation.id = :id', { id })
        .getOne();

      if (!vacation) {
        return res.status(404).json({
          status: 'error',
          message: 'החופשה לא נמצאה'
        });
      }

      // Add follow status to response
      const vacationWithFollowStatus = {
        ...vacation,
        isFollowing: vacation.follows?.length > 0,
        followersCount: vacation.followersCount || 0
      };

      res.json({
        status: 'success',
        data: {
          vacation: vacationWithFollowStatus
        }
      });
    } catch (error) {
      console.error('Error fetching vacation:', error);
      res.status(500).json({
        status: 'error',
        message: 'שגיאה בטעינת החופשה'
      });
    }
  };

  /**
   * Create New Vacation
   * 
   * Creates a new vacation entry with optional image upload.
   * Handles both vacation data and file upload in a single operation.
   * 
   * @param req - Express request object containing:
   *   - body: Vacation details
   *   - file: Optional uploaded image
   * 
   * @param res - Express response object
   * 
   * @returns
   * Success (201):
   * - Created vacation object with initial follow count
   * 
   * Error (500):
   * - Database error
   * - File system error
   */
  create = async (req: Request, res: Response) => {
    try {
      const vacationData = req.body;
      const imageFile = req.file;

      // Handle image upload if present
      if (imageFile) {
        vacationData.imageUrl = `/uploads/vacations/${imageFile.filename}`;
      }

      // Create and save new vacation
      const vacation = this.vacationRepository.create(vacationData);
      await this.vacationRepository.save(vacation);

      res.status(201).json({
        status: 'success',
        data: {
          vacation: {
            ...vacation,
            followersCount: 0,
            isFollowing: false
          }
        }
      });
    } catch (error) {
      console.error('Error creating vacation:', error);
      // Clean up uploaded file if creation fails
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      res.status(500).json({
        status: 'error',
        message: 'שגיאה ביצירת החופשה'
      });
    }
  };

  /**
   * Update Existing Vacation
   * 
   * Updates vacation details and optionally handles image replacement.
   * Manages old image cleanup when a new image is uploaded.
   * 
   * @param req - Express request object containing:
   *   - params.id: Vacation ID
   *   - body: Updated vacation details
   *   - file: Optional new image
   * 
   * @param res - Express response object
   * 
   * @returns
   * Success (200):
   * - Updated vacation object
   * 
   * Error cases:
   * - 404: Vacation not found
   * - 500: Update or file handling error
   */
  update = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const vacationData = req.body;
      const imageFile = req.file;

      // Find existing vacation
      const vacation = await this.vacationRepository.findOne({ where: { id: Number(id) } });
      if (!vacation) {
        return res.status(404).json({
          status: 'error',
          message: 'החופשה לא נמצאה'
        });
      }

      // Handle image replacement
      if (imageFile) {
        if (vacation.imageUrl) {
          const oldImagePath = path.join(__dirname, '../..', vacation.imageUrl);
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }
        vacationData.imageUrl = `/uploads/vacations/${imageFile.filename}`;
      }

      // Update and save vacation
      Object.assign(vacation, vacationData);
      await this.vacationRepository.save(vacation);

      // Fetch updated vacation with follower count
      const updatedVacation = await this.vacationRepository
        .createQueryBuilder('vacation')
        .loadRelationCountAndMap(
          'vacation.followersCount',
          'vacation.follows'
        )
        .where('vacation.id = :id', { id })
        .getOne();

      res.json({
        status: 'success',
        data: {
          vacation: {
            ...updatedVacation,
            followersCount: updatedVacation?.followersCount || 0,
            isFollowing: false
          }
        }
      });
    } catch (error) {
      console.error('Error updating vacation:', error);
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      res.status(500).json({
        status: 'error',
        message: 'שגיאה בעדכון החופשה'
      });
    }
  };

  /**
   * Delete Vacation
   * 
   * Removes a vacation and all associated data:
   * - Deletes all follow relationships
   * - Removes associated image file
   * - Deletes vacation record
   * 
   * @param req - Express request object containing:
   *   - params.id: Vacation ID
   * 
   * @param res - Express response object
   * 
   * @returns
   * Success (200):
   * - Success message
   * 
   * Error cases:
   * - 404: Vacation not found
   * - 500: Deletion error
   */
  delete = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      // Find vacation with follow relationships
      const vacation = await this.vacationRepository.findOne({ 
        where: { id: Number(id) },
        relations: ['follows']
      });

      if (!vacation) {
        return res.status(404).json({
          status: 'error',
          message: 'החופשה לא נמצאה'
        });
      }

      // Delete all follow relationships
      if (vacation.follows) {
        await this.followRepository.remove(vacation.follows);
      }

      // Remove associated image file
      if (vacation.imageUrl) {
        const imagePath = path.join(__dirname, '../..', vacation.imageUrl);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }

      // Delete vacation record
      await this.vacationRepository.remove(vacation);

      res.json({
        status: 'success',
        message: 'החופשה נמחקה בהצלחה'
      });
    } catch (error) {
      console.error('Error deleting vacation:', error);
      res.status(500).json({
        status: 'error',
        message: 'שגיאה במחיקת החופשה'
      });
    }
  };

  /**
   * Follow Vacation
   * 
   * Creates a follow relationship between a user and a vacation.
   * Prevents duplicate follows from the same user.
   * 
   * @param req - Express request object containing:
   *   - params.id: Vacation ID
   *   - user: User object from auth middleware
   * 
   * @param res - Express response object
   * 
   * @returns
   * Success (200):
   * - Updated follow status and count
   * 
   * Error cases:
   * - 404: Vacation not found
   * - 400: Already following
   * - 500: Database error
   */
  follow = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      // Check if vacation exists
      const vacation = await this.vacationRepository.findOne({ where: { id: Number(id) } });
      if (!vacation) {
        return res.status(404).json({
          status: 'error',
          message: 'החופשה לא נמצאה'
        });
      }

      // Check for existing follow
      const existingFollow = await this.followRepository.findOne({
        where: {
          user: { id: userId },
          vacation: { id: Number(id) }
        }
      });

      if (existingFollow) {
        return res.status(400).json({
          status: 'error',
          message: 'כבר עוקב אחרי חופשה זו'
        });
      }

      // Create new follow relationship
      const follow = this.followRepository.create({
        user: { id: userId },
        vacation: { id: Number(id) }
      });

      await this.followRepository.save(follow);

      // Get updated follower count
      const followersCount = await this.followRepository.count({
        where: { vacation: { id: Number(id) } }
      });

      res.json({
        status: 'success',
        data: {
          isFollowing: true,
          followersCount
        }
      });
    } catch (error) {
      console.error('Error following vacation:', error);
      res.status(500).json({
        status: 'error',
        message: 'שגיאה במעקב אחר החופשה'
      });
    }
  };

  /**
   * Unfollow Vacation
   * 
   * Removes a follow relationship between a user and a vacation.
   * 
   * @param req - Express request object containing:
   *   - params.id: Vacation ID
   *   - user: User object from auth middleware
   * 
   * @param res - Express response object
   * 
   * @returns
   * Success (200):
   * - Updated follow status and count
   * 
   * Error cases:
   * - 404: Follow relationship not found
   * - 500: Database error
   */
  unfollow = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      // Find and remove follow relationship
      const follow = await this.followRepository.findOne({
        where: {
          user: { id: userId },
          vacation: { id: Number(id) }
        }
      });

      if (!follow) {
        return res.status(404).json({
          status: 'error',
          message: 'לא נמצא מעקב לביטול'
        });
      }

      await this.followRepository.remove(follow);

      // Get updated follower count
      const followersCount = await this.followRepository.count({
        where: { vacation: { id: Number(id) } }
      });

      res.json({
        status: 'success',
        data: {
          isFollowing: false,
          followersCount
        }
      });
    } catch (error) {
      console.error('Error unfollowing vacation:', error);
      res.status(500).json({
        status: 'error',
        message: 'שגיאה בביטול המעקב'
      });
    }
  };

  /**
   * Get Followers Statistics
   * 
   * Retrieves statistics about vacation followers.
   * Primarily used for administrative reporting.
   * 
   * @param req - Express request object
   * @param res - Express response object
   * 
   * @returns
   * Success (200):
   * - Array of vacation statistics including:
   *   - Vacation details
   *   - Follower count
   * 
   * Error (500):
   * - Database or query error
   */
  getFollowersStats = async (req: Request, res: Response) => {
    try {
      const stats = await this.vacationRepository
        .createQueryBuilder('vacation')
        .loadRelationCountAndMap(
          'vacation.followersCount',
          'vacation.follows'
        )
        .getMany();

      const formattedStats = stats.map(vacation => ({
        id: vacation.id,
        destination: vacation.destination,
        followersCount: vacation.followersCount || 0
      }));

      res.json({
        status: 'success',
        data: {
          stats: formattedStats
        }
      });
    } catch (error) {
      console.error('Error getting followers stats:', error);
      res.status(500).json({
        status: 'error',
        message: 'שגיאה בקבלת הסטטיסטיקות'
      });
    }
  };

  /**
   * Export Statistics to CSV
   * 
   * Generates and sends a CSV file containing vacation statistics.
   * Includes vacation details and follower counts.
   * 
   * @param req - Express request object
   * @param res - Express response object
   * 
   * @returns
   * Success:
   * - CSV file download
   * 
   * Error (500):
   * - File generation or database error
   */
  exportToCsv = async (req: Request, res: Response) => {
    try {
      const stats = await this.vacationRepository
        .createQueryBuilder('vacation')
        .loadRelationCountAndMap(
          'vacation.followersCount',
          'vacation.follows'
        )
        .getMany();

      const csvRows = [
        ['ID', 'Destination', 'Followers Count'],
        ...stats.map(vacation => [
          vacation.id,
          vacation.destination,
          vacation.followersCount || 0
        ])
      ];

      const csvContent = csvRows
        .map(row => row.join(','))
        .join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=vacation-stats.csv');
      res.send(csvContent);
    } catch (error) {
      console.error('Error exporting to CSV:', error);
      res.status(500).json({
        status: 'error',
        message: 'שגיאה בייצוא הנתונים'
      });
    }
  };
} 
/**
 * Vacation Controller
 * Handles all vacation-related HTTP requests including CRUD operations,
 * following/unfollowing vacations, and vacation statistics.
 * 
 * @module Vacations
 */
import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  Delete, 
  UseGuards, 
  Req, 
  NotFoundException 
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vacation } from '../entities/vacation.entity';
import { VacationFollow } from '../entities/vacation-follow.entity';
import { VacationsService } from './vacations.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';

@Controller('vacations')
export class VacationController {
  constructor(
    @InjectRepository(Vacation)
    private readonly vacationRepository: Repository<Vacation>,
    @InjectRepository(VacationFollow)
    private readonly followRepository: Repository<VacationFollow>,
    private readonly vacationsService: VacationsService
  ) {}

  /**
   * Retrieves a specific vacation by its ID
   * 
   * @param id - The unique identifier of the vacation
   * @returns The vacation details if found
   * @throws NotFoundException if the vacation doesn't exist
   */
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Vacation> {
    const vacation = await this.vacationRepository.findOne({ 
      where: { id } 
    });
    
    if (!vacation) {
      throw new NotFoundException(`Vacation with ID ${id} not found`);
    }
    return vacation;
  }

  /**
   * Allows a user to follow a vacation
   * Updates the followers count and creates a follow relationship
   * 
   * @param id - The vacation ID to follow
   * @param req - The request object containing user information
   * @returns Object containing follow status and updated followers count
   * @throws NotFoundException if the vacation doesn't exist
   */
  @UseGuards(JwtAuthGuard)
  @Post(':id/follow')
  async follow(
    @Param('id') id: string, 
    @Req() req: Request
  ): Promise<{ isFollowing: boolean; followersCount: number }> {
    const userId = req.user?.id;
    const vacation = await this.vacationRepository.findOne({ 
      where: { id } 
    });

    if (!vacation) {
      throw new NotFoundException(`Vacation with ID ${id} not found`);
    }

    // Create and save the follow relationship
    const follow = await this.followRepository.create({
      vacation,
      userId
    });
    await this.followRepository.save(follow);

    // Update followers count
    vacation.followersCount += 1;
    await this.vacationRepository.save(vacation);

    return { 
      isFollowing: true,
      followersCount: vacation.followersCount 
    };
  }

  /**
   * Allows a user to unfollow a vacation
   * Updates the followers count and removes the follow relationship
   * 
   * @param id - The vacation ID to unfollow
   * @param req - The request object containing user information
   * @returns Object containing follow status and updated followers count
   * @throws NotFoundException if the vacation doesn't exist
   */
  @UseGuards(JwtAuthGuard)
  @Delete(':id/follow')
  async unfollow(
    @Param('id') id: string, 
    @Req() req: Request
  ): Promise<{ isFollowing: boolean; followersCount: number }> {
    const userId = req.user?.id;
    const vacation = await this.vacationRepository.findOne({ 
      where: { id } 
    });

    if (!vacation) {
      throw new NotFoundException(`Vacation with ID ${id} not found`);
    }

    // Remove the follow relationship
    await this.followRepository.delete({
      vacation: { id },
      userId
    });

    // Update followers count (ensure it doesn't go below 0)
    vacation.followersCount = Math.max(0, vacation.followersCount - 1);
    await this.vacationRepository.save(vacation);

    return { 
      isFollowing: false,
      followersCount: vacation.followersCount 
    };
  }
}
/**
 * Vacations Module
 * 
 * This module handles all vacation-related functionality including:
 * - Vacation CRUD operations
 * - Following/Unfollowing vacations
 * - Vacation statistics and reports
 * 
 * Dependencies:
 * - TypeORM for database operations
 * - Vacation and VacationFollow entities
 * 
 * @module Vacations
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VacationsService } from './vacations.service';
import { VacationController } from './vacation.controller';
import { Vacation } from '../entities/vacation.entity';
import { VacationFollow } from '../entities/vacation-follow.entity';

@Module({
  imports: [
    // Register both entities with TypeORM
    TypeOrmModule.forFeature([
      Vacation, 
      VacationFollow
    ])
  ],
  controllers: [VacationController],
  providers: [VacationsService],
  exports: [VacationsService] // Export service for use in other modules
}) 
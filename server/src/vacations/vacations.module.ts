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
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Module({
  imports: [
    TypeOrmModule.forFeature([Vacation, VacationFollow]),
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads/vacations',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          callback(null, `${uniqueSuffix}${extname(file.originalname)}`);
        }
      })
    })
  ],
  controllers: [VacationController],
  providers: [VacationsService],
  exports: [VacationsService, TypeOrmModule]
})
export class VacationsModule {}
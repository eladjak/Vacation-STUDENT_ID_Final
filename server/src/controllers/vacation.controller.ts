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
 * - Pagination and filtering
 */

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
  UseInterceptors,
  UploadedFiles,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { VacationsService } from '../services/vacations.service';
import { IsAdminGuard } from '../middleware/isAdmin';
import { CreateVacationDto, UpdateVacationDto, VacationResponseDto } from '../vacations/dto';
import { User } from '../entities/user.entity';
import { diskStorage } from 'multer';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';

interface FilterOptions {
  followed?: boolean;
  active?: boolean;
  upcoming?: boolean;
}

const storage = diskStorage({
  destination: join(__dirname, '../../uploads/vacations'),
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

@Controller('vacations')
@UseGuards(AuthGuard('jwt'))
export class VacationController {
  constructor(
    private readonly vacationsService: VacationsService
  ) {}

  @Get()
  async findAll(
    @Req() req: Request & { user: User },
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query() filters: FilterOptions
  ): Promise<{ vacations: VacationResponseDto[]; total: number }> {
    const { vacations, total } = await this.vacationsService.findAll(
      req.user.id,
      Number(page),
      Number(limit),
      filters
    );
    
    return {
      vacations: vacations.map(v => VacationResponseDto.fromEntity(v)),
      total
    };
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Req() req: Request & { user: User }
  ): Promise<VacationResponseDto> {
    const vacation = await this.vacationsService.findOne(id);
    return VacationResponseDto.fromEntity(vacation);
  }

  @Post()
  @UseGuards(IsAdminGuard)
  @UseInterceptors(FilesInterceptor('images', 10, { storage }))
  async create(
    @Body() createVacationDto: CreateVacationDto,
    @UploadedFiles() files: Array<Express.Multer.File>
  ): Promise<VacationResponseDto> {
    if (files?.length > 0) {
      createVacationDto.imageUrls = files.map(file => 
        `uploads/vacations/${file.filename}`
      );
    }
    const vacation = await this.vacationsService.create(createVacationDto);
    return VacationResponseDto.fromEntity(vacation);
  }

  @Put(':id')
  @UseGuards(IsAdminGuard)
  @UseInterceptors(FilesInterceptor('images', 10, { storage }))
  async update(
    @Param('id') id: string,
    @Body() updateVacationDto: UpdateVacationDto,
    @UploadedFiles() files: Array<Express.Multer.File>
  ): Promise<VacationResponseDto> {
    if (files?.length > 0) {
      updateVacationDto.imageUrls = files.map(file => 
        `uploads/vacations/${file.filename}`
      );
    }
    const vacation = await this.vacationsService.update(id, updateVacationDto);
    return VacationResponseDto.fromEntity(vacation);
  }

  @Delete(':id')
  @UseGuards(IsAdminGuard)
  async remove(@Param('id') id: string): Promise<void> {
    return this.vacationsService.remove(id);
  }

  @Post(':id/follow')
  async follow(
    @Param('id') id: string,
    @Req() req: Request & { user: User }
  ): Promise<{ isFollowing: boolean; followersCount: number }> {
    if (!req.user) {
      throw new BadRequestException('User not authenticated');
    }
    return this.vacationsService.follow(req.user.id, id);
  }

  @Delete(':id/follow')
  async unfollow(
    @Param('id') id: string,
    @Req() req: Request & { user: User }
  ): Promise<{ isFollowing: boolean; followersCount: number }> {
    if (!req.user) {
      throw new BadRequestException('User not authenticated');
    }
    return this.vacationsService.unfollow(req.user.id, id);
  }

  @Get('stats/followers')
  @UseGuards(IsAdminGuard)
  async getFollowersStats(): Promise<{ destination: string; followersCount: string }[]> {
    return this.vacationsService.getFollowersStats();
  }
} 
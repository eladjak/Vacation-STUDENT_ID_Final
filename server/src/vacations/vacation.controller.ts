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
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { VacationsService } from './vacations.service';
import { IsAdminGuard } from '../middleware/isAdmin';
import { CreateVacationDto, UpdateVacationDto, VacationResponseDto } from './dto';
import { User } from '../entities/user.entity';
import { Vacation } from '../entities/vacation.entity';

@Controller('vacations')
@UseGuards(AuthGuard('jwt'))
export class VacationController {
  constructor(
    private readonly vacationsService: VacationsService
  ) {}

  private mapToResponseDto(vacation: Vacation): VacationResponseDto {
    return {
      id: vacation.id,
      title: vacation.title,
      description: vacation.description,
      destination: vacation.destination,
      price: vacation.price,
      startDate: vacation.startDate,
      endDate: vacation.endDate,
      imageUrls: vacation.imageUrls || [],
      followersCount: vacation.followersCount || 0,
      maxParticipants: vacation.maxParticipants,
      currentParticipants: vacation.currentParticipants || 0,
      isFollowing: false,
      remainingSpots: vacation.calculateRemainingSpots()
    };
  }

  @Get()
  async getAll(@Req() req: Request): Promise<VacationResponseDto[]> {
    const vacations = await this.vacationsService.findAll();
    return vacations.map(vacation => this.mapToResponseDto(vacation));
  }

  @Get(':id')
  async getOne(@Param('id') id: string): Promise<VacationResponseDto> {
    const vacation = await this.vacationsService.findOne(id);
    return this.mapToResponseDto(vacation);
  }

  @Post()
  @UseGuards(IsAdminGuard)
  @UseInterceptors(FilesInterceptor('images'))
  async create(
    @Body() createVacationDto: CreateVacationDto,
    @UploadedFiles() files: Array<Express.Multer.File>
  ): Promise<VacationResponseDto> {
    if (files?.length > 0) {
      createVacationDto.imageUrls = files.map(file => file.path);
    }
    const vacation = await this.vacationsService.create(createVacationDto);
    return this.mapToResponseDto(vacation);
  }

  @Put(':id')
  @UseGuards(IsAdminGuard)
  @UseInterceptors(FilesInterceptor('images'))
  async update(
    @Param('id') id: string,
    @Body() updateVacationDto: UpdateVacationDto,
    @UploadedFiles() files: Array<Express.Multer.File>
  ): Promise<VacationResponseDto> {
    if (files?.length > 0) {
      updateVacationDto.imageUrls = files.map(file => file.path);
    }
    const vacation = await this.vacationsService.update(id, updateVacationDto);
    return this.mapToResponseDto(vacation);
  }

  @Delete(':id')
  @UseGuards(IsAdminGuard)
  async remove(@Param('id') id: string): Promise<void> {
    return this.vacationsService.remove(id);
  }

  @Post(':id/follow')
  async follow(
    @Param('id') id: string,
    @Req() req: Request
  ): Promise<{ isFollowing: boolean; followersCount: number }> {
    const userId = (req.user as User)?.id;
    return this.vacationsService.follow(userId, id);
  }

  @Delete(':id/follow')
  async unfollow(
    @Param('id') id: string,
    @Req() req: Request
  ): Promise<{ isFollowing: boolean; followersCount: number }> {
    const userId = (req.user as User)?.id;
    return this.vacationsService.unfollow(userId, id);
  }

  @Get('stats/followers')
  @UseGuards(IsAdminGuard)
  async getFollowersStats(): Promise<any[]> {
    return this.vacationsService.getFollowersStats();
  }
} 
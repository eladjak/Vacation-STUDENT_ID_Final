import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { VacationsService } from './vacations.service';
import { CreateVacationDto } from './dto/create-vacation.dto';
import { UpdateVacationDto } from './dto/update-vacation.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('vacations')
@Controller('vacations')
export class VacationsController {
  constructor(private readonly vacationsService: VacationsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new vacation' })
  @ApiResponse({ status: 201, description: 'The vacation has been successfully created.' })
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'images', maxCount: 5 },
  ]))
  async create(
    @Body() createVacationDto: CreateVacationDto,
    @UploadedFiles() files: { images?: Express.Multer.File[] }
  ) {
    // טיפול בתמונות אם קיימות
    if (files?.images) {
      createVacationDto.imageUrls = files.images.map(file => file.path);
    }
    
    return this.vacationsService.create(createVacationDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all vacations' })
  @ApiResponse({ status: 200, description: 'Return all vacations.' })
  findAll() {
    return this.vacationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vacationsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVacationDto: UpdateVacationDto) {
    return this.vacationsService.update(id, updateVacationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vacationsService.remove(id);
  }
} 
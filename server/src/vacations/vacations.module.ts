import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { Vacation } from '../entities/vacation.entity';
import { VacationsService } from './vacations.service';
import { VacationsController } from './vacations.controller';
import { FileService } from '../shared/services/file.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Vacation]),
    MulterModule.register({
      dest: './uploads/vacations',
    }),
  ],
  providers: [VacationsService, FileService],
  controllers: [VacationsController],
  exports: [VacationsService],
})
export class VacationsModule {} 
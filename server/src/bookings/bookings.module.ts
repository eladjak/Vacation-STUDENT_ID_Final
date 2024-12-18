/**
 * Bookings module
 * Handles all booking-related functionality
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingsService } from './bookings.service';
import { Booking } from '../entities/booking.entity';
import { VacationsModule } from '../vacations/vacations.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Booking]),
    VacationsModule
  ],
  providers: [BookingsService],
  exports: [BookingsService]
})
export class BookingsModule {} 
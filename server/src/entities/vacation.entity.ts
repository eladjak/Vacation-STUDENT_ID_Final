/**
 * Vacation Entity
 * 
 * Represents a vacation package in the system.
 * This entity stores all vacation-related information including
 * destination details, dates, pricing, and tracking of user follows.
 * 
 * Database Table: 'vacations'
 * 
 * Relations:
 * - One-to-Many with VacationFollow (one vacation can be followed by many users)
 * 
 * Features:
 * - Automatic timestamp tracking (created/updated)
 * - Virtual fields for follower statistics
 * - Image management support
 */

import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { VacationFollow } from './vacation-follow.entity';
import { IsNotEmpty, IsDate, IsNumber, Min, Max } from 'class-validator';

@Entity('vacations')
export class Vacation {
  /** Unique identifier for the vacation */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /** Name or title of the vacation destination */
  @Column()
  @IsNotEmpty({ message: 'יש להזין כותרת לחופשה' })
  title: string;

  /** Detailed description of the vacation package */
  @Column('text')
  description: string;

  /** Start date of the vacation package */
  @Column()
  @IsNotEmpty({ message: 'יש להזין יעד' })
  destination: string;

  /** Start date of the vacation package */
  @Column('date')
  @IsDate()
  startDate: Date;

  /** End date of the vacation package */
  @Column('date')
  @IsDate()
  endDate: Date;

  /** Price of the vacation package (supports 2 decimal places) */
  @Column('decimal')
  @IsNumber()
  @Min(0, { message: 'המחיר חייב להיות חיובי' })
  price: number;

  /** Maximum number of participants for the vacation */
  @Column('int')
  @IsNumber()
  @Min(0)
  @Max(100)
  maxParticipants: number;

  /** URLs to the vacation's images (optional) */
  @Column('text', { array: true, default: [] })
  imageUrls: string[];

  /** Collection of user follows for this vacation */
  @OneToMany(() => VacationFollow, follow => follow.vacation)
  follows: VacationFollow[];

  /** Timestamp of when the vacation was created */
  @CreateDateColumn()
  createdAt: Date;

  /** Timestamp of the last update to the vacation */
  @UpdateDateColumn()
  updatedAt: Date;

  /** Virtual field: Number of users following this vacation */
  followersCount: number = 0;

  /** Virtual field: Whether the current user is following this vacation */
  isFollowing?: boolean;

  /** Virtual field: Number of remaining spots for the vacation */
  @Column('int')
  @IsNumber()
  @Min(0)
  remainingSpots: number;
} 
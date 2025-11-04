/**
 * Vacation Entity
 * 
 * Represents a vacation package in the system with all its properties
 * and relationships. Includes validation rules and helper methods.
 * 
 * Features:
 * - Basic vacation information (title, description, destination)
 * - Pricing and dates
 * - Multiple image support
 * - Participant management
 * - Follow system integration
 * - Automatic timestamps
 * 
 * @module Entities
 */
import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  UpdateDateColumn,
  OneToMany
} from 'typeorm';
import { 
  IsString, 
  IsNotEmpty, 
  MinLength, 
  MaxLength, 
  IsNumber, 
  Min, 
  IsDate, 
  IsArray, 
  ArrayMinSize,
  ArrayMaxSize,
  IsUrl
} from 'class-validator';
import { VacationFollow } from './vacation-follow.entity';

@Entity('vacations')
export class Vacation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  title: string;

  @Column('text')
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(1000)
  description: string;

  @Column()
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  destination: string;

  @Column({ 
    type: 'decimal', 
    precision: 10, 
    scale: 2 
  })
  @IsNumber()
  @Min(0)
  price: number;

  @Column({ type: 'date' })
  @IsDate()
  startDate: Date;

  @Column({ type: 'date' })
  @IsDate()
  endDate: Date;

  @Column('simple-array')
  @IsArray()
  @ArrayMinSize(0)
  @ArrayMaxSize(10)
  @IsUrl({}, { each: true })
  imageUrls: string[];

  @Column({ default: 0 })
  @IsNumber()
  @Min(0)
  followersCount: number;

  @Column({ type: 'int' })
  @IsNumber()
  @Min(1)
  maxParticipants: number;

  @Column({ 
    type: 'int', 
    default: 0 
  })
  @IsNumber()
  @Min(0)
  currentParticipants: number;

  @OneToMany(() => VacationFollow, follow => follow.vacation)
  follows: VacationFollow[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  /**
   * Virtual property for backward compatibility
   * Returns the first image URL from the array
   * 
   * @returns {string | null} The first image URL or null if no images exist
   */
  get imageUrl(): string | null {
    return this.imageUrls && this.imageUrls.length > 0 ? this.imageUrls[0] : null;
  }

  /**
   * Calculates the number of remaining spots in the vacation
   * 
   * @returns {number} The number of spots still available for booking
   */
  calculateRemainingSpots(): number {
    return this.maxParticipants - (this.currentParticipants || 0);
  }

  /**
   * Checks if the vacation is currently active
   * 
   * @returns {boolean} True if the vacation is currently active
   */
  isActive(): boolean {
    const now = new Date();
    return this.startDate <= now && this.endDate >= now;
  }

  /**
   * Checks if the vacation is upcoming
   * 
   * @returns {boolean} True if the vacation hasn't started yet
   */
  isUpcoming(): boolean {
    const now = new Date();
    return this.startDate > now;
  }

  /**
   * Checks if there are enough spots available for a booking
   * 
   * @param {number} spots - Number of spots to check
   * @returns {boolean} True if enough spots are available
   */
  hasAvailableSpots(spots: number): boolean {
    return this.calculateRemainingSpots() >= spots;
  }
} 
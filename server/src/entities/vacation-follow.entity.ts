/**
 * VacationFollow Entity
 * 
 * Represents the relationship between users and their followed vacations.
 * This entity tracks which users are following which vacations and when
 * they started following.
 * 
 * Features:
 * - Many-to-one relationships with User and Vacation entities
 * - Automatic timestamp for follow creation
 * - Unique constraint on user-vacation pairs
 * - Cascading delete behavior
 * 
 * @module Entities
 */
import { 
  Entity, 
  PrimaryGeneratedColumn, 
  ManyToOne, 
  Column, 
  CreateDateColumn,
  JoinColumn,
  Unique,
  Index
} from 'typeorm';
import { IsUUID, IsNotEmpty } from 'class-validator';
import { Vacation } from './vacation.entity';
import { User } from './user.entity';

@Entity('vacation_follows')
@Unique(['userId', 'vacation'])
@Index(['userId', 'vacation'])
export class VacationFollow {
  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  id: string;

  @ManyToOne(() => Vacation, vacation => vacation.follows, {
    onDelete: 'CASCADE',
    nullable: false
  })
  @JoinColumn({ name: 'vacation_id' })
  vacation: Vacation;

  @ManyToOne(() => User, user => user.follows, {
    onDelete: 'CASCADE',
    nullable: false
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id' })
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  /**
   * Creates a new VacationFollow instance
   * 
   * @param {Partial<VacationFollow>} data - Initial data for the follow relationship
   */
  constructor(data?: Partial<VacationFollow>) {
    if (data) {
      Object.assign(this, data);
    }
  }

  /**
   * Checks if this follow relationship belongs to a specific user
   * 
   * @param {string} userId - The ID of the user to check
   * @returns {boolean} True if the follow belongs to the user
   */
  belongsToUser(userId: string): boolean {
    return this.userId === userId;
  }

  /**
   * Checks if this follow relationship is for a specific vacation
   * 
   * @param {string} vacationId - The ID of the vacation to check
   * @returns {boolean} True if the follow is for the vacation
   */
  isForVacation(vacationId: string): boolean {
    return this.vacation?.id === vacationId;
  }
} 
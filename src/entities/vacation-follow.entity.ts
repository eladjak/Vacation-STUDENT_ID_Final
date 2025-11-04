/**
 * VacationFollow Entity
 * Represents the relationship between users and the vacations they follow
 * 
 * This entity maintains the many-to-many relationship between users and vacations,
 * storing additional metadata such as when the follow action occurred.
 * 
 * @module Entities
 */
import { 
  Entity, 
  PrimaryGeneratedColumn, 
  ManyToOne, 
  Column, 
  CreateDateColumn,
  JoinColumn 
} from 'typeorm';
import { Vacation } from './vacation.entity';
import { User } from './user.entity';

@Entity('vacation_follows')
export class VacationFollow {
  /**
   * Unique identifier for the follow relationship
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * The vacation being followed
   * Many follows can reference one vacation
   */
  @ManyToOne(() => Vacation, vacation => vacation.follows)
  @JoinColumn({ name: 'vacation_id' })
  vacation: Vacation;

  /**
   * The ID of the user following the vacation
   * Stored as a string to match the User entity's ID type
   */
  @Column({ name: 'user_id' })
  userId: string;

  /**
   * Timestamp when the follow relationship was created
   * Automatically set by TypeORM
   */
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
} 
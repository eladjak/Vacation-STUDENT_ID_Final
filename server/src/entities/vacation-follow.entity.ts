/**
 * Vacation Follow Entity
 * 
 * Represents the relationship between users and their followed vacations.
 * This is a junction table that implements the many-to-many relationship
 * between users and vacations with additional metadata.
 * 
 * Database Table: 'vacation_follows'
 * 
 * Relations:
 * - Many-to-One with User (many follows can belong to one user)
 * - Many-to-One with Vacation (many follows can belong to one vacation)
 * 
 * Features:
 * - Automatic timestamp tracking for follow creation
 * - Maintains referential integrity through foreign keys
 */

import { Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Vacation } from './vacation.entity';

@Entity('vacation_follows')
export class VacationFollow {
  /** Unique identifier for the follow relationship */
  @PrimaryGeneratedColumn()
  id: number;

  /** 
   * Reference to the user who is following
   * Creates a foreign key 'userId' in the database
   */
  @ManyToOne(() => User, user => user.follows)
  @JoinColumn({ name: 'userId' })
  user: User;

  /**
   * Reference to the vacation being followed
   * Creates a foreign key 'vacationId' in the database
   */
  @ManyToOne(() => Vacation, vacation => vacation.follows)
  @JoinColumn({ name: 'vacationId' })
  vacation: Vacation;

  /** Timestamp of when the follow relationship was created */
  @CreateDateColumn()
  createdAt: Date;
} 
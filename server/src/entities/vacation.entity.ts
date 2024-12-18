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

@Entity('vacations')
export class Vacation {
  /** Unique identifier for the vacation */
  @PrimaryGeneratedColumn()
  id: number;

  /** Name or title of the vacation destination */
  @Column()
  destination: string;

  /** Detailed description of the vacation package */
  @Column('text')
  description: string;

  /** Start date of the vacation package */
  @Column({ type: 'date' })
  startDate: Date;

  /** End date of the vacation package */
  @Column({ type: 'date' })
  endDate: Date;

  /** Price of the vacation package (supports 2 decimal places) */
  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  /** URL to the vacation's image (optional) */
  @Column({ nullable: true })
  imageUrl: string;

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
} 
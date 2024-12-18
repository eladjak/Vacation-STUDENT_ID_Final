/**
 * User Entity
 * 
 * Represents a user in the system with authentication and profile information.
 * Supports both regular users and administrators with different access levels.
 * 
 * Database Table: 'users'
 * 
 * Relations:
 * - One-to-Many with VacationFollow (one user can follow many vacations)
 * 
 * Features:
 * - Role-based access control (user/admin)
 * - Secure password storage
 * - Email uniqueness enforcement
 * - Automatic timestamp tracking
 */

import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { VacationFollow } from './vacation-follow.entity';

@Entity('users')
export class User {
  /** Unique identifier for the user */
  @PrimaryGeneratedColumn()
  id: number;

  /** User's first name */
  @Column()
  firstName: string;

  /** User's last name */
  @Column()
  lastName: string;

  /** User's email address (unique) */
  @Column({ unique: true })
  email: string;

  /** Hashed password */
  @Column()
  password: string;

  /** 
   * User role for access control
   * - 'user': Regular user with basic privileges
   * - 'admin': Administrator with full system access
   */
  @Column({
    type: 'enum',
    enum: ['user', 'admin'],
    default: 'user'
  })
  role: 'user' | 'admin';

  /** Collection of vacation follows by this user */
  @OneToMany(() => VacationFollow, follow => follow.user)
  follows: VacationFollow[];

  /** Timestamp of when the user account was created */
  @CreateDateColumn()
  createdAt: Date;

  /** Timestamp of the last update to the user account */
  @UpdateDateColumn()
  updatedAt: Date;
} 
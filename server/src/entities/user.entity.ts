/**
 * User Entity
 * 
 * Represents a user in the system with authentication and profile information.
 * Handles user roles, vacation follows, and account status.
 * 
 * Features:
 * - Basic user information (name, email)
 * - Secure password storage
 * - Role-based access control
 * - Vacation follow relationships
 * - Account status tracking
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
  OneToMany,
  BeforeInsert,
  BeforeUpdate
} from 'typeorm';
import { 
  IsString, 
  IsEmail, 
  MinLength, 
  MaxLength, 
  IsNotEmpty,
  IsBoolean,
  IsEnum,
  IsUUID
} from 'class-validator';
import { VacationFollow } from './vacation-follow.entity';
import * as bcrypt from 'bcrypt';

export type UserRole = 'user' | 'admin';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  id!: string;

  @Column()
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  firstName!: string;

  @Column()
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  lastName!: string;

  @Column({ unique: true })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @Column()
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(100)
  password!: string;

  @Column({ default: 'user' })
  @IsEnum(['user', 'admin'])
  role!: UserRole;

  @OneToMany(() => VacationFollow, follow => follow.user)
  follows!: VacationFollow[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @Column({ default: true })
  @IsBoolean()
  isActive!: boolean;

  /**
   * Hash password before inserting or updating
   */
  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      const salt = await bcrypt.genSalt();
      this.password = await bcrypt.hash(this.password, salt);
    }
  }

  /**
   * Get user's full name
   * 
   * @returns {string} The user's full name
   */
  getFullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  /**
   * Check if user has admin role
   * 
   * @returns {boolean} True if user is an admin
   */
  isAdmin(): boolean {
    return this.role === 'admin';
  }

  /**
   * Check if user is following a specific vacation
   * 
   * @param {string} vacationId - The ID of the vacation to check
   * @returns {boolean} True if user is following the vacation
   */
  isFollowingVacation(vacationId: string): boolean {
    return this.follows?.some(follow => follow.vacation.id === vacationId) || false;
  }

  /**
   * Get all vacation IDs that the user is following
   * 
   * @returns {string[]} Array of vacation IDs
   */
  getFollowedVacationIds(): string[] {
    return this.follows?.map(follow => follow.vacation.id) || [];
  }

  /**
   * Verify user's password
   * 
   * @param {string} password - The password to verify
   * @returns {Promise<boolean>} True if password matches
   */
  async verifyPassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
} 
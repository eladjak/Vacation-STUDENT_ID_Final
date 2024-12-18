/**
 * Users service
 * Handles user management operations
 */
import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcryptjs';

interface UserRegistrationData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  /**
   * Registers a new user
   * @param userData - User registration data
   * @returns Created user entity
   * @throws ConflictException if email already exists
   */
  async register(userData: UserRegistrationData): Promise<User> {
    const existingUser = await this.findByEmail(userData.email);
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = this.userRepository.create({
      ...userData,
      password: hashedPassword,
      role: 'user',
      isActive: true
    });
    return await this.userRepository.save(user);
  }

  /**
   * Finds a user by email
   * @param email - User's email
   * @returns User entity if found
   */
  async findByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { email } });
  }

  /**
   * Finds a user by ID
   * @param id - User's ID
   * @returns User entity
   * @throws NotFoundException if user not found
   */
  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
} 
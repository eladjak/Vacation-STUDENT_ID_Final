/**
 * Authentication Service
 * 
 * Handles all authentication-related business logic including
 * user registration, login, token management, and password handling.
 * Implements security best practices for user authentication.
 * 
 * Features:
 * - Secure password hashing with bcrypt
 * - JWT token generation and management
 * - User data sanitization
 * - Comprehensive error handling
 * - Detailed logging
 */

import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/user.entity';
import { AppDataSource } from '../config/data-source';

@Injectable()
export class AuthService {
  private readonly userRepository: Repository<User>;

  constructor(
    private readonly jwtService: JwtService
  ) {
    this.userRepository = AppDataSource.getRepository(User);
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  async register(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }): Promise<any> {
    const existingUser = await this.userRepository.findOne({
      where: { email: userData.email }
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = this.userRepository.create({
      ...userData,
      password: hashedPassword,
      role: 'user'
    });

    await this.userRepository.save(user);
    const { password, ...result } = user;
    return result;
  }

  async generateToken(user: any): Promise<string> {
    const payload = { 
      sub: user.id,
      email: user.email,
      role: user.role
    };
    return this.jwtService.sign(payload);
  }
} 
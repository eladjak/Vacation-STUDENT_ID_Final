/**
 * Authentication service
 * Handles user authentication and JWT token management
 */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';

interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  /**
   * Validates user credentials
   * @param email - User's email
   * @param password - User's password
   * @returns Authenticated user data
   * @throws UnauthorizedException if credentials are invalid
   */
  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  /**
   * Generates JWT token for authenticated user
   * @param user - User data for token generation
   * @returns JWT token
   */
  async generateToken(user: any): Promise<string> {
    const payload: JwtPayload = {
      userId: user.id,
      email: user.email,
      role: user.role
    };
    return this.jwtService.sign(payload);
  }
} 
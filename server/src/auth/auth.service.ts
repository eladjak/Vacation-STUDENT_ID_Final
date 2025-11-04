/**
 * Authentication service
 * Handles user authentication, registration, and JWT token management
 */
import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';

interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

interface RegistrationDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  /**
   * Register a new user
   * @param registrationData - User registration data
   * @returns Newly created user data (without password) and JWT token
   * @throws ConflictException if email already exists
   * @throws BadRequestException if validation fails
   */
  async register(registrationData: RegistrationDto): Promise<{ user: any; token: string }> {
    // Check if user already exists
    const existingUser = await this.usersService.findByEmail(registrationData.email);
    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    // Validate password strength
    if (!this.isPasswordStrong(registrationData.password)) {
      throw new BadRequestException(
        'Password must be at least 8 characters long and contain uppercase, lowercase, number and special character'
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(registrationData.password, 12);

    // Create new user
    const newUser = await this.usersService.create({
      ...registrationData,
      password: hashedPassword,
      role: 'user', // Default role for new registrations
      isEmailVerified: false
    });

    // Generate verification token and send email
    await this.sendVerificationEmail(newUser);

    // Generate JWT token
    const token = await this.generateToken(newUser);

    // Remove password from response
    const { password, ...userWithoutPassword } = newUser;

    return {
      user: userWithoutPassword,
      token
    };
  }

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

  /**
   * Validates password strength
   * @param password - Password to validate
   * @returns boolean indicating if password meets strength requirements
   */
  private isPasswordStrong(password: string): boolean {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return (
      password.length >= minLength &&
      hasUpperCase &&
      hasLowerCase &&
      hasNumbers &&
      hasSpecialChar
    );
  }

  /**
   * Sends verification email to newly registered user
   * @param user - User data
   * @returns Promise<void>
   */
  private async sendVerificationEmail(user: any): Promise<void> {
    // TODO: Implement email verification logic
    // This will be implemented when we add email service integration
    console.log(`Verification email would be sent to ${user.email}`);
  }
} 
/**
 * Authentication Controller
 * 
 * Handles all authentication-related operations including user login, registration,
 * and current user information retrieval. This controller implements security best
 * practices including password hashing and JWT token generation.
 * 
 * Key Features:
 * - User login with email/password
 * - New user registration
 * - Current user information retrieval
 * - Secure password handling using bcrypt
 * - JWT token generation for session management
 */

import { Request, Response } from 'express';
import { AppDataSource } from '../config/data-source';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';

export class AuthController {
  private userRepository: Repository<User>;

  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
  }

  /**
   * User Login Handler
   * 
   * Authenticates a user with their email and password, generating a JWT token upon success.
   * 
   * @param req - Express request object containing:
   *   - email: User's email address
   *   - password: User's password (plain text)
   * 
   * @param res - Express response object
   * 
   * @returns
   * Success (200):
   * - token: JWT authentication token
   * - user: User object with basic information
   * 
   * Error cases:
   * - 401: Invalid credentials (user not found or wrong password)
   * - 500: Server error (e.g., database issues, JWT configuration missing)
   */
  login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    
    console.log('Login attempt:', { email }); // Do not log passwords

    try {
      // Find user by email
      const user = await this.userRepository.findOne({ where: { email } });
      if (!user) {
        console.log('User not found:', email);
        return res.status(401).json({
          status: 'error',
          message: 'משתמש לא נמצא'
        });
      }

      console.log('User found:', { id: user.id, email: user.email, role: user.role });

      // Verify password using bcrypt
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        console.log('Password mismatch for user:', email);
        return res.status(401).json({
          status: 'error',
          message: 'סיסמה שגויה'
        });
      }

      // Ensure JWT secret is configured
      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        console.error('JWT_SECRET is not defined');
        return res.status(500).json({
          status: 'error',
          message: 'שגיאת הגדרות שרת'
        });
      }

      // Generate JWT token with user info and 24-hour expiration
      const token = jwt.sign(
        { userId: user.id, role: user.role },
        jwtSecret,
        { expiresIn: '24h' }
      );

      console.log('Login successful:', { userId: user.id, role: user.role });

      // Return user data and token
      return res.json({
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      return res.status(500).json({
        status: 'error',
        message: 'שגיאת שרת'
      });
    }
  };

  /**
   * User Registration Handler
   * 
   * Creates a new user account with the provided information.
   * Automatically assigns 'user' role to new registrations.
   * 
   * @param req - Express request object containing:
   *   - firstName: User's first name
   *   - lastName: User's last name
   *   - email: User's email address
   *   - password: User's password (will be hashed)
   * 
   * @param res - Express response object
   * 
   * @returns
   * Success (201):
   * - token: JWT authentication token
   * - user: Created user object
   * 
   * Error cases:
   * - 400: Email already exists
   * - 500: Server error (e.g., database issues, password hashing failure)
   */
  register = async (req: Request, res: Response) => {
    const { firstName, lastName, email, password } = req.body;

    try {
      // Verify email uniqueness
      const existingUser = await this.userRepository.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({
          status: 'error',
          message: 'משתמש כבר קיים'
        });
      }

      // Hash password with bcrypt (10 rounds)
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create new user with 'user' role
      const user = this.userRepository.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role: 'user'
      });

      await this.userRepository.save(user);

      // Generate JWT token for immediate login
      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        console.error('JWT_SECRET is not defined');
        return res.status(500).json({
          status: 'error',
          message: 'שגיאת הגדרות שרת'
        });
      }

      const token = jwt.sign(
        { userId: user.id, role: user.role },
        jwtSecret,
        { expiresIn: '24h' }
      );

      // Return new user data and token
      res.status(201).json({
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role
        }
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({
        status: 'error',
        message: 'שגיאה בהרשמה'
      });
    }
  };

  /**
   * Current User Information Handler
   * 
   * Retrieves information about the currently authenticated user.
   * Requires valid JWT token in the request (handled by auth middleware).
   * 
   * @param req - Express request object (with user property added by auth middleware)
   * @param res - Express response object
   * 
   * @returns
   * Success (200):
   * - user: Current user's information
   * 
   * Error cases:
   * - 404: User not found
   * - 500: Server error (e.g., database issues)
   */
  getCurrentUser = async (req: Request, res: Response) => {
    try {
      // Find user by ID (from JWT token)
      const user = await this.userRepository.findOne({
        where: { id: req.user?.id }
      });

      if (!user) {
        return res.status(404).json({
          status: 'error',
          message: 'משתמש לא נמצא'
        });
      }

      // Return user data (excluding sensitive information)
      res.json({
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role
        }
      });
    } catch (error) {
      console.error('Get current user error:', error);
      res.status(500).json({
        status: 'error',
        message: 'שגיאה בקבלת פרטי משתמש'
      });
    }
  };
} 
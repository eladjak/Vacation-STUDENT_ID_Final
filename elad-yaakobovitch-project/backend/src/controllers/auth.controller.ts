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

  login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    
    console.log('Login attempt:', { email }); // Do not log passwords

    try {
      // Find user
      const user = await this.userRepository.findOne({ where: { email } });
      if (!user) {
        console.log('User not found:', email);
        return res.status(401).json({
          status: 'error',
          message: 'משתמש לא נמצא'
        });
      }

      console.log('User found:', { id: user.id, email: user.email, role: user.role });

      // Check password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        console.log('Password mismatch for user:', email);
        return res.status(401).json({
          status: 'error',
          message: 'סיסמה שגויה'
        });
      }

      // Generate token
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

      console.log('Login successful:', { userId: user.id, role: user.role });

      // Return success response
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

  register = async (req: Request, res: Response) => {
    const { firstName, lastName, email, password } = req.body;

    try {
      // Check if user exists
      const existingUser = await this.userRepository.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({
          status: 'error',
          message: 'משתמש כבר קיים'
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const user = this.userRepository.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role: 'user'
      });

      await this.userRepository.save(user);

      // Generate token
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

      // Send response in the format the client expects
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

  getCurrentUser = async (req: Request, res: Response) => {
    try {
      const user = await this.userRepository.findOne({
        where: { id: req.user?.id }
      });

      if (!user) {
        return res.status(404).json({
          status: 'error',
          message: 'משתמש לא נמצא'
        });
      }

      // Return user data in consistent format
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
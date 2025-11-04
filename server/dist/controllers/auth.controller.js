"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const data_source_1 = require("../config/data-source");
const bcryptjs_1 = require("bcryptjs");
const jsonwebtoken_1 = require("jsonwebtoken");
const user_entity_1 = require("../entities/user.entity");
class AuthController {
    constructor() {
        this.login = async (req, res) => {
            const { email, password } = req.body;
            console.log('Login attempt:', { email });
            try {
                const user = await this.userRepository.findOne({ where: { email } });
                if (!user) {
                    console.log('User not found:', email);
                    return res.status(401).json({
                        status: 'error',
                        message: 'משתמש לא נמצא'
                    });
                }
                console.log('User found:', { id: user.id, email: user.email, role: user.role });
                const isMatch = await bcryptjs_1.default.compare(password, user.password);
                if (!isMatch) {
                    console.log('Password mismatch for user:', email);
                    return res.status(401).json({
                        status: 'error',
                        message: 'סיסמה שגויה'
                    });
                }
                const jwtSecret = process.env.JWT_SECRET;
                if (!jwtSecret) {
                    console.error('JWT_SECRET is not defined');
                    return res.status(500).json({
                        status: 'error',
                        message: 'שגיאת הגדרות שרת'
                    });
                }
                const token = jsonwebtoken_1.default.sign({ userId: user.id, role: user.role }, jwtSecret, { expiresIn: '24h' });
                console.log('Login successful:', { userId: user.id, role: user.role });
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
            }
            catch (error) {
                console.error('Login error:', error);
                return res.status(500).json({
                    status: 'error',
                    message: 'שגיאת שרת'
                });
            }
        };
        this.register = async (req, res) => {
            const { firstName, lastName, email, password } = req.body;
            try {
                const existingUser = await this.userRepository.findOne({ where: { email } });
                if (existingUser) {
                    return res.status(400).json({
                        status: 'error',
                        message: 'משתמש כבר קיים'
                    });
                }
                const hashedPassword = await bcryptjs_1.default.hash(password, 10);
                const user = this.userRepository.create({
                    firstName,
                    lastName,
                    email,
                    password: hashedPassword,
                    role: 'user'
                });
                await this.userRepository.save(user);
                const jwtSecret = process.env.JWT_SECRET;
                if (!jwtSecret) {
                    console.error('JWT_SECRET is not defined');
                    return res.status(500).json({
                        status: 'error',
                        message: 'שגיאת הגדרות שרת'
                    });
                }
                const token = jsonwebtoken_1.default.sign({ userId: user.id, role: user.role }, jwtSecret, { expiresIn: '24h' });
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
            }
            catch (error) {
                console.error('Registration error:', error);
                res.status(500).json({
                    status: 'error',
                    message: 'שגיאה בהרשמה'
                });
            }
        };
        this.getCurrentUser = async (req, res) => {
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
                res.json({
                    user: {
                        id: user.id,
                        email: user.email,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        role: user.role
                    }
                });
            }
            catch (error) {
                console.error('Get current user error:', error);
                res.status(500).json({
                    status: 'error',
                    message: 'שגיאה בקבלת פרטי משתמש'
                });
            }
        };
        this.userRepository = data_source_1.AppDataSource.getRepository(user_entity_1.User);
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map
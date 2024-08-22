"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const uuid_1 = require("uuid");
const user_repository_1 = require("../repository/user.repository");
const validation_1 = require("../utils/validation");
const helper_1 = require("../utils/helper");
class AuthService {
    constructor() {
        this.userRepository = new user_repository_1.UserRepository();
    }
    async registerUser(data) {
        const validatedData = validation_1.registrationSchema.parse(data);
        const existingUser = await this.userRepository.findUserByEmail(validatedData.email);
        if (existingUser) {
            throw new Error('User already exists');
        }
        // Hash the password before saving
        const hashedPassword = await bcrypt_1.default.hash(validatedData.password, 10);
        const userData = Object.assign(Object.assign({}, validatedData), { password: hashedPassword, role: validatedData.role || 'Regular' });
        return this.userRepository.createUser(Object.assign(Object.assign({}, userData), { id: (0, uuid_1.v4)() }));
    }
    async loginUser(data) {
        // Validate data using Zod
        const validatedData = validation_1.loginSchema.parse(data);
        const user = await this.userRepository.findUserByEmail(validatedData.email);
        if (!user) {
            throw new Error('User not found');
        }
        const passwordMatch = await bcrypt_1.default.compare(validatedData.password, user.password);
        if (!passwordMatch) {
            throw new Error('Invalid credentials');
        }
        // Generate JWT token
        const token = (0, helper_1.generateJwtToken)(user);
        // Return only necessary user information
        const { id, email, role } = user;
        const userWithoutSensitiveInfo = { id, email, role };
        return { user: userWithoutSensitiveInfo, token };
    }
    async createAdminUser(data) {
        // Validate data using Zod
        const validatedData = validation_1.registrationSchema.parse(data);
        // Check if the user already exists
        const existingUser = await this.userRepository.findUserByEmail(validatedData.email);
        if (existingUser) {
            throw new Error('User already exists');
        }
        // Hash the password before saving
        const hashedPassword = await bcrypt_1.default.hash(validatedData.password, 10);
        // Prepare admin user data
        const adminData = Object.assign(Object.assign({}, validatedData), { password: hashedPassword, role: 'Admin', id: (0, uuid_1.v4)().toString() });
        // Create the admin user in the database
        return this.userRepository.createUser(adminData);
    }
}
exports.AuthService = AuthService;

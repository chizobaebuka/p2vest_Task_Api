// src/services/authService.ts
import { sign } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { UserRepository } from '../repository/user.repository';
import { IUser, LoginData } from '../interfaces/user.interface';
import { loginSchema, registrationSchema } from '../utils/validation';
import { generateJwtToken } from '../utils/helper';

export class AuthService {
    private userRepository = new UserRepository();

    public async registerUser(data: Partial<IUser>) {
        const validatedData = registrationSchema.parse(data);

        const existingUser = await this.userRepository.findUserByEmail(validatedData.email);
        if (existingUser) {
            throw new Error('User already exists');
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(validatedData.password, 10);

        const userData = {
            ...validatedData,
            password: hashedPassword,
            role: validatedData.role || 'Regular',
        };

        return this.userRepository.createUser({
            ...userData,
            id: uuidv4(),
        });
    }

    public async loginUser(data: LoginData) {
        // Validate data using Zod
        const validatedData = loginSchema.parse(data);

        const user = await this.userRepository.findUserByEmail(validatedData.email);
        if (!user) {
            throw new Error('User not found');
        }

        const passwordMatch = await bcrypt.compare(validatedData.password, user.password);
        if (!passwordMatch) {
            throw new Error('Invalid credentials');
        }

        // Generate JWT token
        const token = generateJwtToken(user);

        // Return only necessary user information
        const { id, email, role } = user;
        const userWithoutSensitiveInfo = { id, email, role };

        return { user: userWithoutSensitiveInfo, token };
    }

    public async createAdminUser(data: Partial<IUser>) {
        // Validate data using Zod
        const validatedData = registrationSchema.parse(data);
    
        // Check if the user already exists
        const existingUser = await this.userRepository.findUserByEmail(validatedData.email);
        if (existingUser) {
            throw new Error('User already exists');
        }
    
        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(validatedData.password, 10);
    
        // Prepare admin user data
        const adminData: IUser = {
            ...validatedData,
            password: hashedPassword,
            role: 'Admin',
            id: uuidv4().toString(),
        };
    
        // Create the admin user in the database
        return this.userRepository.createUser(adminData);
    }
    
}

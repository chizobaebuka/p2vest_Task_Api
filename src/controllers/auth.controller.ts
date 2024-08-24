import { Request, Response } from 'express';
import { IUser, LoginData } from '../interfaces/user.interface';
import { AuthService } from '../service/user.service';
import { RequestExt } from '../middleware/auth.middleware';
import { cacheData, getCachedData } from '../db/redis.client';
import UserModel from '../db/models/usermodel';

export class AuthController {
    private authService: AuthService;

    constructor() {
        this.authService = new AuthService();
    }

    public async registerUser(req: Request, res: Response): Promise<Response> {
        try {
            const userData: Partial<IUser> = req.body;
            const newUser = await this.authService.registerUser(userData);
            return res.status(201).json({ message: 'User registered successfully', user: newUser });
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }

    public async loginUser(req: Request, res: Response): Promise<Response> {
        try {
            const loginData: LoginData = req.body;
            const { user, token } = await this.authService.loginUser(loginData);
            return res.status(200).json({ message: 'User logged in successfully', user, token });
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }

    public async createAdminUser(req: RequestExt, res: Response): Promise<Response> {    
        try {
            const currentUserRole = req.user?.role as 'Admin' | 'Regular';
            
            // Ensure that only admins can create other admins
            if (currentUserRole !== 'Admin') {
                console.error('Unauthorized attempt to create admin user');
                throw new Error('Only Admins can create other Admins');
            }

            const userData: Partial<IUser> = req.body;
            const newAdminUser = await this.authService.createAdminUser(userData);
            return res.status(201).json({ message: 'Admin user created successfully', user: newAdminUser });
        } catch (error: any) {
            console.error('Error creating admin user:', error.message);
            return res.status(400).json({ error: error.message });
        }
    }
    

    public async getAllUsers(req: RequestExt, res: Response): Promise<Response> {
        const cacheKey = 'users:all';
        console.log(`Cache key: ${cacheKey}`);
    
        let cachedData: string | null;
        try {
            cachedData = await getCachedData(cacheKey);
            console.log(`Retrieved cache data: ${cachedData}`);
        } catch (error) {
            console.error('Error retrieving cached data:', error);
            cachedData = null;
        }
    
        if (cachedData) {
            console.log('Cache hit: Returning cached data');
            return res.status(200).json({ users: JSON.parse(cachedData) });
        }
    
        console.log('Cache miss: Fetching data from service');
        
        let users: UserModel[];
        try {
            users = await this.authService.getAllUsers();
        } catch (error) {
            console.error('Error fetching data from service:', error);
            return res.status(500).json({ error: 'Failed to fetch users' });
        }
    
        try {
            await cacheData(cacheKey, JSON.stringify(users));
            console.log('Cached new data with key:', cacheKey);
        } catch (error) {
            console.error('Error caching new data:', error);
        }
    
        return res.status(200).json({ users });
    }
    
}

import { Request, Response } from 'express';
import { IUser, LoginData } from '../interfaces/user.interface';
import { AuthService } from '../service/user.service';

export class AuthController {
    private authService: AuthService;

    constructor() {
        console.log('Instantiating AuthController');
        this.authService = new AuthService();
        console.log('AuthService instantiated:', this.authService);
    }

    // Handle user registration
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

    // // Handle creating an admin user (protected)
    public async createAdminUser(req: Request, res: Response): Promise<Response> {
        try {
            // Extract the current user's role from the request object
            const currentUserRole = req.user?.role as 'Admin' | 'Regular';
            
            // Ensure that only admins can create other admins
            if (currentUserRole !== 'Admin') {
                throw new Error('Only Admins can create other Admins');
            }

            const userData: Partial<IUser> = req.body;
            const newAdminUser = await this.authService.createAdminUser(userData);
            return res.status(201).json({ message: 'Admin user created successfully', user: newAdminUser });
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }
}

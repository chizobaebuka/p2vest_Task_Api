"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const user_service_1 = require("../service/user.service");
class AuthController {
    constructor() {
        console.log('Instantiating AuthController');
        this.authService = new user_service_1.AuthService();
        console.log('AuthService instantiated:', this.authService);
    }
    // Handle user registration
    async registerUser(req, res) {
        try {
            const userData = req.body;
            const newUser = await this.authService.registerUser(userData);
            return res.status(201).json({ message: 'User registered successfully', user: newUser });
        }
        catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
    async loginUser(req, res) {
        try {
            const loginData = req.body;
            const { user, token } = await this.authService.loginUser(loginData);
            return res.status(200).json({ message: 'User logged in successfully', user, token });
        }
        catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
    // // Handle creating an admin user (protected)
    async createAdminUser(req, res) {
        var _a;
        try {
            // Extract the current user's role from the request object
            const currentUserRole = (_a = req.user) === null || _a === void 0 ? void 0 : _a.role;
            // Ensure that only admins can create other admins
            if (currentUserRole !== 'Admin') {
                throw new Error('Only Admins can create other Admins');
            }
            const userData = req.body;
            const newAdminUser = await this.authService.createAdminUser(userData);
            return res.status(201).json({ message: 'Admin user created successfully', user: newAdminUser });
        }
        catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
}
exports.AuthController = AuthController;

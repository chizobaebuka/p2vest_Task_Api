"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const user_service_1 = require("../service/user.service");
const redis_client_1 = require("../db/redis.client");
class AuthController {
    constructor() {
        this.authService = new user_service_1.AuthService();
    }
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
    async createAdminUser(req, res) {
        var _a;
        try {
            const currentUserRole = (_a = req.user) === null || _a === void 0 ? void 0 : _a.role;
            // Ensure that only admins can create other admins
            if (currentUserRole !== 'Admin') {
                console.error('Unauthorized attempt to create admin user');
                throw new Error('Only Admins can create other Admins');
            }
            const userData = req.body;
            const newAdminUser = await this.authService.createAdminUser(userData);
            return res.status(201).json({ message: 'Admin user created successfully', user: newAdminUser });
        }
        catch (error) {
            console.error('Error creating admin user:', error.message);
            return res.status(400).json({ error: error.message });
        }
    }
    async getAllUsers(req, res) {
        const cacheKey = 'users:all';
        console.log(`Cache key: ${cacheKey}`);
        let cachedData;
        try {
            cachedData = await (0, redis_client_1.getCachedData)(cacheKey);
            console.log(`Retrieved cache data: ${cachedData}`);
        }
        catch (error) {
            console.error('Error retrieving cached data:', error);
            cachedData = null;
        }
        if (cachedData) {
            console.log('Cache hit: Returning cached data');
            return res.status(200).json({ users: JSON.parse(cachedData) });
        }
        console.log('Cache miss: Fetching data from service');
        let users;
        try {
            users = await this.authService.getAllUsers();
        }
        catch (error) {
            console.error('Error fetching data from service:', error);
            return res.status(500).json({ error: 'Failed to fetch users' });
        }
        try {
            await (0, redis_client_1.cacheData)(cacheKey, JSON.stringify(users));
            console.log('Cached new data with key:', cacheKey);
        }
        catch (error) {
            console.error('Error caching new data:', error);
        }
        return res.status(200).json({ users });
    }
}
exports.AuthController = AuthController;

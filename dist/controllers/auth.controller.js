"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
    registerUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userData = req.body;
                const newUser = yield this.authService.registerUser(userData);
                return res.status(201).json({ message: 'User registered successfully', user: newUser });
            }
            catch (error) {
                return res.status(400).json({ error: error.message });
            }
        });
    }
    loginUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const loginData = req.body;
                const { user, token } = yield this.authService.loginUser(loginData);
                return res.status(200).json({ message: 'User logged in successfully', user, token });
            }
            catch (error) {
                return res.status(400).json({ error: error.message });
            }
        });
    }
    // // Handle creating an admin user (protected)
    createAdminUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                // Extract the current user's role from the request object
                const currentUserRole = (_a = req.user) === null || _a === void 0 ? void 0 : _a.role;
                // Ensure that only admins can create other admins
                if (currentUserRole !== 'Admin') {
                    throw new Error('Only Admins can create other Admins');
                }
                const userData = req.body;
                const newAdminUser = yield this.authService.createAdminUser(userData);
                return res.status(201).json({ message: 'Admin user created successfully', user: newAdminUser });
            }
            catch (error) {
                return res.status(400).json({ error: error.message });
            }
        });
    }
}
exports.AuthController = AuthController;

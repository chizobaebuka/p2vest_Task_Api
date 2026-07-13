"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const authRouter = (0, express_1.Router)();
const authController = new auth_controller_1.AuthController();
// Brute-force protection on credential-guessing endpoints.
const authRateLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many attempts, please try again later.' },
});
/**
   * @swagger
   * tags:
   *   name: Users
   *   description: API endpoints to manage users
*/
authRouter.get('/all-users', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)(['Admin']), authController.getAllUsers.bind(authController));
authRouter.post('/signup', authRateLimiter, authController.registerUser.bind(authController));
authRouter.post('/signin', authRateLimiter, authController.loginUser.bind(authController));
authRouter.post('/create-admin', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)(['Admin']), authController.createAdminUser.bind(authController));
exports.default = authRouter;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const authRouter = (0, express_1.Router)();
const authController = new auth_controller_1.AuthController();
/**
   * @swagger
   * tags:
   *   name: Users
   *   description: API endpoints to manage users
*/
authRouter.get('/all-users', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)(['Admin']), authController.getAllUsers.bind(authController));
authRouter.post('/signup', authController.registerUser.bind(authController));
authRouter.post('/signin', authController.loginUser.bind(authController));
authRouter.post('/create-admin', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)(['Admin']), authController.createAdminUser.bind(authController));
exports.default = authRouter;

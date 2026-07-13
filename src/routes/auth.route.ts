import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { AuthController } from '../controllers/auth.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const authRouter = Router();
const authController = new AuthController();

// Brute-force protection on credential-guessing endpoints.
const authRateLimiter = rateLimit({
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
authRouter.get('/all-users', authenticate, authorize(['Admin']), authController.getAllUsers.bind(authController));
authRouter.post('/signup', authRateLimiter, authController.registerUser.bind(authController));
authRouter.post('/signin', authRateLimiter, authController.loginUser.bind(authController));
authRouter.post('/create-admin', authenticate, authorize(['Admin']), authController.createAdminUser.bind(authController));


export default authRouter;

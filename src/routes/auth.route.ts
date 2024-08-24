import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const authRouter = Router();
const authController = new AuthController();

/**
   * @swagger
   * /api/auth
   * tags:
   *   name: Users
   *   description: API endpoints to manage users
*/
authRouter.get('/all-users', authenticate, authorize(['Admin']), authController.getAllUsers.bind(authController));
authRouter.post('/signup', authController.registerUser.bind(authController));
authRouter.post('/signin', authController.loginUser.bind(authController));
authRouter.post('/create-admin', authenticate, authorize(['Admin']), authController.createAdminUser.bind(authController));


export default authRouter;

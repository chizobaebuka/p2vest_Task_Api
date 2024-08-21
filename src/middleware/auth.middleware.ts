import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import UserModel from '../db/models/usermodel';

interface JwtPayload {
    id: string;
    role: 'Admin' | 'Regular';
    email: string;
}
export interface RequestExt extends Request {
    user?: {
        id: string;
        role: 'Admin' | 'Regular';
        email: string;
    };
}


export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Token is invalid' });
    }

    try {
        const secret = process.env.JWT_SECRET || 'your_jwt_secret';
        const decoded = verify(token, secret) as JwtPayload;

        // Fetch user from database
        const user = await UserModel.findByPk(decoded.id);

        if (!user) {
            return res.status(401).json({ error: 'Invalid token: user not found' });
        }

        // Assign user to req as RequestExt
        (req as RequestExt).user = {
            id: user.id,
            role: user.role,
            email: user.email,
        };

        next();
    } catch (error) {
        console.error('Error in authentication:', error);
        return res.status(401).json({ error: 'Invalid token' });
    }
};

export const authorize = (roles: Array<'Admin' | 'Regular'>) => {
    return (req: RequestExt, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Not authenticated' });
        }

        const userRole = req.user.role;

        if (!roles.includes(userRole)) {
            return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
        }

        next();
    };
};

export const asyncMiddleware = (
    fn: (req: RequestExt, res: Response, next: NextFunction) => Promise<Response | void>
) => {
    return (req: Request, res: Response, next: NextFunction) => {
        fn(req as RequestExt, res, next).catch(next);
    };
};

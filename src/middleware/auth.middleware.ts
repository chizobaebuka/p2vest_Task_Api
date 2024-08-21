import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

interface JwtPayload {
    id: string;
    role: 'Admin' | 'Regular';
}

declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
        }
    }
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Token is invalid' });
    }

    try {
        const secret = process.env.JWT_SECRET || 'your_jwt_secret'; // Replace with your actual secret
        const decoded = verify(token, secret) as JwtPayload;
        req.user = decoded; // Attach user info to the request
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }
};

export const authorize = (roles: Array<'Admin' | 'Regular'>) => {
    return (req: Request, res: Response, next: NextFunction) => {
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

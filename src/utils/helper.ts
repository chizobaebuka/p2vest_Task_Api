import { sign } from "jsonwebtoken";
import { IUser } from "../interfaces/user.interface";
import { client } from "../db/redis.client";

// Fails fast rather than silently signing/verifying tokens with a
// well-known default secret if JWT_SECRET is missing from the environment.
export const getJwtSecret = (): string => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('Missing required environment variable: JWT_SECRET');
    }
    return secret;
}

export const generateJwtToken = (user: IUser): string => {
    const token = sign(
        { id: user.id, role: user.role },
        getJwtSecret(),
        { expiresIn: process.env.EXPIRES_IN || '1h' }
    );

    return token;
}

// Maps known service-layer error messages to HTTP status codes so
// controllers don't collapse every failure into a generic 400/500.
export const mapErrorToStatus = (error: Error): number => {
    const message = error.message.toLowerCase();
    if (message.includes('not found') || message.includes('does not exist')) {
        return 404;
    }
    if (message.includes('forbidden') || message.includes('not authorized') || message.includes('unauthorized')) {
        return 403;
    }
    return 400;
}


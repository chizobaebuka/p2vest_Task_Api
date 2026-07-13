"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapErrorToStatus = exports.generateJwtToken = exports.getJwtSecret = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
// Fails fast rather than silently signing/verifying tokens with a
// well-known default secret if JWT_SECRET is missing from the environment.
const getJwtSecret = () => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('Missing required environment variable: JWT_SECRET');
    }
    return secret;
};
exports.getJwtSecret = getJwtSecret;
const generateJwtToken = (user) => {
    const token = (0, jsonwebtoken_1.sign)({ id: user.id, role: user.role }, (0, exports.getJwtSecret)(), { expiresIn: process.env.EXPIRES_IN || '1h' });
    return token;
};
exports.generateJwtToken = generateJwtToken;
// Maps known service-layer error messages to HTTP status codes so
// controllers don't collapse every failure into a generic 400/500.
const mapErrorToStatus = (error) => {
    const message = error.message.toLowerCase();
    if (message.includes('not found') || message.includes('does not exist')) {
        return 404;
    }
    if (message.includes('forbidden') || message.includes('not authorized') || message.includes('unauthorized')) {
        return 403;
    }
    return 400;
};
exports.mapErrorToStatus = mapErrorToStatus;

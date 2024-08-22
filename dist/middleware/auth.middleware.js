"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncMiddleware = exports.authorize = exports.authenticate = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const usermodel_1 = __importDefault(require("../db/models/usermodel"));
const authenticate = async (req, res, next) => {
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
        const decoded = (0, jsonwebtoken_1.verify)(token, secret);
        // Fetch user from database
        const user = await usermodel_1.default.findByPk(decoded.id);
        if (!user) {
            return res.status(401).json({ error: 'Invalid token: user not found' });
        }
        // Assign user to req as RequestExt
        req.user = {
            id: user.id,
            role: user.role,
            email: user.email,
        };
        next();
    }
    catch (error) {
        console.error('Error in authentication:', error);
        return res.status(401).json({ error: 'Invalid token' });
    }
};
exports.authenticate = authenticate;
const authorize = (roles) => {
    return (req, res, next) => {
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
exports.authorize = authorize;
const asyncMiddleware = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};
exports.asyncMiddleware = asyncMiddleware;

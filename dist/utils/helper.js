"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateJwtToken = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const generateJwtToken = (user) => {
    const token = (0, jsonwebtoken_1.sign)({ id: user.id, role: user.role }, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: '1h' });
    return token;
};
exports.generateJwtToken = generateJwtToken;

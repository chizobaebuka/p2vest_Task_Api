"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCachedData = exports.cacheData = exports.generateJwtToken = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const redis_client_1 = require("../db/redis.client");
const generateJwtToken = (user) => {
    const token = (0, jsonwebtoken_1.sign)({ id: user.id, role: user.role }, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: '1h' });
    return token;
};
exports.generateJwtToken = generateJwtToken;
const cacheData = async (key, value) => {
    try {
        await redis_client_1.client.set(key, value);
    }
    catch (error) {
        console.error('Error caching data:', error);
    }
};
exports.cacheData = cacheData;
// Function to retrieve cached data from Redis
const getCachedData = async (key) => {
    try {
        const value = await redis_client_1.client.get(key);
        return value;
    }
    catch (error) {
        console.error('Error retrieving cached data:', error);
        return null;
    }
};
exports.getCachedData = getCachedData;

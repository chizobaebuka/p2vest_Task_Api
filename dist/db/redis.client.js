"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = void 0;
exports.connectClient = connectClient;
exports.closeClient = closeClient;
const redis_1 = require("redis");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const client = (0, redis_1.createClient)({
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT || '6379', 10),
    },
});
exports.client = client;
client.on('error', (err) => {
    console.error('Redis Client Error', err);
});
let isConnected = false;
async function connectClient() {
    if (!isConnected) {
        try {
            await client.connect();
            isConnected = true;
            console.log('Redis connected successfully.');
        }
        catch (error) {
            console.error('Error connecting to Redis:', error);
        }
    }
}
async function closeClient() {
    if (isConnected) {
        try {
            await client.quit();
            isConnected = false;
            console.log('Redis connection closed.');
        }
        catch (error) {
            console.error('Error closing Redis connection:', error);
        }
    }
}

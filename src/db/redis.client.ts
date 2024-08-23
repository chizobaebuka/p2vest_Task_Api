import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

const client = createClient({
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT || '6379', 10),
    },
});

client.on('error', (err: Error) => {
    console.error('Redis Client Error', err);
});

let isConnected = false;

async function connectClient() {
    if (!isConnected) {
        try {
            await client.connect();
            isConnected = true;
            console.log('Redis connected successfully.');
        } catch (error) {
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
        } catch (error) {
            console.error('Error closing Redis connection:', error);
        }
    }
}

// Connect to Redis and initialize WebSocket server

export { client, connectClient, closeClient };

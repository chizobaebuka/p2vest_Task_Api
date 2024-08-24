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

const cacheData = async (key: string, value: string): Promise<void> => {
    try {
        console.log(`Caching data with key: ${key}`);
        await client.set(key, value);
        console.log(`Data cached successfully`);
    } catch (error) {
        console.error('Error caching data:', error);
    }
};

const getCachedData = async (key: string): Promise<string | null> => {
    try {
        console.log(`Retrieving cached data for key: ${key}`);
        const value = await client.get(key);
        if (value === null) {
            console.log(`No data found for key: ${key}`);
        } else {
            console.log(`Data retrieved for key: ${key}`);
        }
        return value;
    } catch (error) {
        console.error('Error retrieving cached data:', error);
        return null;
    }
};

const deleteCachedData = async (key: string): Promise<boolean> => {
    try {
        console.log(`Attempting to delete cached data for key: ${key}`);
        const result = await client.del(key);
        
        if (result === 1) {
            console.log(`Cache entry deleted for key: ${key}`);
            return true;
        } else {
            console.log(`No cache entry found for key: ${key}`);
            return false;
        }
    } catch (error) {
        console.error('Error deleting cached data:', error);
        return false;
    }
};


export { client, connectClient, closeClient, cacheData, getCachedData, deleteCachedData };

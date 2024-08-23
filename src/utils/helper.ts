import { sign } from "jsonwebtoken";
import { IUser } from "../interfaces/user.interface";
import { client } from "../db/redis.client";

export const generateJwtToken = (user: IUser): string => {
    const token = sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET || 'your_jwt_secret',
        { expiresIn: '1h' }
    );

    return token;
}

export const cacheData = async (key: string, value: string): Promise<void> => {
    try {
        await client.set(key, value);
    } catch (error) {
        console.error('Error caching data:', error);
    }
};

// Function to retrieve cached data from Redis
export const getCachedData = async (key: string): Promise<string | null> => {
    try {
        const value = await client.get(key);
        return value;
    } catch (error) {
        console.error('Error retrieving cached data:', error);
        return null;
    }
};

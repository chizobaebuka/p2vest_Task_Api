import { sign } from "jsonwebtoken";
import { IUser } from "../interfaces/user.interface";

export const generateJwtToken = (user: IUser): string => {
    const token = sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET || 'your_jwt_secret',
        { expiresIn: '1h' }
    );

    return token;
}
import { ICore } from ".";

export interface IUser extends ICore {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: 'Admin' | 'Regular';
}

export interface LoginData {
    email: string;
    password: string;
}

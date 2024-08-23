import UserModel from "../db/models/usermodel";
import { IUser } from "../interfaces/user.interface";


export class UserRepository {
    async createUser(data: IUser) {
        return UserModel.create(data);
    }

    async getUserById(id: string) {
        return UserModel.findByPk(id);
    }

    async findUserByEmail( email: string ) {
        return UserModel.findOne({ where: { email }})
    }

    async getAllUsers() {
        return UserModel.findAll();
    }
}
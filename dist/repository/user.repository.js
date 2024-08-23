"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const usermodel_1 = __importDefault(require("../db/models/usermodel"));
class UserRepository {
    async createUser(data) {
        return usermodel_1.default.create(data);
    }
    async getUserById(id) {
        return usermodel_1.default.findByPk(id);
    }
    async findUserByEmail(email) {
        return usermodel_1.default.findOne({ where: { email } });
    }
    async getAllUsers() {
        return usermodel_1.default.findAll();
    }
}
exports.UserRepository = UserRepository;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connection = exports.models = void 0;
const sequelize_1 = __importDefault(require("../sequelize")); // Adjust the path as necessary
exports.connection = sequelize_1.default;
const usermodel_1 = __importDefault(require("./usermodel")); // Adjust the path as necessary
const taskmodel_1 = __importDefault(require("./taskmodel")); // Adjust the path as necessary
const tagmodel_1 = __importDefault(require("./tagmodel")); // Adjust the path as necessary
const models = {
    UserModel: usermodel_1.default,
    TaskModel: taskmodel_1.default,
    TagModel: tagmodel_1.default
};
exports.models = models;
Object.keys(models).forEach((modelName) => {
    if ('associate' in models[modelName]) {
        models[modelName].associate(models);
    }
});

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connection = exports.models = void 0;
const sequelize_1 = __importDefault(require("../sequelize"));
exports.connection = sequelize_1.default;
const usermodel_1 = __importDefault(require("./usermodel"));
const taskmodel_1 = __importDefault(require("./taskmodel"));
const tagmodel_1 = __importDefault(require("./tagmodel"));
const models = {
    UserModel: usermodel_1.default,
    TaskModel: taskmodel_1.default,
    TagModel: tagmodel_1.default
};
exports.models = models;
// TagModel.associate({ TaskModel });
// UserModel.hasMany(TaskModel, { foreignKey: 'createdById' });
Object.keys(models).forEach((modelName) => {
    if ('associate' in models[modelName]) {
        models[modelName].associate(models);
    }
});

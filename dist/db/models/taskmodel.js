"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const usermodel_1 = __importDefault(require("./usermodel"));
const sequelize_2 = __importDefault(require("../sequelize"));
class TaskModel extends sequelize_1.Model {
}
TaskModel.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    title: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    status: {
        type: sequelize_1.DataTypes.ENUM('Pending', 'In Progress', 'Completed'),
        allowNull: false,
        defaultValue: 'Pending',
    },
    createdById: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
    },
    createdAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
    updatedAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
}, {
    sequelize: sequelize_2.default,
    modelName: 'TaskModel',
    tableName: 'tasksTable',
    timestamps: true,
});
// Associations
TaskModel.belongsTo(usermodel_1.default, {
    as: 'creator',
    foreignKey: 'createdById',
});
exports.default = TaskModel;

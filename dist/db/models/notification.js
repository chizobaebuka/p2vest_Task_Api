"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize_2 = __importDefault(require("../sequelize"));
const usermodel_1 = __importDefault(require("./usermodel"));
const taskmodel_1 = __importDefault(require("./taskmodel"));
class NotificationModel extends sequelize_1.Model {
    static associate() {
        NotificationModel.belongsTo(usermodel_1.default, {
            foreignKey: 'userId',
            as: 'user',
        });
        NotificationModel.belongsTo(taskmodel_1.default, {
            foreignKey: 'taskId',
            as: 'task',
        });
    }
}
NotificationModel.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    type: {
        type: sequelize_1.DataTypes.ENUM('TaskAssigned', 'TaskStatusUpdated'),
        allowNull: false,
    },
    message: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    isRead: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    userId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        references: {
            model: usermodel_1.default,
            key: 'id',
        },
    },
    taskId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        references: {
            model: taskmodel_1.default,
            key: 'id',
        },
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
    modelName: 'NotificationModel',
    tableName: 'notificationsTable',
    timestamps: true,
});
// Associations
NotificationModel.belongsTo(usermodel_1.default, {
    foreignKey: 'userId',
    as: 'user',
});
NotificationModel.belongsTo(taskmodel_1.default, {
    foreignKey: 'taskId',
    as: 'task',
});
exports.default = NotificationModel;

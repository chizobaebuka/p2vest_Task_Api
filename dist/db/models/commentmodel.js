"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const usermodel_1 = __importDefault(require("./usermodel"));
const taskmodel_1 = __importDefault(require("./taskmodel"));
const sequelize_2 = __importDefault(require("../sequelize"));
class CommentModel extends sequelize_1.Model {
    static associate() {
        CommentModel.belongsTo(usermodel_1.default, {
            as: 'author',
            foreignKey: 'userId',
        });
        CommentModel.belongsTo(taskmodel_1.default, {
            as: 'task',
            foreignKey: 'taskId',
        });
    }
}
CommentModel.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    content: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    taskId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'tasksTable', // Make sure this matches the TaskModel table name
            key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
    userId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'usersTable', // Make sure this matches the UserModel table name
            key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
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
    modelName: 'CommentModel',
    tableName: 'commentsTable',
    timestamps: true,
});
// Associations
// CommentModel.belongsTo(UserModel, {
//   as: 'author',
//   foreignKey: 'userId',
// });
// CommentModel.belongsTo(TaskModel, {
//   as: 'task',
//   foreignKey: 'taskId',
// });
exports.default = CommentModel;

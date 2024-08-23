"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const usermodel_1 = __importDefault(require("./usermodel"));
const sequelize_2 = __importDefault(require("../sequelize"));
const tagmodel_1 = __importDefault(require("./tagmodel"));
const commentmodel_1 = __importDefault(require("./commentmodel"));
class TaskModel extends sequelize_1.Model {
    static associate() {
        TaskModel.belongsTo(usermodel_1.default, {
            as: 'creator',
            foreignKey: 'createdById',
        });
        TaskModel.belongsTo(usermodel_1.default, {
            as: 'assignee',
            foreignKey: 'assignedToId',
        });
        TaskModel.belongsToMany(tagmodel_1.default, { through: 'TaskTags', as: 'tags', foreignKey: 'taskId', otherKey: 'tagId' });
        commentmodel_1.default.belongsTo(TaskModel, {
            as: 'task',
            foreignKey: 'taskId',
        });
        TaskModel.hasMany(commentmodel_1.default, {
            foreignKey: 'taskId',
            as: 'comments',
        });
    }
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
    assignedToId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: true,
    },
    dueDate: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true, // Due date is optional
    },
    tagId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'tagsTable',
            key: 'id',
        }
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
// TaskModel.belongsTo(UserModel, {
//   as: 'creator',
//   foreignKey: 'createdById',
// });
// TaskModel.belongsToMany(TagModel, { through: 'TaskTags', as: 'tags' });
// TagModel.belongsToMany(TaskModel, { through: 'TaskTags', as: 'tasks' });
exports.default = TaskModel;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize_2 = __importDefault(require("../sequelize"));
class TagModel extends sequelize_1.Model {
    static associate(models) {
        TagModel.belongsToMany(models.TaskModel, {
            through: 'TaskTags',
            as: 'tasks',
            foreignKey: 'tagId',
            otherKey: 'taskId',
        });
    }
}
TagModel.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
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
    modelName: 'TagModel',
    tableName: 'tagsTable',
    timestamps: true,
});
// TagModel.belongsToMany(TaskModel, { through: 'TaskTags', as: 'tasks' });
// TaskModel.belongsToMany(TagModel, { through: 'TaskTags', as: 'tags' });
exports.default = TagModel;

import { DataTypes, Model } from 'sequelize';
import UserModel from './usermodel';
import connection from '../sequelize';
import TagModel from './tagmodel';

interface TaskAttributes {
  id: string;
  title: string;
  description: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  createdById: string;
  assignedToId?: string; // Optional
  dueDate?: Date; // Optional
  createdAt?: Date;
  updatedAt?: Date;
}

class TaskModel extends Model<TaskAttributes> implements TaskAttributes {
  public id!: string;
  public title!: string;
  public description!: string;
  public status!: 'Pending' | 'In Progress' | 'Completed';
  public createdById!: string;
  public assignedToId?: string; // Optional
  public dueDate?: Date; // Optional
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

TaskModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('Pending', 'In Progress', 'Completed'),
      allowNull: false,
      defaultValue: 'Pending',
    },
    createdById: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    assignedToId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: true, // Due date is optional
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize: connection,
    modelName: 'TaskModel',
    tableName: 'tasksTable',
    timestamps: true,
  }
);

// Associations
TaskModel.belongsTo(UserModel, {
  as: 'creator',
  foreignKey: 'createdById',
});

TaskModel.belongsToMany(TagModel, { through: 'TaskTags', as: 'tags' });
TagModel.belongsToMany(TaskModel, { through: 'TaskTags', as: 'tasks' });

export default TaskModel;

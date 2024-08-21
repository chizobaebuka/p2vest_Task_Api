import { DataTypes, Model } from 'sequelize';
import UserModel from './usermodel';
import connection from '../sequelize';

interface TaskAttributes {
  id: string;
  title: string;
  description: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  createdById: string;
  createdAt?: Date;
  updatedAt?: Date;
}

class TaskModel extends Model<TaskAttributes> implements TaskAttributes {
  public id!: string;
  public title!: string;
  public description!: string;
  public status!: 'Pending' | 'In Progress' | 'Completed';
  public createdById!: string;
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

export default TaskModel;

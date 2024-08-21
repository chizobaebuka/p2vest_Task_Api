import { DataTypes, Model } from 'sequelize';
import UserModel from './usermodel';
import TaskModel from './taskmodel';
import connection from '../sequelize';

interface CommentAttributes {
  id: string;
  content: string;
  taskId: string;
  userId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

class CommentModel extends Model<CommentAttributes> implements CommentAttributes {
  public id!: string;
  public content!: string;
  public taskId!: string;
  public userId!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

CommentModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    taskId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'tasksTable', // Make sure this matches the TaskModel table name
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'usersTable', // Make sure this matches the UserModel table name
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
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
    modelName: 'CommentModel',
    tableName: 'commentsTable',
    timestamps: true,
  }
);

// Associations
CommentModel.belongsTo(UserModel, {
  as: 'author',
  foreignKey: 'userId',
});

CommentModel.belongsTo(TaskModel, {
  as: 'task',
  foreignKey: 'taskId',
});

export default CommentModel;

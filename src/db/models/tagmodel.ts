import { DataTypes, Model } from 'sequelize';
import connection from '../sequelize';
import TaskModel from './taskmodel';

interface TagAttributes {
  id: string;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

class TagModel extends Model<TagAttributes> implements TagAttributes {
  public id!: string;
  public name!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static associate(models: { TaskModel: typeof TaskModel }) {
    TagModel.belongsToMany(models.TaskModel, {
      through: 'TaskTags',
      as: 'tasks',
      foreignKey: 'tagId',
      otherKey: 'taskId',
    });
  }
}

TagModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
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
    modelName: 'TagModel',
    tableName: 'tagsTable',
    timestamps: true,
  }
);

// TagModel.belongsToMany(TaskModel, { through: 'TaskTags', as: 'tasks', foreignKey: 'tagId', otherKey: 'taskId' });
// TaskModel.belongsToMany(TagModel, { through: 'TaskTags', as: 'tags' });


export default TagModel;

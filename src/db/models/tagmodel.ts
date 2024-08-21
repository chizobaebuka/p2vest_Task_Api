import { DataTypes, Model } from 'sequelize';
import connection from '../sequelize';

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

export default TagModel;

import { DataTypes, Model } from 'sequelize';
import connection from '../sequelize';
import UserModel from './usermodel';
import TaskModel from './taskmodel';

interface NotificationAttributes {
    id: string;
    type: string;
    message: string;
    isRead: boolean;
    userId: string; // References the UserModel
    taskId: string; // References the TaskModel
    createdAt?: Date;
    updatedAt?: Date;
}

class NotificationModel extends Model<NotificationAttributes> implements NotificationAttributes {
    public id!: string;
    public type!: string;
    public message!: string;
    public isRead!: boolean;
    public userId!: string;
    public taskId!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    public static associate() {
        NotificationModel.belongsTo(UserModel, {
            foreignKey: 'userId',
            as: 'user',
        });

        NotificationModel.belongsTo(TaskModel, {
            foreignKey: 'taskId',
            as: 'task',
        });
    }
}

NotificationModel.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        type: {
            type: DataTypes.ENUM('TaskAssigned', 'TaskStatusUpdated'),
            allowNull: false,
        },
        message: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        isRead: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: UserModel,
                key: 'id',
            },
        },
        taskId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: TaskModel,
                key: 'id',
            },
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
        modelName: 'NotificationModel',
        tableName: 'notificationsTable',
        timestamps: true,
    }
);

// Associations
NotificationModel.belongsTo(UserModel, {
    foreignKey: 'userId',
    as: 'user',
});

NotificationModel.belongsTo(TaskModel, {
    foreignKey: 'taskId',
    as: 'task',
});

export default NotificationModel;

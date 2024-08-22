import { Sequelize } from 'sequelize';
import connection from '../sequelize'; // Adjust the path as necessary

import UserModel from './usermodel'; // Adjust the path as necessary
import TaskModel from './taskmodel'; // Adjust the path as necessary
import TagModel from './tagmodel'; // Adjust the path as necessary

const models: { [key: string]: any } = {
    UserModel,
    TaskModel,
    TagModel
};

Object.keys(models).forEach((modelName) => {
    if ('associate' in models[modelName]) {
        models[modelName].associate(models);
    }
});

export { models, connection };

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

TagModel.associate({ TaskModel });
UserModel.hasMany(TaskModel, { foreignKey: 'createdById' });

connection.sync({ force: true }).then(() => {
    console.log('Database synchronized');
    connection.close(); // Close the connection when done for better resource management.
    process.exit(0); // Exit the process with a success status.
})

Object.keys(models).forEach((modelName) => {
    if ('associate' in models[modelName]) {
        models[modelName].associate(models);
    }
});

export { models, connection };

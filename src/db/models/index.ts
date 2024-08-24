import connection from '../sequelize'; 

import UserModel from './usermodel'; 
import TaskModel from './taskmodel'; 
import TagModel from './tagmodel'; 

const models: { [key: string]: any } = {
    UserModel,
    TaskModel,
    TagModel
};

// TagModel.associate({ TaskModel });
// UserModel.hasMany(TaskModel, { foreignKey: 'createdById' });


Object.keys(models).forEach((modelName) => {
    if ('associate' in models[modelName]) {
        models[modelName].associate(models);
    }
});

export { models, connection };

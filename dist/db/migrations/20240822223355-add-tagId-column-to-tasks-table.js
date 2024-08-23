'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('tasksTable', 'tagId', {
            type: Sequelize.UUID,
            allowNull: true, // Assuming the tag is optional
            references: {
                model: 'tagsTable', // The name of the tags table
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL', // Set to null if the referenced tag is deleted
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn('tasksTable', 'tagId');
    }
};

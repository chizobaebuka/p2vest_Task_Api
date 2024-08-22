"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('TaskTags', {
            taskId: {
                type: Sequelize.UUID,
                references: {
                    model: 'tasksTable', // Table name for TaskModel
                    key: 'id',
                },
                allowNull: false,
            },
            tagId: {
                type: Sequelize.UUID,
                references: {
                    model: 'tagsTable', // Table name for TagModel
                    key: 'id',
                },
                allowNull: false,
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('TaskTags');
    },
};

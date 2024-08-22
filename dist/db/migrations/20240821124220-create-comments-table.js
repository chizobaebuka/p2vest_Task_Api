"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('commentsTable', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
            },
            content: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            taskId: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'tasksTable',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            userId: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'usersTable',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL',
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
        await queryInterface.dropTable('commentsTable');
    },
};

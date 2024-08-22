"use strict";
module.exports = {
    async down(queryInterface, Sequelize) {
        // Check if the column exists before attempting to remove it
        const table = await queryInterface.describeTable('tasksTable');
        if (table['assignedToId']) {
            await queryInterface.removeColumn('tasksTable', 'assignedToId');
        }
        // Optionally, drop the table if needed
        await queryInterface.dropTable('tasksTable');
    },
    async up(queryInterface, Sequelize) {
        // Optionally recreate the table with original columns if necessary
        await queryInterface.createTable('tasksTable', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
            },
            title: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            description: {
                type: Sequelize.TEXT,
                allowNull: false,
            },
            status: {
                type: Sequelize.ENUM('Pending', 'In Progress', 'Completed'),
                allowNull: false,
                defaultValue: 'Pending',
            },
            createdById: {
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
    }
};

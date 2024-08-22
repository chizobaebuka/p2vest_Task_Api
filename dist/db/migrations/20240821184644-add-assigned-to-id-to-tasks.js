"use strict";
// src/db/migrations/20240821235959-add-assigned-to-id-to-tasks.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('tasksTable', 'assignedToId', {
            type: Sequelize.UUID,
            allowNull: true, // Assignment is optional
        });
        // Add foreign key constraint for assignedToId
        await queryInterface.addConstraint('tasksTable', {
            fields: ['assignedToId'],
            type: 'foreign key',
            name: 'fk_tasks_assigned_to',
            references: {
                table: 'usersTable', // The name of the user table
                field: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
        });
    },
    async down(queryInterface, Sequelize) {
        // Remove foreign key constraint
        await queryInterface.removeConstraint('tasksTable', 'fk_tasks_assigned_to');
        // Remove the assignedToId column
        await queryInterface.removeColumn('tasksTable', 'assignedToId');
    },
};

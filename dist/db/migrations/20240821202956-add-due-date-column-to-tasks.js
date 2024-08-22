"use strict";
// src/db/migrations/20240821235959-add-assigned-to-id-to-tasks.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    async down(queryInterface, Sequelize) {
        await queryInterface.addColumn('tasksTable', 'dueDate', {
            type: Sequelize.DATE, // Use DATE type for the due date
            allowNull: true, // Due date is optional
        });
    },
    async up(queryInterface, Sequelize) {
        // Remove the assignedToId column
        await queryInterface.removeColumn('tasksTable', 'dueDate');
    },
};

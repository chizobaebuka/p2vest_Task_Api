// src/db/migrations/20240821235959-add-assigned-to-id-to-tasks.ts

import { DataTypes, QueryInterface } from 'sequelize';

export default {
  async up(queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
    await queryInterface.addColumn('tasksTable', 'dueDate', {
      type: Sequelize.DATE, // Use DATE type for the due date
      allowNull: true, // Due date is optional
    });
  },

  async down(queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
    // Remove the assignedToId column
    await queryInterface.removeColumn('tasksTable', 'dueDate');
  },
};

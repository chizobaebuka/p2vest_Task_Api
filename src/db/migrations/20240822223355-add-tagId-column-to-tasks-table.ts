'use strict';

import { DataTypes, QueryInterface } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
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

  async down (queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
    await queryInterface.removeColumn('tasksTable', 'tagId');
  }
};

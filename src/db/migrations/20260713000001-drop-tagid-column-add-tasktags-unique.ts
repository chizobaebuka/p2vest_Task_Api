import { DataTypes, QueryInterface } from 'sequelize';

export default {
  async up(queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
    // Tasks now hold tags exclusively through the TaskTags join table
    // (many-to-many). The single tagId column could only ever record one
    // tag per task and was being overwritten on every addTagsToTask call.
    await queryInterface.removeColumn('tasksTable', 'tagId');

    // Prevent the same tag from being attached to the same task twice.
    await queryInterface.addConstraint('TaskTags', {
      fields: ['taskId', 'tagId'],
      type: 'unique',
      name: 'unique_task_tag',
    });
  },

  async down(queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
    await queryInterface.removeConstraint('TaskTags', 'unique_task_tag');

    await queryInterface.addColumn('tasksTable', 'tagId', {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'tagsTable',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  },
};

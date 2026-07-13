import { DataTypes, QueryInterface } from 'sequelize';

export default {
  async up(queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
    // Postgres does not automatically index foreign key columns, and these
    // are exactly the columns every join/filter in the API queries on.
    await queryInterface.addIndex('tasksTable', ['createdById'], { name: 'idx_tasks_created_by_id' });
    await queryInterface.addIndex('tasksTable', ['assignedToId'], { name: 'idx_tasks_assigned_to_id' });
    await queryInterface.addIndex('tasksTable', ['status'], { name: 'idx_tasks_status' });
    await queryInterface.addIndex('tasksTable', ['dueDate'], { name: 'idx_tasks_due_date' });

    await queryInterface.addIndex('commentsTable', ['taskId'], { name: 'idx_comments_task_id' });
    await queryInterface.addIndex('commentsTable', ['userId'], { name: 'idx_comments_user_id' });

    await queryInterface.addIndex('notificationsTable', ['userId'], { name: 'idx_notifications_user_id' });
    await queryInterface.addIndex('notificationsTable', ['taskId'], { name: 'idx_notifications_task_id' });
  },

  async down(queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
    await queryInterface.removeIndex('tasksTable', 'idx_tasks_created_by_id');
    await queryInterface.removeIndex('tasksTable', 'idx_tasks_assigned_to_id');
    await queryInterface.removeIndex('tasksTable', 'idx_tasks_status');
    await queryInterface.removeIndex('tasksTable', 'idx_tasks_due_date');

    await queryInterface.removeIndex('commentsTable', 'idx_comments_task_id');
    await queryInterface.removeIndex('commentsTable', 'idx_comments_user_id');

    await queryInterface.removeIndex('notificationsTable', 'idx_notifications_user_id');
    await queryInterface.removeIndex('notificationsTable', 'idx_notifications_task_id');
  },
};

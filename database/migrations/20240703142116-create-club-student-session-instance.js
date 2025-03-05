'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('club_student_session_instances', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      clubStudentId: {
        type: Sequelize.UUID,
        references: {
          model: 'club_students',
          key: 'id',
        },
        onDelete: 'SET NULL',
      },
      sessionInstanceId: {
        type: Sequelize.UUID,
        references: {
          model: 'session_instances',
          key: 'id',
        },
        onDelete: 'SET NULL',
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('club_student_session_instances');
  },
};

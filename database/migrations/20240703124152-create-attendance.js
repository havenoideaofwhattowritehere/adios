'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('attendances', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      sessionInstanceId: {
        type: Sequelize.UUID,
        references: {
          model: 'session_instances',
          key: 'id',
        },
        onDelete: 'SET NULL',
      },
      sessionStudentId: {
        type: Sequelize.UUID,
        references: {
          model: 'session_participants',
          key: 'id',
        },
        onDelete: 'SET NULL',
      },
      attended: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('attendances');
  },
};

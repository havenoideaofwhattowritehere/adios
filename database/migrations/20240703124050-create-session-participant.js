'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('session_participants', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      sessionId: {
        type: Sequelize.UUID,
        references: {
          model: 'sessions',
          key: 'id',
        },
        onDelete: 'SET NULL',
      },
      clubStudentId: {
        type: Sequelize.UUID,
        references: {
          model: 'club_students',
          key: 'id',
        },
        onDelete: 'SET NULL',
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
    await queryInterface.dropTable('session_participants');
  },
};

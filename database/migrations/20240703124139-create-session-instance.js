'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('session_instances', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      sessionScheduleId: {
        type: Sequelize.UUID,
        references: {
          model: 'session_schedules',
          key: 'id',
        },
        onDelete: 'SET NULL',
      },
      isCanceled: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      durationMinutes: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      datetime: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('session_instances');
  },
};

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('sessions', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      clubId: {
        type: Sequelize.UUID,
        references: {
          model: 'clubs',
          key: 'id',
        },
        onDelete: 'SET NULL',
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      defaultDurationInMinutes: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 30,
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
    await queryInterface.dropTable('sessions');
  },
};

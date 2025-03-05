'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('club_students', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      clubId: {
        type: Sequelize.UUID,
        references: {
          model: 'clubs',
          key: 'id',
        },
        onDelete: 'SET NULL',
      },
      userId: {
        type: Sequelize.UUID,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'SET NULL',
      },
      status: {
        type: Sequelize.ENUM('active', 'inactive'),
        allowNull: false,
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

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('club_students');
  }
};

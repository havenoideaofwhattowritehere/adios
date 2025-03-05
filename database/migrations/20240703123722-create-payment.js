'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('payments', {
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
      amount: {
        allowNull: false,
        type: Sequelize.FLOAT,
      },
      method: {
        type: Sequelize.ENUM('cash', 'card'),
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
    await queryInterface.dropTable('payments');
  }
};

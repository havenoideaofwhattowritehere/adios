'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('payment_targets', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      paymentId: {
        type: Sequelize.UUID,
        references: {
          model: 'payments',
          key: 'id',
        },
        onDelete: 'SET NULL',
      },
      sessionId: {
        type: Sequelize.UUID,
        references: {
          model: 'sessions',
          key: 'id',
        },
        onDelete: 'SET NULL',
      },
      month: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: Sequelize.NOW,
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
    await queryInterface.dropTable('payment_targets');
  }
};

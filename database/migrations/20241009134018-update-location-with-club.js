'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('locations', 'clubId', {
      type: Sequelize.UUID,
      references: {
        model: 'clubs',
        key: 'id',
      },
      onDelete: 'SET NULL',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('locations', 'clubId');
  },
};

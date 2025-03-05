'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('sessions', 'locationId', {
      type: Sequelize.UUID,
      references: {
        model: 'locations',
        key: 'id',
      },
      onDelete: 'SET NULL',
    });

    await queryInterface.addColumn('sessions', 'type', {
      type: Sequelize.ENUM('group', 'individual'),
      allowNull: false,
    });
    
    await queryInterface.addColumn('sessions', 'maxPeople', {
      type: Sequelize.INTEGER,
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('sessions', 'locationId');
    await queryInterface.removeColumn('sessions', 'type');
    await queryInterface.removeColumn('sessions', 'maxPeople');
  },
};

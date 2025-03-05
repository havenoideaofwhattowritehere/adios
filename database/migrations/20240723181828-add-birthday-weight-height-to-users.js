'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'birthday', {
      type: Sequelize.DATEONLY,
      allowNull: true,
    });

    await queryInterface.addColumn('users', 'weight', {
      type: Sequelize.FLOAT,
      allowNull: true,
    });

    await queryInterface.addColumn('users', 'height', {
      type: Sequelize.FLOAT,
      allowNull: true,
    });
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'birthday');
    await queryInterface.removeColumn('users', 'weight');
    await queryInterface.removeColumn('users', 'height');
  },
};

'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('users', 'phone', {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false,
    });
    await queryInterface.changeColumn('clubs', 'name', {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('users', 'phone', {
      type: Sequelize.STRING,
      unique: false,
      allowNull: true,
    });
    await queryInterface.changeColumn('clubs', 'name', {
      type: Sequelize.STRING,
      unique: false,
      allowNull: false,
    });
  },
};

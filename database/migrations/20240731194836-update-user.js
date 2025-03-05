'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'isRegistrationCompleted', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });

    await queryInterface.changeColumn('users', 'firstName', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.changeColumn('users', 'lastName', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.changeColumn('users', 'phone', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.changeColumn('users', 'gender', {
      type: Sequelize.ENUM('male', 'female'),
      allowNull: true,
    });

    await queryInterface.removeColumn('users', 'email');
    await queryInterface.removeColumn('users', 'password');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'isRegistrationCompleted');

    await queryInterface.changeColumn('users', 'firstName', {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.changeColumn('users', 'lastName', {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.changeColumn('users', 'phone', {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.changeColumn('users', 'gender', {
      type: Sequelize.ENUM('male', 'female'),
      allowNull: false,
    });

    await queryInterface.addColumn('users', 'email', {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.addColumn('users', 'password', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },
};

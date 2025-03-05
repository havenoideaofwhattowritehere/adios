'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('users', 'deletedAt');
    await queryInterface.removeColumn('clubs', 'deletedAt');
    await queryInterface.removeColumn('club_staffs', 'deletedAt');
    await queryInterface.removeColumn('club_students', 'deletedAt');
    await queryInterface.removeColumn('payments', 'deletedAt');
    await queryInterface.removeColumn('sessions', 'deletedAt');
    await queryInterface.removeColumn('payment_targets', 'deletedAt');
    await queryInterface.removeColumn('session_participants', 'deletedAt');
    await queryInterface.removeColumn('session_schedules', 'deletedAt');
    await queryInterface.removeColumn('attendances', 'deletedAt');
    await queryInterface.removeColumn('club_student_sessions', 'deletedAt');
    await queryInterface.removeColumn(
      'club_student_session_instances',
      'deletedAt',
    );
    await queryInterface.removeColumn('locations', 'deletedAt');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'deletedAt', {
      type: Sequelize.DATE,
      allowNull: true,
    });
    await queryInterface.addColumn('clubs', 'deletedAt', {
      type: Sequelize.DATE,
      allowNull: true,
    });
    await queryInterface.addColumn('club_staffs', 'deletedAt', {
      type: Sequelize.DATE,
      allowNull: true,
    });
    await queryInterface.addColumn('club_students', 'deletedAt', {
      type: Sequelize.DATE,
      allowNull: true,
    });
    await queryInterface.addColumn('payments', 'deletedAt', {
      type: Sequelize.DATE,
      allowNull: true,
    });
    await queryInterface.addColumn('sessions', 'deletedAt', {
      type: Sequelize.DATE,
      allowNull: true,
    });
    await queryInterface.addColumn('payment_targets', 'deletedAt', {
      type: Sequelize.DATE,
      allowNull: true,
    });
    await queryInterface.addColumn('session_participants', 'deletedAt', {
      type: Sequelize.DATE,
      allowNull: true,
    });
    await queryInterface.addColumn('session_schedules', 'deletedAt', {
      type: Sequelize.DATE,
      allowNull: true,
    });
    await queryInterface.addColumn('attendances', 'deletedAt', {
      type: Sequelize.DATE,
      allowNull: true,
    });
    await queryInterface.addColumn('club_student_sessions', 'deletedAt', {
      type: Sequelize.DATE,
      allowNull: true,
    });
    await queryInterface.addColumn(
      'club_student_session_instances',
      'deletedAt',
      {
        type: Sequelize.DATE,
        allowNull: true,
      },
    );
    await queryInterface.addColumn('locations', 'deletedAt', {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },
};

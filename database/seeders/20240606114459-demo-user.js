'use strict';
const { v4 } = require('uuid');

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Users', [
      {
        id: v4(),
        auth0UserId: v4(),
        firstName: 'Admin',
        lastName: 'Admin',
        phone: '+1(111)1111111',
        gender: 'male',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: v4(),
        auth0UserId: v4(),
        firstName: 'John',
        lastName: 'Doe',
        phone: '+2(222)2222222',
        gender: 'male',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: v4(),
        auth0UserId: v4(),
        firstName: 'John',
        lastName: 'Doe',
        phone: '+3(333)3333333',
        gender: 'male',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: v4(),
        auth0UserId: v4(),
        firstName: 'John',
        lastName: 'Doe',
        phone: '+4(444)4444444',
        gender: 'male',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: v4(),
        auth0UserId: v4(),
        firstName: 'Guest',
        lastName: 'Guest',
        phone: '+5(555)5555555',
        gender: 'male',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Users', null, {});
  },
};

'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    let data = require('../data/users.json').map((e)=> {
      delete e.id;
      e.createdAt = new Date();
      e.updatedAt = new Date();
      return e;
    })

    await queryInterface.bulkInsert('Users', data, {});

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};

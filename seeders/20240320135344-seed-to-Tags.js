'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    let data = require('../tags.json').map((e)=> {
      delete e.id;
      e.createdAt = new Date();
      e.updatedAt = new Date();
      return e;
    })

    await queryInterface.bulkInsert('Tags', data, {});

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Tags', null, {});
  }
};
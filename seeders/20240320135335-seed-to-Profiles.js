'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    let data = require('../data/profiles.json').map((e)=> {
      delete e.id;
      e.createdAt = new Date();
      e.updatedAt = new Date();
      return e;
    })

    await queryInterface.bulkInsert('Profiles', data, {});

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Profiles', null, {});
  }
};

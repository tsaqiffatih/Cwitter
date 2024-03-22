'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    let data = require('../data/post.json').map((e)=> {
      delete e.id;
      e.createdAt = new Date();
      e.updatedAt = new Date();
      return e;
    })

    await queryInterface.bulkInsert('Posts', data, {});

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Posts', null, {});
  }
};
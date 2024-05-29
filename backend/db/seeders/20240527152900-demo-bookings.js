'use strict';

const { Booking } = require('../models')

/** @type {import('sequelize-cli').Migration} */

let options = {};
options.tableName = 'Bookings'
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await Booking.bulkCreate(options,[
      {
        spotId: 1,
        userId: 2,
        startDate: "2024-06-05",
        endDate: "2024-06-15"
      },
      {
        spotId: 1,
        userId: 3,
        startDate: "2024-06-05",
        endDate: "2024-06-15"
      },
      {
        spotId: 3,
        userId: 1,
        startDate: "2024-06-05",
        endDate: "2024-06-15"
      },
      {
        spotId: 3,
        userId: 1,
        startDate: "2024-06-05",
        endDate: "2024-06-15"
      },
    ])
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Bookings';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {}, {});
  }
};

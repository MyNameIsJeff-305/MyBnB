'use strict';
const { Review } = require('../models')

/** @type {import('sequelize-cli').Migration} */

let options = {};
options.tableName = 'Reviews'
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await Review.bulkCreate([
      {
        userId: 1,
        spotId: 1,
        review: "Too far away from Home",
        stars: 3
      },
      {
        userId: 2,
        spotId: 1,
        review: "I got dizzy due the highs, didn't love at all",
        stars: 3
      },
      {
        userId: 3,
        spotId: 1,
        review: "Fished a lot of Bass and Snappers!",
        stars: 4
      },
      {
        userId: 1,
        spotId: 2,
        review: "Can't love more this place. I got a new job one month after graduation!",
        stars: 4
      },
      {
        userId: 2,
        spotId: 2,
        review: "Love how great is this place. All is like in the movie",
        stars: 5
      },
      {
        userId: 3,
        spotId: 2,
        review: "Too many mosquitoes",
        stars: 2
      },
      {
        userId: 2,
        spotId: 3,
        review: "Love how great is this place. All is like in the movie",
        stars: 5
      },
      {
        userId: 3,
        spotId: 3,
        review: "Too many mosquitoes",
        stars: 2
      },
    ], options)
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {}, {});
  }
};

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
        userId: 2,
        spotId: 1,
        review: "Can't say enough positive things about App Academy. I was already a physical therapist when I decided to switch careers, App Academy (while a rigorous course) was excellent at teaching the fundamental of programming and helping me land my first software engineering job. Most importantly the amount of support I've gotten from App Academy even after graduating has been excellent, with alumni services and plenty of room for professional growth. App Academy really holds up its end of the deal of teaching software development and helping people get software engineering jobs, and I couldn't be more thankful.",
        stars: 5
      },
      {
        userId: 3,
        spotId: 1,
        review: "The best Academic decision of my life! App Academy is highly invested in not just teaching to code but also making sure you grow in your career. They offer opportunities to connect with Alumni as well as resources to assist you in finding jobs (even after you have landed your first job and your tuition has been paid). I cannot recommend App Academy enough.",
        stars: 5
      },
      {
        userId: 3,
        spotId: 2,
        review: "Too Many Mosquitoes",
        stars: 3
      },
      {
        userId: 2,
        spotId: 2,
        review: "A little bit far away home, but a nice place",
        stars: 4
      },
      {
        userId: 1,
        spotId: 3,
        review: "Love how great is this place. All is like in the movie",
        stars: 5
      },
      {
        userId: 3,
        spotId: 3,
        review: "I am afraid of highs",
        stars: 2
      },
      {
        userId: 1,
        spotId: 4,
        review: "Air Conditioner was not working.",
        stars: 2
      },
      {
        userId: 3,
        spotId: 4,
        review: "Pool was a mess",
        stars: 3
      },
      {
        userId: 1,
        spotId: 5,
        review: "Lovely Place!",
        stars: 5
      },
      {
        userId: 3,
        spotId: 5,
        review: "Not a clean place",
        stars: 3
      },
      {
        userId: 1,
        spotId: 6,
        review: "It' like live in the rel headquarter",
        stars: 5
      },
      {
        userId: 2,
        spotId: 6,
        review: "I do not like this place",
        stars: 1
      },
    ], options)
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {}, {});
  }
};

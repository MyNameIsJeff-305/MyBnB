'use strict';
const { Spot } = require('../models');
const bcrypt = require("bcryptjs");

/** @type {import('sequelize-cli').Migration} */

let options = {};
options.tableName = 'Spots'
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

//BONUS REMINDER: IMPLEMENT ZIP CODES

module.exports = {
  async up (queryInterface, Sequelize) {
   await Spot.bulkCreate([
    {
      name: 'App Academy',
      description: "A nice place where turn into a Software Engineer",
      price: 234.45,
      address: "548 Market St Suite 96590",
      city: "San Francisco",
      state: "California",
      country: "United States",
      lat: 37.7899616,
      lng: -122.4034589,
      ownerId: 1
    },
    {
      name: 'The Pines Homestead',
      description: "This Colonial Style Home has countless amenities. Nestled on it's own, private 5-acre lake with a fishing pier and paddle boat for your pleasure. This property is surrounded by 150 acres of gorgeous Pine Trees. Take a stroll in the woods, enjoy a campfire, Rock on the rocking chairs on the front porch, sip a glass of wine and watch sunset light up the sky through the pines. Soak in the 6 person jacuzzi under the stars. Come make yourself at home and enjoy our slice of paradise.",
      price: 299.99,
      address: "4281 Georgia 46",
      city: "Soperton",
      state: "Georgia",
      country: "United States",
      lat: 32.3436195,
      lng: -82.6568411,
      ownerId: 1
    },
    {
      name: 'The Up house',
      description: "I don’t always like visitors, but I guess it’s pretty nice to have them now that it’s just me and Dug. So, come stay in my cozy home I made with my dear Ellie. My greatest adventures have happened here, and I learned that the best ones are always with someone you love, so bring your pals to kickstart your very own Adventure Book and watch as my house drifts off before you depart.",
      price: 299.99,
      address: "21132 US-84",
      city: "Espanola",
      state: "New Mexico",
      country: "United States",
      lat: 36.2071897,
      lng: -106.3187518,
      ownerId: 2
    }
   ])
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      name: {[Op.in]: ['App Academy', 'The Pines Homestead', 'The Up house']}
    }, {});
  }
};

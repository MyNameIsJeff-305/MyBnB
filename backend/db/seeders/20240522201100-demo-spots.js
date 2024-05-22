'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = {};
options.tableName = 'Users'
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
   await spot.bulkCreate([
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
    }
   ])
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      name: {[Op.in]: ['App Academy']}
    }, {});
  }
};

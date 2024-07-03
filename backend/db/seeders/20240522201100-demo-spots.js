'use strict';
const { Spot } = require('../models');
const bcrypt = require("bcryptjs");

/** @type {import('sequelize-cli').Migration} */

let options = {};
options.tableName = 'Spots'
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await Spot.bulkCreate([
      {
        name: 'App Academy',
        description: "App Academy is a renowned coding bootcamp that offers intensive, immersive programs designed to transform individuals into skilled software engineers. Founded on the principles of accessibility and quality education, App Academy combines rigorous coursework with hands-on projects and real-world applications. Students learn in-demand programming languages like JavaScript, Ruby on Rails, and React, gaining proficiency through a curriculum that emphasizes both technical mastery and problem-solving skills. With a commitment to fostering a supportive learning environment, App Academy equips graduates with the tools and knowledge needed to succeed in the fast-paced tech industry, making it a premier choice for aspiring developers worldwide.",
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
        description: "This Colonial Style Home has countless amenities.",
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
        description: "I don’t always like visitors, but I guess it’s pretty nice to have them now that it’s just me and Dug. ",
        price: 299.99,
        address: "21132 US-84",
        city: "Espanola",
        state: "New Mexico",
        country: "United States",
        lat: 36.2071897,
        lng: -106.3187518,
        ownerId: 2
      },
      {
        name: 'Luxury Disney Vacation Home on Reunion Golf Resort',
        description: "This 5 bedroom Luxury family vacation home has one of the most picturesque views in all of Reunion, located on the 14th fairway of the Jack Nicklaus course. 2 MASTER SUITES which looks over your private POOL & SPA. All rooms are professionally decorated with a Disney and a Harry Potter room. Your family will stay busy with the arcade, pool table, ping pong table and a large number of board games for all ages. Pool area has a basketball and volleyball net and a WEBER BBQ",
        price: 407,
        address: "331 Muirfield Loop",
        city: "Kissimmee",
        state: "Florida",
        country: "United States",
        lat: 28.2840529,
        lng: -81.6027615,
        ownerId: 2
      },
      {
        name: 'Tranquility with Resort Access',
        description: "This is a truly magical place for our family and guests. Unwind and let all of your troubles go while you swing in our benches hanging from 200 year old oak trees. Wake up and sip your coffee while gazing out to the vast distance and let your imagination run free.",
        price: 242,
        address: "25310 Oakmont Dr",
        city: "Lake Wales",
        state: "Florida",
        country: "United States",
        lat: 27.76997,
        lng: -81.2065782,
        ownerId: 3
      },
      {
        name: 'Make core memories with Inside Out 2',
        description: "Do you ever look at someone and wonder, “What is going on inside their head?” Well, now you don’t have to! Because for the first time ever, I’m inviting guests to spend the night at Team Riley Headquarters. Amazing, right?! I know what you’re thinking, and yes, you can take control of Riley’s emotions. All of them. More than I ever thought could or should be here. Anyway, please be gentle with her. I just love our girl so much!",
        price: 160.99,
        address: "25310 Oakmont Dr",
        city: "Las Vegas",
        state: "Nevada",
        country: "United States",
        lat: 36.2912236,
        lng: -115.2445241,
        ownerId: 3
      }
    ], options)
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      name: { [Op.in]: ['App Academy', 'The Pines Homestead', 'The Up house'] }
    }, {});
  }
};

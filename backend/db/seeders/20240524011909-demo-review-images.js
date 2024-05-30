'use strict';

const { ReviewImage } = require('../models')

/** @type {import('sequelize-cli').Migration} */

let options = {};
options.tableName = 'ReviewImages'
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await ReviewImage.bulkCreate(options,[
      {
        url: "https://computersciencehero.com/wp-content/uploads/2019/10/o.jpg",
        reviewId: 1
      },
      {
        url: "https://computersciencehero.com/wp-content/uploads/2019/10/app-academy-cover.jpg",
        reviewId: 2
      },
      {
        url: "https://pbs.twimg.com/media/DBr6IOKXcAEhbbX.jpg",
        reviewId: 1
      },
      {
        url: "https://computersciencehero.com/wp-content/uploads/2019/10/app-academy-cover.jpg",
        reviewId: 2
      },
      {
        url: "https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6MTEyNjE4NTg5MzIzNjI0NjI2MA%3D%3D/original/ba2f3fdb-57c8-48c3-81bc-9f9b79a90b42.jpeg?im_w=2560&im_q=highq",
        reviewId: 3
      },
      {
        url: "https://images.ctfassets.net/pujs1b1v0165/2AvtJ9pcEJ4bjxkR8Vc5bJ/5d1033f3c8f450f73cf54b521bb06b4e/How_to_Find_the_Right_Depth_for_Bass.jpg?w=1280",
        reviewId: 4
      },
      {
        url: "https://koa.com/blog/images/large-mouth-bass.jpg?preset=heroimagecropped",
        reviewId: 4
      },
    ])
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'ReviewImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {}, {});
  }
};

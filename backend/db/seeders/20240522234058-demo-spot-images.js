'use strict';
const { SpotImage } = require('../models');

/** @type {import('sequelize-cli').Migration} */

let options = {};
options.tableName = 'Spots'
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await SpotImage.bulkCreate([
      {
        url: "https://assets-global.website-files.com/5dcc7f8c449e597ed83356b8/5e3a384c96ecbe8564dadb2a_Artboard%20Copy%206-p-800.webp",
        spotId: 1,
        preview: true
      },
      {
        url: "https://assets-global.website-files.com/5dcc7f8c449e597ed83356b8/650261d8cce9ccd6eb6e236f_unsplash_ZJEKICY5EXY-p-500.webp",
        spotId: 1.
      },
      {
        url: "https://assets-global.website-files.com/5dcc7f8c449e597be23356e0/64e7fe3c7fa59319efb79b52_APP_ACADEMY_1014%20(1)-p-1600.jpg",
        spotId: 1
      },
      {
        url: "https://a0.muscache.com/im/pictures/miso/Hosting-868393983200444961/original/8cc76862-e59e-45da-aa73-8ff76d7038d3.jpeg?im_w=960",
        spotId: 2,
        preview: true
      },
      {
        url: "https://a0.muscache.com/im/pictures/miso/Hosting-868393983200444961/original/78b67d5e-febc-45a6-89d3-74c7fe80512c.jpeg?im_w=1200",
        spotId: 2
      },
      {
        url: "https://a0.muscache.com/im/pictures/miso/Hosting-868393983200444961/original/b457164c-6030-4c51-a937-f66c0f37b38f.jpeg?im_w=1200",
        spotId: 2
      },
      {
        url: "https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6MTEyNjE4NTg5MzIzNjI0NjI2MA%3D%3D/original/e6b26733-2c15-47d9-b097-6968b39bb697.jpeg?im_w=1920&im_q=highq",
        spotId: 3,
        preview: true
      },
      {
        url: "https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6MTEyNjE4NTg5MzIzNjI0NjI2MA%3D%3D/original/c6e8b725-62c3-45d8-a9bb-33dd6b62df99.jpeg?im_w=2560&im_q=highq",
        spotId: 3
      },
      {
        url: "https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6MTEyNjE4NTg5MzIzNjI0NjI2MA%3D%3D/original/da8954c4-76fc-4572-a3c9-8fcefd667e7d.jpeg?im_w=2560&im_q=highq",
        spotId: 3
      },
      {
        url: "https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6MTEyNjE4NTg5MzIzNjI0NjI2MA%3D%3D/original/d4eb3373-8aab-4634-bbfe-aba2836895c0.jpeg?im_w=2560&im_q=highq",
        spotId: 3
      },
      {
        url: "https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6MTEyNjE4NTg5MzIzNjI0NjI2MA%3D%3D/original/65f84c4a-f3f0-49a2-8faa-27861aaa9b33.jpeg?im_w=2560&im_q=highq",
        spotId: 3
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {}, {});
  }
};

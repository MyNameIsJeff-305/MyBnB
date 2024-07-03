'use strict';
const { preview } = require('vite');
const { SpotImage } = require('../models');

/** @type {import('sequelize-cli').Migration} */

let options = {};
options.tableName = 'Spots'
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
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
      },
      {
        url: "https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6MTM0ODc0NjQ%3D/original/40031892-0279-4327-8ca6-fedc2375165d.jpeg?im_w=960",
        spotId: 4,
        preview: true
      },
      {
        url: "https://a0.muscache.com/im/pictures/667956b9-da29-4ac2-98f7-20c7dfe71f2e.jpg?im_w=1200",
        spotId: 4
      },
      {
        url: "https://a0.muscache.com/im/pictures/ff3b47ab-91e3-4d4d-a50b-a23f849d9048.jpg?im_w=1200",
        spotId: 4
      },
      {
        url: "https://a0.muscache.com/im/pictures/miso/Hosting-13487464/original/af0e8cff-bbf5-4100-9d88-ac9ae4ffa5b3.jpeg?im_w=1200",
        spotId: 4
      },
      {
        url: "https://a0.muscache.com/im/pictures/93f9e608-c3f6-4a90-b28b-60b6199d7540.jpg?im_w=1200",
        spotId: 4
      },
      {
        url: "https://a0.muscache.com/im/pictures/miso/Hosting-800218468142723860/original/074bad21-ad08-4ea1-87f0-433161dfb832.jpeg?im_w=1200",
        spotId: 5,
        preview: true
      },
      {
        url: "https://a0.muscache.com/im/pictures/b7c51a51-5c22-4e28-8f55-516b37ea7f19.jpg?im_w=1200",
        spotId: 5
      },
      {
        url: "https://a0.muscache.com/im/pictures/miso/Hosting-800218468142723860/original/0ce6ffd3-84a8-4444-965a-81c5a6fc1138.jpeg?im_w=1200",
        spotId: 5
      },
      {
        url: "https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6MTEzMTA4MzUyMzk5Mjc3MDU5Nw%3D%3D/original/ced15ffe-0ab5-48cf-a189-dbdeaaf04387.jpeg?im_w=1920&im_q=highq",
        spotId: 6,
        preview: true
      },
      {
        url: "https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6MTEzMTA4MzUyMzk5Mjc3MDU5Nw%3D%3D/original/f52a6a13-c8d1-4966-ad19-e614fd4bae3c.jpeg?im_w=1920&im_q=highq",
        spotId: 6
      },
      {
        url: "https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6MTEzMTA4MzUyMzk5Mjc3MDU5Nw%3D%3D/original/0caa1462-bd5f-4cfa-8f9d-7012f7eb7d02.jpeg?im_w=1920&im_q=highq",
        spotId: 6
      },
      {
        url: "https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6MTEzMTA4MzUyMzk5Mjc3MDU5Nw%3D%3D/original/dcb25748-642f-4314-9815-acaba652ca1e.jpeg?im_w=960&im_q=highq",
        spotId: 6
      },
      {
        url: "https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6MTEzMTA4MzUyMzk5Mjc3MDU5Nw%3D%3D/original/1c51e2a3-fbf3-42df-abf2-70407923e12b.jpeg?im_w=960&im_q=highq",
        spotId: 6
      },
      {
        url: "https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6MTEzMTA4MzUyMzk5Mjc3MDU5Nw%3D%3D/original/8f21b0ad-7c68-469e-81ae-872e7d714c03.jpeg?im_w=960&im_q=highq",
        spotId: 6
      },
      {
        url: "https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6MTEzMTA4MzUyMzk5Mjc3MDU5Nw%3D%3D/original/40f5ca8e-51e1-4bb7-8a49-0ee06feb8ba6.jpeg?im_w=960&im_q=highq",
        spotId: 6
      },
    ], options)
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {}, {});
  }
};

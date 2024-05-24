'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ReviewImage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ReviewImage.init({
    url: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isUrl: true,
        len: [12, 100] //12 is the less possible amount of characters that a URL may have
      }

    },
    reviewId: {
      type: DataTypes.INTEGER

    }
  }, {
    sequelize,
    modelName: 'ReviewImage',
  });
  return ReviewImage;
};
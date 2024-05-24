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
      ReviewImage.belongsTo(
        models.Review,
        { foreignKey: 'reviewId', onDelete: "CASCADE" }
      )
    }
  }
  ReviewImage.init({
    url: {
      type: DataTypes.STRING(200),
      allowNull: false,
      unique: true,
      validate: {
        isUrl: true,
        len: [12, 200] //12 is the less possible amount of characters that a URL may have
      }

    },
    reviewId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'ReviewImage',
  });
  return ReviewImage;
};
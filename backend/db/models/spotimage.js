'use strict';
const {
  Model, Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SpotImage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      SpotImage.belongsTo(
        models.Spot,
        {

          foreignKey: 'spotId'
        },
      )
    }
  }
  SpotImage.init({
    url: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    spotId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    preview: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      validate: {
        isBoolean(value) {
          if(typeof value !== 'boolean')
              throw new Error("Preview must be true or false")
        }
      }
    }
  }, {
    sequelize,
    modelName: 'SpotImage',
  });
  return SpotImage;
};
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
          as: 'previewImage',
          foreignKey: 'spotId',
          onDelete: "CASCADE"
        },
      )
    }
  }
  SpotImage.init({
    url: {
      type: DataTypes.STRING(200),
      allowNull: false,
      unique: true,
      allowNull: false,
      validate: {
        isUrl: true,
        len: [12, 200] //12 is the less possible amount of characters that a URL may have
      }
    },
    spotId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isUrl: true,
        
      }
    },
    preview: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      validate: {
        isBoolean(value) {
          if (typeof value !== 'boolean')
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

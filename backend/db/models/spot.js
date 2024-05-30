'use strict';
const {
  Model,
  Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    static associate(models) {
      Spot.belongsTo(
        models.User, {
        as: 'Owner',
        foreignKey: 'ownerId',
        onDelete: 'CASCADE'
      }
      )
      Spot.hasMany(
        models.SpotImage,
        { as: "SpotImages", foreignKey: 'spotId', onDelete: 'CASCADE' },
      ),
        Spot.hasMany(
          models.Review,
          { foreignKey: 'spotId', onDelete: 'CASCADE' }
        ),
        Spot.hasMany(
          models.Booking,
          { foreignKey: "spotId" }
        )
    }
  }
  Spot.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [0, 100],
      }
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: [0, 500]
      }
    },
    price: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      validate: {
        min: 0,
        isFloat: true,
        isNumeric: true
      }
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [0, 100]
      }
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [0, 100]
      }
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [0, 100]
      }
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [0, 30]
      }
    },
    lat: {
      type: DataTypes.DECIMAL(9, 7),
      allowNull: false,
      validate: {
        min: -90,
        max: 90
      }
    },
    lng: {
      type: DataTypes.DECIMAL(10, 7),
      allowNull: false,
      validate: {
        min: -180,
        max: 180
      }
    },
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
        // onDelete: 'CASCADE'
      },
      onDelete: "CASCADE"
    }
  }, {
    sequelize,
    modelName: 'Spot',
  });
  return Spot;
};

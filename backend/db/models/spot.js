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
        { foreignKey: 'spotId', onDelete: 'CASCADE' },
      ),
        Spot.hasMany(
          models.Review,
          { foreignKey: 'spotId', onDelete: 'CASCADE' }
        ),
        Spot.hasMany(
          models.Booking,
          { foreignKey: "spotId", onDelete: "CASCADE" },
        )
    }
  }
  Spot.init({
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
        // onDelete: 'CASCADE'
      },
      onDelete: "CASCADE"
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        len: [0, 100]
      }
    },
    city: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        len: [0, 100]
      }
    },
    state: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        len: [0, 100]
      }
    },
    country: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        len: [0, 30]
      }
    },
    lat: {
      type: DataTypes.FLOAT,
      allowNull: true,
      validate: {
        min: -90,
        max: 90
      }
    },
    lng: {
      type: DataTypes.FLOAT,
      allowNull: true,
      validate: {
        min: -180,
        max: 180
      }
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        len: [0, 100],
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        len: [0, 500]
      }
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min: 0,
        isFloat: true,
        isNumeric: true
      }
    }
  }, {
    sequelize,
    modelName: 'Spot',
  });
  return Spot;
};

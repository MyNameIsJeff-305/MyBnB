'use strict';
const {
  Model,
  Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Spot.belongsTo(
        models.User, {
        as: 'Owner',
        foreignKey: 'ownerId'
      }
      ),
        Spot.hasMany(
          models.SpotImage,
          { foreignKey: 'spotId' }
        ),
        Spot.hasMany(
          models.Review,
          { foreignKey: 'spotId' }
        )
    }
  }
  Spot.init({
    name: {
      type: DataTypes.STRING(20),
      allowNull: false,
      validate: {
        len: [0, 20],
        isEmail: false,
        isNumeric: false,
      }
    },
    description: {
      type: DataTypes.STRING(500),
      allowNull: true,
      validate: {
        len: [0, 500]
      }
    },
    price: {
      type: DataTypes.FLOAT(5, 2),
      allowNull: false,
      validate: {
        min: 0,
        isFloat: true,
        isNumeric: true
      }
    },
    address: {
      type: DataTypes.STRING(30),
      allowNull: false,
      validate: {
        len: [0, 30]
      }
    },
    city: {
      type: DataTypes.STRING(30),
      allowNull: false,
      validate: {
        len: [0, 30]
      }
    },
    state: {
      type: DataTypes.STRING(20),
      allowNull: false,
      validate: {
        len: [0, 20]
      }
    },
    country: {
      type: DataTypes.STRING(30),
      allowNull: false,
      validate: {
        len: [0, 30]
      }
    },
    lat: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min: -90,
        max: 90
      }
    },
    lng: {
      type: DataTypes.FLOAT,
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
        key: 'id'
      },
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    sequelize,
    modelName: 'Spot',
  });
  return Spot;
};

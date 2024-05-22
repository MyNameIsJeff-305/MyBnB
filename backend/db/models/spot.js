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
          foreignKey: 'ownerId'
        }
      )
    }
  }
  Spot.init({
    name: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    description: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    price: {
      type: DataTypes.FLOAT(5, 2),
      allowNull: false,
      validate: {
        min: 0,
        isFloat: true
      }
    },
    address: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    city: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    state: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    country: {
      type: DataTypes.STRING(30),
      allowNull: false
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

'use strict';
const {
  Model,
  Validator,
  Sequelize
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {

  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(
        models.Spot, {
          foreignKey: 'ownerId'
        }
      ),
      User.hasMany(
        models.Review,
        {foreignKey: 'userId'}
      )
    }
  }
  User.init({
    firstName: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        isNumeric: false,
        isEmail: false
      }
    },
    lastName: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        isNumeric: false,
        isEmail: false
      }
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        len: [3, 256],
        isEmail: true
      }
    },
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        len: [4, 30],
        isNotEmail: true,
      }
    },
    hashedPassword: {
      type: DataTypes.STRING.BINARY,
      allowNull: false,
      validate: {
        len: [60, 60]
      }
    }
  }, {
    sequelize,
    modelName: 'User',
    defaultScope: {
      attributes: {
        exclude: ['hashedPassword', 'email', 'createdAt', 'updatedAt']
      }
    }
  });
  return User;
};

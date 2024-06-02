'use strict';
const {
  Model,
  Validator,
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
        as: "Owner",
        foreignKey: 'ownerId',
        onDelete: 'CASCADE'
      }
      ),
        User.hasMany(
          models.Review,
          {
            foreignKey: 'userId', onDelete: 'CASCADE'
          }
        ),
        User.hasMany(
          models.Booking,
          {
            foreignKey: "userId"
          }
        )
    }
  }
  User.init({
    firstName: {
      allowNull: false,
      type: DataTypes.STRING,
      // validate: {
      //   isEmail: false
      // }
    },
    lastName: {
      allowNull: false,
      type: DataTypes.STRING,
      // validate: {
      //   isEmail: false
      // }
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
      }
    },
    hashedPassword: {
      type: DataTypes.STRING,
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
        exclude: ['hashedPassword', 'createdAt', 'updatedAt']
      }
    }
  });
  return User;
};

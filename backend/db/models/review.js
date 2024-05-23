'use strict';
const {
  Model,
  Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Review.belongsTo(
        models.Spot,
        {foreignKey: 'spotId'}
      ),
      Review.belongsTo(
        models.User,
        {foreignKey: 'userId'}
      )
    }
  }
  Review.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        }
    },
    spotId: {
      type: DataTypes.INTEGER,
      allowNull: false,
        references: {
          model: 'Spots',
          key: 'id'
        }
    },
    review: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        len: [0,100]
      }
    },
    stars: {
      type: DataTypes.INTEGER,
      validate: {
        min: 0,
        max: 5
      }
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
    }
  }, {
    sequelize,
    modelName: 'Review',
  });
  return Review;
};
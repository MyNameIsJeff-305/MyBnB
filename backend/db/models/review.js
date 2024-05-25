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
        {
          foreignKey: 'spotId',
          onDelete: "CASCADE"
        }
      ),
        Review.belongsTo(
          models.User,
          {
            foreignKey: 'userId',
            onDelete: "CASCADE"
          }
        ),
        Review.hasMany(
          models.ReviewImage,
          { foreignKey: 'reviewId', onDelete: 'CASCADE' }
        )
    }
  }
  Review.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
        // onDelete: 'CASCADE'
      },
      onDelete: 'CASCADE'

    },
    spotId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Spots',
        key: 'id',
        // onDelete: 'CASCADE'
      },
      onDelete: 'CASCADE'
    },
    review: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        len: [0, 100]
      }
    },
    stars: {
      type: DataTypes.INTEGER,
      validate: {
        min: 0,
        max: 5
      }
    }
  }, {
    sequelize,
    modelName: 'Review',
  });
  return Review;
};

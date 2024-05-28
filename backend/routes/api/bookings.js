const { Sequelize } = require('sequelize');
const { SpotImage, Spot, User, Review, ReviewImage, Booking } = require('../../db/models');
const { requireAuth } = require('../../utils/auth')
const { validateSpotValues, validateReviews, properUserValidation } = require('../../utils/validations');

const router = express.Router();





module.exports = router;
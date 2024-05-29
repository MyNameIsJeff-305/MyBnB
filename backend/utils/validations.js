const { validationResult } = require('express-validator');
const { check } = require('express-validator');
const { Spot, Review, Booking } = require('../db/models');
const { parseInt } = require('lodash');

const handleValidationErrors = (req, _res, next) => {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
        const errors = {};
        validationErrors
            .array()
            .forEach(error => errors[error.path] = error.msg);

        const err = Error('bad request.');
        err.errors = errors;
        err.status = 400;
        err.title = "Bad Request.";
        next(err);
    }
    next();
};

const validateSpotValues = [
    check('address').exists({ checkFalsy: true }).withMessage("Street address is required"),
    check('city').exists({ checkFalsy: true }).withMessage("City is required"),
    check('state').exists({ checkFalsy: true }).withMessage("State is required"),
    check('country').exists({ checkFalsy: true }).withMessage("Country is required"),
    check('lat').exists({ checkFalsy: true }).isFloat().withMessage("Latitude is not valid"),
    check('lng').exists({ checkFalsy: true }).isFloat().withMessage("Longitude is not valid"),
    check('name').exists({ checkFalsy: true }).isLength(50).withMessage("Name must be less than 50 characters"),
    check('description').exists({ checkFalsy: true }).withMessage("Description is required"),
    check('price').exists({ checkFalsy: true }).withMessage("Price per day is required")
];

const validateReviews = [
    check('review').exists({ checkFalsy: true }).withMessage("Review Text is required"),
    check('stars').isLength({ min: 1, max: 5 }).withMessage("Stars must be an integer from 1 to 5")
];

const properUserValidation = async (req, _res, next) => {
    const { id } = req.user;
    const { spotId } = req.params;
    try {
        const spot = await Spot.findByPk(spotId);

        if (!spot) {
            const err = new Error("Spot couldn't be found");
            err.status = 404;
            err.title = 'Resource not found';
            return next(err);
        }

        if (spot.ownerId !== id) {
            const err = new Error('Unauthorized');
            err.status = 403;
            err.title = 'Forbidden';
            return next(err);
        }
        next();
    } catch (error) {
        next(error);
    }
};

const properReviewValidation = async (req, _res, next) => {
    const { id } = req.user;
    const { reviewId } = req.params;
    try {
        const review = await Review.findByPk(reviewId);

        if (!review) {
            const err = new Error("Review couldn't be found");
            err.status = 404;
            err.title = "Resource not Found";
            return next(err);
        }

        if (review.userId !== id) {
            const err = new Error('Unauthorized');
            err.status = 403;
            err.title = 'Forbidden';
            return next(err);
        }

        next();
    } catch (error) {
        next(error)
    }
};

const validateLogin = [

    check('credential')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('Please provide a valid email or username.'),
    check('password')
        .exists({ checkFalsy: true })
        .withMessage('Please provide a password.'),
    handleValidationErrors
];

const validateSignup = [
    check('email')
        .exists({ checkFalsy: true })
        .isEmail()
        .withMessage('Invalid email'),
    check('username')
        .exists()
        .withMessage("Username is required"),
    check('username')
        .exists({ checkFalsy: true })
        .isLength({ min: 4 })
        .withMessage('Please provide a username with at least 4 characters.'),
    check('username')
        .not()
        .isEmail()
        .withMessage('Username cannot be an email'),
    check('password')
        .exists({ checkFalsy: true })
        .isLength({ min: 6 })
        .withMessage('Password must be 6 characters or more.'),
    handleValidationErrors
];

module.exports = {
    handleValidationErrors,
    validateSpotValues,
    validateReviews,
    properUserValidation,
    properReviewValidation,
    validateLogin,
    validateSignup,
}

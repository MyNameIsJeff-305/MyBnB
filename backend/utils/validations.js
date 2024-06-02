const { validationResult } = require('express-validator');
const { check } = require('express-validator');
const { Spot, Review, User, Booking } = require('../db/models');
const { parseInt } = require('lodash');

const handleValidationErrors = (req, _res, next) => {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
        const errors = {};
        validationErrors
            .array()
            .forEach(error => errors[error.path] = error.msg);

        const err = Error('Bad request.');
        err.errors = errors;
        err.status = 400;
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
    check('name').exists({ checkFalsy: true }).isLength({ min: 0, max: 50 }).withMessage("Name must be less than 50 characters"),
    check('description').exists({ checkFalsy: true }).withMessage("Description is required"),
    check('price').exists({ checkFalsy: true }).withMessage("Price per day is required"),
    handleValidationErrors
];

const validateReviews = [
    check('review').exists({ checkFalsy: true }).withMessage("Review Text is required"),
    check('stars').isLength({ min: 1, max: 5 }).withMessage("Stars must be an integer from 1 to 5"),
    handleValidationErrors
];

const properUserValidation = async (req, res, next) => {
    const { id } = req.user;
    const { spotId } = req.params;
    try {
        const spot = await Spot.findByPk(spotId);

        if (!spot) {
            return res.status(404).json({
                message: "Spot couldn't be found"
            })
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

const properReviewValidation = async (req, res, next) => {
    const { id } = req.user;
    const { reviewId } = req.params;
    try {
        const review = await Review.findByPk(reviewId);

        if (!review) {
            return res.status(404).json({
                message: "Review couldn't be found"
            })
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
        .withMessage("Email or username is required"),
    check('password')
        .exists({ checkFalsy: true })
        .withMessage("Password is required"),
    handleValidationErrors
];

const validateUser = async (req, res, next) => {
    // const userEmail = await User.findAll({
    //     where: {
    //         email: req.body.email
    //     }
    // });
    // if (userEmail.email === req.body.email)
    //     return res.status(500).json({
    //         message: "User already exists",
    //         errors: {
    //             email: "User with that email already exists"
    //         }
    //     });

    // const userUsername = await User.findAll({
    //     where: {
    //         username: req.body.username
    //     }
    // });
    // if (userUsername.username === req.body.username)
    //     return res.status(500).json({
    //         message: "User already exists",
    //         errors: {
    //             username: "User with that username already exists"
    //         }
    //     })
}

const validateSignup = [
    check('email')
        .exists({ checkFalsy: true })
        .isEmail()
        .withMessage('Invalid email'),
    check('username')
        .exists({ checkFalsy: true })
        .withMessage("Username is required"),
    check('firstName').exists({ checkFalsy: true }).withMessage("First Name is required"),
    check('lastName').exists({ checkFalsy: true }).withMessage("Last Name is required"),
    handleValidationErrors
];

const validateQueryValues = [
    check('page').optional().isInt({ min: 1 }).withMessage('Page must be greater than or equal to 1'),
    check('size').optional().isInt({ min: 1 }).withMessage('Size must be greater or equal to 1'),
    check('maxLat').optional().isFloat({ max: 90 }).withMessage('Maximum latitude is invalid'),
    check('minLat').optional().isFloat({ min: -90 }).withMessage('Minimum latitude is invalid'),
    check('maxLng').optional().isFloat({ max: 180 }).withMessage('Maximum longitude is invalid'),
    check('minLng').optional().isFloat({ min: -180 }).withMessage('Minimum longitude is invalid'),
    check('minPrice').optional().isFloat({ min: 0 }).withMessage('Minimum price must be greater than or equal to 0'),
    check('maxPrice').optional().isFloat({ min: 0 }).withMessage('Maximum price must be greater than or equal to 0'),
    check('minPrice').optional().isFloat({ max: 'maxPrice' }).withMessage('Minimum price must be lower than Maximum.'),
    check('maxPrice').optional().isFloat({ min: 'minPrice' }).withMessage('Maximum price must be greater than Minimum.'),
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
    validateQueryValues,
    validateUser
}

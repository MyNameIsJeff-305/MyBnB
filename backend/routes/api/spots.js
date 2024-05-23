const router = require('express').Router();
const { Sequelize } = require('sequelize');
const { SpotImage, Spot, User, Review } = require('../../db/models');
const { requireAuth } = require('../../utils/auth')
const { groupBy } = require('lodash');
const { Op } = require('sequelize');
const { check } = require('express-validator');

//Middlewares
//Validate a Spot
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
]

//Get all Spots
router.get('/', async (_req, res, next) => {
    try {

        const spots = await Spot.findAll({
            attributes: {
                include: [
                    [Sequelize.fn('AVG', Sequelize.col('Reviews.stars')), 'avgRating'],
                    [Sequelize.fn('', Sequelize.col('SpotImages.url')), 'previewImage']
                ],
            },
            group: ['Spot.id'],
            include: [
                {
                    model: Review,
                    attributes: []
                },
                {
                    model: SpotImage,
                    attributes: [],
                }]
        });


        res.json(spots);

    } catch (error) {
        next(error)
    }
});

//Get details of a Spot from an id
router.get('/:spotId', async (req, res, next) => {
    try {
        const spotId = parseInt(req.params.spotId);

        const spot = await Spot.findOne({
            where: {
                id: spotId,
            },
            attributes: {
                include: [
                    [Sequelize.fn('AVG', Sequelize.col('Reviews.stars')), 'avgRating'],
                    [Sequelize.fn('COUNT', Sequelize.col('Reviews.id')), 'numReviews'],
                ],
            },
            include: [
                {
                    model: Review,
                    attributes: [], // Exclude review attributes since we're only interested in the count
                },
                {
                    model: SpotImage,
                    as: 'SpotImages', // Ensure this matches your association alias
                    attributes: ['id', 'url', 'preview'],
                    required: false,
                },
                {
                    model: User,
                    as: 'Owner',
                    attributes: ['id', 'firstName', 'lastName'],
                },
            ],
            group: ['Spot.id', 'SpotImages.id', 'Owner.id'],
        });

        if (!spot) {
            const err = new Error("Spot couldn't be found");
            err.status = 404;
            err.title = 'Resource not found';
            err.errors = { query: 'Query returned an empty array (no resources like that)' };
            throw err;
        }

        const spotData = spot.toJSON();
        const previewImages = spotData.SpotImages.filter(image => image.preview).map(image => image.url);
        const formattedSpot = {
            ...spotData,
        };

        res.json(formattedSpot);
    } catch (error) {
        next(error);
    }
});

router.post('/', requireAuth, validateSpotValues, async (req, res, next) => {
    try {
        const { address, city, state, country, lat, lng, name, description, price } = req.body;

        const newSpot = await Spot.create({
            ownerId: parseInt(req.user.id),
            address: address,
            city: city,
            state: state,
            country: country,
            lat: lat,
            lng: lng,
            name: name,
            description: description,
            price: price
        })

        res.json(newSpot);

    } catch (error) {
        next(error)
    }
})

module.exports = router;